
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load variables from .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing clicks_data count...");
  const { count, error: countError } = await supabase
    .from("clicks_data")
    .select("*", { count: "exact", head: true });
  console.log("countError:", countError);

  console.log("Testing get_click_counts_by_escape...");
  const { error: clickCountsError } = await supabase.rpc(
    "get_click_counts_by_escape",
  );
  console.log("clickCountsError:", clickCountsError);

  console.log("Testing get_click_counts_by_banner...");
  const { error: bannerClickCountsError } = await supabase.rpc(
    "get_click_counts_by_banner",
  );
  console.log("bannerClickCountsError:", bannerClickCountsError);

  console.log("Testing recent clicks...");
  const { error: recentClicksError } = await supabase
    .from("clicks_data")
    .select(
      `
      id,
      escape_id,
      created_at,
      source,
      referrer,
      user_agent,
      item_type
    `,
    )
    .order("created_at", { ascending: false })
    .limit(10);
  console.log("recentClicksError:", recentClicksError);
}

test();
