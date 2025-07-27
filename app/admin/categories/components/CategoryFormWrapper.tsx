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
    iframe_embed_code: string | null;
  };
}

export function CategoryFormWrapper({ category }: CategoryFormWrapperProps) {
  return <CategoryForm category={category} />;
} 