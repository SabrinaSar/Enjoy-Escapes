import {
  CalendarIcon,
  PackageCheck,
  PlusCircle,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AdminPagination } from "./components/AdminPagination";
import { AdminSearchBar } from "./components/AdminSearchBar";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import EscapesTable from "./components/EscapesTable";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { fetchEscapesWithPagination } from "./actions";

type EscapeStats = {
  id: number;
  type: "hotel" | "flight" | "hotel+flight" | null;
  price: number | null;
  validTo: string | null;
  created_at: string;
};

export default async function EscapesPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  // Get search query and page from URL parameters
  const query = searchParams.q || "";
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 10; // Items per page

  // Fetch paginated and filtered escapes
  const { escapes, totalCount, totalPages, error } =
    await fetchEscapesWithPagination(currentPage, pageSize, query);

  if (error) {
    console.error("Error fetching escapes:", error);
    return <p>Error loading escapes. Please try again later.</p>;
  }

  // For stats, fetch all escapes (this could be optimized with aggregation queries)
  const supabase = await createClient();
  const { data } = await supabase
    .from("escapes_data")
    .select("id, type, price, validTo, created_at");

  const allEscapes: EscapeStats[] = data || [];

  // Calculate some simple statistics
  const totalEscapes = totalCount;
  const activeEscapes =
    allEscapes?.filter((escape) => {
      if (!escape.validTo) return true; // No end date means always active
      return new Date(escape.validTo) > new Date();
    }).length || 0;

  const packageDeals =
    allEscapes?.filter((escape) => escape.type === "hotel+flight").length || 0;
  const hotelOnlyDeals =
    allEscapes?.filter((escape) => escape.type === "hotel").length || 0;

  const averagePrice =
    allEscapes?.reduce((sum, escape) => sum + (escape.price || 0), 0) /
    (allEscapes?.length || 1);

  // Get the latest created or updated escape
  const latestEscape = allEscapes?.[0];
  const latestUpdate = latestEscape?.created_at
    ? new Date(latestEscape.created_at).toLocaleDateString()
    : "N/A";

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Manage Escapes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalEscapes} total escapes, {activeEscapes} currently active
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Escape
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Escapes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEscapes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {latestUpdate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Package Deals
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">{packageDeals}</div>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hotel Only
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">{hotelOnlyDeals}</div>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Price
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">£{averagePrice.toFixed(2)}</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <AdminSearchBar />
        <div className="text-sm text-muted-foreground">
          {query ? (
            <span>
              Found {totalCount} {totalCount === 1 ? "result" : "results"} for "
              {query}"
            </span>
          ) : (
            <span>
              Showing page {currentPage} of {totalPages}
            </span>
          )}
        </div>
      </div>

      {/* Escapes Table */}
      <EscapesTable escapes={escapes || []} />

      {/* Pagination */}
      <div className="mt-6">
        <AdminPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}
