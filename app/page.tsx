import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  fetchEscapes,
  getLatestEscapeTimestamp,
} from "@/app/actions/fetchEscapes";

import EscapeGrid from "@/components/escapes/EscapeGrid";
import { Terminal } from "lucide-react";
import { format } from "date-fns"; // Using date-fns for formatting

export default async function Home() {
  // Fetch initial data on the server
  const initialData = await fetchEscapes(1); // Fetch first page
  const latestTimestamp = await getLatestEscapeTimestamp();

  const formattedTimestamp = latestTimestamp
    ? format(new Date(latestTimestamp), "PPPp") // Format: Sep 21, 2023, 4:30 PM
    : "Not available";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner Area */}

      {/* Last Updated Info */}
      <div className="mb-6 text-sm text-muted-foreground text-center md:text-right">
        Last updated: {formattedTimestamp}
      </div>

      {/* Escape Grid */}
      {initialData.error ? (
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Could not load initial escape deals:</p>
          <p>{initialData.error}</p>
        </div>
      ) : (
        <EscapeGrid
          initialEscapes={initialData.escapes}
          initialHasMore={initialData.hasMore}
        />
      )}
    </div>
  );
}
