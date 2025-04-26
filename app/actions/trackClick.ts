"use server";

import { createClient } from "@/utils/supabase/server";

export type ClickData = {
  escape_id: number;
  source?: string;
  user_agent?: string;
  referrer?: string;
};

/**
 * Tracks a click on an escape deal
 * This function uses the anonymous key to write to the database
 * No authentication is required for tracking clicks
 */
export async function trackEscapeClick(data: ClickData) {
  try {
    const supabase = await createClient();
    
    // Insert click data into the clicks_data table
    const { error } = await supabase
      .from('clicks_data')
      .insert({
        escape_id: data.escape_id,
        source: data.source || null,
        user_agent: data.user_agent || null,
        referrer: data.referrer || null,
        // created_at will be automatically set by Supabase
      });

    if (error) {
      console.error("Error tracking click:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error tracking click:", err);
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    return { success: false, error: message };
  }
} 