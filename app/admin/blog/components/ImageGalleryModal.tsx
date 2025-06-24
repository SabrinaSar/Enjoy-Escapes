"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Search, Grid, List, Image as ImageIcon, Check } from "lucide-react";
import { ImageGallery } from "@/types/blog";
import { validateImageUpload, generateUniqueFilename } from "@/utils/blog";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (image: ImageGallery) => void;
  mode?: "single" | "content"; // single for featured image, content for markdown insertion
  selectedImageId?: string;
}

export default function ImageGalleryModal({ isOpen, onClose, onSelectImage, mode = "single", selectedImageId }: Props) {
  const [images, setImages] = useState<ImageGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(selectedImageId || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    alt_text: "",
    caption: "",
    upload_folder: "blog",
  });
  const [showUploadForm, setShowUploadForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Load images
  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("image_gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

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
    setShowUploadForm(true);
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
      setShowUploadForm(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Auto-select the newly uploaded image
      setSelectedImage(imageRecord.id);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageSelect = (image: ImageGallery) => {
    if (mode === "content") {
      // For content insertion, immediately call onSelectImage
      onSelectImage(image);
      onClose();
    } else {
      // For single selection (featured image), select and show in UI
      setSelectedImage(image.id);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedImage) {
      const image = images.find(img => img.id === selectedImage);
      if (image) {
        onSelectImage(image);
        onClose();
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {mode === "content" ? "Insert Image" : "Select Featured Image"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[70vh]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4 pb-4 border-b">
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

          {/* Upload Form */}
          {showUploadForm && (
            <div className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-3">Upload New Image</h3>
              {selectedFile && (
                <div className="text-sm text-gray-600 mb-3">
                  <p><strong>File:</strong> {selectedFile.name}</p>
                  <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
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
                  <Label htmlFor="folder">Upload Folder</Label>
                  <Input
                    id="folder"
                    value={uploadForm.upload_folder}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, upload_folder: e.target.value }))}
                    placeholder="blog"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mb-3">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Image caption (optional)"
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          )}

          {/* Images Grid/List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredImages.length === 0 ? (
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                      selectedImage === image.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <div className="aspect-square bg-gray-200">
                      <img
                        src={image.public_url}
                        alt={image.alt_text || image.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {selectedImage === image.id && mode !== "content" && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    
                    <div className="p-2">
                      <p className="text-xs font-medium truncate">{image.filename}</p>
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
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedImage === image.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <img
                      src={image.public_url}
                      alt={image.alt_text || image.filename}
                      className="w-12 h-12 object-cover rounded"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{image.filename}</p>
                      <p className="text-xs text-gray-500 truncate">{image.alt_text || "No alt text"}</p>
                      <p className="text-xs text-gray-400">
                        {image.file_size ? formatFileSize(image.file_size) : "Unknown size"} • 
                        {new Date(image.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {selectedImage === image.id && mode !== "content" && (
                      <Check className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              {filteredImages.length} images found
            </div>
            
            {mode !== "content" && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmSelection}
                  disabled={!selectedImage}
                >
                  Select Image
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 