"use client";

import React, { useCallback, useRef } from "react";
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
  const isNavigatingRef = useRef(false);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Prevent multiple clicks
      if (isNavigatingRef.current) {
        e.preventDefault();
        return;
      }
      
      e.preventDefault(); // Prevent immediate navigation
      isNavigatingRef.current = true;
      
      // Get browser data for better analytics
      const source = pathname || "";
      const userAgent = navigator.userAgent;
      const referrer = document.referrer;
      
      try {
        // Track the click first - but don't wait too long
        const trackingPromise = trackEscapeClick({
          escape_id: itemId,
          source,
          user_agent: userAgent,
          referrer,
        });
        
        // Wait max 500ms for tracking, then navigate regardless
        await Promise.race([
          trackingPromise,
          new Promise(resolve => setTimeout(resolve, 500))
        ]);
      } catch (error) {
        console.error("Error tracking click:", error);
      }
      
      // Navigate to the destination
      window.open(href, "_blank", "noopener,noreferrer");
      
      // Reset the flag after a delay
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 1000);
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
      style={{ 
        touchAction: 'manipulation',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {children}
    </a>
  );
};

export default TrackableLink; 