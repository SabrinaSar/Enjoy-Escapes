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
      <Alert className="mb-8 bg-blue-green/10 border-blue-green/30 dark:bg-blue-green/20 dark:border-blue-green/40">
        <Terminal className="h-4 w-4 !text-blue-green" />{" "}
        {/* Use brand color */}
        <AlertTitle className="text-blue-green dark:text-blue-green/90 font-semibold">
          Heads Up!
        </AlertTitle>
        <AlertDescription className="text-blue-green/80 dark:text-blue-green/70">
          These deals are updated frequently. Please be aware that prices are
          correct as of posting but can fluctuate due to availability, demand,
          and other factors. If you missed out, don't worry – new deals pop up
          often!
        </AlertDescription>
      </Alert>

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
