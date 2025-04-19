import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Hotel, Moon, PackageCheck, Plane, Star } from "lucide-react"; // Added Moon and Star icons

import { AspectRatio } from "@/components/ui/aspect-ratio"; // For consistent image size
import CountdownTimer from "./CountdownTimer";
import type { EscapeData } from "@/app/actions/fetchEscapes"; // Import the type
import Image from "next/image";
import Link from "next/link"; // Use next/link for internal links if needed, but <a> for external
import NewDealTag from "./NewDealTag";
import React from "react";

// Format price with unit and £ symbol
const formatPrice = (price?: number | null, unit?: string | null) => {
  if (price === null || price === undefined) return null;

  const unitDisplay = unit ? ` ${unit}` : "";
  return `£${price}${unitDisplay}`;
};

// Star Rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-accent fill-accent" />
      ))}
    </div>
  );
};

// Board Basis labels
const BOARD_BASIS_LABELS: Record<string, string> = {
  room_only: "Room Only",
  self_catering: "Self-Catering",
  bed_and_breakfast: "Bed & Breakfast",
  half_board: "Half Board",
  full_board: "Full Board",
  all_inclusive: "All Inclusive",
  ultra_all_inclusive: "Ultra All Inclusive (AI+)",
  flight_only: "Flight Only",
};

// Deal Type Tag component
const DealTypeTag = ({
  type,
}: {
  type: "hotel" | "flight" | "hotel+flight";
}) => {
  let icon = null;
  let label = "";
  let bgColor = "";

  // Define icon and label based on type
  if (type === "hotel") {
    icon = <Hotel className="h-3 w-3 mr-1" />;
    label = "Hotel";
    bgColor =
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  } else if (type === "flight") {
    icon = <Plane className="h-3 w-3 mr-1" />;
    label = "Flight";
    bgColor =
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
  } else if (type === "hotel+flight") {
    icon = <PackageCheck className="h-3 w-3 mr-1" />;
    label = "Hotel + Flight";
    bgColor =
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
    >
      {icon}
      {label}
    </span>
  );
};

interface EscapeCardProps {
  escape: EscapeData;
}

const EscapeCard: React.FC<EscapeCardProps> = ({ escape }) => {
  return (
    <a
      href={escape.link ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View details for ${escape.title}`}
      className="block w-full h-full group cursor-pointer"
    >
      <Card className="overflow-hidden border hover:shadow-md dark:hover:shadow-black/30 transition-shadow duration-200 p-0 group-hover:shadow-lg dark:group-hover:shadow-black/40 flex flex-col h-full">
        {/* Image section */}
        <div className="relative h-48 w-full">
          <Image
            src={escape.image!}
            alt={escape.title ?? "Escape deal image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
            priority={false} // Set to true for above-the-fold images if needed, false for lazy loading
          />

          {/* Tags positioned at the top-left corner of the image */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 items-start">
            {/* Custom wrapper for NewDealTag to maintain original styling */}
            {escape.validFrom && (
              <div className="inline-flex rounded-md bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-400 ring-1 ring-inset ring-orange-500/10 dark:ring-orange-500/30">
                <span>New Deal 🔥</span>
              </div>
            )}

            {/* Countdown timer with consistent styling */}
            {escape.validTo && (
              <div className="inline-flex bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded">
                <CountdownTimer validTo={escape.validTo} />
              </div>
            )}
          </div>
        </div>
        <CardContent className="relative z-10 mt-[-1.25rem] bg-white dark:bg-card rounded-tr-3xl pt-6 px-4 pb-0 flex-1">
          <div className="h-full flex flex-col">
            <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              {escape.country || "Unknown Location"}
              {escape.city ? `, ${escape.city}` : ""}
            </CardTitle>
            <div className="min-h-[1.5rem]">
              {escape.star_rating && (
                <div className="mt-1">
                  <StarRating rating={escape.star_rating} />
                </div>
              )}
            </div>
            <div className="min-h-[1.5rem]">
              {escape.board_basis && (
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <span>
                    {BOARD_BASIS_LABELS[escape.board_basis] ||
                      escape.board_basis}
                  </span>
                  {escape.type && (
                    <>
                      <span className="text-xs">•</span>
                      <span>
                        {escape.type === "hotel"
                          ? "Hotel"
                          : escape.type === "flight"
                            ? "Flight"
                            : "Hotel + Flight"}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="min-h-[1.5rem] mt-auto">
              {escape.nights && (
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <Moon className="h-4 w-4 text-accent" />
                  <span>
                    {escape.nights} {escape.nights === 1 ? "night" : "nights"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 flex flex-col items-end gap-1 bg-white dark:bg-card">
          {escape.price ? (
            <span className="whitespace-nowrap text-right">
              <span className="text-base text-muted-foreground mr-1">from</span>
              <span className="text-2xl font-bold text-accent align-middle">
                £{escape.price}
              </span>
              {escape.price_unit && (
                <span className="text-base text-muted-foreground ml-1">
                  {escape.price_unit}
                </span>
              )}
            </span>
          ) : (
            <span className="whitespace-nowrap text-right opacity-0">
              <span className="text-base text-muted-foreground mr-1">from</span>
              <span className="text-2xl font-bold text-accent align-middle">
                £0
              </span>
            </span>
          )}
          <div className="min-h-[1.75rem]">
            {escape.deposit_price && (
              <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Book for £{escape.deposit_price}
                {escape.deposit_price_unit
                  ? ` ${escape.deposit_price_unit}`
                  : ""}{" "}
                deposit
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </a>
  );
};

export default EscapeCard;
