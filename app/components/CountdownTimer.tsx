"use client";

import React, { useEffect, useState } from "react";

import { Clock } from "lucide-react";

interface CountdownTimerProps {
  validTo: string | null;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ validTo }) => {
  const calculateTimeLeft = () => {
    if (!validTo) return null;

    const difference = +new Date(validTo) - +new Date();
    let timeLeft: { [key: string]: number } = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      // If expired, maybe show nothing or an "Expired" message
      return null; // Returning null hides the component if expired
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!validTo) return;

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear timeout if the component is unmounted or if the timer expires
    return () => clearTimeout(timer);
  }); // No dependency array, runs on every render to update seconds correctly

  if (!timeLeft || Object.keys(timeLeft).length === 0) {
    return null; // Don't render if no time left or not applicable
  }

  // Compact time format
  const formatTime = () => {
    const parts = [];

    if (timeLeft.days > 0) {
      parts.push(`${timeLeft.days}d`);
    }

    parts.push(`${String(timeLeft.hours).padStart(2, "0")}h`);
    parts.push(`${String(timeLeft.minutes).padStart(2, "0")}m`);

    // Only show seconds if less than a day remaining
    if (timeLeft.days === 0) {
      parts.push(`${String(timeLeft.seconds).padStart(2, "0")}s`);
    }

    return parts.join(" ");
  };

  return (
    <span className="inline-flex items-center">
      <Clock className="h-3 w-3 mr-1" />
      <span>Expires {formatTime()}</span>
    </span>
  );
};

export default CountdownTimer;
