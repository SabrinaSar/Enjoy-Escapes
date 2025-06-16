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

  // State for dynamic filters
  const [filters, setFilters] = useState(
    category?.category_filters || [{ filter_type: "", filter_value: "" }]
  );

  // State for dynamic embed params
  const [embedParams, setEmbedParams] = useState(
    category?.category_embed_params || [{ 
      embed_type: "icelolly", 
      base_url: "https://supersonic-icelolly-website.pages.dev/v2/affiliate-bos", 
      param_name: "", 
      param_value: "" 
    }]
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
      embed_type: "icelolly", 
      base_url: "https://supersonic-icelolly-website.pages.dev/v2/affiliate-bos", 
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
      if (param.embed_type && param.base_url && param.param_name && param.param_value) {
        formData.append(`embed_${index}_type`, param.embed_type);
        formData.append(`embed_${index}_base_url`, param.base_url);
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

      {/* Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            name="is_active"
            defaultChecked={category?.is_active ?? true}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_special_page"
            name="is_special_page"
            defaultChecked={category?.is_special_page ?? false}
          />
          <Label htmlFor="is_special_page">Special Page (not a filter)</Label>
        </div>
      </div>

      {/* Category Filters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Category Filters</CardTitle>
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
                    <SelectItem value="board_basis">Board Basis</SelectItem>
                    <SelectItem value="price_under">Price Under</SelectItem>
                    <SelectItem value="school_holidays">School Holidays</SelectItem>
                    <SelectItem value="last_minute">Last Minute</SelectItem>
                    <SelectItem value="long_haul">Long Haul</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="hot_deal">Hot Deal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Filter Value</Label>
                <div className="flex gap-2">
                  <Input
                    value={filter.filter_value}
                    onChange={(e) => updateFilter(index, "filter_value", e.target.value)}
                    placeholder="e.g., all_inclusive, 300, true"
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
        </CardContent>
      </Card>

      {/* Embed Parameters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Embed Parameters</CardTitle>
          <Button type="button" onClick={addEmbedParam} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Parameter
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {embedParams.map((param, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Embed Type</Label>
                <Select
                  value={param.embed_type}
                  onValueChange={(value) => updateEmbedParam(index, "embed_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select embed type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="icelolly">IceLolly</SelectItem>
                    <SelectItem value="holidayconnect">Holiday Connect</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Base URL</Label>
                <Input
                  value={param.base_url}
                  onChange={(e) => updateEmbedParam(index, "base_url", e.target.value)}
                  placeholder="https://example.com/embed"
                />
              </div>

              <div className="space-y-2">
                <Label>Parameter Name</Label>
                <Input
                  value={param.param_name}
                  onChange={(e) => updateEmbedParam(index, "param_name", e.target.value)}
                  placeholder="e.g., destination"
                />
              </div>

              <div className="space-y-2">
                <Label>Parameter Value</Label>
                <div className="flex gap-2">
                  <Input
                    value={param.param_value}
                    onChange={(e) => updateEmbedParam(index, "param_value", e.target.value)}
                    placeholder="e.g., 39677"
                  />
                  {embedParams.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeEmbedParam(index)}
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
        </CardContent>
      </Card>

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