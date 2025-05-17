"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import BannerForm from "./components/BannerForm";
import { toast } from "sonner";
import { fetchAllBanners } from "@/app/actions/fetchBanners";
import { deleteBanner } from "./actions";
import { BannerData } from "@/app/actions/fetchBanners";

export default function BannersPage() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<BannerData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewBanner, setPreviewBanner] = useState<BannerData | null>(null);

  // Load banners
  const loadBanners = async () => {
    setLoading(true);
    try {
      const result = await fetchAllBanners(currentPage);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setBanners(result.banners);
      setTotalPages(result.totalPages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load banners");
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  // Load banners when page changes
  useEffect(() => {
    loadBanners();
  }, [currentPage]);

  // Handle deleting a banner
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) {
      return;
    }
    
    try {
      const result = await deleteBanner(id);
      
      if (result.success) {
        toast.success(result.message);
        loadBanners(); // Reload banners after deletion
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete banner");
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle edit button click
  const handleEditClick = (banner: BannerData) => {
    setEditBanner(banner);
    setIsEditModalOpen(true);
  };

  // Handle preview button click
  const handlePreviewClick = (banner: BannerData) => {
    setPreviewBanner(banner);
    setIsPreviewModalOpen(true);
  };

  // Handle form success (create or edit)
  const handleFormSuccess = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    loadBanners();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Banners</h1>
        <AlertDialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <AlertDialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Banner</AlertDialogTitle>
            </AlertDialogHeader>
            <BannerForm onSuccess={handleFormSuccess} />
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading banners...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : banners.length === 0 ? (
          <div className="p-6 text-center">
            No banners found. Click "Add Banner" to create one.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Link</TableHead>
                  <TableHead className="hidden md:table-cell">Position</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {banner.link ? (
                        <a
                          href={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline truncate block max-w-[200px]"
                        >
                          {banner.link}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">No link</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {banner.position}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {banner.active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePreviewClick(banner)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditClick(banner)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center p-4">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center px-4">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Edit Modal */}
      <AlertDialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Banner</AlertDialogTitle>
          </AlertDialogHeader>
          {editBanner && (
            <BannerForm banner={editBanner} onSuccess={handleFormSuccess} />
          )}
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Modal */}
      <AlertDialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Banner Preview</AlertDialogTitle>
          </AlertDialogHeader>
          {previewBanner && (
            <div
              className="overflow-hidden rounded-lg shadow-md"
              style={{
                backgroundColor: previewBanner.background_color || "#FFFFFF",
                color: previewBanner.text_color || "#000000",
              }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:p-8 flex flex-col justify-center md:w-1/2 space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold">
                    {previewBanner.title}
                  </h3>
                  {previewBanner.description && (
                    <p className="text-sm md:text-base opacity-90">
                      {previewBanner.description}
                    </p>
                  )}
                  {previewBanner.link && (
                    <div className="mt-4">
                      <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        Book now
                      </Button>
                    </div>
                  )}
                </div>
                <div className="md:w-1/2 h-48 md:h-64 relative">
                  <img
                    src={previewBanner.image}
                    alt={previewBanner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 