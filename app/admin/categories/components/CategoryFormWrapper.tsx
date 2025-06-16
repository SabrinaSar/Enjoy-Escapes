"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "./CategoryForm";

interface CategoryFormWrapperProps {
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

export function CategoryFormWrapper({ category }: CategoryFormWrapperProps) {
  return <CategoryForm category={category} />;
} 