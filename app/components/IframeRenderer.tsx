"use client";

import { useEffect, useRef } from "react";

interface IframeRendererProps {
  embedCode: string;
}

export default function IframeRenderer({ embedCode }: IframeRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set the HTML content
    container.innerHTML = embedCode;

    // Execute any scripts in the embed code
    const scripts = container.querySelectorAll('script');
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      
      // Copy attributes
      Array.from(script.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy content
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }
      
      // Replace the old script with the new one to ensure execution
      script.parentNode?.replaceChild(newScript, script);
    });

    return () => {
      // Cleanup on unmount
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [embedCode]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 w-full mx-4 mb-4"
    />
  );
}

