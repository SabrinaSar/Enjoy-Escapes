import { createClient } from "@/utils/supabase/server";
import ImageGalleryAdmin from "./components/ImageGalleryAdmin";

export const metadata = {
  title: "Image Gallery - Blog Admin",
  description: "Manage images for blog posts",
};

export default async function ImageGalleryPage() {
  const supabase = await createClient();

  // Fetch images from gallery
  const { data: images } = await supabase
    .from("image_gallery")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Image Gallery
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Upload and manage images for your blog posts
            </p>
          </div>
          
          <ImageGalleryAdmin initialImages={images || []} />
        </div>
      </div>
    </div>
  );
} 