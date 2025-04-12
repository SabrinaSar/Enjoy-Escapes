"use client";

import React from "react";

interface NewDealTagProps {
  validFrom: string | null;
}

const NewDealTag: React.FC<NewDealTagProps> = ({ validFrom }) => {
  if (!validFrom) return null;

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const validFromDate = new Date(validFrom);

  const isNew = validFromDate > twentyFourHoursAgo;

  if (!isNew) return null;

  return (
    <span className="inline-flex items-center rounded-md bg-orange-50 dark:bg-orange-900/30 px-2 py-1 text-xs font-medium text-orange-600 dark:text-orange-400 ring-1 ring-inset ring-orange-500/10 dark:ring-orange-500/30">
      New Deal 🔥
    </span>
  );
};

export default NewDealTag;
