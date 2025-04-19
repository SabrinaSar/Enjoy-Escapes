import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Hotel, Moon, PackageCheck, Plane, Star } from "lucide-react"; // Added Moon and Star icons

import { AspectRatio } from "@/components/ui/aspect-ratio"; // For consistent image size
import CountdownTimer from "./CountdownTimer";
import type { EscapeData } from "@/app/actions/fetchEscapes"; // Import the type
import Image from "next/image";
import Link from "next/link"; // Use next/link for internal links if needed, but <a> for external
import NewDealTag from "./NewDealTag";
import React from "react";

// Format price with unit
const formatPrice = (price?: string | null, unit?: string | null) => {
  if (!price) return null;

  const unitDisplay = unit ? ` ${unit}` : "";
  return `${price}${unitDisplay}`;
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
    bgColor = "bg-blue-100 text-blue-800";
  } else if (type === "flight") {
    icon = <Plane className="h-3 w-3 mr-1" />;
    label = "Flight";
    bgColor = "bg-purple-100 text-purple-800";
  } else if (type === "hotel+flight") {
    icon = <PackageCheck className="h-3 w-3 mr-1" />;
    label = "Hotel + Flight";
    bgColor = "bg-green-100 text-green-800";
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
      <Card className="overflow-hidden border hover:shadow-md transition-shadow duration-200 p-0 group-hover:shadow-lg">
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
        </div>
        <CardContent className="pt-4 px-4 pb-0">
          <div>
            <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              {escape.country || "Unknown Location"}
              {escape.city ? `, ${escape.city}` : ""}
            </CardTitle>
            {escape.star_rating && (
              <div className="mt-1">
                <StarRating rating={escape.star_rating} />
              </div>
            )}
            {escape.board_basis && (
              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <span>
                  {BOARD_BASIS_LABELS[escape.board_basis] || escape.board_basis}
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
            {escape.nights && (
              <div className="text-sm text-muted-foreground mt-1">
                {escape.nights} {escape.nights === 1 ? "night" : "nights"}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <NewDealTag validFrom={escape.validFrom} />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col items-end gap-1">
          {escape.price && (
            <span className="whitespace-nowrap text-right">
              <span className="text-base text-muted-foreground mr-1">from</span>
              <span className="text-2xl font-bold text-accent align-middle">
                {escape.price}
              </span>
              {escape.price_unit && (
                <span className="text-base text-muted-foreground ml-1">
                  {escape.price_unit}
                </span>
              )}
            </span>
          )}
          {escape.deposit_price && (
            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mt-1">
              Book for {escape.deposit_price}
              {escape.deposit_price_unit
                ? `${escape.deposit_price_unit}`
                : ""}{" "}
              deposit
            </span>
          )}
          {/* Display countdown timer if valid_to exists */}
          <CountdownTimer validTo={escape.validTo} />
        </CardFooter>
      </Card>
    </a>
  );
};

export default EscapeCard;
