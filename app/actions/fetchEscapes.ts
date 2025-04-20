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
  nights: number | null;
  board_basis:
    | "room_only"
    | "self_catering"
    | "bed_and_breakfast"
    | "half_board"
    | "full_board"
    | "all_inclusive"
    | "ultra_all_inclusive"
    | "flight_only"
    | null;
  star_rating: number | null;
  price_unit: "pp" | "pn" | "pr" | null;
  deposit_price: number | null;
  deposit_price_unit: "pp" | "pn" | "pr" | null;
  city: string | null;
  school_holidays: boolean | null;
  long_haul: boolean | null;
};

// Define a type for category filters
export type CategoryFilter = {
  type?: "hotel" | "flight" | "hotel+flight";
  board_basis?: string;
  last_minute?: boolean;
  price_under?: number;
  school_holidays?: boolean;
  long_haul?: boolean;
};

export async function fetchEscapes(
  page: number = 1,
  category?: string
): Promise<{ escapes: EscapeData[]; hasMore: boolean; error: string | null }> {
  const cookieStore = cookies();
  const supabase = await createClient();

  const startIndex = (page - 1) * PAGE_LIMIT;
  const endIndex = page * PAGE_LIMIT - 1;

  // Initialize the query
  let query = supabase.from("escapes_data").select("*", { count: "exact" }); // Request count for pagination logic

  // Apply filters based on the selected category
  if (category) {
    switch (category) {
      case "holidays":
        query = query.eq("type", "hotel+flight");
        break;
      case "all-inclusive":
        query = query.eq("board_basis", "all_inclusive");
        break;
      case "deals-under-300":
        // For deals under £300, filter by price
        query = query.lt("price", 300);
        break;
      case "school-holidays":
        query = query.eq("school_holidays", true);
        break;
      case "last-minute":
        // For last-minute, filter deals that expire within 48 hours
        const fortyEightHoursFromNow = new Date();
        fortyEightHoursFromNow.setHours(fortyEightHoursFromNow.getHours() + 48);
        query = query
          .not("validTo", "is", null)
          .lt("validTo", fortyEightHoursFromNow.toISOString());
        break;
      case "long-haul":
        query = query.eq("long_haul", true);
        break;
      case "breaks-under-100":
        // For breaks under £100, filter by price
        query = query.lt("price", 100);
        break;
      case "city-breaks":
        // For city breaks, we'll consider a deal a city break if it has a city value
        // and doesn't include flights (typically hotel only in a city)
        query = query.not("city", "is", null).eq("type", "hotel");
        break;
    }
  }

  // Add ordering and pagination
  query = query
    .order("created_at", { ascending: false })
    .range(startIndex, endIndex);

  try {
    const { data, error, count } = await query;

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
