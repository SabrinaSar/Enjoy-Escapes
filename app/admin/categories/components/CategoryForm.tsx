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
import { Trash2, Plus } from "lucide-react";
import { createCategory, updateCategory } from "../actions";
import { useRouter } from "next/navigation";

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
    category_embed_params: Array<{
      id: string;
      embed_type: string;
      base_url: string;
      param_name: string;
      param_value: string;
    }>;
  };
}

const initialState = { success: false, message: "", errors: {} };

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
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

  // Get placeholder text for embed parameters
  const getEmbedPlaceholder = (paramName: string) => {
    switch (paramName) {
      case "destination": return "e.g., 39677 (destination code)";
      case "departureAirport": return "e.g., LGW, MAN, ABZ";
      case "boardBasis": return "e.g., AI (All Inclusive), HB (Half Board)";
      case "starRating": return "e.g., 4,5 (4 or 5 star hotels)";
      case "duration": return "e.g., 7, 14 (nights)";
      case "adults": return "e.g., 2";
      case "children": return "e.g., 0, 2";
      default: return "Enter parameter value";
    }
  };

  // State for category type
  const [isSpecialPage, setIsSpecialPage] = useState(category?.is_special_page ?? false);

  // State for dynamic filters (only for regular categories)
  const [filters, setFilters] = useState(
    category?.category_filters || [{ filter_type: "", filter_value: "" }]
  );

  // State for dynamic embed params (only for special pages)
  const [embedParams, setEmbedParams] = useState(
    category?.category_embed_params || []
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

  // Add new embed param
  const addEmbedParam = () => {
    setEmbedParams([...embedParams, { 
      id: crypto.randomUUID(),
      embed_type: "holiday-finder", 
      base_url: "https://holidayconnect-app.icetravelgroup.com/holiday-deals", 
      param_name: "", 
      param_value: "" 
    }]);
  };

  // Remove embed param
  const removeEmbedParam = (index: number) => {
    setEmbedParams(embedParams.filter((_, i) => i !== index));
  };

  // Update embed param
  const updateEmbedParam = (index: number, field: string, value: string) => {
    const updatedParams = [...embedParams];
    updatedParams[index] = { ...updatedParams[index], [field]: value };
    setEmbedParams(updatedParams);
  };

  // Handle special page toggle
  const handleSpecialPageToggle = (checked: boolean) => {
    setIsSpecialPage(checked);
    if (checked) {
      // Clear filters when switching to special page
      setFilters([]);
      // Add default embed params if none exist
      if (embedParams.length === 0) {
        setEmbedParams([{
          id: crypto.randomUUID(),
          embed_type: "holiday-finder",
          base_url: "https://holidayconnect-app.icetravelgroup.com/holiday-deals",
          param_name: "destination",
          param_value: ""
        }]);
      }
    } else {
      // Clear embed params when switching to regular category
      setEmbedParams([]);
      // Add default filter if none exist
      if (filters.length === 0) {
        setFilters([{ filter_type: "", filter_value: "" }]);
      }
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

    // Add embed params to form data
    embedParams.forEach((param, index) => {
      if (param.param_name && param.param_value) {
        formData.append(`embed_${index}_type`, "holiday-finder");
        formData.append(`embed_${index}_base_url`, "https://holidayconnect-app.icetravelgroup.com/holiday-deals");
        formData.append(`embed_${index}_param_name`, param.param_name);
        formData.append(`embed_${index}_param_value`, param.param_value);
      }
    });

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
          <Input
            id="icon"
            name="icon"
            defaultValue={category?.icon || ""}
            placeholder="/icons/example.svg"
            required
          />
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

      {/* Holiday Finder Widget Parameters - Only for special pages */}
      {isSpecialPage && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Holiday Finder Widget Parameters</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure the parameters for the Holiday Finder holiday search widget
              </p>
            </div>
            <Button type="button" onClick={addEmbedParam} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Parameter
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {embedParams.map((param, index) => (
              <div key={param.id || index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Parameter Name</Label>
                  <Select
                    value={param.param_name}
                    onValueChange={(value) => updateEmbedParam(index, "param_name", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parameter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="destination">Destination</SelectItem>
                      <SelectItem value="departureAirport">Departure Airport</SelectItem>
                      <SelectItem value="boardBasis">Board Basis</SelectItem>
                      <SelectItem value="starRating">Star Rating</SelectItem>
                      <SelectItem value="duration">Duration (nights)</SelectItem>
                      <SelectItem value="adults">Number of Adults</SelectItem>
                      <SelectItem value="children">Number of Children</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Parameter Value</Label>
                  <div className="flex gap-2">
                    <Input
                      value={param.param_value}
                      onChange={(e) => updateEmbedParam(index, "param_value", e.target.value)}
                      placeholder={getEmbedPlaceholder(param.param_name)}
                    />
                    <Button
                      type="button"
                      onClick={() => removeEmbedParam(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {embedParams.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No parameters configured. Add parameters to customize the Holiday Finder widget.</p>
                <p className="text-xs mt-1">Common parameters: destination, departureAirport, boardBasis, starRating</p>
              </div>
            )}
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