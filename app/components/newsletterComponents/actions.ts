"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updatePopup(formData: FormData) {
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const description = formData.get("description") as string;
  const buttonText = formData.get("button_text") as string;
  const file = formData.get("image") as File;

  let image_url: string | null =
    (formData.get("existing_image") as string) || null;

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

  // Use the requested RPC function name
  const { error } = await supabase.rpc("submit_newsletter_mail", {
    p_title: title,
    p_subtitle: subtitle,
    p_description: description,
    p_image_url: image_url,
    p_button_text: buttonText,
  });

  if (error) {
    console.error("RPC error:", error);
    // Fallback: Manually update the first record we find to avoid duplicates
    const { data: existing } = await supabase
      .from("newsletter_popup_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    const { error: upsertError } = await supabase
      .from("newsletter_popup_settings")
      .upsert({
        id: existing?.id, // This ensures we UPDATE the existing row instead of making a new one
        title,
        subtitle,
        description,
        button_text: buttonText,
        image_url,
        is_active: true,
      });

    if (upsertError) {
      return { success: false, error: upsertError.message };
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/newsletter");
  return { success: true };
}
