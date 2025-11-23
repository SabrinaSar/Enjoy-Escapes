"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Upload, Loader2 } from "lucide-react";
import { createCategory, updateCategory } from "../actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { validateImageUpload } from "@/utils/blog";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string | null;
    is_active: boolean;
    is_special_page: boolean;
    sort_order: number;
    category_filters: Array<{
      id: string;
      filter_type: string;
      filter_value: string;
    }>;
    iframe_embed_code: string | null;
  };
}

const initialState = { success: false, message: "", errors: {} };

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  const [iconPath, setIconPath] = useState(category?.icon || "");
  const [state, formAction] = useFormState(
    category 
      ? updateCategory.bind(null, category.id)
      : createCategory,
    initialState
  );

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Get placeholder text for filter values
  const getFilterPlaceholder = (filterType: string) => {
    switch (filterType) {
      case "board_basis": return "e.g., all_inclusive, half_board";
      case "price_under": return "e.g., 300, 500";
      case "school_holidays":
      case "last_minute":
      case "long_haul":
      case "featured":
      case "hot_deal": return "true or false";
      default: return "Enter filter value";
    }
  };


  // State for category type
  const [isSpecialPage, setIsSpecialPage] = useState(category?.is_special_page ?? false);

  // State for dynamic filters (only for regular categories)
  const [filters, setFilters] = useState(
    category?.category_filters || [{ filter_type: "", filter_value: "" }]
  );

  // State for iframe embed code (only for special pages)
  const [iframeEmbedCode, setIframeEmbedCode] = useState(
    category?.iframe_embed_code || ""
  );

  // Add new filter
  const addFilter = () => {
    setFilters([...filters, { filter_type: "", filter_value: "" }]);
  };

  // Remove filter
  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  // Update filter
  const updateFilter = (index: number, field: string, value: string) => {
    const updatedFilters = [...filters];
    updatedFilters[index] = { ...updatedFilters[index], [field]: value };
    setFilters(updatedFilters);
  };


  // Handle special page toggle
  const handleSpecialPageToggle = (checked: boolean) => {
    setIsSpecialPage(checked);
    if (checked) {
      // Clear filters when switching to special page
      setFilters([]);
    } else {
      // Clear iframe embed code when switching to regular category
      setIframeEmbedCode("");
      // Add default filter if none exist
      if (filters.length === 0) {
        setFilters([{ filter_type: "", filter_value: "" }]);
      }
    }
  };

  // Handle icon upload
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageUpload(file);
    if (!validation.isValid) {
      toast.error(validation.error || "Invalid file");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('enjoy-escapes-assets')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Supabase storage error:", uploadError);
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('enjoy-escapes-assets')
        .getPublicUrl(filePath);

      // Update the state
      setIconPath(publicUrl);
      
      toast.success("Icon uploaded successfully");
    } catch (error) {
      console.error("Error uploading icon:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload icon");
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    // Add filters to form data
    filters.forEach((filter, index) => {
      if (filter.filter_type && filter.filter_value) {
        formData.append(`filter_${index}_type`, filter.filter_type);
        formData.append(`filter_${index}_value`, filter.filter_value);
      }
    });

    // Add iframe embed code to form data
    if (iframeEmbedCode.trim()) {
      formData.append("iframe_embed_code", iframeEmbedCode);
    }

    formAction(formData);
  };

  // Redirect on success
  if (state.success) {
    router.push("/admin/categories");
    return null; // Prevent rendering during redirect
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={category?.name || ""}
            placeholder="e.g., All Inclusive"
            required
            onChange={(e) => {
              const slugInput = document.getElementById("slug") as HTMLInputElement;
              if (slugInput && !category) {
                slugInput.value = generateSlug(e.target.value);
              }
            }}
          />
          {state.errors?.name && (
            <p className="text-sm text-red-500">{state.errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={category?.slug || ""}
            placeholder="e.g., all-inclusive"
            required
          />
          {state.errors?.slug && (
            <p className="text-sm text-red-500">{state.errors.slug[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon Path *</Label>
          <div className="flex gap-2">
            <Input
              id="icon"
              name="icon"
              value={iconPath}
              onChange={(e) => setIconPath(e.target.value)}
              placeholder="/icons/example.svg or https://..."
              required
              className="flex-1"
            />
            <div className="relative">
              <input
                type="file"
                id="icon_upload"
                className="hidden"
                accept="image/*"
                onChange={handleIconUpload}
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => document.getElementById("icon_upload")?.click()}
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter a local path (e.g., /icons/summer.svg) or upload a new icon
          </p>
          {state.errors?.icon && (
            <p className="text-sm text-red-500">{state.errors.icon[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={category?.sort_order || 0}
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={category?.description || ""}
          placeholder="Optional description for this category"
          rows={3}
        />
      </div>

      {/* Category Type Selection */}
      <Card className="bg-blue-50 dark:bg-blue-950/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Category Type</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose how this category should work
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="filter_category"
                name="category_type"
                checked={!isSpecialPage}
                onChange={() => handleSpecialPageToggle(false)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="filter_category" className="font-medium">Filter Category</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Filters existing holiday deals on the main page
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="special_page"
                name="category_type"
                checked={isSpecialPage}
                onChange={() => handleSpecialPageToggle(true)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="special_page" className="font-medium">Special Page</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Creates a dedicated page with an Holiday Finder widget
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="is_active"
              name="is_active"
              defaultChecked={category?.is_active ?? true}
            />
            <Label htmlFor="is_active">Active (visible to users)</Label>
          </div>

          {/* Hidden input for form submission */}
          <input 
            type="hidden" 
            name="is_special_page" 
            value={isSpecialPage ? "on" : ""} 
          />
        </CardContent>
      </Card>

      {/* Category Filters - Only for regular categories */}
      {!isSpecialPage && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Category Filters</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Define what criteria to filter holiday deals by
              </p>
            </div>
            <Button type="button" onClick={addFilter} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Filter
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {filters.map((filter, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Filter Type</Label>
                  <Select
                    value={filter.filter_type}
                    onValueChange={(value) => updateFilter(index, "filter_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select filter type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="board_basis">Board Basis (e.g., all_inclusive)</SelectItem>
                      <SelectItem value="price_under">Price Under (e.g., 300)</SelectItem>
                      <SelectItem value="school_holidays">School Holidays (true/false)</SelectItem>
                      <SelectItem value="last_minute">Last Minute (true/false)</SelectItem>
                      <SelectItem value="long_haul">Long Haul (true/false)</SelectItem>
                      <SelectItem value="featured">Featured (true/false)</SelectItem>
                      <SelectItem value="hot_deal">Hot Deal (true/false)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Filter Value</Label>
                  <div className="flex gap-2">
                    <Input
                      value={filter.filter_value}
                      onChange={(e) => updateFilter(index, "filter_value", e.target.value)}
                      placeholder={getFilterPlaceholder(filter.filter_type)}
                    />
                    {filters.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeFilter(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filters.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No filters configured. Add at least one filter for this category.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Iframe Embed Code - Only for special pages */}
      {isSpecialPage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Iframe Embed Code</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Paste the complete iframe HTML code including any scripts provided by the client
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="iframe_embed_code">Complete Iframe HTML Code</Label>
              <Textarea
                id="iframe_embed_code"
                value={iframeEmbedCode}
                onChange={(e) => setIframeEmbedCode(e.target.value)}
                placeholder={`<iframe style="border:0;width:100%;" title="Holiday deals" id="holiday-deals-6d341d52" src="https://holidayconnect-app.icetravelgroup.com/holiday-deals?utm_source=hc-d73673bf-1025-4875-9fb9-dc86749318cc&utm_medium=holconn&utm_content=hol-bos-dl&orgId=d73673bf-1025-4875-9fb9-dc86749318cc&poweredBy=icelolly&title=Sabrina's all inclusive deals"></iframe>
<script src="https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@5.3.2"></script>
<script>
  iframeResize({
    license: 'GPLv3',
    waitForLoad: false,
    checkOrigin: false
  }, '#holiday-deals-6d341d52');
</script>`}
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Include the complete iframe tag and any associated scripts exactly as provided by the client
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button type="submit" className="w-full md:w-auto">
          {category ? "Update Category" : "Create Category"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
          className="w-full md:w-auto"
        >
          Cancel
        </Button>
      </div>

      {/* Display success/error messages */}
      {state.message && (
        <div className={`p-4 rounded-lg ${state.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {state.message}
        </div>
      )}
    </form>
  );
} 