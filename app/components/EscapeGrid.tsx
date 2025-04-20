"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { fetchEscapes, type EscapeData } from "@/app/actions/fetchEscapes";
import CardSelector from "./cards/CardSelector";
import { Loader2 } from "lucide-react"; // Loading spinner
import { Button } from "@/components/ui/button";

interface EscapeGridProps {
  initialEscapes: EscapeData[];
  initialHasMore: boolean;
}

const EscapeGrid: React.FC<EscapeGridProps> = ({
  initialEscapes,
  initialHasMore,
}) => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("q");

  const [escapes, setEscapes] = useState<EscapeData[]>(initialEscapes);
  const [page, setPage] = useState<number>(2); // Start loading from page 2
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reset grid when category or search query changes
  useEffect(() => {
    const loadInitialEscapes = async () => {
      setLoading(true);
      try {
        const result = await fetchEscapes(
          1,
          category || undefined,
          searchQuery || undefined
        );
        if (result.error) {
          throw new Error(result.error);
        }
        setEscapes(result.escapes);
        setHasMore(result.hasMore);
        setPage(2); // Reset to page 2 for loading more
      } catch (err) {
        console.error("Failed to load escapes:", err);
        setError(err instanceof Error ? err.message : "Failed to load deals.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialEscapes();
  }, [category, searchQuery]);

  const loadMoreEscapes = useCallback(async () => {
    if (loading || !hasMore) return; // Don't fetch if already loading or no more data

    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const result = await fetchEscapes(
        page,
        category || undefined,
        searchQuery || undefined
      );
      if (result.error) {
        throw new Error(result.error);
      }
      if (result.escapes.length > 0) {
        setEscapes((prevEscapes) => [...prevEscapes, ...result.escapes]);
        setPage((prevPage) => prevPage + 1);
      }
      setHasMore(result.hasMore); // Update based on the action's response
    } catch (err) {
      console.error("Failed to load more escapes:", err);
      setError(err instanceof Error ? err.message : "Failed to load deals.");
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, category, searchQuery]);

  return (
    <div>
      {escapes.length === 0 && !loading && !error && (
        <p className="text-center text-muted-foreground">
          No escape deals found.
        </p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 auto-rows-fr">
        {escapes.map((escape) => (
          <div key={escape.id} className="h-full">
            <CardSelector escape={escape} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8 mb-6">
          <Button onClick={loadMoreEscapes} disabled={loading} className="px-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {/* Error Message Display */}
      {error && (
        <div className="text-center text-red-600 dark:text-red-400 mt-4">
          <p>Oops! Something went wrong.</p>
          <p>{error}</p>
          <Button
            onClick={loadMoreEscapes}
            disabled={loading}
            variant="outline"
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Message when all items are loaded */}
      {!hasMore && escapes.length > 0 && (
        <p className="text-center text-muted-foreground mt-6">
          You've reached the end! ✨
        </p>
      )}
    </div>
  );
};

export default EscapeGrid;
