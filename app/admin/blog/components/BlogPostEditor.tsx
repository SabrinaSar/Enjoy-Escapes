"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Save, Eye, Image as ImageIcon, Plus } from "lucide-react";
import { BlogPost, BlogCategory, BlogTag, BlogPostFormData, ImageGallery } from "@/types/blog";
import { generateSlug, estimateReadingTime, generateExcerpt, validateBlogPost } from "@/utils/blog";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import ImageGalleryModal from "./ImageGalleryModal";

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <div className="h-96 border rounded-md flex items-center justify-center bg-gray-50">Loading editor...</div>
  }
);

interface Props {
  post?: BlogPost | null;
  categories: BlogCategory[];
  tags: BlogTag[];
  onClose: () => void;
  onSave: (post: BlogPost) => void;
}

export default function BlogPostEditor({ post, categories, tags, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image_url: "",
    featured_image_alt: "",
    author_name: "",
    author_email: "",
    status: "draft",
    publish_date: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: [],
    is_featured: false,
    sort_order: 0,
    category_ids: [],
    tag_ids: [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showContentImageGallery, setShowContentImageGallery] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const supabase = createClient();

  // Initialize form data when editing
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        featured_image_url: post.featured_image_url || "",
        featured_image_alt: post.featured_image_alt || "",
        author_name: post.author_name || "",
        author_email: post.author_email || "",
        status: post.status,
        publish_date: post.publish_date ? post.publish_date.split('T')[0] : "",
        seo_title: post.seo_title || "",
        seo_description: post.seo_description || "",
        seo_keywords: post.seo_keywords || [],
        is_featured: post.is_featured,
        sort_order: post.sort_order,
        category_ids: post.blog_categories?.map(pc => pc.blog_category_id) || [],
        tag_ids: post.blog_tags?.map(pt => pt.blog_tag_id) || [],
      });
    }
  }, [post]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && (!post || formData.slug === post.slug)) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.title) }));
    }
  }, [formData.title, post]);

  // Auto-generate excerpt from content
  useEffect(() => {
    if (formData.content && !formData.excerpt) {
      setFormData(prev => ({ ...prev, excerpt: generateExcerpt(formData.content) }));
    }
  }, [formData.content, formData.excerpt]);

  const handleInputChange = (field: keyof BlogPostFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleKeywordAdd = () => {
    if (keywordInput.trim() && !formData.seo_keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seo_keywords: [...prev.seo_keywords, keywordInput.trim()]
      }));
      setKeywordInput("");
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      seo_keywords: prev.seo_keywords.filter(k => k !== keyword)
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }));
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter(id => id !== tagId)
        : [...prev.tag_ids, tagId]
    }));
  };

  const handleFeaturedImageSelect = (image: ImageGallery) => {
    setFormData(prev => ({
      ...prev,
      featured_image_url: image.public_url,
      featured_image_alt: image.alt_text || "",
    }));
  };

  const handleContentImageInsert = (image: ImageGallery) => {
    const imageMarkdown = `![${image.alt_text || image.filename}](${image.public_url})`;
    const currentContent = formData.content;
    const newContent = currentContent ? `${currentContent}\n\n${imageMarkdown}` : imageMarkdown;
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  const handleSave = async (status?: "draft" | "published") => {
    const saveData = { ...formData };
    if (status) saveData.status = status;

    // Validate the data
    const validation = validateBlogPost(saveData);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    setIsSaving(true);

    try {
      // Prepare post data
      const postData = {
        title: saveData.title,
        slug: saveData.slug,
        excerpt: saveData.excerpt || generateExcerpt(saveData.content),
        content: saveData.content,
        featured_image_url: saveData.featured_image_url || null,
        featured_image_alt: saveData.featured_image_alt || null,
        author_name: saveData.author_name || null,
        author_email: saveData.author_email || null,
        status: saveData.status,
        publish_date: saveData.status === "published" && saveData.publish_date 
          ? new Date(saveData.publish_date).toISOString()
          : saveData.status === "published" 
            ? new Date().toISOString()
            : null,
        seo_title: saveData.seo_title || saveData.title,
        seo_description: saveData.seo_description || saveData.excerpt || generateExcerpt(saveData.content),
        seo_keywords: saveData.seo_keywords,
        reading_time: estimateReadingTime(saveData.content),
        is_featured: saveData.is_featured,
        sort_order: saveData.sort_order,
      };

      let savedPost;

      if (post) {
        // Update existing post
        const { data, error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", post.id)
          .select()
          .single();

        if (error) throw error;
        savedPost = data;
      } else {
        // Create new post
        const { data, error } = await supabase
          .from("blog_posts")
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        savedPost = data;
      }

      // Handle categories
      if (post) {
        // Remove existing categories
        await supabase
          .from("blog_post_categories")
          .delete()
          .eq("blog_post_id", post.id);
      }

      // Add new categories
      if (saveData.category_ids.length > 0) {
        const categoryData = saveData.category_ids.map(categoryId => ({
          blog_post_id: savedPost.id,
          blog_category_id: categoryId,
        }));

        await supabase
          .from("blog_post_categories")
          .insert(categoryData);
      }

      // Handle tags
      if (post) {
        // Remove existing tags
        await supabase
          .from("blog_post_tags")
          .delete()
          .eq("blog_post_id", post.id);
      }

      // Add new tags
      if (saveData.tag_ids.length > 0) {
        const tagData = saveData.tag_ids.map(tagId => ({
          blog_post_id: savedPost.id,
          blog_tag_id: tagId,
        }));

        await supabase
          .from("blog_post_tags")
          .insert(tagData);
      }

      toast.success(post ? "Post updated successfully" : "Post created successfully");
      onSave(savedPost);
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {post ? "Edit Post" : "Create New Post"}
              </h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSave("draft")}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={() => handleSave("published")}
                  disabled={isSaving}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Publish
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter post title..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                      placeholder="url-friendly-slug"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      placeholder="Brief description of the post..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Content</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowContentImageGallery(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Insert Image
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div data-color-mode="light">
                    <MDEditor
                      value={formData.content}
                      onChange={(value) => handleInputChange("content", value || "")}
                      height={400}
                      preview="edit"
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Estimated reading time: {estimateReadingTime(formData.content)} minutes
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                      id="seo_title"
                      value={formData.seo_title}
                      onChange={(e) => handleInputChange("seo_title", e.target.value)}
                      placeholder="SEO optimized title (60 chars max)"
                      className="mt-1"
                      maxLength={60}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {(formData.seo_title || "").length}/60 characters
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="seo_description">Meta Description</Label>
                    <Textarea
                      id="seo_description"
                      value={formData.seo_description}
                      onChange={(e) => handleInputChange("seo_description", e.target.value)}
                      placeholder="SEO meta description (160 chars max)"
                      className="mt-1"
                      rows={3}
                      maxLength={160}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {(formData.seo_description || "").length}/160 characters
                    </div>
                  </div>

                  <div>
                    <Label>SEO Keywords</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="Enter keyword and press Enter"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleKeywordAdd())}
                      />
                      <Button type="button" onClick={handleKeywordAdd}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.seo_keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer">
                          {keyword}
                          <X
                            className="h-3 w-3 ml-1"
                            onClick={() => handleKeywordRemove(keyword)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publication Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Publication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => handleInputChange("status", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="publish_date">Publish Date</Label>
                    <Input
                      id="publish_date"
                      type="date"
                      value={formData.publish_date}
                      onChange={(e) => handleInputChange("publish_date", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                    />
                    <Label htmlFor="is_featured">Featured Post</Label>
                  </div>

                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => handleInputChange("sort_order", parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="featured_image_url">Image URL</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="featured_image_url"
                        value={formData.featured_image_url}
                        onChange={(e) => handleInputChange("featured_image_url", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowImageGallery(true)}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {formData.featured_image_url && (
                    <div>
                      <img
                        src={formData.featured_image_url}
                        alt="Featured"
                        className="w-full h-32 object-cover rounded border"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="featured_image_alt">Alt Text</Label>
                    <Input
                      id="featured_image_alt"
                      value={formData.featured_image_alt}
                      onChange={(e) => handleInputChange("featured_image_alt", e.target.value)}
                      placeholder="Describe the image for accessibility"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={formData.category_ids.includes(category.id)}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
                        />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-normal"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={formData.tag_ids.includes(tag.id)}
                          onCheckedChange={() => handleTagToggle(tag.id)}
                        />
                        <Label
                          htmlFor={`tag-${tag.id}`}
                          className="text-sm font-normal"
                        >
                          {tag.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Author Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Author</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="author_name">Author Name</Label>
                    <Input
                      id="author_name"
                      value={formData.author_name}
                      onChange={(e) => handleInputChange("author_name", e.target.value)}
                      placeholder="Author name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="author_email">Author Email</Label>
                    <Input
                      id="author_email"
                      type="email"
                      value={formData.author_email}
                      onChange={(e) => handleInputChange("author_email", e.target.value)}
                      placeholder="author@example.com"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modals */}
      <ImageGalleryModal
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        onSelectImage={handleFeaturedImageSelect}
        mode="single"
        selectedImageId={formData.featured_image_url ? undefined : undefined}
      />

      <ImageGalleryModal
        isOpen={showContentImageGallery}
        onClose={() => setShowContentImageGallery(false)}
        onSelectImage={handleContentImageInsert}
        mode="content"
      />
    </div>
  );
} 