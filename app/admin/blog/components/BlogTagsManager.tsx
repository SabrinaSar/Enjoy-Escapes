"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { BlogTag } from "@/types/blog";
import { generateSlug } from "@/utils/blog";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface Props {
  tags: BlogTag[];
  onTagsChange: (tags: BlogTag[]) => void;
}

interface TagFormData {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

export default function BlogTagsManager({ tags, onTagsChange }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [formData, setFormData] = useState<TagFormData>({
    name: "",
    slug: "",
    description: "",
    is_active: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const supabase = createClient();

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      is_active: true,
    });
    setEditingTag(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (tag: BlogTag) => {
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || "",
      is_active: tag.is_active,
    });
    setEditingTag(tag);
    setIsDialogOpen(true);
  };

  const handleInputChange = (field: keyof TagFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === "name" && (!editingTag || formData.slug === generateSlug(editingTag.name))) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Tag name is required");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Tag slug is required");
      return;
    }

    setIsSaving(true);

    try {
      const tagData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null,
        is_active: formData.is_active,
      };

      if (editingTag) {
        // Update existing tag
        const { data, error } = await supabase
          .from("blog_tags")
          .update(tagData)
          .eq("id", editingTag.id)
          .select()
          .single();

        if (error) throw error;

        const updatedTags = tags.map(tag =>
          tag.id === editingTag.id ? data : tag
        );
        onTagsChange(updatedTags);
        toast.success("Tag updated successfully");
      } else {
        // Create new tag
        const { data, error } = await supabase
          .from("blog_tags")
          .insert([tagData])
          .select()
          .single();

        if (error) throw error;

        onTagsChange([...tags, data]);
        toast.success("Tag created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Error saving tag:", error);
      if (error.code === "23505") {
        toast.error("Tag name or slug already exists");
      } else {
        toast.error("Failed to save tag");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    setIsDeleting(tagId);

    try {
      const { error } = await supabase
        .from("blog_tags")
        .delete()
        .eq("id", tagId);

      if (error) throw error;

      const updatedTags = tags.filter(tag => tag.id !== tagId);
      onTagsChange(updatedTags);
      toast.success("Tag deleted successfully");
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error("Failed to delete tag");
    } finally {
      setIsDeleting(null);
    }
  };

  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Blog Tags</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTag ? "Edit Tag" : "Create Tag"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Tag name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="tag-slug"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Tag description (optional)"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange("is_active", e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : editingTag ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tags Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No tags found
                </TableCell>
              </TableRow>
            ) : (
              sortedTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{tag.name}</div>
                        {tag.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {tag.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {tag.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tag.is_active ? "default" : "secondary"}>
                      {tag.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">0 posts</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(tag)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{tag.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(tag.id)}
                              disabled={isDeleting === tag.id}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {isDeleting === tag.id ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-500">
        {tags.length} tags total
      </div>
    </div>
  );
} 