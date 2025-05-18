"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Instagram, Mail, PlaneTakeoff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NewsletterFormClient() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = () => {
    if (!email || !email.includes('@')) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    
    setIsSubmitting(true);
    setErrorMessage("");
    return true;
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setIsSuccess(true);
    }
  }, []);

  if (isSuccess) {
    return (
      <div className="w-full max-w-full py-8 px-4">
        <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex justify-center mb-2">
            <PlaneTakeoff className="h-6 w-6 text-primary" />
          </div>
          <p className="font-medium text-primary">Thanks for subscribing!</p>
          <p className="text-sm text-muted-foreground mt-2">
            You're now on the list for our best travel deals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <footer className="w-full border-t border-border mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-12">
        {/* Newsletter Column */}
        <div className="md:border-r md:border-border md:pr-8">
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
              <p className="text-destructive text-sm">{errorMessage}</p>
            )}
          </form>
        </div>

        {/* Company Links Column */}
        <div className="md:px-4">
          <h3 className="text-xl font-semibold mb-4">Links</h3>
          <nav className="flex flex-col space-y-3">
            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/work-with-us" className="text-muted-foreground hover:text-primary transition-colors">
              Work with Us
            </Link>
          </nav>
          <div className="flex gap-4 mt-8">
            <a
              href="https://tiktok.com/@sabrinaescapes"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 448 512"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/sabrinaescapes"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* About Column */}
        <div className="md:border-l md:border-border md:pl-8">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="Enjoy Escapes Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-xl font-semibold">Enjoy Escapes</span>
          </div>
          <p className="text-muted-foreground">
            At EnjoyEscapes, we believe amazing holidays shouldn't come with a sky-high price tag. 
            That's why we're here to help you discover epic getaways without blowing the budget.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Enjoy Escapes. All rights reserved.</p>
      </div>
    </footer>
  );
} 