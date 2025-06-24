import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPost from "./components/BlogPost";
import { generateSEOTags } from "@/utils/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const resolvedParams = await params;
  
  const { data: post } = await supabase
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
    .eq("slug", resolvedParams.slug)
    .eq("status", "published")
    .single();

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const seoTags = generateSEOTags({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || "",
    keywords: post.seo_keywords,
    ogImage: post.featured_image_url,
    ogImageAlt: post.featured_image_alt,
    canonical: `/blog/${post.slug}`,
    publishedTime: post.publish_date,
    modifiedTime: post.updated_at,
    author: post.author_name,
    type: "article",
  });

  const metadata: Metadata = {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    keywords: post.seo_keywords,
    authors: post.author_name ? [{ name: post.author_name }] : undefined,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      type: "article",
      publishedTime: post.publish_date,
      modifiedTime: post.updated_at,
      authors: post.author_name ? [post.author_name] : undefined,
      images: post.featured_image_url ? [{
        url: post.featured_image_url,
        alt: post.featured_image_alt || post.title,
      }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
  };

  return metadata;
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = await createClient();
  const resolvedParams = await params;

  const { data: post, error } = await supabase
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
    .eq("slug", resolvedParams.slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    notFound();
  }

  // Increment view count
  await supabase
    .from("blog_posts")
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq("id", post.id);

  // Fetch related posts
  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories:blog_post_categories(
        blog_category_id,
        blog_categories(*)
      )
    `)
    .eq("status", "published")
    .neq("id", post.id)
    .limit(3)
    .order("publish_date", { ascending: false });

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image_url,
    author: {
      "@type": "Person",
      name: "Enjoy Escapes",
    },
    publisher: {
      "@type": "Organization",
      name: "Enjoy Escapes",
    },
    datePublished: post.publish_date,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/blog/${post.slug}`,
    },
    keywords: post.seo_keywords?.join(", "),
    wordCount: post.content?.split(" ").length,
    timeRequired: `PT${post.reading_time}M`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPost 
        post={post} 
        relatedPosts={relatedPosts || []} 
      />
    </>
  );
} 