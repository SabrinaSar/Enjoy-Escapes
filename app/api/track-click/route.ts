import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "edge"; // Use edge runtime for faster response

/**
 * API endpoint for tracking clicks via navigator.sendBeacon
 * This is optimized for speed and reliability
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json();
    
    const {
      escape_id,
      item_type = "escape",
      source,
      user_agent,
      referrer,
    } = data;

    // Validate required fields
    if (!escape_id || typeof escape_id !== "number") {
      return NextResponse.json(
        { success: false, error: "Invalid escape_id" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Insert click data into the clicks_data table
    const { error } = await supabase
      .from("clicks_data")
      .insert({
        escape_id: escape_id,
        source: source || null,
        user_agent: user_agent || null,
        referrer: referrer || null,
      });

    if (error) {
      console.error("Error tracking click:", error);
      // Return 200 even on error to not affect user experience
      // But log it for debugging
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 200 } // Return 200 to prevent retry storms
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error tracking click:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    
    // Return 200 even on error to not affect user experience
    return NextResponse.json(
      { success: false, error: message },
      { status: 200 }
    );
  }
}
