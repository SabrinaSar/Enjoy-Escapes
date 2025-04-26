"use client";

import React, { useCallback } from "react";
import { usePathname } from "next/navigation";
import { trackEscapeClick } from "@/app/actions/trackClick";

interface TrackableLinkProps {
  href: string;
  escapeId: number;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  itemScope?: boolean;
  itemType?: string;
}

/**
 * A link component that tracks clicks before redirecting
 */
const TrackableLink: React.FC<TrackableLinkProps> = ({
  href,
  escapeId,
  className,
  children,
  ariaLabel,
  itemScope,
  itemType,
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
          escape_id: escapeId,
          source,
          user_agent: userAgent,
          referrer,
        });
        
        // Then navigate to the destination
        window.open(href, "_blank", "noopener,noreferrer");
      } catch (error) {
        console.error("Error tracking click:", error);
        // Navigate anyway even if tracking fails
        window.open(href, "_blank", "noopener,noreferrer");
      }
    },
    [escapeId, href, pathname]
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
      itemType={itemType}
    >
      {children}
    </a>
  );
};

export default TrackableLink; 