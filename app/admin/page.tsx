import {
  CalendarIcon,
  Clock,
  Flame,
  PackageCheck,
  PlaneTakeoff,
  PlusCircle,
  School,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AdminFilterBar } from "./components/AdminFilterBar";
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
  type: "hotel" | "flight" | "hotel+flight" | "other" | null;
  price: number | null;
  created_at: string;
  featured: boolean | null;
  hot_deal: boolean | null;
  school_holidays: boolean | null;
  long_haul: boolean | null;
  last_minute: boolean | null;
};

export default async function EscapesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    featured?: string;
    hot_deal?: string;
    school_holidays?: string;
    long_haul?: string;
    last_minute?: string;
    scheduled?: string;
    type?: string;
  }>;
}) {
  // Resolve searchParams Promise
  const resolvedSearchParams = await searchParams;

  // Get search query and page from URL parameters
  const query = resolvedSearchParams.q || "";
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const pageSize = 10; // Items per page

  // Get filter parameters
  const filters = {
    featured: resolvedSearchParams.featured === "true" || undefined,
    hot_deal: resolvedSearchParams.hot_deal === "true" || undefined,
    school_holidays:
      resolvedSearchParams.school_holidays === "true" || undefined,
    long_haul: resolvedSearchParams.long_haul === "true" || undefined,
    last_minute: resolvedSearchParams.last_minute === "true" || undefined,
    type: resolvedSearchParams.type as
      | "hotel"
      | "flight"
      | "hotel+flight"
      | "other"
      | undefined,
    include_scheduled: resolvedSearchParams.scheduled === "true" || undefined,
  };

  // Fetch paginated and filtered escapes
  const { escapes, totalCount, totalPages, error } =
    await fetchEscapesWithPagination(currentPage, pageSize, query, filters);

  if (error) {
    console.error("Error fetching escapes:", error);
    return <p>Error loading escapes. Please try again later.</p>;
  }

  // For stats, fetch all escapes (this could be optimized with aggregation queries)
  const supabase = await createClient();
  const { data } = await supabase
    .from("escapes_data")
    .select(
      "id, type, price, created_at, featured, hot_deal, school_holidays, long_haul, last_minute"
    );

  const allEscapes: EscapeStats[] = data || [];

  // Calculate some simple statistics
  const totalEscapes = totalCount;
  const activeEscapes = totalCount; // All escapes are active now that we don't have validTo

  const packageDeals =
    allEscapes?.filter((escape) => escape.type === "hotel+flight").length || 0;
  const hotelOnlyDeals =
    allEscapes?.filter((escape) => escape.type === "hotel").length || 0;

  const featuredEscapes =
    allEscapes?.filter((escape) => escape.featured).length || 0;
  const hotDeals = allEscapes?.filter((escape) => escape.hot_deal).length || 0;
  const lastMinuteDeals =
    allEscapes?.filter((escape) => escape.last_minute).length || 0;

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
            Manage Escapes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalEscapes} total escapes, {activeEscapes} currently active
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Escape
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <Card className="col-span-1">
          <CardHeader className="pb-1 px-3 pt-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Escapes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl sm:text-2xl font-bold">{totalEscapes}</div>
            <p className="text-xs text-muted-foreground">
              Last: {latestUpdate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 px-3 pt-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Package Deals
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between px-3 pb-3">
            <div className="text-xl sm:text-2xl font-bold">{packageDeals}</div>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 px-3 pt-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Hotel Only
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between px-3 pb-3">
            <div className="text-xl sm:text-2xl font-bold">{hotelOnlyDeals}</div>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 px-3 pt-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Featured
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between px-3 pb-3">
            <div className="text-xl sm:text-2xl font-bold">{featuredEscapes}</div>
            <Sparkles className="h-4 w-4 text-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 px-3 pt-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Hot Deals
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between px-3 pb-3">
            <div className="text-xl sm:text-2xl font-bold">{hotDeals}</div>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 px-3 pt-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Last Minute
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between px-3 pb-3">
            <div className="text-xl sm:text-2xl font-bold">{lastMinuteDeals}</div>
            <Clock className="h-4 w-4 text-red-500" />
          </CardContent>
        </Card>
      </div>

      {/* Search Bar and Filters */}
      <div className="mb-6 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
        <div className="flex flex-row items-center gap-2 w-full xs:w-auto">
          <div className="flex-1 xs:flex-auto">
            <AdminSearchBar />
          </div>
          <AdminFilterBar />
        </div>
        <div className="text-sm text-muted-foreground mt-2 xs:mt-0">
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
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-full px-4 sm:px-0">
          <EscapesTable escapes={escapes || []} />
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <AdminPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}
