export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  featured_image_alt?: string;
  author_id?: string;
  author_name?: string;
  author_email?: string;
  status: 'draft' | 'published' | 'archived';
  publish_date?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  reading_time?: number;
  view_count: number;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  blog_categories?: BlogPostCategory[];
  blog_tags?: BlogPostTag[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostCategory {
  id: string;
  blog_post_id: string;
  blog_category_id: string;
  created_at: string;
  blog_categories?: BlogCategory;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface BlogPostTag {
  id: string;
  blog_post_id: string;
  blog_tag_id: string;
  created_at: string;
  blog_tags?: BlogTag;
}

export interface ImageGallery {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  public_url: string;
  alt_text?: string;
  caption?: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  is_featured: boolean;
  upload_folder: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
  id: string;
  blog_post_id: string;
  parent_comment_id?: string;
  author_name: string;
  author_email: string;
  author_website?: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'rejected';
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
  replies?: BlogComment[];
}

// Form interfaces for admin
export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  featured_image_alt?: string;
  author_name?: string;
  author_email?: string;
  status: 'draft' | 'published' | 'archived';
  publish_date?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords: string[];
  is_featured: boolean;
  sort_order: number;
  category_ids: string[];
  tag_ids: string[];
}

export interface BlogCategoryFormData {
  name: string;
  slug: string;
  description?: string;
  color: string;
  is_active: boolean;
  sort_order: number;
}

export interface BlogTagFormData {
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

export interface ImageUploadFormData {
  file: File;
  alt_text?: string;
  caption?: string;
  upload_folder: string;
}

// SEO metadata interface
export interface BlogSEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
  canonical?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  category?: string;
}

// Blog listing and filtering
export interface BlogListingProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  selectedCategory?: string;
  selectedTag?: string;
  searchQuery?: string;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  search?: string;
  sort?: 'newest' | 'oldest' | 'popular' | 'alphabetical';
  page?: number;
  limit?: number;
} 