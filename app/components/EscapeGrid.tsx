"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { fetchEscapes, type EscapeData } from "@/app/actions/fetchEscapes";
import CardSelector from "./cards/CardSelector";
import { Loader2 } from "lucide-react"; // Loading spinner
import { Button } from "@/components/ui/button";
import BannerContainer from "./BannerContainer";

interface EscapeGridProps {
  initialEscapes: EscapeData[];
  initialHasMore: boolean;
  insertAfterItems?: number;
  insertComponent?: ReactNode;
}

const EscapeGrid: React.FC<EscapeGridProps> = ({
  initialEscapes,
  initialHasMore,
  insertAfterItems,
  insertComponent,
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

  // Determine where to split based on available items
  let firstBatchEscapes: EscapeData[] = [];
  let remainingEscapes: EscapeData[] = [];

  if (insertComponent && escapes.length > 0) {
    // If we have fewer items than specified, show after all available items
    if (insertAfterItems && escapes.length >= insertAfterItems) {
      // We have at least the number of items requested, so split at the specified point
      firstBatchEscapes = escapes.slice(0, insertAfterItems);
      remainingEscapes = escapes.slice(insertAfterItems);
    } else {
      // We have fewer items than requested, so show all available items first
      firstBatchEscapes = escapes;
      remainingEscapes = [];
    }
  } else {
    // No insertion needed
    firstBatchEscapes = escapes;
    remainingEscapes = [];
  }

  // Determine if we should show the insert component
  const shouldShowInsert = insertComponent && 
    (firstBatchEscapes.length > 0) && 
    (firstBatchEscapes.length === insertAfterItems || !hasMore);

  return (
    <div>
      {escapes.length === 0 && !loading && !error && (
        <p className="text-center text-muted-foreground">
          No escape deals found.
        </p>
      )}

      {/* First batch of escapes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 auto-rows-fr">
        {firstBatchEscapes.map((escape) => (
          <div key={escape.id} className="h-full">
            <CardSelector escape={escape} />
          </div>
        ))}
      </div>

      {/* Inserted component */}
      {shouldShowInsert && (
        <div className="my-10">{insertComponent}</div>
      )}

      {/* Remaining escapes */}
      {remainingEscapes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 auto-rows-fr mt-10">
          {remainingEscapes.map((escape) => (
            <div key={escape.id} className="h-full">
              <CardSelector escape={escape} />
            </div>
          ))}
        </div>
      )}

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
        <p className="text-center text-muted-foreground mt-6 mb-10">
          You've reached the end! ✨
        </p>
      )}

      {/* Banner section at the bottom of the page */}
      {(!error && escapes.length > 0) && (
        <div className="mt-10">
          <BannerContainer />
        </div>
      )}
    </div>
  );
};

export default EscapeGrid;
