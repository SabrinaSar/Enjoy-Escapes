import { Database } from "@/types/supabase";
import { EscapeForm } from "../../components/EscapeForm"; // Adjust path as needed
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { updateEscape } from "../../actions"; // Adjust path as needed

// Define the params type as a Promise based on Next.js >= 15 changes
type PageParams = Promise<{ id: string }>;

export default async function EditEscapePage(props: { params: PageParams }) {
  // Await the params promise to resolve it
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: escape, error } = await supabase
    .from("escapes_data")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !escape) {
    console.error("Error fetching escape for edit:", error);
    notFound(); // Show a 404 page if escape not found or error occurs
  }

  return (
    <>
      <EscapeForm action={updateEscape} initialData={escape} formType="edit" />
      <Toaster richColors /> {/* Ensure Toaster is rendered */}
    </>
  );
}
