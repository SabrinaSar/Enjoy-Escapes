import EscapeGrid from "@/app/components/EscapeGrid";
import { Metadata } from "next";
import { fetchEscapes } from "@/app/actions/fetchEscapes";
import SearchFilterBanner from "@/app/components/SearchFilterBanner";
import CategoryFilter from "../components/CategoryFilter";
import PopularDestinations from "../components/PopularDestinations";

type SearchParams = {
  q?: string;
  origin?: string;
  date?: string;
};

// The correct type for pages in Next.js 14+
type PageProps = {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
};

// Following the pattern in forgot-password page
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const origin = resolvedParams.origin ? ` from ${resolvedParams.origin}` : "";
  const date = resolvedParams.date ? ` on ${resolvedParams.date}` : "";

  return {
    title:
      query || origin || date
        ? `Search results for ${query}${origin}${date} | Enjoy Escapes`
        : "Search | Enjoy Escapes",
    description: `Find travel deals and escapes matching your search on Enjoy Escapes.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const origin = resolvedParams.origin || "";
  const date = resolvedParams.date || "";

  // Fetch initial data on the server with search query, origin, and date
  const initialData = await fetchEscapes(1, undefined, query, origin, date);

  const hasSearchParams = query || origin || date;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Filters */}
      <div className="mb-6">
        <CategoryFilter />
      </div>
      <div className="mb-8">
        <SearchFilterBanner />
      </div>

      {hasSearchParams ? (
        <>
          <h1 className="text-xl font-bold mb-6 text-gray-800">
            Search results {query ? `for "${query}"` : ""}{" "}
            {origin ? `from "${origin}"` : ""} {date ? `on ${date}` : ""}
          </h1>

          {/* Escape Grid */}
          {initialData.error ? (
            <div className="text-center text-red-600 dark:text-red-400">
              <p>Error loading search results:</p>
              <p>{initialData.error}</p>
            </div>
          ) : (
            <EscapeGrid
              initialEscapes={initialData.escapes}
              initialHasMore={initialData.hasMore}
              insertAfterItems={20}
              insertComponent={<PopularDestinations />}
            />
          )}
        </>
      ) : (
        <div className="text-center my-12">
          <h1 className="text-2xl font-bold mb-6">Search Escapes</h1>
          <p className="text-muted-foreground">
            Enter a search term in the search bar above to find your perfect
            escape.
          </p>
        </div>
      )}
    </div>
  );
}
