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

  const timerComponents = Object.entries(timeLeft)
    .map(([interval, value]) => {
      if (
        value === 0 &&
        interval !== "seconds" &&
        Object.keys(timeLeft).length > 1
      )
        return null; // Optionally hide zero values except seconds if other units exist
      return (
        <span key={interval} className="mx-1">
          {value}
          {interval.charAt(0)}
        </span>
      );
    })
    .filter(Boolean); // Remove null entries

  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <Clock className="mr-1.5 h-4 w-4 text-blue-green dark:text-secondary" />
      <span>Expires in: {timerComponents}</span>
    </div>
  );
};

export default CountdownTimer;
