import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import BlogListing from "./components/BlogListing";

export const metadata: Metadata = {
  title: "Travel Blog - Enjoy Escapes",
  description: "Discover amazing travel destinations, tips, and inspiration for your next adventure. Read our latest travel blog posts and plan your perfect escape.",
  keywords: ["travel blog", "travel tips", "destinations", "vacation", "adventure", "travel guides"],
  openGraph: {
    title: "Travel Blog - Enjoy Escapes",
    description: "Discover amazing travel destinations and travel tips for your next adventure",
    type: "website",
  },
};

interface SearchParams {
  category?: string;
  tag?: string;
  search?: string;
  page?: string;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 12;
  const offset = (page - 1) * limit;

  // Build query
  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories:blog_post_categories(
        blog_categories(*)
      ),
      blog_tags:blog_post_tags(
        blog_tags(*)
      )
    `)
    .eq("status", "published")
    .order("publish_date", { ascending: false });

  // Apply filters
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,excerpt.ilike.%${searchParams.search}%`);
  }

  // Execute query with pagination
  const { data: posts, error: postsError } = await query
    .range(offset, offset + limit - 1);

  if (postsError) {
    console.error("Error fetching posts:", postsError);
  }

  // Get total count for pagination
  const { count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  // Fetch categories and tags
  const { data: categories } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: tags } = await supabase
    .from("blog_tags")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const totalPosts = count || 0;
  const totalPages = Math.ceil(totalPosts / limit);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Travel Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover amazing destinations, get travel tips, and find inspiration for your next adventure
          </p>
        </div>

        <BlogListing
          posts={posts || []}
          categories={categories || []}
          tags={tags || []}
          currentPage={page}
          totalPages={totalPages}
          totalPosts={totalPosts}
          selectedCategory={searchParams.category}
          selectedTag={searchParams.tag}
          searchQuery={searchParams.search}
        />
      </div>
    </div>
  );
} 