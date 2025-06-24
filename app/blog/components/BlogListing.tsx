"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
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

  const clearAllFilters = () => {
    setSearchInput("");
    updateUrl({ search: undefined, category: undefined, tag: undefined });
  };

  const getFeaturedPost = () => {
    return posts.find(post => post.is_featured);
  };

  const getRegularPosts = () => {
    const featuredPost = getFeaturedPost();
    return featuredPost ? posts.filter(post => post.id !== featuredPost.id) : posts;
  };

  const getBadgeColor = (category: BlogCategory) => {
    return { backgroundColor: category.color, color: '#fff' };
  };

  const featuredPost = getFeaturedPost();
  const regularPosts = getRegularPosts();
  const hasActiveFilters = selectedCategory || selectedTag || searchQuery;

  return (
    <div className="space-y-8">
      {/* Enhanced Search and Filters */}
      <div className="relative bg-gradient-to-br from-card via-card/50 to-primary/5 backdrop-blur rounded-3xl p-8 shadow-lg border border-border/50 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-20 h-20 bg-primary rounded-full animate-pulse" />
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-secondary rounded-full animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10">
          {/* Header and Search Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Header */}
            <div className="lg:col-span-1 flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Find Your Perfect Read</h3>
                <p className="text-muted-foreground">Search through our travel stories and tips</p>
              </div>
            </div>

            {/* Search Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search for destinations, tips, guides..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-12 pr-24 h-14 text-lg bg-background/80 backdrop-blur border-2 border-border/50 focus:border-primary/50 rounded-2xl shadow-sm w-full"
                  />
                  <Button 
                    type="submit" 
                    size="lg"
                    className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md rounded-xl"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="bg-background/60 backdrop-blur rounded-2xl p-4 mb-6 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Active Filters</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-3 py-1">
                    Category: {categories.find(c => c.slug === selectedCategory)?.name}
                  </Badge>
                )}
                {selectedTag && (
                  <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1">
                    Tag: {tags.find(t => t.slug === selectedTag)?.name}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Categories and Tags Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Browse by Category
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.slug ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleCategoryFilter(category.slug)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 w-full justify-start ${
                      selectedCategory === category.slug 
                        ? 'shadow-lg scale-105' 
                        : 'hover:scale-105 hover:shadow-md bg-background/60 backdrop-blur border-border/50'
                    }`}
                    style={selectedCategory === category.slug ? getBadgeColor(category) : undefined}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Popular Tags
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tags.slice(0, 12).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTag === tag.slug ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 justify-center ${
                      selectedTag === tag.slug 
                        ? 'bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg scale-105' 
                        : 'hover:scale-105 hover:shadow-sm bg-background/60 backdrop-blur border-border/50 hover:border-accent/30 hover:text-accent'
                    }`}
                    onClick={() => handleTagFilter(tag.slug)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
          <div className="md:flex">
            {featuredPost.featured_image_url && (
              <div className="md:w-1/2">
                <Link href={`/blog/${featuredPost.slug}`}>
                  <img
                    src={featuredPost.featured_image_url}
                    alt={featuredPost.featured_image_alt || featuredPost.title}
                    className="w-full h-64 md:h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </Link>
              </div>
            )}
            <div className={`p-8 ${featuredPost.featured_image_url ? 'md:w-1/2' : 'w-full'}`}>
              <div className="flex items-center gap-2 mb-3">
                {featuredPost.is_featured && (
                  <Badge className="bg-blue-600 text-white">Featured</Badge>
                )}
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
            <Link key={post.id} href={`/blog/${post.slug}`} className="block">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
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
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {post.title}
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
            </Link>
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