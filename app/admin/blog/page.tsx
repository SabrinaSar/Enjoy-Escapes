import { createClient } from "@/utils/supabase/server";
import BlogAdmin from "./components/BlogAdmin";

export const metadata = {
  title: "Blog Management - Admin",
  description: "Manage blog posts, categories, and tags",
};

export default async function BlogAdminPage() {
  const supabase = await createClient();

  // Fetch blog posts with related data
  const { data: posts } = await supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories:blog_post_categories(
        blog_category_id,
        blog_categories(*)
      ),
      blog_tags:blog_post_tags(
        blog_tag_id,
        blog_tags(*)
      )
    `)
    .order("created_at", { ascending: false });

  // Fetch categories
  const { data: categories } = await supabase
    .from("blog_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  // Fetch tags
  const { data: tags } = await supabase
    .from("blog_tags")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Blog Management
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Create, edit, and manage your blog posts, categories, and tags
            </p>
          </div>
          
          <BlogAdmin
            initialPosts={posts || []}
            initialCategories={categories || []}
            initialTags={tags || []}
          />
        </div>
      </div>
    </div>
  );
} 