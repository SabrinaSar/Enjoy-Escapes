"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect, useRef } from "react";
import { X, Gift, PlaneTakeoff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import Image from "next/image";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const SCROLL_TIME_THRESHOLD_MS = 10000; // 10 seconds of scrolling

export default function NewsletterPopup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const scrollTimeRef = useRef(0);
  const lastScrollRef = useRef(0);
  const scrollCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    // Create form data and submit to Mailchimp
    const form = document.createElement('form');
    form.action = 'https://enjoyescapes.us18.list-manage.com/subscribe/post';
    form.method = 'POST';
    form.target = '_blank';

    const inputs = [
      { name: 'u', value: '04a882be1679191e819450535' },
      { name: 'id', value: '5c84056061' },
      { name: 'MERGE0', value: email }
    ];

    inputs.forEach(({ name, value }) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    // Show success state
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Mark as shown with current timestamp
      const now = new Date().getTime();
      localStorage.setItem('newsletter-popup-shown', now.toString());
    }, 1000);
  };

  const closePopup = () => {
    setShowPopup(false);
    // Mark as shown with current timestamp so it doesn't show again for 30 days
    const now = new Date().getTime();
    localStorage.setItem('newsletter-popup-shown', now.toString());
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closePopup();
    } else {
      setShowPopup(open);
    }
  };

  useEffect(() => {
    // Check if popup has been shown in the last 30 days
    const lastShown = localStorage.getItem('newsletter-popup-shown');

    if (lastShown) {
      const lastShownTime = parseInt(lastShown);
      const now = new Date().getTime();

      // If less than 30 days have passed, don't show the popup
      if (now - lastShownTime < THIRTY_DAYS_MS) {
        return;
      }
    }

    // Track scroll time
    const handleScroll = () => {
      lastScrollRef.current = Date.now();
    };

    // Check scroll activity every 500ms
    scrollCheckIntervalRef.current = setInterval(() => {
      const now = Date.now();
      // If user scrolled in the last 500ms, count it as active scrolling
      if (now - lastScrollRef.current < 500) {
        scrollTimeRef.current += 500;

        // Show popup after 10 seconds of scrolling
        if (scrollTimeRef.current >= SCROLL_TIME_THRESHOLD_MS && !showPopup) {
          setShowPopup(true);
          // Clean up listeners once shown
          window.removeEventListener('scroll', handleScroll);
          if (scrollCheckIntervalRef.current) {
            clearInterval(scrollCheckIntervalRef.current);
          }
        }
      }
    }, 500);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollCheckIntervalRef.current) {
        clearInterval(scrollCheckIntervalRef.current);
      }
    };
  }, [showPopup]);

  // Success state
  if (isSuccess) {
    return (
      <Dialog open={showPopup} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md bottom-4 top-auto left-[50%] translate-y-0 sm:top-[50%] sm:bottom-auto sm:translate-y-[-50%] rounded-lg [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="sr-only">Newsletter Subscription Success</DialogTitle>
          </DialogHeader>
          {/* Custom close button - more visible */}
          <button
            onClick={closePopup}
            className="absolute right-3 top-3 z-10 rounded-full bg-muted/80 p-2 hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="text-center p-4 sm:p-6">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <PlaneTakeoff className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">You're in the draw!</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Thanks for subscribing! You're now entered into our £100 giveaway and will receive our best travel deals.
            </p>
            <Button onClick={closePopup} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={showPopup} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg p-0 overflow-hidden bottom-4 top-auto left-[50%] translate-y-0 sm:top-[50%] sm:bottom-auto sm:translate-y-[-50%] rounded-lg [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Newsletter Subscription Giveaway</DialogTitle>
        </DialogHeader>

        {/* Custom close button - more visible with background */}
        <button
          onClick={closePopup}
          className="absolute right-3 top-3 z-20 rounded-full bg-black/50 p-2 hover:bg-black/70 transition-colors text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header - smaller on mobile, full on desktop */}
        <div className="relative h-24 sm:h-48 w-full">
          <Image
            src="/win-bg.png"
            alt="Win £100 Giveaway"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Gift className="h-6 w-6 sm:h-10 sm:w-10 mx-auto mb-1 sm:mb-3" />
              <h2 className="text-xl sm:text-3xl font-bold">Win £100!</h2>
              <p className="text-sm sm:text-2xl opacity-90 hidden sm:block">Limited Time Giveaway</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground text-sm sm:text-base">
              Subscribe to our newsletter and you'll be automatically entered to win £100. Plus get exclusive travel deals!
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
                autoCapitalize="off"
                autoCorrect="off"
                className="w-full"
              />
              {errorMessage && (
                <p className="text-destructive text-sm">{errorMessage}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entering..." : "Enter Giveaway"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
