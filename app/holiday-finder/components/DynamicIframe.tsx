"use client";

import { useEffect, useRef } from "react";

interface DynamicIframeProps {
  src: string;
  title: string;
}

export function DynamicIframe({ src, title }: DynamicIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const setIframeHeight = () => {
      if (iframeRef.current) {
        const marginOffset = 32; // Account for mx-4 + mb-4 margins
        const newHeight = Math.max(window.innerHeight - marginOffset, 600);
        iframeRef.current.style.height = newHeight + 'px';
      }
    };

    // Set height immediately
    setIframeHeight();

    // Update height on window resize
    window.addEventListener('resize', setIframeHeight);

    // Cleanup
    return () => {
      window.removeEventListener('resize', setIframeHeight);
    };
  }, [src]); // Re-run when src changes (route changes)

  return (
    <div className="flex-1 w-full mx-4 mb-4 rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 32px)' }}>
      <iframe
        ref={iframeRef}
        style={{ 
          border: 0, 
          width: "100%", 
          height: "100%",
          minHeight: "600px",
          display: "block"
        }}
        src={src}
        title={title}
      />
    </div>
  );
} 