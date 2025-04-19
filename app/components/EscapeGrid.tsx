"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";
import { fetchEscapes, type EscapeData } from "@/app/actions/fetchEscapes";
import EscapeCard from "./EscapeCard";
import { Loader2 } from "lucide-react"; // Loading spinner

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

  const [escapes, setEscapes] = useState<EscapeData[]>(initialEscapes);
  const [page, setPage] = useState<number>(2); // Start loading from page 2
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView({
    threshold: 0, // Trigger as soon as the element enters the viewport
    triggerOnce: false, // Keep triggering as user scrolls up and down (if needed)
  });

  // Reset grid when category changes
  useEffect(() => {
    const loadInitialEscapes = async () => {
      setLoading(true);
      try {
        const result = await fetchEscapes(1, category || undefined);
        if (result.error) {
          throw new Error(result.error);
        }
        setEscapes(result.escapes);
        setHasMore(result.hasMore);
        setPage(2); // Reset to page 2 for infinite loading
      } catch (err) {
        console.error("Failed to load escapes:", err);
        setError(err instanceof Error ? err.message : "Failed to load deals.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialEscapes();
  }, [category]);

  const loadMoreEscapes = useCallback(async () => {
    if (loading || !hasMore) return; // Don't fetch if already loading or no more data

    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const result = await fetchEscapes(page, category || undefined);
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
      // Optional: Stop trying to load more if there's an error?
      // setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, category]);

  useEffect(() => {
    // If the trigger element is in view and there's more data, load more
    if (inView && hasMore && !loading) {
      loadMoreEscapes();
    }
  }, [inView, loadMoreEscapes, hasMore, loading]);

  return (
    <div>
      {escapes.length === 0 && !loading && !error && (
        <p className="text-center text-muted-foreground">
          No escape deals found.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 auto-rows-fr">
        {escapes.map((escape) => (
          <div key={escape.id} className="h-full">
            <EscapeCard escape={escape} />
          </div>
        ))}
      </div>

      {/* Sentinel Element for Intersection Observer */}
      {/* Only render the loader and sentinel if there are more items potentially available */}
      {hasMore && (
        <div ref={ref} className="flex justify-center items-center h-20">
          {loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          {!loading && !error && hasMore && (
            <span className="text-muted-foreground">Loading more...</span>
          )}
        </div>
      )}

      {/* Error Message Display */}
      {error && (
        <div className="text-center text-red-600 dark:text-red-400 mt-4">
          <p>Oops! Something went wrong.</p>
          <p>{error}</p>
          {/* Optional: Add a retry button */}
          {/* <button onClick={loadMoreEscapes} disabled={loading}>Retry</button> */}
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
