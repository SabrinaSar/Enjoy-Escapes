"use client";

import React from "react";

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
    <span className="inline-flex items-center rounded-md bg-orange-50 dark:bg-orange-900/30 px-2 py-1 text-xs font-medium text-orange-600 dark:text-orange-400 ring-1 ring-inset ring-orange-500/10 dark:ring-orange-500/30">
      New Deal 🔥
    </span>
  );
};

export default NewDealTag;
