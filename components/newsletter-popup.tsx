"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { Mail, X, Gift, PlaneTakeoff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import Image from "next/image";

export default function NewsletterPopup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

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
    // Mark as shown with current timestamp so it doesn't show again for 24 hours
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
    // Check if popup has been shown in the last 24 hours
    const lastShown = localStorage.getItem('newsletter-popup-shown');
    
    if (lastShown) {
      const lastShownTime = parseInt(lastShown);
      const now = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      // If less than 24 hours have passed, don't show the popup
      if (now - lastShownTime < twentyFourHours) {
        return;
      }
    }
    
    // Show popup after 15 seconds if 24 hours have passed or it's never been shown
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  // Success state
  if (isSuccess) {
    return (
      <Dialog open={showPopup} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Newsletter Subscription Success</DialogTitle>
          </DialogHeader>
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <PlaneTakeoff className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">You're in the draw! 🎉</h3>
            <p className="text-muted-foreground mb-4">
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
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Newsletter Subscription Giveaway</DialogTitle>
        </DialogHeader>
        {/* Eye-catching header image */}
        <div className="relative h-48 w-full">
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
              <Gift className="h-10 w-10 mx-auto mb-3" />
              <h2 className="text-3xl font-bold mb-2">Win £100!</h2>
              <p className="text-2xl opacity-90">Limited Time Giveaway</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter and you'll be automatically entered to win £100. Plus get exclusive travel deals delivered to your inbox!
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
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
            By subscribing, you agree to receive marketing emails. You can unsubscribe at any time.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 