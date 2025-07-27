import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryFormWrapper } from "../components/CategoryFormWrapper";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch category with its filters
  const { data: category, error } = await supabase
    .from("categories")
    .select(`
      *,
      category_filters (*)
    `)
    .eq("id", id)
    .single();

  if (error || !category) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
          Edit Category: {category.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update category details, filters, and iframe embed code
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryFormWrapper category={category} />
        </CardContent>
      </Card>
    </div>
  );
} 