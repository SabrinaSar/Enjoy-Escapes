"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Form state interface
interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: any;
}

// Category form schema
const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  slug: z.string().min(1, "Slug is required.").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens."),
  icon: z.string().min(1, "Icon path is required."),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  is_special_page: z.boolean().default(false),
  sort_order: z.number().min(0, "Sort order must be 0 or greater.").default(0),
  iframe_embed_code: z.string().optional(),
});

// Category filter schema
const categoryFilterSchema = z.object({
  filter_type: z.string().min(1, "Filter type is required."),
  filter_value: z.string().min(1, "Filter value is required."),
});


// Fetch all categories with their filters
export async function fetchCategories() {
  const supabase = await createClient();
  
  const { data: categories, error } = await supabase
    .from("categories")
    .select(`
      *,
      category_filters (*)
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return { categories: [], error: error.message };
  }

  return { categories, error: null };
}

// Create a new category
export async function createCategory(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  // Extract form data
  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    icon: formData.get("icon") as string,
    description: formData.get("description") as string || null,
    is_active: formData.get("is_active") === "on",
    is_special_page: formData.get("is_special_page") === "on",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    iframe_embed_code: formData.get("iframe_embed_code") as string || null,
  };

  // Validate data
  const validationResult = categoryFormSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const validatedData = validationResult.data;

  // Check if slug already exists
  const { data: existingCategory } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", validatedData.slug)
    .single();

  if (existingCategory) {
    return {
      success: false,
      message: "A category with this slug already exists.",
      errors: { slug: ["Slug must be unique."] },
    };
  }

  // Insert category
  const { data: category, error } = await supabase
    .from("categories")
    .insert(validatedData)
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    return {
      success: false,
      message: "Failed to create category. Please try again.",
    };
  }

  // Handle filters
  const filters = extractFiltersFromFormData(formData);
  if (filters.length > 0) {
    const filtersWithCategoryId = filters.map(filter => ({
      ...filter,
      category_id: category.id,
    }));

    const { error: filtersError } = await supabase
      .from("category_filters")
      .insert(filtersWithCategoryId);

    if (filtersError) {
      console.error("Error creating category filters:", filtersError);
    }
  }


  revalidatePath("/admin/categories");
  return {
    success: true,
    message: "Category created successfully!",
    data: category,
  };
}

// Update a category
export async function updateCategory(
  categoryId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  // Extract form data
  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    icon: formData.get("icon") as string,
    description: formData.get("description") as string || null,
    is_active: formData.get("is_active") === "on",
    is_special_page: formData.get("is_special_page") === "on",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    iframe_embed_code: formData.get("iframe_embed_code") as string || null,
  };

  // Validate data
  const validationResult = categoryFormSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const validatedData = validationResult.data;

  // Check if slug already exists (excluding current category)
  const { data: existingCategory } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", validatedData.slug)
    .neq("id", categoryId)
    .single();

  if (existingCategory) {
    return {
      success: false,
      message: "A category with this slug already exists.",
      errors: { slug: ["Slug must be unique."] },
    };
  }

  // Update category
  const { data: category, error } = await supabase
    .from("categories")
    .update(validatedData)
    .eq("id", categoryId)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    return {
      success: false,
      message: "Failed to update category. Please try again.",
    };
  }

  // Delete existing filters
  await supabase.from("category_filters").delete().eq("category_id", categoryId);

  // Handle filters
  const filters = extractFiltersFromFormData(formData);
  if (filters.length > 0) {
    const filtersWithCategoryId = filters.map(filter => ({
      ...filter,
      category_id: categoryId,
    }));

    const { error: filtersError } = await supabase
      .from("category_filters")
      .insert(filtersWithCategoryId);

    if (filtersError) {
      console.error("Error updating category filters:", filtersError);
    }
  }


  revalidatePath("/admin/categories");
  return {
    success: true,
    message: "Category updated successfully!",
    data: category,
  };
}

// Delete a category
export async function deleteCategory(categoryId: string): Promise<FormState> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      message: "Failed to delete category. Please try again.",
    };
  }

  revalidatePath("/admin/categories");
  return {
    success: true,
    message: "Category deleted successfully!",
  };
}

// Helper function to extract filters from form data
function extractFiltersFromFormData(formData: FormData) {
  const filters: any[] = [];
  const filterEntries = Array.from(formData.entries()).filter(([key]) => 
    key.startsWith("filter_") && key.endsWith("_type")
  );

  filterEntries.forEach(([key]) => {
    const index = key.split("_")[1];
    const filterType = formData.get(`filter_${index}_type`) as string;
    const filterValue = formData.get(`filter_${index}_value`) as string;

    if (filterType && filterValue) {
      filters.push({
        filter_type: filterType,
        filter_value: filterValue,
      });
    }
  });

  return filters;
}

 