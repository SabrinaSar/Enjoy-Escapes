"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define the type for categories
interface Category {
  id: string;
  name: string;
  icon: string;
  filter?: Record<string, any>;
  isSpecialPage?: boolean;
}

// Define the categories shown in the image
const categories: Category[] = [
  {
    id: "latest-all-inclusive",
    name: "Latest All Inclusive",
    icon: "/icons/all-inclusive.svg",
    isSpecialPage: true, // This indicates it goes to a different page
  },
  {
    id: "all-inclusive",
    name: "All Inclusive",
    icon: "/icons/all-inclusive.svg",
    filter: { board_basis: "all_inclusive" },
  },
  {
    id: "deals-under-300",
    name: "Deals Under £300",
    icon: "/icons/price.svg",
    filter: { price_under: 300 },
  },
  {
    id: "school-holidays",
    name: "School Holidays",
    icon: "/icons/holidays.svg",
    filter: { school_holidays: true },
  },
  {
    id: "last-minute",
    name: "Last Minute",
    icon: "/icons/last-minute.svg",
    filter: { last_minute: true },
  },
  {
    id: "long-haul",
    name: "Long Haul",
    icon: "/icons/city-breaks.svg", // Reusing existing icon, you may want to create a new one
    filter: { long_haul: true },
  },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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
    // Check if we're on a special page
    if (pathname === "/latest-all-inclusive") {
      return "latest-all-inclusive";
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
    (categoryId: string) => {
      // Find the category to check if it's a special page
      const category = categories.find(cat => cat.id === categoryId);
      
      // Handle special pages that navigate to different routes
      if (category?.isSpecialPage) {
        if (categoryId === "latest-all-inclusive") {
          router.push("/latest-all-inclusive");
          return;
        }
      }

      // Create a new URLSearchParams instance for regular filters
      const params = new URLSearchParams(searchParams.toString());

      // If the same category is clicked, remove the filter
      if (activeCategory === categoryId) {
        params.delete("category");
      } else {
        // Otherwise, set the new category filter
        params.set("category", categoryId);
      }

      // Update the URL with the new params
      router.push(`/?${params.toString()}`);
    },
    [activeCategory, router, searchParams]
  );

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
              activeCategory === category.id
                ? "bg-gray-100 dark:bg-gray-800"
                : ""
            }`}
            onClick={() => handleCategorySelect(category.id)}
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
