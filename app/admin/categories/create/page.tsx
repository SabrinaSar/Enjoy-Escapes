import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryFormWrapper } from "../components/CategoryFormWrapper";

export default function CreateCategoryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
          Create New Category
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add a new category with filters and embed configurations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryFormWrapper />
        </CardContent>
      </Card>
    </div>
  );
} 