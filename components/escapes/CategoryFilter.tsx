"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCallback } from "react";

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

  // Get the currently active filter from URL params
  const activeCategory = searchParams.get("category");

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
    <div className="flex justify-center items-center space-x-8 py-4">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="ghost"
          className={`flex flex-col items-center p-2 ${
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
  );
}
