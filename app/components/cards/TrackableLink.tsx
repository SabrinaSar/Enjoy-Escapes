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
  const isTrackingRef = useRef(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Don't prevent default - let the browser handle navigation naturally
      // This prevents popup blocking issues
      
      // Prevent duplicate tracking
      if (isTrackingRef.current) {
        return;
      }
      
      isTrackingRef.current = true;
      
      // Get browser data for analytics
      const source = pathname || "";
      const userAgent = navigator.userAgent;
      const referrer = document.referrer;
      
      // Track the click asynchronously without blocking navigation
      // Use fire-and-forget approach
      trackEscapeClick({
        escape_id: itemId,
        source,
        user_agent: userAgent,
        referrer,
      }).catch(error => {
        console.error("Error tracking click:", error);
      }).finally(() => {
        // Reset tracking flag after a short delay
        setTimeout(() => {
          isTrackingRef.current = false;
        }, 100);
      });
      
      // Let the browser handle the navigation naturally
      // No preventDefault, no manual window.open
    },
    [itemId, pathname, itemType]
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
        touchAction: 'manipulation'
      }}
    >
      {children}
    </a>
  );
};

export default TrackableLink; 