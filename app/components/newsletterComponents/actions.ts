"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteSubscriber(id: number) {
  await supabase.from("newsletter_subscribers").delete().eq("id", id);

  revalidatePath("/admin/newsletter");
}

export async function updatePopup(formData: FormData) {
  const idInput = formData.get("id");
  let id =
    idInput && idInput !== "0" && idInput !== "" ? Number(idInput) : null;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const file = formData.get("image") as File;

  // ✅ If no ID in form, try to find an existing record to update
  if (!id) {
    const { data: existing } = await supabase
      .from("newsletter_popup_settings")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (existing) id = existing.id;
  }

  let image_url: string | null = null;

  if (file && file.size > 0) {
    const fileName = `popup-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("popup-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return {
        success: false,
        error: "Image upload failed. Please try again.",
      };
    }

    const { data: publicUrl } = supabase.storage
      .from("popup-images")
      .getPublicUrl(fileName);

    image_url = publicUrl.publicUrl;
  }

  const updateData: any = {
    title,
    description,
    is_active: true,
  };

  // Only include id in upsert if it exists, otherwise Supabase creates new
  if (id) updateData.id = id;
  if (image_url) updateData.image_url = image_url;

  const { error } = await supabase
    .from("newsletter_popup_settings")
    .upsert(updateData);

  if (error) {
    console.error("Upsert error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/newsletter");
  return { success: true };
}
