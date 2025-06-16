"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Clock, Eye, Share2, ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { BlogPost as BlogPostType } from "@/types/blog";
import { formatDate } from "@/utils/blog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  post: BlogPostType;
  relatedPosts: BlogPostType[];
}

export default function BlogPost({ post, relatedPosts }: Props) {
  const [isLiked, setIsLiked] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const getBadgeColor = (category: any) => {
    return { backgroundColor: category.color, color: '#fff' };
  };

  const categories = post.blog_categories?.map(pc => pc.blog_categories).filter(Boolean) || [];
  const tags = post.blog_tags?.map(pt => pt.blog_tags).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article */}
          <article className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              {/* Featured Image */}
              {post.featured_image_url && (
                <div className="aspect-video bg-gray-200">
                  <img
                    src={post.featured_image_url}
                    alt={post.featured_image_alt || post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                {/* Categories */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((category) => (
                      <Badge 
                        key={category.id}
                        style={getBadgeColor(category)}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.publish_date || post.created_at)}
                    </div>
                    {post.reading_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.reading_time} min read
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.view_count || 0} views
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={isLiked ? "text-red-600" : ""}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-red-600" : ""}`} />
                      Like
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Author */}
                {post.author_name && (
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {post.author_name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {post.author_name}
                      </p>
                      <p className="text-sm text-gray-500">Author</p>
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({ node, ...props }) => (
                        <img 
                          {...props} 
                          className="rounded-lg shadow-md w-full h-auto"
                          loading="lazy"
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a 
                          {...props} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        />
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag.id} variant="outline">
                          #{tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Table of Contents */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Table of Contents</h3>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Scroll to navigate through the article sections</p>
                  </div>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Related Articles</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.id} className="space-y-2">
                        <Link 
                          href={`/blog/${relatedPost.slug}`}
                          className="block group"
                        >
                          {relatedPost.featured_image_url && (
                            <div className="aspect-video bg-gray-200 rounded mb-2">
                              <img
                                src={relatedPost.featured_image_url}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                          )}
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                            {relatedPost.title}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(relatedPost.publish_date || relatedPost.created_at, "short")}
                          {relatedPost.reading_time && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {relatedPost.reading_time}m
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Stay Updated</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Get the latest travel tips and destination guides delivered to your inbox.
                  </p>
                  <Button className="w-full">
                    Subscribe to Newsletter
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>

        {/* Comments Section Placeholder */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Comments feature coming soon. Share your thoughts about this article!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 