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

// Define a type validator for the deal type enum
const dealTypeEnum = z.enum(["hotel", "flight", "hotel+flight", "other"]);

// Define a type validator for the board basis enum
const boardBasisEnum = z.enum([
  "room_only",
  "self_catering",
  "bed_and_breakfast",
  "half_board",
  "full_board",
  "all_inclusive",
  "ultra_all_inclusive",
  "flight_only",
]);

// Define a type validator for the price unit enum
const priceUnitEnum = z.enum(["pp", "pn", "pr"]);

// Updated Zod schema with the new scheduled_for field
const escapeFormSchema = z
  .object({
    title: z.string().min(1, "Title is required."),
    price: z
      .string()
      .min(1, "Price is required.")
      .transform((val) => {
        const numericValue = parseInt(val.replace(/[^0-9]/g, ""), 10);
        return isNaN(numericValue) ? 0 : numericValue;
      }), // Transform string to number, allowing 0 for "Contact for Price"
    link: z.string().url("Invalid URL format."),
    type: dealTypeEnum, // Add type validation
    // Optional fields
    nights: z
      .union([
        z.string().transform((val) => (val === "" ? null : parseInt(val, 10))),
        z.number(),
        z.null(),
      ])
      .optional(),
    board_basis: boardBasisEnum.optional(),
    star_rating: z
      .union([
        z.string().transform((val) => (val === "" ? null : parseInt(val, 10))),
        z.number(),
        z.null(),
      ])
      .optional(),
    price_unit: priceUnitEnum.optional(),
    deposit_price: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return null;
        return parseInt(val.replace(/[^0-9]/g, ""), 10);
      }),
    deposit_price_unit: priceUnitEnum.optional(),
    school_holidays: z
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
      .default(false),
    long_haul: z
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
      .default(false),
    featured: z
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
      .default(false),
    hot_deal: z
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
      .default(false),
    last_minute: z
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
      .default(false),
    scheduled_for: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return null;
        // If it's already a valid ISO string, just return it
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(val)) {
          return val;
        }
        // Otherwise, try to parse it as a date and convert to ISO
        try {
          const date = new Date(val);
          return date.toISOString();
        } catch (e) {
          return null;
        }
      }),
    // Exclude image_file from schema validation if handled separately
  })
  .refine(
    (data) => {
      if (data.type === "flight")
        return data.board_basis === "flight_only" || !data.board_basis;
      if (data.type === "hotel") return data.board_basis !== "flight_only";
      if (data.type === "hotel+flight")
        return (
          data.board_basis !== "flight_only" && data.board_basis !== "room_only"
        );
      if (data.type === "other")
        return !data.board_basis; // "other" type should not have board basis
      return true;
    },
    {
      message: "Invalid combination of type and board basis",
      path: ["board_basis"],
    }
  );

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

  // Enhanced validation for image file
  if (imageFile && imageFile.size > 0) {
    // Validate image has a name
    if (!imageFile.name || imageFile.name.trim() === "") {
      return {
        success: false,
        message: "Image file must have a valid name.",
        errors: {
          image_file: ["Image file must have a valid name."],
        },
      };
    }

    // Check for HEIC files (by file extension and MIME type)
    const fileName = imageFile.name.toLowerCase();
    const isHeicByExtension = fileName.endsWith('.heic') || fileName.endsWith('.heif');
    const isHeicByMimeType = imageFile.type === 'image/heic' || imageFile.type === 'image/heif';
    
    if (isHeicByExtension || isHeicByMimeType) {
      return {
        success: false,
        message: "HEIC/HEIF files are not supported. Please convert to JPG, PNG, or WebP format.",
        errors: {
          image_file: ["HEIC/HEIF files are not supported. Please convert to JPG, PNG, or WebP format."],
        },
      };
    }

    // Validate it's an actual image file
    if (!imageFile.type.startsWith("image/")) {
      return {
        success: false,
        message: "Uploaded file must be an image.",
        errors: {
          image_file: ["Uploaded file must be an image."],
        },
      };
    }

    // Generate a safe filename with a timestamp
    const safeFileName = imageFile.name.replace(/[^\w\d.-]/g, "_");
    const imagePath = `escapes/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("enjoy-escapes-assets")
      .upload(imagePath, imageFile, {
        contentType: imageFile.type, // Explicitly set the content type
      });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return {
        success: false,
        message: "Failed to upload image. " + uploadError.message,
        errors: {
          image_file: ["Failed to upload image: " + uploadError.message],
        },
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

  const validatedFields = escapeFormSchema.safeParse({
    title: rawFormData.title,
    price: rawFormData.price,
    link: rawFormData.link,
    type: rawFormData.type,
    nights: rawFormData.nights,
    board_basis: rawFormData.board_basis,
    star_rating: rawFormData.star_rating,
    price_unit: rawFormData.price_unit,
    deposit_price: rawFormData.deposit_price,
    deposit_price_unit: rawFormData.deposit_price_unit,
    school_holidays:
      rawFormData.school_holidays === "on" ||
      rawFormData.school_holidays === "true" ||
      false,
    long_haul:
      rawFormData.long_haul === "on" ||
      rawFormData.long_haul === "true" ||
      false,
    featured:
      rawFormData.featured === "on" || rawFormData.featured === "true" || false,
    hot_deal:
      rawFormData.hot_deal === "on" || rawFormData.hot_deal === "true" || false,
    last_minute:
      rawFormData.last_minute === "on" ||
      rawFormData.last_minute === "true" ||
      false,
    scheduled_for: rawFormData.scheduled_for,
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
  const {
    title,
    price,
    link,
    type,
    nights,
    board_basis,
    star_rating,
    price_unit,
    deposit_price,
    deposit_price_unit,
    school_holidays,
    long_haul,
    featured,
    hot_deal,
    last_minute,
    scheduled_for,
  } = validatedFields.data;

  // Prepare data for database insertion
  const escapeDataToInsert: EscapeInsert = {
    title,
    price, // Already validated as string
    link,
    type, // Add the type field to the data being inserted
    nights: nights,
    board_basis: board_basis,
    star_rating: star_rating,
    price_unit: price_unit,
    deposit_price: deposit_price,
    deposit_price_unit: deposit_price_unit,
    school_holidays: school_holidays || false,
    long_haul: long_haul || false,
    featured: featured || false,
    hot_deal: hot_deal || false,
    last_minute: last_minute || false,
    scheduled_for: scheduled_for,
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
  revalidatePath("/admin");

  // Optional: Redirect to the main escapes list page after creation
  // redirect('/admin');
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

  // Enhanced validation for image file
  if (imageFile && imageFile.size > 0) {
    // Validate image has a name
    if (!imageFile.name || imageFile.name.trim() === "") {
      return {
        success: false,
        message: "Image file must have a valid name.",
        errors: {
          image_file: ["Image file must have a valid name."],
        },
      };
    }

    // Check for HEIC files (by file extension and MIME type)
    const fileName = imageFile.name.toLowerCase();
    const isHeicByExtension = fileName.endsWith('.heic') || fileName.endsWith('.heif');
    const isHeicByMimeType = imageFile.type === 'image/heic' || imageFile.type === 'image/heif';
    
    if (isHeicByExtension || isHeicByMimeType) {
      return {
        success: false,
        message: "HEIC/HEIF files are not supported. Please convert to JPG, PNG, or WebP format.",
        errors: {
          image_file: ["HEIC/HEIF files are not supported. Please convert to JPG, PNG, or WebP format."],
        },
      };
    }

    // Validate it's an actual image file
    if (!imageFile.type.startsWith("image/")) {
      return {
        success: false,
        message: "Uploaded file must be an image.",
        errors: {
          image_file: ["Uploaded file must be an image."],
        },
      };
    }

    // Generate a safe filename with a timestamp
    const safeFileName = imageFile.name.replace(/[^\w\d.-]/g, "_");
    newImagePath = `escapes/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("enjoy-escapes-assets")
      .upload(newImagePath, imageFile, {
        contentType: imageFile.type, // Explicitly set the content type
      });

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
  const escapeUpdateFormSchema = z
    .object({
      title: z.string().min(1, "Title is required."),
      price: z
        .string()
        .min(1, "Price is required.")
        .transform((val) => {
          const numericValue = parseInt(val.replace(/[^0-9]/g, ""), 10);
          return isNaN(numericValue) ? 0 : numericValue;
        }), // Transform string to number, allowing 0 for "Contact for Price"
      link: z.string().url("Invalid URL format."),
      type: dealTypeEnum, // Add type validation
      nights: z
        .union([
          z
            .string()
            .transform((val) => (val === "" ? null : parseInt(val, 10))),
          z.number(),
          z.null(),
        ])
        .optional(),
      board_basis: boardBasisEnum.optional(),
      star_rating: z
        .union([
          z
            .string()
            .transform((val) => (val === "" ? null : parseInt(val, 10))),
          z.number(),
          z.null(),
        ])
        .optional(),
      price_unit: priceUnitEnum.optional(),
      deposit_price: z
        .string()
        .optional()
        .transform((val) => {
          if (!val) return null;
          return parseInt(val.replace(/[^0-9]/g, ""), 10);
        }),
      deposit_price_unit: priceUnitEnum.optional(),
      school_holidays: z
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
        .default(false),
      long_haul: z
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
        .default(false),
      featured: z
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
        .default(false),
      hot_deal: z
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
        .default(false),
      last_minute: z
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
        .default(false),
      scheduled_for: z
        .string()
        .optional()
        .transform((val) => {
          if (!val) return null;
          // If it's already a valid ISO string, just return it
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(val)) {
            return val;
          }
          // Otherwise, try to parse it as a date and convert to ISO
          try {
            const date = new Date(val);
            return date.toISOString();
          } catch (e) {
            return null;
          }
        }),
      // ID is handled separately, image_file is handled separately
    })
    .refine(
      (data) => {
        if (data.type === "flight")
          return data.board_basis === "flight_only" || !data.board_basis;
        if (data.type === "hotel") return data.board_basis !== "flight_only";
        if (data.type === "hotel+flight")
          return (
            data.board_basis !== "flight_only" &&
            data.board_basis !== "room_only"
          );
        if (data.type === "other")
          return !data.board_basis; // "other" type should not have board basis
        return true;
      },
      {
        message: "Invalid combination of type and board basis",
        path: ["board_basis"],
      }
    );

  // Exclude file and id before validation
  const { image_file, id: removedId, ...dataToValidate } = rawFormData;

  const validatedFields = escapeUpdateFormSchema.safeParse({
    title: dataToValidate.title,
    price: dataToValidate.price,
    link: dataToValidate.link,
    type: dataToValidate.type,
    nights: dataToValidate.nights,
    board_basis: dataToValidate.board_basis,
    star_rating: dataToValidate.star_rating,
    price_unit: dataToValidate.price_unit,
    deposit_price: dataToValidate.deposit_price,
    deposit_price_unit: dataToValidate.deposit_price_unit,
    school_holidays:
      dataToValidate.school_holidays === "on" ||
      dataToValidate.school_holidays === "true" ||
      false,
    long_haul:
      dataToValidate.long_haul === "on" ||
      dataToValidate.long_haul === "true" ||
      false,
    featured:
      dataToValidate.featured === "on" ||
      dataToValidate.featured === "true" ||
      false,
    hot_deal:
      dataToValidate.hot_deal === "on" ||
      dataToValidate.hot_deal === "true" ||
      false,
    last_minute:
      dataToValidate.last_minute === "on" ||
      dataToValidate.last_minute === "true" ||
      false,
    scheduled_for: dataToValidate.scheduled_for,
  });

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
  const {
    title,
    price,
    link,
    type,
    nights,
    board_basis,
    star_rating,
    price_unit,
    deposit_price,
    deposit_price_unit,
    school_holidays,
    long_haul,
    featured,
    hot_deal,
    last_minute,
    scheduled_for,
  } = validatedFields.data;

  // Prepare data for database update
  const escapeDataToUpdate: EscapeUpdate = {
    title,
    price,
    link,
    type, // Add the type field to the update data
    nights: nights,
    board_basis: board_basis,
    star_rating: star_rating,
    price_unit: price_unit,
    deposit_price: deposit_price,
    deposit_price_unit: deposit_price_unit,
    school_holidays: school_holidays || false,
    long_haul: long_haul || false,
    featured: featured || false,
    hot_deal: hot_deal || false,
    last_minute: last_minute || false,
    scheduled_for: scheduled_for,

    // Conditionally add the image field only if a new one was uploaded
    // Otherwise keep the existing image URL from currentEscapeData
    ...(newImageUrl ? { image: newImageUrl } : {}),
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
  revalidatePath("/admin");
  revalidatePath(`/admin/${id}/edit`);

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
  revalidatePath("/admin");

  return {
    success: true,
    message: "Escape deleted successfully!",
  };
}

// Function to fetch escapes with pagination and search
export async function fetchEscapesWithPagination(
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = "",
  filters: {
    featured?: boolean;
    hot_deal?: boolean;
    school_holidays?: boolean;
    long_haul?: boolean;
    last_minute?: boolean;
    type?: "hotel" | "flight" | "hotel+flight" | "other";
    include_scheduled?: boolean; // New filter to include scheduled escapes
  } = {}
): Promise<{
  escapes: Database["public"]["Tables"]["escapes_data"]["Row"][];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  error: string | null;
}> {
  const supabase = await createClient();

  // Calculate pagination limits
  const from = (page - 1) * pageSize;
  const to = page * pageSize - 1;

  // Start with the base query
  let query = supabase.from("escapes_data").select("*", { count: "exact" });

  // Filter by scheduled status
  const now = new Date().toISOString();
  if (filters.include_scheduled === true) {
    // If include_scheduled is true, only show future scheduled escapes
    // Using ISO string for consistent UTC timezone handling in the database
    query = query.gt("scheduled_for", now);
  } else if (filters.include_scheduled === false) {
    // Don't show any scheduled escapes
    query = query.or(`scheduled_for.is.null,scheduled_for.lte.${now}`);
  }
  // Default (undefined) - show all escapes

  // Add search filtering if a search query is provided
  if (searchQuery) {
    const searchQueryLower = searchQuery.toLowerCase();

    // Use ilike for case-insensitive partial matches
    query = query.or(`title.ilike.%${searchQueryLower}%`);
  }

  // Apply filters for special attributes
  // Only apply filter if it's explicitly set to true
  // We want to see ALL items (including featured ones) when not filtering
  if (filters.featured === true) {
    query = query.eq("featured", true);
  }

  if (filters.hot_deal === true) {
    query = query.eq("hot_deal", true);
  }

  if (filters.school_holidays === true) {
    query = query.eq("school_holidays", true);
  }

  if (filters.long_haul === true) {
    query = query.eq("long_haul", true);
  }

  if (filters.last_minute === true) {
    query = query.eq("last_minute", true);
  }

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  // Apply pagination and ordering
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching escapes:", error);
    return {
      escapes: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      error: error.message,
    };
  }

  // Calculate total pages
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    escapes: data || [],
    totalCount,
    currentPage: page,
    totalPages,
    error: null,
  };
}
