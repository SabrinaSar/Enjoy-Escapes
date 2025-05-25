"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { createBanner, updateBanner } from "../actions";
import { BannerData } from "@/app/actions/fetchBanners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BannerFormProps {
  banner?: BannerData; // Optional for edit mode
  onSuccess?: () => void;
}

export default function BannerForm({ banner, onSuccess }: BannerFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(banner?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial form state
  const initialState = {
    success: false,
    message: "",
    errors: {},
  };

  // Setup form state handlers
  const [formState, formAction] = useFormState(
    banner ? updateBanner : createBanner,
    initialState
  );

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    // If we're updating and there's no new file, we need to include the existing image URL
    if (banner && !file && banner.image) {
      formData.append("image_url", banner.image);
    }
    
    // If editing, add the banner ID
    if (banner) {
      formData.append("id", banner.id.toString());
    }
    
    // Let the form action handle the rest
    formAction(formData);
  };

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      // Check for HEIC files (by file extension and MIME type)
      const fileName = selectedFile.name.toLowerCase();
      const isHeicByExtension = fileName.endsWith('.heic') || fileName.endsWith('.heif');
      const isHeicByMimeType = selectedFile.type === 'image/heic' || selectedFile.type === 'image/heif';
      
      if (isHeicByExtension || isHeicByMimeType) {
        toast.error("HEIC/HEIF files are not supported. Please convert to JPG, PNG, or WebP format.");
        e.target.value = ""; // Clear the input
        return;
      }

      // Validate it's an actual image file
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("File must be a valid image.");
        e.target.value = ""; // Clear the input
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreview(banner?.image || null);
    }
  };

  // Show toast messages for success/error
  useEffect(() => {
    if (formState.success) {
      toast.success(formState.message);
      if (onSuccess) onSuccess();
    } else if (formState.message) {
      toast.error(formState.message);
    }
    setIsSubmitting(false);
  }, [formState, onSuccess]);

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={banner?.title || ""}
          required
        />
        {formState.errors?.title && (
          <p className="text-sm text-red-500">{formState.errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={banner?.description || ""}
        />
        {formState.errors?.description && (
          <p className="text-sm text-red-500">{formState.errors.description}</p>
        )}
      </div>

      {/* Link */}
      <div className="space-y-2">
        <Label htmlFor="link">Link URL</Label>
        <Input
          id="link"
          name="link"
          type="url"
          defaultValue={banner?.link || ""}
          placeholder="https://example.com"
        />
        {formState.errors?.link && (
          <p className="text-sm text-red-500">{formState.errors.link}</p>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image_file">Banner Image</Label>
        <Input
          id="image_file"
          name="image_file"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          required={!banner}
        />
        {formState.errors?.image_file && (
          <p className="text-sm text-red-500">{formState.errors.image_file}</p>
        )}
        
        {/* Image Preview */}
        {preview && (
          <div className="mt-2 border rounded-md overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-48 object-cover"
            />
          </div>
        )}
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="active"
          name="active"
          defaultChecked={banner?.active !== false}
        />
        <Label htmlFor="active">Active</Label>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date (Optional)</Label>
          <Input
            id="start_date"
            name="start_date"
            type="datetime-local"
            defaultValue={
              banner?.start_date
                ? new Date(banner.start_date).toISOString().slice(0, 16)
                : ""
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date (Optional)</Label>
          <Input
            id="end_date"
            name="end_date"
            type="datetime-local"
            defaultValue={
              banner?.end_date
                ? new Date(banner.end_date).toISOString().slice(0, 16)
                : ""
            }
          />
        </div>
      </div>

      {/* Position */}
      <div className="space-y-2">
        <Label htmlFor="position">Display Order (lower numbers appear first)</Label>
        <Input
          id="position"
          name="position"
          type="number"
          defaultValue={banner?.position || 0}
          min={0}
        />
      </div>

      {/* Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="background_color">Background Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="background_color"
              name="background_color"
              type="color"
              defaultValue={banner?.background_color || "#FFFFFF"}
              className="w-12 h-10"
            />
            <Input
              type="text"
              value={banner?.background_color || "#FFFFFF"}
              onChange={(e) => {
                document.getElementById("background_color")?.setAttribute("value", e.target.value);
              }}
              placeholder="#FFFFFF"
              className="flex-1"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="text_color">Text Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="text_color"
              name="text_color"
              type="color"
              defaultValue={banner?.text_color || "#000000"}
              className="w-12 h-10"
            />
            <Input
              type="text"
              value={banner?.text_color || "#000000"}
              onChange={(e) => {
                document.getElementById("text_color")?.setAttribute("value", e.target.value);
              }}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {banner ? "Updating..." : "Creating..."}
          </>
        ) : (
          <>{banner ? "Update Banner" : "Create Banner"}</>
        )}
      </Button>
    </form>
  );
} 