import EscapeGrid from "@/app/components/EscapeGrid";
import { Metadata } from "next";
import { fetchEscapes } from "@/app/actions/fetchEscapes";

type SearchParams = {
  q?: string;
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

  return {
    title: query
      ? `Search results for "${query}" | Enjoy Escapes`
      : "Search | Enjoy Escapes",
    description: `Find travel deals and escapes matching "${query}" on Enjoy Escapes.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  // Fetch initial data on the server with search query
  const initialData = await fetchEscapes(1, undefined, query);

  return (
    <div className="container mx-auto px-4 py-8">
      {query ? (
        <>
          <h1 className="text-2xl font-bold mb-6">
            Search results for &quot;{query}&quot;
          </h1>

          {/* Display message if no results */}
          {initialData.escapes.length === 0 && (
            <div className="text-center my-12">
              <p className="text-lg text-muted-foreground">
                No results found for &quot;{query}&quot;
              </p>
              <p className="mt-2">
                Try a different search term or browse our categories.
              </p>
            </div>
          )}

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
