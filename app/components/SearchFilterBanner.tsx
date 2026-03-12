"use client";

import React from "react";
import {
  MapPin,
  Plane,
  Calendar,
  Search,
  ChevronDown,
  Globe,
} from "lucide-react";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  POPULAR_DESTINATIONS,
  ALL_DESTINATIONS,
  AIRPORTS,
  MONTHS,
  DESTINATION_FLAGS,
  DESTINATION_CODES,
} from "@/app/constants/searchOptions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const SearchFilterBannerContent = () => {
  // Get search parameters to populate defaults
  const searchParams = useSearchParams();
  const currentDestination = searchParams.get("q") || "";
  const currentOrigin = searchParams.get("origin") || "";
  const currentDate = searchParams.get("date") || "";

  const [selectedDest, setSelectedDest] = React.useState(currentDestination);
  const [selectedOrigins, setSelectedOrigins] = React.useState<string[]>(
    currentOrigin ? currentOrigin.split(",").map((o: string) => o.trim()) : [],
  );
  const [selectedDates, setSelectedDates] = React.useState<string[]>(
    currentDate ? currentDate.split(",").map((d: string) => d.trim()) : [],
  );

  const toggleOrigin = (airport: string) => {
    setSelectedOrigins((prev) =>
      prev.includes(airport)
        ? prev.filter((a) => a !== airport)
        : [...prev, airport],
    );
  };

  const removeOrigin = (airport: string) => {
    setSelectedOrigins((prev) => prev.filter((a) => a !== airport));
  };

  const toggleDate = (month: string) => {
    setSelectedDates((prev) =>
      prev.includes(month)
        ? prev.filter((d) => d !== month)
        : [...prev, month],
    );
  };

  const removeDate = (month: string) => {
    setSelectedDates((prev) => prev.filter((d) => d !== month));
  };

  const getFlagUrl = (destName: string) => {
    const code = DESTINATION_CODES[destName];
    if (!code) return null;
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto ">
      <form
        action="/search"
        method="GET"
        className="flex flex-col md:flex-row items-stretch md:items-center bg-white dark:bg-gray-800 rounded-2xl md:rounded-full shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Destination */}
        <div className="flex flex-1 items-center gap-3 px-4 py-2 md:px-5 md:py-3 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 group transition-all">
          <MapPin className="text-orange-500 flex-shrink-0" size={20} />
          <div className="flex flex-col w-full relative gap-0.5">
            <label
              htmlFor="destination-input"
              className="text-xs md:text-[10px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-wide"
            >
              Where to?
            </label>
            <div className="flex items-center w-full">
              <Select
                name="q"
                value={selectedDest}
                onValueChange={setSelectedDest}
              >
                <SelectTrigger className="text-base md:text-sm font-medium text-gray-900 dark:text-gray-100 bg-transparent border-0 p-0 h-auto focus:ring-0 shadow-none w-full ">
                  <SelectValue placeholder="Search destination">
                    {selectedDest && (
                      <div className="flex items-center gap-2">
                        {selectedDest === "Any" ? (
                          <Globe className="w-4 h-4 text-gray-400" />
                        ) : getFlagUrl(selectedDest) ? (
                          <img
                            src={getFlagUrl(selectedDest)!}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover shrink-0 border border-gray-100"
                          />
                        ) : (
                          <span className="w-5 text-center">
                            {DESTINATION_FLAGS[selectedDest]}
                          </span>
                        )}
                        <span>
                          {selectedDest === "Any"
                            ? "Any Destination"
                            : selectedDest}
                        </span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any Destination</SelectItem>
                  <SelectGroup>
                    <SelectLabel>Most popular</SelectLabel>
                    {POPULAR_DESTINATIONS.map((dest) => (
                      <SelectItem key={`pop-${dest}`} value={dest}>
                        <div className="flex items-center gap-3 w-full">
                          {getFlagUrl(dest) ? (
                            <img
                              src={getFlagUrl(dest)!}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <span className="w-5 text-center">
                              {DESTINATION_FLAGS[dest]}
                            </span>
                          )}
                          <span>{dest}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>All</SelectLabel>
                    {ALL_DESTINATIONS.map((dest) => (
                      <SelectItem key={`all-${dest}`} value={dest}>
                        <div className="flex items-center gap-3 w-full text-left">
                          {getFlagUrl(dest) ? (
                            <img
                              src={getFlagUrl(dest)!}
                              alt=""
                              className="w-5 h-5 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <span className="w-5 text-center">
                              {DESTINATION_FLAGS[dest]}
                            </span>
                          )}
                          <span>{dest}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Flying From */}
        <div className="flex flex-1 items-center gap-3 px-4 py-2 md:px-5 md:py-3 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 transition-all">
          <Plane className="text-blue-500 flex-shrink-0" size={20} />
          <div className="flex flex-col w-full relative gap-0.5">
            <label
              htmlFor="origin-input"
              className="text-xs md:text-[10px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-wide"
            >
              Flying from
            </label>
            <div className="flex items-center w-full">
              <input
                type="hidden"
                name="origin"
                value={selectedOrigins.join(",")}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center justify-between gap-2 text-base md:text-sm font-medium text-gray-900 dark:text-gray-100 bg-transparent border-0 p-0 h-auto focus:ring-0 shadow-none w-full text-left"
                  >
                    <div className="flex flex-wrap gap-1">
                      {selectedOrigins.length > 0 ? (
                        selectedOrigins.map((airport) => (
                          <Badge
                            key={airport}
                            variant="secondary"
                            className="text-[10px] md:text-xs py-0 px-1.5 flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                          >
                            {airport}
                            <X
                              size={10}
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeOrigin(airport);
                              }}
                            />
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400">Departure airport</span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-2" align="start">
                  <div className="space-y-2">
                    {AIRPORTS.map((airport) => (
                      <div
                        key={airport}
                        className="flex items-center space-x-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                        onClick={() => toggleOrigin(airport)}
                      >
                        <Checkbox
                          id={`airport-${airport}`}
                          checked={selectedOrigins.includes(airport)}
                          onCheckedChange={() => toggleOrigin(airport)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          htmlFor={`airport-${airport}`}
                          className="text-sm font-medium leading-none cursor-pointer flex-1"
                        >
                          {airport}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-1 items-center gap-3 px-4 py-2 md:px-5 md:py-3 transition-all border-b md:border-b-0 border-gray-100 dark:border-gray-700">
          <Calendar className="text-yellow-500 flex-shrink-0" size={20} />
          <div className="flex flex-col w-full relative gap-0.5">
            <label
              htmlFor="date-input"
              className="text-xs md:text-[10px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-wide"
            >
              When
            </label>
            <div className="flex items-center w-full">
              <input
                type="hidden"
                name="date"
                value={selectedDates.join(",")}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center justify-between gap-2 text-base md:text-sm font-medium text-gray-900 dark:text-gray-100 bg-transparent border-0 p-0 h-auto focus:ring-0 shadow-none w-full text-left"
                  >
                    <div className="flex flex-wrap gap-1">
                      {selectedDates.length > 0 ? (
                        selectedDates.map((month) => (
                          <Badge
                            key={month}
                            variant="secondary"
                            className="text-[10px] md:text-xs py-0 px-1.5 flex items-center gap-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
                          >
                            {month}
                            <X
                              size={10}
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDate(month);
                              }}
                            />
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400">Select month</span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-2" align="start">
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {MONTHS.map((month) => (
                      <div
                        key={month}
                        className="flex items-center space-x-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                        onClick={() => toggleDate(month)}
                      >
                        <Checkbox
                          id={`date-${month}`}
                          checked={selectedDates.includes(month)}
                          onCheckedChange={() => toggleDate(month)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          htmlFor={`date-${month}`}
                          className="text-sm font-medium leading-none cursor-pointer flex-1"
                        >
                          {month}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="px-4 py-3 md:py-2 md:pr-3 bg-white dark:bg-gray-800">
          <button
            type="submit"
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-6 py-2.5 md:py-3 rounded-xl md:rounded-full font-bold text-base md:text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <Search size={16} />
            Find Deals
          </button>
        </div>
      </form>
    </div>
  );
};

const SearchFilterBanner = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-6xl mx-auto px-4 h-[72px] md:h-[60px] bg-white rounded-2xl md:rounded-full shadow-lg border border-gray-200 animate-pulse"></div>
      }
    >
      <SearchFilterBannerContent />
    </Suspense>
  );
};

export default SearchFilterBanner;
