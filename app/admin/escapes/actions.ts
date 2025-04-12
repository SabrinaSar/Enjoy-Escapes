"use server";

import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define the expected state shape from the server action (matches EscapeForm)
interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: any;
}

type EscapeInsert = Database["public"]["Tables"]["escapes_data"]["Insert"];
type EscapeUpdate = Database["public"]["Tables"]["escapes_data"]["Update"];

// Updated function signature for createEscape
export async function createEscape(
  prevState: FormState, // Added prevState
  formData: FormData
): Promise<FormState> {
  // Return type updated to FormState
  const supabase = await createClient();

  // --- Extract data from FormData ---
  const rawFormData = Object.fromEntries(formData.entries());

  // Handle image upload
  let imageUrl: string | null = null;
  const imageFile = formData.get("image_file") as File | null;
  if (imageFile) {
    const imagePath = `escapes/${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("enjoy-escapes-assets")
      .upload(imagePath, imageFile);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return {
        success: false,
        message: "Failed to upload image. " + uploadError.message,
        // Add errors field if needed for specific validation errors
      };
    }

    // Adjusted getPublicUrl handling: It only returns { data }
    const { data: imageData } = supabase.storage
      .from("enjoy-escapes-assets")
      .getPublicUrl(imagePath);

    // Check if publicUrl exists in the returned data
    imageUrl = imageData?.publicUrl ?? null;
    if (!imageUrl) {
      // Handle case where public URL couldn't be generated
      console.error("Could not get public URL for uploaded image.");
      // Attempt to clean up the uploaded file
      await supabase.storage.from("enjoy-escapes-assets").remove([imagePath]);
      return {
        success: false,
        message: "Image uploaded but failed to get public URL.",
      };
    }
  }

  // --- Add Zod Validation (Example) ---
  // Define Zod schema (should match your form needs)
  const escapeFormSchema = z.object({
    title: z.string().min(1, "Title is required."),
    subtitle: z.string().min(1, "Subtitle is required."),
    country: z.string().min(1, "Country is required."),
    price: z.string().min(1, "Price is required."), // Keep as string based on previous findings
    link: z.string().url("Invalid URL format."),
    // Optional fields
    tags: z.string().optional(),
    validFrom: z.string().optional(),
    validTo: z.string().optional(),
    // Exclude image_file from schema validation if handled separately
  });

  const validatedFields = escapeFormSchema.safeParse({
    title: rawFormData.title,
    subtitle: rawFormData.subtitle,
    country: rawFormData.country,
    price: rawFormData.price,
    link: rawFormData.link,
    tags: rawFormData.tags,
    validFrom: rawFormData.validFrom,
    validTo: rawFormData.validTo,
  });

  // If validation fails, return errors
  if (!validatedFields.success) {
    console.log(
      "Validation Errors:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Validation failed. Please check the form fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Use validated data for insertion
  const { title, subtitle, country, price, link, tags, validFrom, validTo } =
    validatedFields.data;

  // Prepare data for database insertion
  const escapeDataToInsert: EscapeInsert = {
    title,
    subtitle,
    country,
    price, // Already validated as string
    link,
    // Handle tags: Convert comma-separated string to array for DB if needed
    // tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : null,
    // Handle dates: Convert date string to ISO format for DB if needed
    // validFrom: validFrom ? new Date(validFrom).toISOString() : null,
    // validTo: validTo ? new Date(validTo).toISOString() : null,

    image: imageUrl ?? "", // Use uploaded URL or empty string
  };

  // --- Insert data into the database ---
  const { data, error } = await supabase
    .from("escapes_data")
    .insert(escapeDataToInsert)
    .select()
    .single(); // Assuming you want the created record back

  if (error) {
    console.error("Error creating escape:", error);
    // Clean up uploaded image if insertion fails
    if (imageUrl) {
      console.log(`Insertion failed, deleting uploaded image: ${imageUrl}`);
      await supabase.storage.from("enjoy-escapes-assets").remove([imageUrl]);
    }
    return {
      success: false,
      message: "Database Error: Failed to create escape. " + error.message,
      // Optionally add DB error details if helpful
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

// Updated function signature for updateEscape
export async function updateEscape(
  prevState: FormState, // Added prevState
  formData: FormData
): Promise<FormState> {
  // Return type updated to FormState
  const supabase = await createClient();

  // --- Extract data and ID from FormData ---
  const rawFormData = Object.fromEntries(formData.entries());

  const id = rawFormData.id as string;
  if (!id) {
    return {
      success: false,
      message: "Error: Escape ID is missing or invalid for update.",
    };
  }

  // --- Fetch current escape data to get old image path ---
  const { data: currentEscapeData, error: fetchError } = await supabase
    .from("escapes_data")
    .select("image")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error(
      "Database Error: Failed to fetch current escape data for update.",
      fetchError
    );
    return {
      success: false,
      message:
        "Database Error: Failed to fetch current escape data for update. " +
        fetchError?.message,
    };
  }

  const oldImagePath = currentEscapeData.image;

  // --- Handle Optional Image Upload ---
  let newImageUrl: string | null = null;
  let newImagePath: string | null = null;
  const imageFile = formData.get("image_file") as File | null;
  if (imageFile) {
    newImagePath = `escapes/${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("enjoy-escapes-assets")
      .upload(newImagePath, imageFile);

    if (uploadError) {
      console.error("Error uploading new image:", uploadError);
      return {
        success: false,
        message:
          "Storage Error: Failed to upload new image. " + uploadError.message,
      };
    }

    // Adjusted getPublicUrl handling: It only returns { data }
    const { data: imageData } = supabase.storage
      .from("enjoy-escapes-assets")
      .getPublicUrl(newImagePath);

    // Check if publicUrl exists in the returned data
    newImageUrl = imageData?.publicUrl ?? null;
    if (!newImageUrl) {
      console.error(
        "Storage Error: New image uploaded but failed to get public URL."
      );
      // Attempt to clean up the newly uploaded file
      if (newImagePath) {
        await supabase.storage
          .from("enjoy-escapes-assets")
          .remove([newImagePath]);
      }
      return {
        success: false,
        message:
          "Storage Error: New image uploaded but failed to get public URL.",
      };
    }
  }

  // --- Add Zod Validation (Example) ---
  // Define Zod schema for update (similar to create, adjust if needed)
  const escapeUpdateFormSchema = z.object({
    title: z.string().min(1, "Title is required."),
    subtitle: z.string().min(1, "Subtitle is required."),
    country: z.string().min(1, "Country is required."),
    price: z.string().min(1, "Price is required."),
    link: z.string().url("Invalid URL format."),
    tags: z.string().optional(),
    validFrom: z.string().optional(),
    validTo: z.string().optional(),
    // ID is handled separately, image_file is handled separately
  });

  // Exclude file and id before validation
  const { image_file, id: removedId, ...dataToValidate } = rawFormData;

  const validatedFields = escapeUpdateFormSchema.safeParse(dataToValidate);

  // If validation fails, return errors
  if (!validatedFields.success) {
    console.log(
      "Validation Errors:",
      validatedFields.error.flatten().fieldErrors
    );
    // Clean up newly uploaded image if validation fails *after* upload
    if (newImagePath) {
      console.log(
        `Validation failed, deleting newly uploaded image: ${newImagePath}`
      );
      await supabase.storage
        .from("enjoy-escapes-assets")
        .remove([newImagePath]);
    }
    return {
      success: false,
      message: "Validation failed. Please check the form fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Use validated data for update
  const { title, subtitle, country, price, link, tags, validFrom, validTo } =
    validatedFields.data;

  // Prepare data for database update
  const escapeDataToUpdate: EscapeUpdate = {
    title,
    subtitle,
    country,
    price,
    link,
    // tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : null,
    // validFrom: validFrom ? new Date(validFrom).toISOString() : null,
    // validTo: validTo ? new Date(validTo).toISOString() : null,

    // Conditionally add the image field only if a new one was uploaded
    ...(newImageUrl && { image: newImageUrl }),
  };

  // --- Update data in the database ---
  const { data, error } = await supabase
    .from("escapes_data")
    .update(escapeDataToUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating escape:", error);
    // Clean up newly uploaded image if update fails *after* upload
    if (newImagePath) {
      console.log(
        `Update failed, deleting newly uploaded image: ${newImagePath}`
      );
      await supabase.storage
        .from("enjoy-escapes-assets")
        .remove([newImagePath]);
    }
    return {
      success: false,
      message: "Database Error: Failed to update escape. " + error.message,
      // error: error, // Avoid sending raw DB error object to client
    };
  }

  // Revalidate paths where this data might be shown
  revalidatePath("/admin/escapes");
  revalidatePath(`/admin/escapes/${id}/edit`);

  // Clean up old image if a new one was uploaded
  if (newImagePath && oldImagePath) {
    console.log(`Update successful, deleting old image: ${oldImagePath}`);
    await supabase.storage.from("enjoy-escapes-assets").remove([oldImagePath]);
  }

  return {
    success: true,
    message: "Escape updated successfully!",
    data: data,
  };
}

// --- Delete function remains the same (doesn't use useFormState) ---
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
