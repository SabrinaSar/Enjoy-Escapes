"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define the categories shown in the image
const categories = [
  {
    id: "holidays",
    name: "Holidays",
    icon: "/icons/holidays.svg",
    filter: { type: "hotel+flight" },
  },
  {
    id: "all-inclusive",
    name: "All-inclusive",
    icon: "/icons/all-inclusive.svg",
    filter: { board_basis: "all_inclusive" },
  },
  {
    id: "last-minute",
    name: "Last-minute",
    icon: "/icons/last-minute.svg",
    filter: { last_minute: true },
  },
  {
    id: "breaks-under-100",
    name: "Breaks Under £100",
    icon: "/icons/price.svg",
    filter: { price_under: 100 },
  },
  {
    id: "city-breaks",
    name: "City Breaks",
    icon: "/icons/city-breaks.svg",
    filter: { city_break: true },
  },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // Get the currently active filter from URL params
  const activeCategory = searchParams.get("category");

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
      // Create a new URLSearchParams instance
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
            className={`flex flex-col items-center p-2 h-auto w-auto rounded-md hover:bg-gray-100 ${
              activeCategory === category.id ? "bg-gray-100" : ""
            }`}
            onClick={() => handleCategorySelect(category.id)}
          >
            <div className="h-10 w-10 mb-2 flex items-center justify-center">
              <Image
                src={category.icon}
                alt={category.name}
                width={24}
                height={24}
              />
            </div>
            <span className="text-xs font-medium">{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
