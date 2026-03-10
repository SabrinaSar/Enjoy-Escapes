"use client";

import React from "react";
import { MapPin, Plane, Calendar, Search, ChevronDown } from "lucide-react";

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

const SearchFilterBannerContent = () => {
  // Get search parameters to populate defaults
  const searchParams = useSearchParams();
  const currentDestination = searchParams.get("q") || "";
  const currentOrigin = searchParams.get("origin") || "";
  const currentDate = searchParams.get("date") || "";

  const [selectedDest, setSelectedDest] = React.useState(currentDestination);

  const getFlagUrl = (destName: string) => {
    const code = DESTINATION_CODES[destName];
    if (!code) return null;
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <form
        action="/search"
        method="GET"
        className="flex flex-col md:flex-row items-stretch md:items-center bg-white rounded-2xl md:rounded-full shadow-lg border border-gray-200 overflow-hidden"
      >
        {/* Destination */}
        <div className="flex flex-1 items-center gap-3 px-5 py-4 md:py-3 border-b md:border-b-0 md:border-r border-gray-100 group transition-all">
          <MapPin className="text-teal-600 flex-shrink-0" size={18} />
          <div className="flex flex-col w-full relative">
            <label
              htmlFor="destination-input"
              className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide"
            >
              Where to?
            </label>
            <div className="flex items-center w-full">
              <Select
                name="q"
                value={selectedDest}
                onValueChange={setSelectedDest}
              >
                <SelectTrigger className="text-sm text-gray-600 bg-transparent border-0 p-0 h-auto focus:ring-0 shadow-none w-full justify-start gap-2">
                  <SelectValue placeholder="Search destination">
                    {selectedDest && (
                      <div className="flex items-center gap-2">
                        {getFlagUrl(selectedDest) ? (
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
                        <span>{selectedDest}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
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
        <div className="flex flex-1 items-center gap-3 px-5 py-4 md:py-3 border-b md:border-b-0 md:border-r border-gray-100 transition-all">
          <Plane className="text-teal-600 flex-shrink-0" size={18} />
          <div className="flex flex-col w-full relative">
            <label
              htmlFor="origin-input"
              className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide"
            >
              Flying from
            </label>
            <div className="flex items-center w-full">
              <Select name="origin" defaultValue={currentOrigin}>
                <SelectTrigger className="text-sm text-gray-600 bg-transparent border-0 p-0 h-auto focus:ring-0 shadow-none w-full">
                  <SelectValue placeholder="Departure airport" />
                </SelectTrigger>
                <SelectContent>
                  {AIRPORTS.map((airport) => (
                    <SelectItem key={airport} value={airport}>
                      {airport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>

        {/* Date */}
        <div className="flex flex-1 items-center gap-3 px-5 py-4 md:py-3 transition-all border-b md:border-b-0">
          <Calendar className="text-teal-600 flex-shrink-0" size={18} />
          <div className="flex flex-col w-full relative">
            <label
              htmlFor="date-input"
              className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide"
            >
              When
            </label>
            <Select name="date" defaultValue={currentDate}>
              <SelectTrigger className="text-sm text-gray-600 bg-transparent border-0 p-0 h-auto focus:ring-0 shadow-none w-full">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <div className="px-4 py-4 md:py-2 md:pr-3 bg-white">
          <button
            type="submit"
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
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
