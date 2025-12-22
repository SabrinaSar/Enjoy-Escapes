import slugify from 'slugify';

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
}

/**
 * Estimate reading time based on content
 * Assumes average reading speed of 200 words per minute
 */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

/**
 * Extract plain text from markdown content
 */
export function extractPlainText(markdown: string): string {
  // Remove markdown syntax (basic implementation)
  return markdown
    .replace(/#{1,6}\s+/g, '') // Headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/`(.*?)`/g, '$1') // Inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // Images
    .replace(/>\s+/g, '') // Blockquotes
    .replace(/\n+/g, ' ') // Line breaks
    .trim();
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = extractPlainText(content);
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Format date for display
 */
export function formatDate(dateString: string, format: 'full' | 'short' | 'relative' = 'full'): string {
  const date = new Date(dateString);
  
  if (format === 'relative') {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  if (format === 'short') {
    return date.toLocaleDateString();
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate SEO-friendly meta tags
 */
export function generateSEOTags(data: {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
  canonical?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  type?: string;
}) {
  const tags = [
    { name: 'description', content: data.description },
    { property: 'og:title', content: data.title },
    { property: 'og:description', content: data.description },
    { property: 'og:type', content: data.type || 'article' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: data.title },
    { name: 'twitter:description', content: data.description },
  ];

  if (data.keywords && data.keywords.length > 0) {
    tags.push({ name: 'keywords', content: data.keywords.join(', ') });
  }

  if (data.ogImage) {
    tags.push(
      { property: 'og:image', content: data.ogImage },
      { name: 'twitter:image', content: data.ogImage }
    );
  }

  if (data.ogImageAlt) {
    tags.push({ property: 'og:image:alt', content: data.ogImageAlt });
  }

  if (data.canonical) {
    tags.push({ name: 'canonical', content: data.canonical });
  }

  if (data.publishedTime) {
    tags.push({ property: 'article:published_time', content: data.publishedTime });
  }

  if (data.modifiedTime) {
    tags.push({ property: 'article:modified_time', content: data.modifiedTime });
  }

  if (data.author) {
    tags.push({ property: 'article:author', content: data.author });
  }

  return tags;
}

/**
 * Validate blog post data
 */
export function validateBlogPost(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.push('Content is required');
  }

  if (!data.slug || data.slug.trim().length === 0) {
    errors.push('Slug is required');
  }

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }

  if (data.seo_description && data.seo_description.length > 160) {
    errors.push('SEO description should not exceed 160 characters');
  }

  if (data.seo_title && data.seo_title.length > 60) {
    errors.push('SEO title should not exceed 60 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get color for blog category
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'travel-tips': '#10B981',
    'destinations': '#3B82F6',
    'food-culture': '#F59E0B',
    'adventure': '#EF4444',
    'budget-travel': '#8B5CF6',
    default: '#6B7280',
  };

  return colors[category] || colors.default;
}

/**
 * Generate breadcrumb data for blog pages
 */
export function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Home', href: '/' },
  ];

  if (paths.includes('blog')) {
    breadcrumbs.push({ label: 'Blog', href: '/blog' });
    
    const blogIndex = paths.indexOf('blog');
    if (paths.length > blogIndex + 1) {
      const category = paths[blogIndex + 1];
      if (category !== 'post') {
        breadcrumbs.push({
          label: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
          href: `/blog/category/${category}`,
        });
      }
    }
  }

  return breadcrumbs;
}

/**
 * Parse and validate image upload
 */
export function validateImageUpload(file: File): { isValid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPEG, PNG, WebP, GIF, and SVG images are allowed',
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 5MB',
    };
  }

  return { isValid: true };
}

/**
 * Generate unique filename for uploaded images
 */
export function generateUniqueFilename(originalFilename: string): string {
  const extension = originalFilename.split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}.${extension}`;
} 