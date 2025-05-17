"use client";

import React, { useCallback } from "react";
import { usePathname } from "next/navigation";
import { trackEscapeClick } from "@/app/actions/trackClick";

interface TrackableLinkProps {
  href: string;
  itemId: number;
  itemType: "escape" | "banner"; // Type of item being tracked
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  itemScope?: boolean;
  microDataItemType?: string; // Renamed to avoid conflicts
}

/**
 * A link component that tracks clicks before redirecting
 */
const TrackableLink: React.FC<TrackableLinkProps> = ({
  href,
  itemId,
  itemType = "escape", // Default to escape for backward compatibility
  className,
  children,
  ariaLabel,
  itemScope,
  microDataItemType,
}) => {
  const pathname = usePathname();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault(); // Prevent immediate navigation
      
      // Get browser data for better analytics
      const source = pathname || "";
      const userAgent = navigator.userAgent;
      const referrer = document.referrer;
      
      try {
        // Track the click first
        await trackEscapeClick({
          escape_id: itemId, // We'll use the existing field name for backward compatibility
          source,
          user_agent: userAgent,
          referrer,
          // Note: If item_type is added to the trackEscapeClick function params, add it here
        });
        
        // Then navigate to the destination
        window.open(href, "_blank", "noopener,noreferrer");
      } catch (error) {
        console.error("Error tracking click:", error);
        // Navigate anyway even if tracking fails
        window.open(href, "_blank", "noopener,noreferrer");
      }
    },
    [itemId, href, pathname, itemType]
  );

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      itemScope={itemScope}
      itemType={microDataItemType}
    >
      {children}
    </a>
  );
};

export default TrackableLink; 