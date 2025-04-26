"use client";

import { Clock, Flame, PlaneTakeoff, School, Sparkles, Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

export function AdminFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // Get current filter states from URL
  const featured = searchParams.get("featured") === "true";
  const hotDeal = searchParams.get("hot_deal") === "true";
  const schoolHolidays = searchParams.get("school_holidays") === "true";
  const longHaul = searchParams.get("long_haul") === "true";
  const lastMinute = searchParams.get("last_minute") === "true";
  const scheduled = searchParams.get("scheduled") === "true";
  const dealType = searchParams.get("type") || "all";

  // Local state for filters
  const [filters, setFilters] = useState({
    featured,
    hotDeal,
    schoolHolidays,
    longHaul,
    lastMinute,
    scheduled,
    dealType,
  });

  // Count active filters
  const activeFilterCount = [
    filters.featured && "featured",
    filters.hotDeal && "hotDeal",
    filters.schoolHolidays && "schoolHolidays",
    filters.longHaul && "longHaul",
    filters.lastMinute && "lastMinute",
    filters.scheduled && "scheduled",
    filters.dealType !== "all" && filters.dealType,
  ].filter(Boolean).length;

  // Update URL when filters change
  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset pagination when filters change
    params.set("page", "1");

    // Update or remove filter params
    if (filters.featured) params.set("featured", "true");
    else params.delete("featured");

    if (filters.hotDeal) params.set("hot_deal", "true");
    else params.delete("hot_deal");

    if (filters.schoolHolidays) params.set("school_holidays", "true");
    else params.delete("school_holidays");

    if (filters.longHaul) params.set("long_haul", "true");
    else params.delete("long_haul");

    if (filters.lastMinute) params.set("last_minute", "true");
    else params.delete("last_minute");
    
    if (filters.scheduled) params.set("scheduled", "true");
    else params.delete("scheduled");

    if (filters.dealType && filters.dealType !== "all")
      params.set("type", filters.dealType);
    else params.delete("type");

    router.push(`${pathname}?${params.toString()}`);
    setOpen(false); // Close popover when filters are applied
  }, [filters, router, pathname, searchParams]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      featured: false,
      hotDeal: false,
      schoolHolidays: false,
      longHaul: false,
      lastMinute: false,
      scheduled: false,
      dealType: "all",
    });
  };

  // Apply filters when the component mounts to sync with URL
  useEffect(() => {
    setFilters({
      featured,
      hotDeal,
      schoolHolidays,
      longHaul,
      lastMinute,
      scheduled,
      dealType: dealType || "all",
    });
  }, [featured, hotDeal, schoolHolidays, longHaul, lastMinute, scheduled, dealType]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 border-dashed w-auto min-w-[80px]">
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 rounded-sm px-1 font-normal"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            <Button
              variant="ghost"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={resetFilters}
            >
              Reset filters
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Special Types</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="filter-featured"
                  checked={filters.featured}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor="filter-featured"
                  className="flex items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  <span>Featured</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="filter-hot-deal"
                  checked={filters.hotDeal}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      hotDeal: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor="filter-hot-deal"
                  className="flex items-center gap-1"
                >
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span>Hot Deal</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="filter-school-holidays"
                  checked={filters.schoolHolidays}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      schoolHolidays: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor="filter-school-holidays"
                  className="flex items-center gap-1"
                >
                  <School className="h-3.5 w-3.5" />
                  <span>School Holidays</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="filter-long-haul"
                  checked={filters.longHaul}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      longHaul: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor="filter-long-haul"
                  className="flex items-center gap-1"
                >
                  <PlaneTakeoff className="h-3.5 w-3.5" />
                  <span>Long Haul</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="filter-last-minute"
                  checked={filters.lastMinute}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      lastMinute: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor="filter-last-minute"
                  className="flex items-center gap-1"
                >
                  <Clock className="h-3.5 w-3.5 text-red-500" />
                  <span>Last Minute</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="filter-scheduled"
                  checked={filters.scheduled}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      scheduled: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor="filter-scheduled"
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-3.5 w-3.5 text-purple-500" />
                  <span>Scheduled for Future</span>
                </Label>
              </div>
              <p className="text-xs text-gray-500 ml-6">
                Show only escapes scheduled for future publication
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Deal Type</h4>
            <Select
              value={filters.dealType}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, dealType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All deal types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All deal types</SelectItem>
                <SelectItem value="hotel">Hotel Only</SelectItem>
                <SelectItem value="flight">Flight Only</SelectItem>
                <SelectItem value="hotel+flight">Hotel + Flight</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={updateFilters}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
