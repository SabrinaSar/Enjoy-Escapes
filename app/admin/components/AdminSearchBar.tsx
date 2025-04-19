"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

export function AdminSearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  // Get the current search query from URL or empty string
  const currentQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(currentQuery);

  // Debounce search to avoid too many URL updates while typing
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    // Reset to page 1 when searching
    params.set("page", "1");

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }, 500);

  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search escapes..."
        className="pl-8 w-full"
        value={searchQuery}
        onChange={(e) => {
          const newValue = e.target.value;
          setSearchQuery(newValue);
          handleSearch(newValue);
        }}
      />
      {isPending && (
        <div className="absolute right-2.5 top-2.5 h-4 w-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
