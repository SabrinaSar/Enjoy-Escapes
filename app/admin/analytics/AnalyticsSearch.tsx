"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAnalyticsDestinations, searchEscapesAnalytics } from "./actions";
import { Globe, TrendingUp, ChevronRight } from "lucide-react";

interface SearchResult {
  id: number;
  title: string;
  type: string | null;
  price: number | null;
  link: string | null;
  click_count: number;
}

const POPULAR_DESTINATIONS = [
  "Turkey",
  "Greece",
  "Egypt",
  "Dubai",
  "Morocco",
  "Portugal",
  "Spain",
  "Thailand",
  "Tunisia",
];

export function AnalyticsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadDestinations();
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  async function loadDestinations() {
    const data = await getAnalyticsDestinations();
    setDestinations(data);
  }

  const debouncedSearch = useDebouncedCallback(async (value: string) => {
    if (value.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await searchEscapesAnalytics(value);
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setLoading(true);
    debouncedSearch(value);
  };

  const handleDestinationClick = (dest: string) => {
    setQuery(dest);
    setLoading(true);
    debouncedSearch(dest);
  };

  const formatEscapeType = (type: string | null): string => {
    if (!type) return "Unknown";
    switch (type) {
      case "hotel":
        return "Hotel";
      case "flight":
        return "Flight";
      case "hotel+flight":
        return "Hotel + Flight";
      case "other":
        return "Other";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <div className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background text-muted-foreground items-center">
            Search specific escapes or destinations...
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden flex flex-col max-h-[85vh]">
        <DialogHeader className="p-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Find Escapes & Destinations
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 bg-muted/30 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search by title or destination..."
              value={query}
              onChange={handleInputChange}
              className="pl-10 h-12 text-base shadow-sm"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-0">
              {/* Most Popular Section */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-primary">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Most Popular Destinations
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <button
                      key={dest}
                      onClick={() => handleDestinationClick(dest)}
                      className="flex items-center justify-between px-3 py-2 text-sm bg-background border rounded-md hover:border-primary hover:text-primary transition-all group"
                    >
                      <span>{dest}</span>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>

              {/* All Destinations Section */}
              <div className="p-4 bg-muted/10">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-primary">
                  <Globe className="h-4 w-4 text-blue-500" />
                  All Destinations
                </div>
                {destinations.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {destinations
                      .filter((d) => !POPULAR_DESTINATIONS.includes(d))
                      .map((dest) => (
                        <button
                          key={dest}
                          onClick={() => handleDestinationClick(dest)}
                          className="px-3 py-1.5 text-xs bg-muted border rounded-full hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors"
                        >
                          {dest}
                        </button>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-muted-foreground italic">
                    Loading all destinations...
                  </div>
                )}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y">
              <div className="px-4 py-2 bg-muted/50 text-[10px] uppercase tracking-wider font-bold text-muted-foreground sticky top-0 z-10">
                Found {results.length} Matches
              </div>
              {results.map((result) => (
                <a
                  href={result.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={result.id}
                  className="p-4 hover:bg-muted/50 transition-colors block border-l-4 border-l-transparent hover:border-l-primary"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-semibold text-primary truncate text-sm sm:text-base">
                        {result.title}
                      </h4>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground">
                        <Badge
                          variant="secondary"
                          className="font-normal text-[10px] h-5"
                        >
                          {formatEscapeType(result.type)}
                        </Badge>
                        <span className="font-medium text-primary/80">
                          £{result.price || 0}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-bold text-primary">
                        {result.click_count}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Clicks
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : !loading ? (
            <div className="p-12 text-center text-muted-foreground">
              <div className="mb-4 flex justify-center">
                <Search className="h-10 w-10 opacity-20" />
              </div>
              <p className="text-sm font-medium">No escapes found</p>
              <p className="text-xs">
                Try searching for a different destination or title
              </p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
