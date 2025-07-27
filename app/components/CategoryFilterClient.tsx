"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define the type for categories from database
interface Category {
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
}

interface CategoryFilterClientProps {
  initialCategories?: Category[];
}

export default function CategoryFilterClient({ initialCategories = [] }: CategoryFilterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(initialCategories.length === 0);

  // Fetch categories from database
  useEffect(() => {
    if (initialCategories.length > 0) {
      setCategories(initialCategories);
      setLoading(false);
      return;
    }

    async function fetchCategories() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select(`
          *,
          category_filters (*),
          category_embed_params (*)
        `)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
        return;
      }

      setCategories(data || []);
      setLoading(false);
    }

    fetchCategories();
  }, [initialCategories]);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkMobile();

    // Add listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get the currently active filter from URL params or pathname for special pages
  const getActiveCategory = () => {
    // Check if we're on a special page - match by slug
    const specialPageCategory = categories.find(cat => 
      cat.is_special_page && pathname === `/${cat.slug}`
    );
    if (specialPageCategory) {
      return specialPageCategory.slug;
    }
    // Otherwise, get from search params
    return searchParams.get("category");
  };
  
  const activeCategory = getActiveCategory();

  // Drag handlers for horizontal scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle category selection
  const handleCategorySelect = useCallback(
    (categorySlug: string) => {
      // Find the category to check if it's a special page
      const category = categories.find(cat => cat.slug === categorySlug);
      
      // Handle special pages that navigate to different routes
      if (category?.is_special_page) {
        router.push(`/${category.slug}`);
        return;
      }

      // Create a new URLSearchParams instance for regular filters
      const params = new URLSearchParams(searchParams.toString());

      // If the same category is clicked, remove the filter
      if (activeCategory === categorySlug) {
        params.delete("category");
      } else {
        // Otherwise, set the new category filter
        params.set("category", categorySlug);
      }

      // Update the URL with the new params
      router.push(`/?${params.toString()}`);
    },
    [activeCategory, router, searchParams, categories]
  );

  if (loading) {
    return (
      <div className="w-full py-4">
        <div className="flex min-w-max px-4 md:px-0 md:justify-center space-x-4 md:space-x-8">
          {/* Loading skeleton */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center p-2 animate-pulse">
              <div className="h-10 w-10 mb-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className={`w-full overflow-x-auto py-4 ${isMobile ? "no-scrollbar" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      <div className="flex min-w-max px-4 md:px-0 md:justify-center space-x-4 md:space-x-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className={`flex flex-col items-center p-2 h-auto w-auto rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
              activeCategory === category.slug
                ? "bg-gray-100 dark:bg-gray-800"
                : ""
            }`}
            onClick={() => handleCategorySelect(category.slug)}
          >
            <div className="h-10 w-10 mb-2 flex items-center justify-center bg-white group-hover:bg-gray-100 dark:bg-primary/20 rounded-full">
              <Image
                src={category.icon}
                alt={category.name}
                width={24}
                height={24}
                className="dark:invert dark:brightness-200 dark:hue-rotate-180"
              />
            </div>
            <span className="text-xs font-medium">{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
} 