import AuthButton from "@/components/header-auth";
import Image from "next/image";
import Link from "next/link";
import NavbarSearchForm from "@/app/components/NavbarSearchForm";
import { Suspense } from "react";
import { staticAssets } from "@/lib/static-assets";
// import NewsletterPopup from "@/components/newsletter-popup";

export default function Navbar() {
  // Using cookies.get to retrieve the search query from headers is not reliable
  // Instead, we'll let the NavbarSearchForm component handle the search parameter client-side

  return (
    <div>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <Link href={"/"} className="flex items-center gap-2 font-semibold">
            <Image
              src={staticAssets.logo}
              alt="Enjoy Escapes Logo"
              width={40}
              height={40}
              className="h-8 w-auto"
            />
            <span className="hidden sm:inline text-2xl">Enjoy Escapes</span>
          </Link>

          {/* Search bar - expanded on mobile */}
          <div className="flex-grow mx-1 sm:mx-4 max-w-full">
            <Suspense
              fallback={
                <div className="relative w-full">
                  <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-8 w-full"
                    placeholder="Search escapes..."
                  />
                </div>
              }
            >
              <NavbarSearchForm />
            </Suspense>
          </div>

          {/* Auth button (dropdown menu on mobile, normal buttons on desktop) */}
          <div className="ml-1 sm:ml-0 flex items-center gap-2">
            {/* <NewsletterPopup /> */}
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Promotional banner */}
      <div className="w-full bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground py-3 px-4 flex justify-center items-center text-sm font-medium shadow-md relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

        <div className="max-w-5xl w-full flex items-center justify-center gap-3 relative z-10">
          <span className="hidden sm:inline text-lg">✈️</span>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            <p className="text-center">
              <span className="font-bold text-white">
                Book with as low as £0 deposit
              </span>
              <span className="mx-2 text-accent">|</span>
              <span className="text-accent font-semibold hover:text-sunglow transition-colors duration-200 cursor-pointer">
                Book now pay later
              </span>
            </p>
            <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          </div>
          <span
            className="hidden sm:inline text-lg"
            style={{ animationDelay: "0.5s" }}
          >
            💳
          </span>
        </div>
      </div>
    </div>
  );
}
