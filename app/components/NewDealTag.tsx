"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface NewDealTagProps {
  validFrom: string | null;
}

const NewDealTag: React.FC<NewDealTagProps> = ({ validFrom }) => {
  if (!validFrom) return null;

  // Check if the deal is new based on the validFrom date
  const isNew = () => {
    const today = new Date();
    const validFromDate = new Date(validFrom);

    // Reset time part to compare dates only
    today.setHours(0, 0, 0, 0);
    validFromDate.setHours(0, 0, 0, 0);

    // Calculate the difference in days
    const diffTime = today.getTime() - validFromDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Return true if today is 1 day after validFrom
    return diffDays <= 1;
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
