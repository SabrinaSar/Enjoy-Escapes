"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function NavbarSearchForm() {
  // Get the current search query from URL to populate the input
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  return (
    <form action="/search" method="GET" className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        name="q"
        placeholder="Search escapes..."
        className="pl-8 w-full"
        defaultValue={currentQuery}
      />
      {/* We don't need to handle the form submission with JS as we're using a form action */}
    </form>
  );
}
