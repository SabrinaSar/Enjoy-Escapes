"use client";

import React, { useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

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
 * A link component that tracks clicks before redirecting.
 * Uses navigator.sendBeacon for reliable, non-blocking tracking.
 * Always allows navigation even if tracking fails.
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
  const lastTrackTimeRef = useRef<number>(0);

  const trackClick = useCallback(() => {
    // Simple time-based deduplication (prevent double-clicks within 300ms)
    const now = Date.now();
    if (now - lastTrackTimeRef.current < 300) {
      return;
    }
    lastTrackTimeRef.current = now;

    try {
      // Prepare tracking data
      const trackingData = {
        escape_id: itemId,
        item_type: itemType,
        source: pathname || "",
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      };

      // Debug logging for banner clicks
      if (itemType === "banner") {
        console.log("🎯 Banner click tracking:", {
          itemId,
          itemType,
          trackingData,
        });
      }

      // Use sendBeacon for reliable tracking that doesn't block navigation
      // This is specifically designed for analytics and works even when the page unloads
      if (navigator.sendBeacon) {
        // Create a Blob with the correct content type for sendBeacon
        // sendBeacon with a string doesn't set Content-Type to application/json
        const blob = new Blob([JSON.stringify(trackingData)], {
          type: "application/json",
        });
        
        const success = navigator.sendBeacon("/api/track-click", blob);
        
        if (!success) {
          console.warn("⚠️ sendBeacon failed, using fetch fallback");
          // Fallback to fetch if sendBeacon fails (rare)
          fetch("/api/track-click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trackingData),
            keepalive: true, // Keep request alive even if page navigates away
          })
            .then(response => response.json())
            .then(data => {
              if (itemType === "banner") {
                console.log("📡 Fetch response for banner:", data);
              }
            })
            .catch((error) => {
              console.error("❌ Fetch tracking error:", error);
            });
        } else if (itemType === "banner") {
          console.log("✅ sendBeacon sent successfully for banner");
        }
      } else {
        // Fallback for browsers without sendBeacon support
        fetch("/api/track-click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trackingData),
          keepalive: true,
        }).catch(() => {
          // Silent fail
        });
      }
    } catch (error) {
      // Silently fail - never let tracking break the link
      console.debug("Tracking failed:", error);
    }
  }, [itemId, itemType, pathname]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Debug logging for banner clicks
      if (itemType === "banner") {
        console.log("🖱️ Banner button clicked! Event:", {
          itemId,
          itemType,
          href,
          target: e.currentTarget,
        });
      }
      
      // Track the click - this never prevents navigation
      trackClick();
      
      // Let the browser handle navigation naturally
      // No preventDefault(), no blocking - affiliate link always works
    },
    [trackClick, itemType, itemId, href]
  );

  // Also track on touch for better iOS support
  const handleTouchStart = useCallback(() => {
    trackClick();
  }, [trackClick]);

  return (
    <a
      href={href}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      className={className}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      itemScope={itemScope}
      itemType={microDataItemType}
      style={{ 
        touchAction: 'manipulation',
        // Ensure the link is always tappable on iOS
        WebkitTapHighlightColor: 'transparent',
        cursor: 'pointer'
      }}
    >
      {children}
    </a>
  );
};

export default TrackableLink; 