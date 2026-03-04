"use client";

import React from "react";
import { MapPin, Plane, Calendar, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

const SearchFilterBanner = () => {
  // Get search parameters to populate defaults
  const searchParams = useSearchParams();
  const currentDestination = searchParams.get("q") || "";
  const currentOrigin = searchParams.get("origin") || "";
  const currentDate = searchParams.get("date") || "";

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
          <div className="flex flex-col w-full">
            <label
              htmlFor="destination-input"
              className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide"
            >
              Where to?
            </label>
            <input
              id="destination-input"
              name="q"
              type="text"
              placeholder="Search destination"
              defaultValue={currentDestination}
              className="text-sm text-gray-600 bg-transparent outline-none placeholder:text-gray-400 focus:placeholder:text-gray-300 transition-all"
            />
          </div>
        </div>

        {/* Flying From */}
        <div className="flex flex-1 items-center gap-3 px-5 py-4 md:py-3 border-b md:border-b-0 md:border-r border-gray-100 transition-all">
          <Plane className="text-teal-600 flex-shrink-0" size={18} />
          <div className="flex flex-col w-full">
            <label
              htmlFor="origin-input"
              className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide"
            >
              Flying from
            </label>
            <input
              id="origin-input"
              name="origin"
              type="text"
              placeholder="Departure airport"
              defaultValue={currentOrigin}
              className="text-sm text-gray-600 bg-transparent outline-none placeholder:text-gray-400 focus:placeholder:text-gray-300 transition-all"
            />
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-1 items-center gap-3 px-5 py-4 md:py-3 transition-all border-b md:border-b-0">
          <Calendar className="text-teal-600 flex-shrink-0" size={18} />
          <div className="flex flex-col w-full">
            <label
              htmlFor="date-input"
              className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide"
            >
              When
            </label>
            <input
              id="date-input"
              name="date"
              type="date"
              defaultValue={currentDate}
              className="text-sm text-gray-600 bg-transparent outline-none cursor-pointer"
            />
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

export default SearchFilterBanner;
