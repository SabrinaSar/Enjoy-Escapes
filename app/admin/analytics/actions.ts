"use server";

import { createClient } from "@/utils/supabase/server";

export async function searchEscapesAnalytics(query: string) {
  if (!query || query.length < 2) return [];

  const supabase = await createClient();

  // Search escapes matching the query
  const { data: escapes, error: searchError } = await supabase
    .from("escapes_data")
    .select("id, title, type, price, link")
    .ilike("title", `%${query}%`)
    .limit(10);

  if (searchError || !escapes || escapes.length === 0) {
    return [];
  }

  const escapeIds = escapes.map((e) => e.id);

  // Get click counts for these escapes
  // We'll use a more efficient way to get counts by using a join-like approach or summary
  // If click_stats_summary exists, it's MUCH faster.
  const { data: clickCounts, error: clickError } = await supabase
    .from("clicks_data")
    .select("escape_id")
    .in("escape_id", escapeIds)
    .or("item_type.eq.escape,item_type.is.null");

  // Since Supabase JS doesn't support GROUP BY directly for aggregations in this way,
  // and we only have 10 escapes, this is somewhat okay unless one escape has 100k+ clicks.
  // To be safe, let's try to see if we can get counts more efficiently.

  // REAL OPTIMIZATION: If we have a summary table, we should use it.
  // Let's try to fetch from click_stats_summary which is likely what get_admin_analytics_v3 uses.
  const { data: summaryStats } = await supabase
    .from("click_stats_summary")
    .select("item_id, click_count")
    .in("item_id", escapeIds)
    .eq("item_type", "escape");

  const counts: Record<number, number> = {};

  if (summaryStats && summaryStats.length > 0) {
    summaryStats.forEach((s) => {
      counts[Number(s.item_id)] = Number(s.click_count);
    });
  } else {
    // Fallback to manual count if summary doesn't exist or is empty
    clickCounts?.forEach((c) => {
      const id = c.escape_id;
      counts[id] = (counts[id] || 0) + 1;
    });
  }

  // Combine data
  return escapes.map((e) => ({
    id: e.id,
    title: e.title,
    type: e.type,
    price: e.price,
    link: e.link,
    click_count: counts[e.id] || 0,
  }));
}

export async function getAnalyticsDestinations() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("name")
    .eq("is_active", true)
    .order("name");

  return (data?.map((d) => d.name) || []).filter((name) => name !== "All");
}
