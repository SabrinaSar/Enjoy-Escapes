"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface NewDealTagProps {
  created_at: string;
}

const NewDealTag: React.FC<NewDealTagProps> = ({ created_at }) => {
  if (!created_at) return null;

  // Check if the deal is new based on the created_at date (within last 24 hours)
  const isNew = () => {
    const now = new Date();
    const createdAtDate = new Date(created_at);

    // Calculate the difference in milliseconds
    const diffTime = now.getTime() - createdAtDate.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);

    // Return true if the deal was created within the last 24 hours
    return diffHours <= 24;
  };

  if (!isNew()) return null;

  return (
    <span className="inline-flex items-center rounded-md bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-orange-400/50">
      <Sparkles className="h-3 w-3 mr-1" />
      New Deal
    </span>
  );
};

export default NewDealTag;
