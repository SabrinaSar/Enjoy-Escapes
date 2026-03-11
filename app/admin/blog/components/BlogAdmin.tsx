"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BlogPost, BlogCategory, BlogTag } from "@/types/blog";
import BlogPostsList from "./BlogPostsList";
import BlogCategoriesManager from "./BlogCategoriesManager";
import BlogTagsManager from "./BlogTagsManager";
import BlogPostEditor from "./BlogPostEditor";

interface Props {
  initialPosts: BlogPost[];
  initialCategories: BlogCategory[];
  initialTags: BlogTag[];
}

export default function BlogAdmin({ initialPosts, initialCategories, initialTags }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [categories, setCategories] = useState(initialCategories);
  const [tags, setTags] = useState(initialTags);
  const [activeTab, setActiveTab] = useState("posts");
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowPostEditor(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowPostEditor(true);
  };

  const handleCloseEditor = () => {
    setShowPostEditor(false);
    setEditingPost(null);
  };

  const handlePostSaved = (post: BlogPost) => {
    if (editingPost) {
      // Update existing post
      setPosts(posts.map(p => p.id === post.id ? post : p));
    } else {
      // Add new post
      setPosts([post, ...posts]);
    }
    handleCloseEditor();
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  if (showPostEditor) {
    return (
      <BlogPostEditor
        post={editingPost}
        categories={categories}
        tags={tags}
        onClose={handleCloseEditor}
        onSave={handlePostSaved}
      />
    );
  }

  return (
    <div className="p-2 sm:p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <TabsList className="grid w-full sm:max-w-md grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>

          {activeTab === "posts" && (
            <Button onClick={handleCreatePost} className="w-full sm:w-auto flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          )}
        </div>

        <TabsContent value="posts">
          <BlogPostsList
            posts={posts}
            categories={categories}
            onEditPost={handleEditPost}
            onDeletePost={handlePostDeleted}
          />
        </TabsContent>

        <TabsContent value="categories">
          <BlogCategoriesManager
            categories={categories}
            onCategoriesChange={setCategories}
          />
        </TabsContent>

        <TabsContent value="tags">
          <BlogTagsManager
            tags={tags}
            onTagsChange={setTags}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 