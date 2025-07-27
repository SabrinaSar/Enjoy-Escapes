import { createClient } from "@/utils/supabase/server";
import CategoryFilterClient from "./CategoryFilterClient";

// Server component that fetches data and passes to client component
export default async function CategoryFilter() {
  // Fetch categories on the server for SSR
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select(`
      *,
      category_filters (*)
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  // Pass the fetched data to the client component
  return <CategoryFilterClient initialCategories={categories || []} />;
}
