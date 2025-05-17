"use server";

import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define the expected state shape from the server action
interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: any;
}

type BannerInsert = Database["public"]["Tables"]["banners"]["Insert"];
type BannerUpdate = Database["public"]["Tables"]["banners"]["Update"];

// Zod schema for banner form validation
const bannerFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  link: z.string().url("Invalid URL format.").optional().or(z.literal("")),
  active: z
    .union([
      z.boolean(),
      z.literal("on"),
      z.literal("true"),
      z.literal(true),
      z.literal(""),
      z.literal(undefined),
      z.null(),
    ])
    .transform((val) => val === true || val === "on" || val === "true")
    .optional()
    .default(true),
  start_date: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return null;
      try {
        const date = new Date(val);
        return date.toISOString();
      } catch (e) {
        return null;
      }
    }),
  end_date: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return null;
      try {
        const date = new Date(val);
        return date.toISOString();
      } catch (e) {
        return null;
      }
    }),
  position: z
    .string()
    .transform((val) => parseInt(val) || 0)
    .optional()
    .default("0"),
  background_color: z.string().optional().default("#FFFFFF"),
  text_color: z.string().optional().default("#000000"),
});

// Create a new banner
export async function createBanner(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  // Extract data from FormData
  const rawFormData = Object.fromEntries(formData.entries());

  // Handle image upload
  let imageUrl: string | null = null;
  const imageFile = formData.get("image_file") as File | null;

  // Enhanced validation for image file
  if (!imageFile || imageFile.size === 0) {
    return {
      success: false,
      message: "Banner image is required.",
      errors: {
        image_file: ["Banner image is required."],
      },
    };
  }

  // Validate file has a valid name
  if (!imageFile.name || imageFile.name.trim() === "") {
    return {
      success: false,
      message: "Image file must have a valid name.",
      errors: {
        image_file: ["Image file must have a valid name."],
      },
    };
  }

  // Validate form data using Zod
  const validationResult = bannerFormSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Validation error. Please check your inputs.",
      errors,
    };
  }

  // Destructure valid data
  const validData = validationResult.data;

  try {
    // Get file extension
    const fileExtension = imageFile.name.split(".").pop();
    const fileName = `banners/${Date.now()}_${imageFile.name.replace(/[^\w\d.-]/g, "_")}`;

    // Upload the image to Supabase Storage using the same bucket as escapes
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("enjoy-escapes-assets")
      .upload(fileName, imageFile, {
        contentType: imageFile.type, // Explicitly set the content type
      });

    if (uploadError) {
      throw new Error(`Error uploading image: ${uploadError.message}`);
    }

    // Get public URL for the uploaded image
    const { data: imageData } = supabase.storage
      .from("enjoy-escapes-assets")
      .getPublicUrl(fileName);

    // Check if publicUrl exists in the returned data
    imageUrl = imageData?.publicUrl ?? null;
    if (!imageUrl) {
      // Handle case where public URL couldn't be generated
      console.error("Could not get public URL for uploaded image.");
      // Attempt to clean up the uploaded file
      await supabase.storage.from("enjoy-escapes-assets").remove([fileName]);
      throw new Error("Image uploaded but failed to get public URL.");
    }

    // Prepare banner data for insertion
    const bannerData: BannerInsert = {
      title: validData.title,
      description: validData.description || null,
      image: imageUrl,
      link: validData.link || null,
      active: validData.active,
      start_date: validData.start_date,
      end_date: validData.end_date,
      position: typeof validData.position === "string" 
        ? parseInt(validData.position) 
        : validData.position,
      background_color: validData.background_color,
      text_color: validData.text_color,
    };

    // Insert banner data into the database
    const { data, error } = await supabase
      .from("banners")
      .insert(bannerData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error inserting banner: ${error.message}`);
    }

    // Revalidate the pages that display banners
    revalidatePath("/");
    revalidatePath("/admin/banners");

    return {
      success: true,
      message: "Banner created successfully!",
      data,
    };
  } catch (err) {
    console.error("Error creating banner:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "An unknown error occurred",
    };
  }
}

// Update an existing banner
export async function updateBanner(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  // Extract data from FormData
  const rawFormData = Object.fromEntries(formData.entries());
  const bannerId = formData.get("id") as string;

  if (!bannerId) {
    return {
      success: false,
      message: "Banner ID is required.",
    };
  }

  // Validate form data using Zod
  const validationResult = bannerFormSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Validation error. Please check your inputs.",
      errors,
    };
  }

  // Destructure valid data
  const validData = validationResult.data;

  try {
    // Handle image upload if a new image is provided
    let imageUrl: string | null = null;
    const imageFile = formData.get("image_file") as File | null;

    if (imageFile && imageFile.size > 0) {
      // Get file extension
      const fileExtension = imageFile.name.split(".").pop();
      const fileName = `banners/${Date.now()}_${imageFile.name.replace(/[^\w\d.-]/g, "_")}`;

      // Upload the image to Supabase Storage using the same bucket as escapes
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("enjoy-escapes-assets")
        .upload(fileName, imageFile, {
          contentType: imageFile.type, // Explicitly set the content type
        });

      if (uploadError) {
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }

      // Get public URL for the uploaded image
      const { data: imageData } = supabase.storage
        .from("enjoy-escapes-assets")
        .getPublicUrl(fileName);

      // Check if publicUrl exists in the returned data
      imageUrl = imageData?.publicUrl ?? null;
      if (!imageUrl) {
        // Handle case where public URL couldn't be generated
        console.error("Could not get public URL for uploaded image.");
        // Attempt to clean up the uploaded file
        await supabase.storage.from("enjoy-escapes-assets").remove([fileName]);
        throw new Error("Image uploaded but failed to get public URL.");
      }
    }

    // Prepare banner data for update
    const bannerData: BannerUpdate = {
      title: validData.title,
      description: validData.description || null,
      link: validData.link || null,
      active: validData.active,
      start_date: validData.start_date,
      end_date: validData.end_date,
      position: typeof validData.position === "string" 
        ? parseInt(validData.position) 
        : validData.position,
      background_color: validData.background_color,
      text_color: validData.text_color,
    };

    // Add image only if a new one was uploaded
    if (imageUrl) {
      bannerData.image = imageUrl;
    }

    // Update banner data in the database
    const { data, error } = await supabase
      .from("banners")
      .update(bannerData)
      .eq("id", bannerId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating banner: ${error.message}`);
    }

    // Revalidate the pages that display banners
    revalidatePath("/");
    revalidatePath("/admin/banners");

    return {
      success: true,
      message: "Banner updated successfully!",
      data,
    };
  } catch (err) {
    console.error("Error updating banner:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "An unknown error occurred",
    };
  }
}

// Delete a banner
export async function deleteBanner(id: number) {
  const supabase = await createClient();

  try {
    // Get the banner to check if it exists and to get its image
    const { data: banner, error: fetchError } = await supabase
      .from("banners")
      .select("image")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching banner: ${fetchError.message}`);
    }

    if (!banner) {
      throw new Error("Banner not found");
    }

    // Delete the banner from the database
    const { error: deleteError } = await supabase
      .from("banners")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error(`Error deleting banner: ${deleteError.message}`);
    }

    // Optionally, delete the image from storage if needed
    // This would require parsing the URL to get the path within the bucket

    // Revalidate pages
    revalidatePath("/");
    revalidatePath("/admin/banners");

    return { success: true, message: "Banner deleted successfully" };
  } catch (err) {
    console.error("Error deleting banner:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "An unknown error occurred",
    };
  }
} 