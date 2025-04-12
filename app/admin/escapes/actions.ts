"use server";

import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type EscapeInsert = Database["public"]["Tables"]["escapes_data"]["Insert"];
type EscapeUpdate = Database["public"]["Tables"]["escapes_data"]["Update"];

export async function createEscape(formData: EscapeInsert | EscapeUpdate) {
  const supabase = await createClient();

  // TODO: Add validation logic here (e.g., using Zod)

  const { data, error } = await supabase
    .from("escapes_data")
    .insert(formData as EscapeInsert)
    .select()
    .single(); // Assuming you want the created record back

  if (error) {
    console.error("Error creating escape:", error);
    // TODO: Return a more specific error message to the form
    return {
      success: false,
      message: "Failed to create escape. " + error.message,
    };
  }

  // Revalidate the path to update the escapes list
  revalidatePath("/admin/escapes");

  // Optional: Redirect to the main escapes list page after creation
  // redirect('/admin/escapes');
  // Or just return success
  return {
    success: true,
    message: "Escape created successfully!",
    data: data,
  };
}

export async function updateEscape(formData: EscapeUpdate) {
  const supabase = await createClient();

  // TODO: Add validation logic here (e.g., using Zod)

  if (!formData.id) {
    return {
      success: false,
      message: "Error: Escape ID is missing for update.",
    };
  }

  const { data, error } = await supabase
    .from("escapes_data")
    .update(formData)
    .eq("id", formData.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating escape:", error);
    return {
      success: false,
      message: "Failed to update escape. " + error.message,
      error: error,
    };
  }

  // Revalidate paths where this data might be shown
  revalidatePath("/admin/escapes");
  revalidatePath(`/admin/escapes/${formData.id}/edit`);

  return {
    success: true,
    message: "Escape updated successfully!",
    data: data,
  };
}

export async function deleteEscape(id: number) {
  const supabase = await createClient();

  if (!id) {
    return {
      success: false,
      message: "Error: Escape ID is missing for deletion.",
    };
  }

  const { error } = await supabase.from("escapes_data").delete().eq("id", id);

  if (error) {
    console.error("Error deleting escape:", error);
    return {
      success: false,
      message: "Failed to delete escape. " + error.message,
      error: error,
    };
  }

  // Revalidate the main escapes list path
  revalidatePath("/admin/escapes");

  return {
    success: true,
    message: "Escape deleted successfully!",
  };
}
