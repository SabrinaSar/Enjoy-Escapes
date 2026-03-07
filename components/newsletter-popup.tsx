"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect, useRef } from "react";
import { X, Gift, PlaneTakeoff, Mail, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type PopupData = {
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  image_url: string | null;
};

const defaultPopup: PopupData = {
  title: "",
  subtitle: "",
  description: "",
  button_text: "",
  image_url: null,
};

const THIRTY_DAYS_MS = 1 * 24 * 60 * 60 * 1000;
// const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const SCROLL_TIME_THRESHOLD_MS = 10000; // 10 seconds of scrolling

export default function NewsletterPopup({
  showTrigger = true,
}: {
  showTrigger?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  // Removed scroll refs

  const [popupContent, setPopupContent] = useState<PopupData>(defaultPopup);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPopupData() {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc("get_newslatter_data");
        if (error) throw error;
        if (data && data.length > 0) {
          const remote = data[0];
          setPopupContent({
            title: remote.title ?? "",
            subtitle: remote.subtitle ?? "",
            description: remote.description ?? "",
            button_text: remote.button_text ?? "",
            image_url: remote.image_url ?? null,
          });
        }
      } catch (error) {
        console.error("Error fetching newsletter data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPopupData();
  }, []);
  console.log(popupContent);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Use URLSearchParams for form-encoded data
      const formData = new URLSearchParams();
      formData.append("u", "04a882be1679191e819450535");
      formData.append("id", "5c84056061");
      formData.append("MERGE0", email);

      // Perform background fetch to avoid redirect
      // note: mode: 'no-cors' is used because Mailchimp's post endpoint doesn't support CORS for direct fetch
      await fetch("https://enjoyescapes.us18.list-manage.com/subscribe/post", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      // Show success state
      setIsSubmitting(false);
      setIsSuccess(true);
      // Mark as subscribed and shown
      const now = new Date().getTime();
      localStorage.setItem("newsletter-subscribed", "true");
      localStorage.setItem("newsletter-popup-shown", now.toString());
    } catch (error) {
      console.error("Submission failed:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    // Mark as shown with current timestamp so it doesn't show again for 30 days
    const now = new Date().getTime();
    localStorage.setItem("newsletter-popup-shown", now.toString());
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closePopup();
    } else {
      setShowPopup(open);
    }
  };

  useEffect(() => {
    // check if user already subscribed (forever) or dismissed in last 30 days
    const isSubscribed =
      localStorage.getItem("newsletter-subscribed") === "true";
    const lastShown = localStorage.getItem("newsletter-popup-shown");

    if (isSubscribed) return;

    if (lastShown) {
      const lastShownTime = parseInt(lastShown);
      const now = new Date().getTime();

      // If less than 30 days have passed, don't show the popup
      if (now - lastShownTime < THIRTY_DAYS_MS) {
        return;
      }
    }

    // Automatically show popup after a 3 second delay
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // Only run once on mount

  // Success state
  if (isSuccess) {
    return (
      <Dialog open={showPopup} onOpenChange={handleOpenChange}>
        {showTrigger && (
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative group hover:bg-primary/10 transition-colors"
            >
              <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md bottom-4 top-auto left-[50%] translate-y-0 sm:top-[50%] sm:bottom-auto sm:translate-y-[-50%] rounded-lg [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="sr-only">
              Newsletter Subscription Success
            </DialogTitle>
          </DialogHeader>
          {/* Custom close button - more visible */}
          <div className="absolute right-3 top-3 z-20">
            <button
              onClick={closePopup}
              className="rounded-full bg-muted/80 p-2 hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center p-4 sm:p-6">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <PlaneTakeoff className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">You're in the draw!</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Thanks for subscribing! You're now entered into our giveaway and
              will receive our best travel deals.
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
      {showTrigger && (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative group hover:bg-primary/10 transition-colors"
          >
            <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg p-0 overflow-hidden bottom-4 top-auto left-[50%] translate-y-0 sm:top-[50%] sm:bottom-auto sm:translate-y-[-50%] rounded-lg [&>button]:hidden min-h-[300px]">
        <DialogHeader className="sr-only">
          <DialogTitle>Newsletter Subscription Giveaway</DialogTitle>
        </DialogHeader>

        <div className="absolute right-3 top-3 z-30">
          <button
            onClick={closePopup}
            className="rounded-full bg-black/50 p-2 hover:bg-black/70 transition-colors text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">
              Loading Giveaway...
            </p>
          </div>
        ) : (
          <>
            {/* Header - smaller on mobile, full on desktop */}
            <div className="relative h-24 sm:h-48 w-full">
              {popupContent.image_url ? (
                <Image
                  src={popupContent.image_url}
                  alt={popupContent.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                  <Gift className="h-10 w-10 text-primary/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <Gift className="h-6 w-6 sm:h-10 sm:w-10 mx-auto mb-1 sm:mb-3" />
                  <h2 className="text-xl sm:text-3xl font-bold">
                    {popupContent.title}
                  </h2>
                  {popupContent.subtitle && (
                    <p className="text-sm sm:text-2xl opacity-90 hidden sm:block">
                      {popupContent.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground text-sm sm:text-base whitespace-pre-line">
                  {popupContent.description}
                </p>
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="space-y-3 sm:space-y-4"
              >
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
                  {isSubmitting ? `${popupContent.button_text}...` : popupContent.button_text}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center">
                By subscribing, you agree to receive marketing emails.
                Unsubscribe anytime.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
