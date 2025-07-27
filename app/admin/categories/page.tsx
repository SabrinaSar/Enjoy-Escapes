import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, Edit, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { fetchCategories } from "./actions";
import { DeleteCategoryButton } from "./components/DeleteCategoryButton";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  is_active: boolean;
  is_special_page: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category_filters: Array<{
    id: string;
    filter_type: string;
    filter_value: string;
  }>;
  iframe_embed_code: string | null;
}

export default async function CategoriesPage() {
  const { categories, error } = await fetchCategories();

  if (error) {
    return <p className="text-red-500">Error loading categories: {error}</p>;
  }

  const totalCategories = categories?.length || 0;
  const activeCategories = categories?.filter((cat: Category) => cat.is_active).length || 0;
  const specialPages = categories?.filter((cat: Category) => cat.is_special_page).length || 0;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
            Category Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage category filters and iframe embed codes
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/categories/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Category
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCategories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Special Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{specialPages}</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order</th>
                  <th className="text-left p-2">Icon</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Slug</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Filters</th>
                  <th className="text-left p-2">Iframe Code</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((category: Category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        {category.sort_order}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                        <Image
                          src={category.icon}
                          alt={category.name}
                          width={20}
                          height={20}
                          className="dark:invert"
                        />
                      </div>
                    </td>
                    <td className="p-2 font-medium">{category.name}</td>
                    <td className="p-2">
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="p-2">
                      {category.is_special_page ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                          Special Page
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded text-xs">
                          Filter
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      {category.is_active ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <EyeOff className="w-4 h-4" />
                          <span className="text-xs">Inactive</span>
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      <span className="text-xs text-muted-foreground">
                        {category.category_filters?.length || 0} filters
                      </span>
                    </td>
                    <td className="p-2">
                      <span className="text-xs text-muted-foreground">
                        {category.iframe_embed_code ? 'Configured' : 'Not set'}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/admin/categories/${category.id}`}>
                            <Edit className="w-3 h-3" />
                          </Link>
                        </Button>
                        <DeleteCategoryButton 
                          categoryId={category.id} 
                          categoryName={category.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!categories || categories.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No categories found.</p>
              <p className="text-sm">Create your first category to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
} 