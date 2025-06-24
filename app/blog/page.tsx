import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { BookOpen, Calendar, Tag } from "lucide-react";
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
        blog_category_id,
        blog_categories(*)
      ),
      blog_tags:blog_post_tags(
        blog_tag_id,
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-r from-primary via-secondary to-accent text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse delay-500" />
          <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-white rounded-full animate-pulse delay-700" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur p-4 rounded-full">
                <BookOpen className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Travel Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover amazing destinations, get travel tips, and find inspiration for your next adventure
            </p>
            
            {/* Quick highlights */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <div className="bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm">
                <Calendar className="inline h-4 w-4 mr-2" />
                Latest Posts
              </div>
              <div className="bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm">
                <Tag className="inline h-4 w-4 mr-2" />
                Travel Tips
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Introduction Section */}
        <div className="py-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Your <span className="text-accent italic font-script">ultimate</span> travel companion
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            From hidden gems to popular hotspots, our travel experts share insider knowledge, practical tips, and inspiring stories to help you make the most of every journey. Whether you're planning a weekend getaway or a month-long adventure, find everything you need right here.
          </p>
        </div>

        {/* Blog Content */}
        <div className="pb-16">
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
    </div>
  );
} 