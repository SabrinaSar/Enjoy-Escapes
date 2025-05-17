"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Instagram, Mail, PlaneTakeoff } from "lucide-react";

export default function NewsletterFormClient() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // This function will just update UI state, but let the form's native action handle the actual submission
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = () => {
    // This will run right before the form submits to Mailchimp
    if (!email || !email.includes('@')) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    
    setIsSubmitting(true);
    setErrorMessage("");
    // Let the form submit naturally to Mailchimp
    return true;
  };

  // If you want to show success message after returning from Mailchimp,
  // you can check URL parameters on component mount
  React.useEffect(() => {
    // Check if the URL has a success parameter or some other indicator
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setIsSuccess(true);
    }
  }, []);

  if (isSuccess) {
    return (
      <div className="w-full max-w-xl mx-auto py-8 px-4">
        <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex justify-center mb-2">
            <PlaneTakeoff className="h-6 w-6 text-primary" />
          </div>
          <p className="font-medium text-primary">Thanks for subscribing!</p>
          <p className="text-sm text-muted-foreground mt-2">
            You're now on the list for our best travel deals.
          </p>
        </div>
        
        <div className="flex justify-center mt-8 gap-4">
          <SocialLinks />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="h-px w-12 bg-primary/30"></div>
          <Mail className="h-5 w-5 text-primary" />
          <div className="h-px w-12 bg-primary/30"></div>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Get exclusive travel deals</h3>
        <p className="text-muted-foreground text-sm">
          Join our newsletter for the best escapes, direct to your inbox.
        </p>
      </div>

      <form
        action="https://enjoyescapes.us18.list-manage.com/subscribe/post"
        method="POST"
        onSubmit={() => handleFormSubmit()}
        className="space-y-3"
      >
        <input type="hidden" name="u" value="04a882be1679191e819450535" />
        <input type="hidden" name="id" value="5c84056061" />

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            name="MERGE0"
            id="MERGE0"
            value={email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className="flex-1"
            required
            autoCapitalize="off"
            autoCorrect="off"
          />
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>

        {errorMessage && (
          <p className="text-destructive text-sm mt-2">{errorMessage}</p>
        )}
      </form>
      
      <div className="flex justify-center mt-8 gap-4">
        <SocialLinks />
      </div>
    </div>
  );
}

// Extracted social links to a separate component for reuse
function SocialLinks() {
  return (
    <>
      <a
        href="https://tiktok.com/@sabrinaescapes"
        target="_blank"
        rel="noreferrer"
        aria-label="TikTok"
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 448 512"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
          </svg>
        </Button>
      </a>
      <a
        href="https://instagram.com/sabrinaescapes"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10">
          <Instagram className="h-5 w-5" />
        </Button>
      </a>
    </>
  );
} 