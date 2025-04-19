import {
  CalendarIcon,
  PackageCheck,
  PlusCircle,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import EscapesTable from "./components/EscapesTable"; // We will create this next
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function EscapesPage() {
  const supabase = await createClient();
  const { data: escapes, error } = await supabase
    .from("escapes_data")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching escapes:", error);
    // TODO: Add better error handling, maybe show a toast or message
    return <p>Error loading escapes. Please try again later.</p>;
  }

  // Calculate some simple statistics
  const totalEscapes = escapes?.length || 0;
  const activeEscapes =
    escapes?.filter((escape) => {
      if (!escape.validTo) return true; // No end date means always active
      return new Date(escape.validTo) > new Date();
    }).length || 0;

  const packageDeals =
    escapes?.filter((escape) => escape.type === "hotel+flight").length || 0;
  const hotelOnlyDeals =
    escapes?.filter((escape) => escape.type === "hotel").length || 0;
  const flightOnlyDeals =
    escapes?.filter((escape) => escape.type === "flight").length || 0;

  const averagePrice =
    escapes?.reduce((sum, escape) => sum + (escape.price || 0), 0) /
    (escapes?.length || 1);

  // Get the latest created or updated escape
  const latestEscape = escapes?.[0];
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

      {/* Pass the fetched escapes to the table component */}
      <EscapesTable escapes={escapes || []} />
    </>
  );
}
