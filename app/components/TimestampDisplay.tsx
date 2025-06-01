"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface TimestampDisplayProps {
  timestamp: string | null;
  className?: string;
}

export default function TimestampDisplay({ timestamp, className = "" }: TimestampDisplayProps) {
  const [formattedTime, setFormattedTime] = useState<string>("Not available");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (timestamp) {
      try {
        // Create a Date object from the UTC timestamp
        const date = new Date(timestamp);
        
        // Format in user's local timezone
        const formatted = date.toLocaleString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        });
        
        setFormattedTime(formatted);
      } catch (error) {
        console.error("Error formatting timestamp:", error);
        setFormattedTime("Invalid date");
      }
    }
  }, [timestamp]);

  // Don't render anything on server-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className={`inline-flex items-center gap-1 text-sm text-muted-foreground ${className}`}>
        <Clock className="h-3 w-3 text-secondary" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1 text-sm text-muted-foreground ${className}`}>
      <Clock className="h-3 w-3 text-secondary" />
      <span>Last updated: {formattedTime}</span>
    </div>
  );
} 