import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import EscapesTable from "./components/EscapesTable"; // We will create this next
import Link from "next/link";
import { PlusCircle } from "lucide-react";
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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Manage Escapes
        </h1>
        <Button asChild>
          <Link href="/admin/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Escape
          </Link>
        </Button>
      </div>

      {/* Pass the fetched escapes to the table component */}
      <EscapesTable escapes={escapes || []} />
    </>
  );
}
