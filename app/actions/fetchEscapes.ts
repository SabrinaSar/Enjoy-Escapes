"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const PAGE_LIMIT = 25; // Define the number of items per page

export type EscapeData = {
  id: number;
  created_at: string;
  title: string | null;
  subtitle: string | null;
  country: string | null;
  price: number | null;
  link: string | null;
  image: string | null;
  type: "hotel" | "flight" | "hotel+flight" | null;
  validFrom: string | null;
  validTo: string | null;
  tags: string[] | null;
};

export async function fetchEscapes(
  page: number = 1
): Promise<{ escapes: EscapeData[]; hasMore: boolean; error: string | null }> {
  const cookieStore = cookies();
  const supabase = await createClient();

  const startIndex = (page - 1) * PAGE_LIMIT;
  const endIndex = page * PAGE_LIMIT - 1;

  try {
    const { data, error, count } = await supabase
      .from("escapes_data")
      .select("*", { count: "exact" }) // Request count for pagination logic
      .order("created_at", { ascending: false })
      .range(startIndex, endIndex);

    if (error) {
      console.error("Error fetching escapes:", error);
      return { escapes: [], hasMore: false, error: error.message };
    }

    // Ensure data conforms to EscapeData type, handling nulls if necessary
    const escapes: EscapeData[] = data || [];

    const totalFetched = startIndex + escapes.length;
    const hasMore = count !== null && totalFetched < count;

    return { escapes, hasMore, error: null };
  } catch (err) {
    console.error("Unexpected error fetching escapes:", err);
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    return { escapes: [], hasMore: false, error: message };
  }
}

// Optional: Function to get just the latest timestamp for the "Last Updated" display
export async function getLatestEscapeTimestamp(): Promise<string | null> {
  const cookieStore = cookies();
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("escapes_data")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single(); // Fetch only the newest one

    if (error) {
      console.error("Error fetching latest timestamp:", error);
      return null;
    }

    return data?.created_at || null;
  } catch (err) {
    console.error("Unexpected error fetching latest timestamp:", err);
    return null;
  }
}
