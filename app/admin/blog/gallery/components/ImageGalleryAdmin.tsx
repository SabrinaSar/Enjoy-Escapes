"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Upload, Trash2, Copy, Search, Grid, List, Image as ImageIcon } from "lucide-react";
import { ImageGallery } from "@/types/blog";
import { validateImageUpload, generateUniqueFilename } from "@/utils/blog";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface Props {
  initialImages: ImageGallery[];
}

export default function ImageGalleryAdmin({ initialImages }: Props) {
  const [images, setImages] = useState(initialImages);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    alt_text: "",
    caption: "",
    upload_folder: "blog",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const filteredImages = images.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.caption?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageUpload(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setSelectedFile(file);
    setUploadForm({
      alt_text: "",
      caption: "",
      upload_folder: "blog",
    });
    setUploadDialog(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const filename = generateUniqueFilename(selectedFile.name);
      const filePath = `${uploadForm.upload_folder}/${filename}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("enjoy-escapes-assets")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("enjoy-escapes-assets")
        .getPublicUrl(filePath);

      // Create image record in database
      const imageData = {
        filename,
        original_filename: selectedFile.name,
        file_path: filePath,
        public_url: publicUrl,
        alt_text: uploadForm.alt_text || null,
        caption: uploadForm.caption || null,
        file_size: selectedFile.size,
        mime_type: selectedFile.type,
        upload_folder: uploadForm.upload_folder,
        is_featured: false,
      };

      const { data: imageRecord, error: dbError } = await supabase
        .from("image_gallery")
        .insert([imageData])
        .select()
        .single();

      if (dbError) throw dbError;

      setImages([imageRecord, ...images]);
      toast.success("Image uploaded successfully");
      setUploadDialog(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    setIsDeleting(imageId);

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("enjoy-escapes-assets")
        .remove([image.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("image_gallery")
        .delete()
        .eq("id", imageId);

      if (dbError) throw dbError;

      setImages(images.filter(img => img.id !== imageId));
      setSelectedImages(selectedImages.filter(id => id !== imageId));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied to clipboard");
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedFile && (
              <div className="text-sm text-gray-600">
                <p><strong>File:</strong> {selectedFile.name}</p>
                <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
                <p><strong>Type:</strong> {selectedFile.type}</p>
              </div>
            )}
            
            <div>
              <Label htmlFor="alt_text">Alt Text</Label>
              <Input
                id="alt_text"
                value={uploadForm.alt_text}
                onChange={(e) => setUploadForm(prev => ({ ...prev, alt_text: e.target.value }))}
                placeholder="Describe the image for accessibility"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={uploadForm.caption}
                onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                placeholder="Image caption (optional)"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="folder">Upload Folder</Label>
              <Input
                id="folder"
                value={uploadForm.upload_folder}
                onChange={(e) => setUploadForm(prev => ({ ...prev, upload_folder: e.target.value }))}
                placeholder="blog"
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setUploadDialog(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Images Grid/List */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No images found</p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4"
          >
            Upload your first image
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className={`relative group border rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedImages.includes(image.id) ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => toggleImageSelection(image.id)}
            >
              <div className="aspect-square bg-gray-200">
                <img
                  src={image.public_url}
                  alt={image.alt_text || image.filename}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', image.public_url);
                    console.error('Image data:', image);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', image.public_url);
                  }}
                />
              </div>
              
              {/* Hover overlay - only visible on hover */}
              <div className="absolute inset-0 bg-transparent hover:bg-black/50 transition-all duration-200 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                <div className="opacity-0 group-hover:opacity-100 flex gap-2 pointer-events-auto">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(image.public_url);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Image</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this image? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(image.id)}
                          disabled={isDeleting === image.id}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting === image.id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              
              <div className="p-3">
                <p className="text-sm font-medium truncate">{image.filename}</p>
                <p className="text-xs text-gray-500">
                  {image.file_size ? formatFileSize(image.file_size) : "Unknown size"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                selectedImages.includes(image.id) ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => toggleImageSelection(image.id)}
            >
              <img
                src={image.public_url}
                alt={image.alt_text || image.filename}
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  console.error('List view image failed to load:', image.public_url);
                  console.error('Image data:', image);
                }}
                onLoad={() => {
                  console.log('List view image loaded successfully:', image.public_url);
                }}
              />
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{image.filename}</p>
                <p className="text-sm text-gray-500 truncate">{image.alt_text || "No alt text"}</p>
                <p className="text-xs text-gray-400">
                  {image.file_size ? formatFileSize(image.file_size) : "Unknown size"} • 
                  {new Date(image.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl(image.public_url);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Image</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this image? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(image.id)}
                        disabled={isDeleting === image.id}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting === image.id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 text-sm text-gray-500">
        {images.length} images total
        {selectedImages.length > 0 && (
          <span> • {selectedImages.length} selected</span>
        )}
      </div>
    </div>
  );
} 