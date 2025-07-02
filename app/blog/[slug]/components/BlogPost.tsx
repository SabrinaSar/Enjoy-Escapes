"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Clock, Eye, Share2, ArrowLeft, Heart } from "lucide-react";
import { BlogPost as BlogPostType } from "@/types/blog";
import { formatDate } from "@/utils/blog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import NewsletterFormClient from "@/components/newsletter-form-client";

interface Props {
  post: BlogPostType;
  relatedPosts: BlogPostType[];
}

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export default function BlogPost({ post, relatedPosts }: Props) {
  const [isLiked, setIsLiked] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>("");

  // Extract table of contents from markdown content
  const tableOfContents = useMemo(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TableOfContentsItem[] = [];
    let match;

    while ((match = headingRegex.exec(post.content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      headings.push({
        id,
        text,
        level
      });
    }

    return headings;
  }, [post.content]);

  // Set up intersection observer for active heading tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0
      }
    );

    // Observe all headings
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
    return { backgroundColor: category?.color || '#3B82F6', color: '#fff' };
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const categories = post.blog_categories?.map(pc => pc.blog_categories).filter((cat): cat is NonNullable<typeof cat> => Boolean(cat)) || [];
  const tags = post.blog_tags?.map(pt => pt.blog_tags).filter((tag): tag is NonNullable<typeof tag> => Boolean(tag)) || [];

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
                <div className="aspect-video bg-gray-200 overflow-hidden">
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

                {/* Main Content */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, children, ...props }) => (
                        <h1 
                          id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                          className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 scroll-mt-24"
                          {...props}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ node, children, ...props }) => (
                        <h2 
                          id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                          className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4 scroll-mt-24"
                          {...props}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ node, children, ...props }) => (
                        <h3 
                          id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                          className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3 scroll-mt-24"
                          {...props}
                        >
                          {children}
                        </h3>
                      ),
                      h4: ({ node, children, ...props }) => (
                        <h4 
                          id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                          className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3 scroll-mt-24"
                          {...props}
                        >
                          {children}
                        </h4>
                      ),
                      h5: ({ node, children, ...props }) => (
                        <h5 
                          id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                          className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2 scroll-mt-24"
                          {...props}
                        >
                          {children}
                        </h5>
                      ),
                      h6: ({ node, children, ...props }) => (
                        <h6 
                          id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                          className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2 scroll-mt-24"
                          {...props}
                        >
                          {children}
                        </h6>
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props} />
                      ),
                      img: ({ node, ...props }) => (
                        <img 
                          {...props} 
                          className="rounded-lg shadow-md w-full h-auto my-6"
                          loading="lazy"
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a 
                          {...props} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote 
                          className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-6 italic text-gray-700 dark:text-gray-300"
                          {...props}
                        />
                      ),
                      code: ({ node, className, children, ...props }) => {
                        const isInline = !className?.includes('language-');
                        return isInline ? (
                          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props}>
                            {children}
                          </code>
                        );
                      },
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
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
              {tableOfContents.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Table of Contents</h3>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      {tableOfContents.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToHeading(item.id)}
                          className={`block w-full text-left text-sm hover:text-primary transition-colors ${
                            activeHeading === item.id ? 'text-primary font-medium' : 'text-gray-600 dark:text-gray-400'
                          }`}
                          style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                        >
                          {item.text}
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              )}

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
                            <div className="aspect-[4/3] bg-gray-200 rounded mb-2 overflow-hidden">
                              <img
                                src={relatedPost.featured_image_url}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
} 