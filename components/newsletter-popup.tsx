"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { Mail, X, Gift, PlaneTakeoff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

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
      // Mark as shown in session storage
      sessionStorage.setItem('newsletter-popup-shown', 'true');
    }, 1000);
  };

  const closePopup = () => {
    setShowPopup(false);
    // Mark as shown in session storage so it doesn't show again this session
    sessionStorage.setItem('newsletter-popup-shown', 'true');
  };

  useEffect(() => {
    // Check if popup has already been shown this session
    const hasBeenShown = sessionStorage.getItem('newsletter-popup-shown');
    
    if (!hasBeenShown) {
      // Show popup after 15 seconds
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Success state
  if (isSuccess) {
    return (
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-md">
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
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <Gift className="h-5 w-5 text-primary" />
            Win £100 Travel Voucher!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="bg-primary/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground">
                🎁 <strong>Limited Time Giveaway!</strong> Subscribe to our newsletter and you'll be automatically entered to win a £100 travel voucher. Plus get exclusive deals delivered to your inbox!
              </p>
            </div>
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