"use client";

import { usePathname } from "next/navigation";

export default function PromotionalBanner() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return (
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
  );
}
