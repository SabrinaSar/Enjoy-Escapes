"use client";

import React, { useState, useEffect } from "react";
import { updatePopup } from "./actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, UploadCloud, FileImage, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type PopupData = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
};

export default function EditMailPoup({
  initialData,
}: {
  initialData: PopupData | null;
}) {
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.image_url || null,
  );
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  // ✅ Sync preview when data is updated on server
  useEffect(() => {
    setPreviewImage(initialData?.image_url || null);
  }, [initialData?.image_url]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const result = await updatePopup(formData);
      if (result?.success) {
        toast.success("Popup updated successfully!");
      } else {
        toast.error(result?.error || "Failed to update popup");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1.5 border-b pb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Edit Popup Content
        </h2>
        <p className="text-muted-foreground text-sm font-medium">
          Manage the content and appearance of your subscription popup.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-8">
        <input type="hidden" name="id" value={initialData?.id} />

        <div className="space-y-6">
          {/* Title Input */}
          <div className="grid gap-3">
            <Label htmlFor="title" className="text-base font-semibold">
              Popup Title
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title}
              placeholder="e.g. Subscribe to our newsletter!"
              className="h-12 bg-background border-border shadow-sm focus-visible:ring-primary"
              required
            />
          </div>

          {/* Description Textarea */}
          <div className="grid gap-3">
            <Label htmlFor="description" className="text-base font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialData?.description}
              placeholder="Enter your discount offer or newsletter message..."
              rows={4}
              className="bg-background border-border shadow-sm focus-visible:ring-primary resize-none leading-relaxed"
              required
            />
          </div>

          {/* File Upload Section */}
          <div className="grid gap-3">
            <Label className="text-base font-semibold">Banner Image</Label>

            <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-all bg-muted/20 p-8 flex flex-col items-center justify-center gap-4 text-center">
              {previewImage ? (
                <div className="w-full space-y-4">
                  <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden ring-1 ring-border shadow-md">
                    <img
                      src={previewImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <UploadCloud className="w-4 h-4" />
                      Change Banner Image
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewImage(null)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Remove Preview
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <FileImage className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Upload an image</h3>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, or WebP up to 5MB
                  </p>
                  <Label
                    htmlFor="image-upload"
                    className="mt-4 cursor-pointer inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Select File
                  </Label>
                </div>
              )}

              <input
                id="image-upload"
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-border">
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="px-8 h-12 gap-2 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Popup
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
