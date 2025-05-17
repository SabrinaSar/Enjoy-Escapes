"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";

export type BannerData = Database["public"]["Tables"]["banners"]["Row"];

/**
 * Fetches active banners from the database with date filtering
 */
export async function fetchBanners(): Promise<{
  banners: BannerData[];
  error: string | null;
}> {
  const cookieStore = cookies();
  const supabase = await createClient();

  try {
    // Get current date in ISO format for comparison
    const now = new Date().toISOString();

    // Build query for active banners that are within their date range (if specified)
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("active", true)
      // Only show banners where:
      // - start_date is null (no start date restriction) OR start_date is before or equal to now
      // - AND end_date is null (no end date restriction) OR end_date is after or equal to now
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order("position", { ascending: true });

    if (error) {
      console.error("Error fetching banners:", error);
      return { banners: [], error: error.message };
    }

    // Type check and ensure data conforms to BannerData type
    const banners: BannerData[] = data || [];
    return { banners, error: null };
  } catch (err) {
    console.error("Unexpected error fetching banners:", err);
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    return { banners: [], error: message };
  }
}

/**
 * Fetches all banners from the database for admin views
 */
export async function fetchAllBanners(
  page: number = 1,
  pageSize: number = 10
): Promise<{
  banners: BannerData[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  error: string | null;
}> {
  const cookieStore = cookies();
  const supabase = await createClient();

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize - 1;

  try {
    // Get count for pagination
    const { count, error: countError } = await supabase
      .from("banners")
      .select("*", { count: "exact", head: true });

    if (countError) {
      throw new Error(countError.message);
    }

    // Fetch paginated data
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: false })
      .range(startIndex, endIndex);

    if (error) {
      throw new Error(error.message);
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      banners: data || [],
      totalCount,
      currentPage: page,
      totalPages,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching banners for admin:", err);
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    return {
      banners: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      error: message,
    };
  }
} 