"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BlogPost, BlogCategory, BlogTag, BlogListingProps } from "@/types/blog";
import { formatDate } from "@/utils/blog";

export default function BlogListing({
  posts,
  categories,
  tags,
  currentPage,
  totalPages,
  totalPosts,
  selectedCategory,
  selectedTag,
  searchQuery,
}: BlogListingProps) {
  const [searchInput, setSearchInput] = useState(searchQuery || "");
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrl = (params: Record<string, string | undefined>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    // Reset page when filtering
    if (params.category !== undefined || params.tag !== undefined || params.search !== undefined) {
      current.delete("page");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/blog${query}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search: searchInput || undefined });
  };

  const handleCategoryFilter = (categorySlug: string) => {
    updateUrl({ 
      category: selectedCategory === categorySlug ? undefined : categorySlug 
    });
  };

  const handleTagFilter = (tagSlug: string) => {
    updateUrl({ 
      tag: selectedTag === tagSlug ? undefined : tagSlug 
    });
  };

  const handlePageChange = (page: number) => {
    updateUrl({ page: page.toString() });
  };

  const getFeaturedPost = () => {
    return posts.find(post => post.is_featured) || posts[0];
  };

  const getRegularPosts = () => {
    const featuredPost = getFeaturedPost();
    return posts.filter(post => post.id !== featuredPost?.id);
  };

  const getBadgeColor = (category: BlogCategory) => {
    return { backgroundColor: category.color, color: '#fff' };
  };

  const featuredPost = getFeaturedPost();
  const regularPosts = getRegularPosts();

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-20"
            />
            <Button 
              type="submit" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Categories */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category.slug)}
                style={selectedCategory === category.slug ? getBadgeColor(category) : undefined}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 15).map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTag === tag.slug ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagFilter(tag.slug)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
          <div className="md:flex">
            {featuredPost.featured_image_url && (
              <div className="md:w-1/2">
                <img
                  src={featuredPost.featured_image_url}
                  alt={featuredPost.featured_image_alt || featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
            )}
            <div className={`p-8 ${featuredPost.featured_image_url ? 'md:w-1/2' : 'w-full'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-blue-600 text-white">Featured</Badge>
                {featuredPost.blog_categories?.[0]?.blog_categories && (
                  <Badge 
                    style={getBadgeColor(featuredPost.blog_categories[0].blog_categories)}
                  >
                    {featuredPost.blog_categories[0].blog_categories.name}
                  </Badge>
                )}
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                <Link 
                  href={`/blog/${featuredPost.slug}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {featuredPost.title}
                </Link>
              </h2>
              
              {featuredPost.excerpt && (
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                  {featuredPost.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(featuredPost.publish_date || featuredPost.created_at)}
                  </div>
                  {featuredPost.reading_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.reading_time} min read
                    </div>
                  )}
                </div>
                
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Button>
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Posts Grid */}
      {regularPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {post.featured_image_url && (
                <div className="aspect-video bg-gray-200">
                  <img
                    src={post.featured_image_url}
                    alt={post.featured_image_alt || post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  {post.blog_categories?.[0]?.blog_categories && (
                    <Badge 
                      style={getBadgeColor(post.blog_categories[0].blog_categories)}
                      className="text-xs"
                    >
                      {post.blog_categories[0].blog_categories.name}
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
              </CardHeader>
              
              <CardContent className="pt-0">
                {post.excerpt && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.publish_date || post.created_at, "short")}
                  </div>
                  {post.reading_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.reading_time}m
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Posts Found */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg">No blog posts found</p>
            <p>Try adjusting your search or filters</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchInput("");
              updateUrl({ search: undefined, category: undefined, tag: undefined });
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPage;
              
              return (
                <Button
                  key={pageNum}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-sm text-gray-500">
        Showing {posts.length} of {totalPosts} posts
        {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
      </div>
    </div>
  );
} 