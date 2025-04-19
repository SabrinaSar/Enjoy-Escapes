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
        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
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
      <Card className="overflow-hidden flex flex-col h-full border hover:shadow-md transition-shadow duration-200 p-0 group-hover:shadow-lg">
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
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-2 mb-2">
            <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              {escape.title || "Untitled Escape"}
            </CardTitle>
            <div className="text-right">
              {escape.price && (
                <span className="text-lg font-bold text-accent whitespace-nowrap">
                  {escape.price}
                  {escape.price_unit ? ` ${escape.price_unit}` : ""}
                </span>
              )}
              {escape.deposit_price && (
                <div className="text-xs text-muted-foreground">
                  Deposit: {escape.deposit_price}
                  {escape.deposit_price_unit
                    ? ` ${escape.deposit_price_unit}`
                    : ""}
                </div>
              )}
            </div>
          </div>
          {escape.subtitle && <p className="text-sm mb-2">{escape.subtitle}</p>}

          <div className="text-sm text-muted-foreground mb-3 flex flex-wrap items-center gap-1">
            <span>{escape.country || "Unknown Location"}</span>
            {escape.city && (
              <>
                <span className="text-xs">•</span>
                <span>{escape.city}</span>
              </>
            )}
          </div>

          {escape.star_rating && (
            <div className="mb-2">
              <StarRating rating={escape.star_rating} />
            </div>
          )}

          <div className="flex flex-wrap gap-2 items-center mb-2">
            {escape.type && <DealTypeTag type={escape.type} />}
            <NewDealTag validFrom={escape.validFrom} />

            {escape.nights && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <Moon className="h-3 w-3 mr-1" />
                {escape.nights} {escape.nights === 1 ? "night" : "nights"}
              </span>
            )}

            {escape.board_basis && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {BOARD_BASIS_LABELS[escape.board_basis] || escape.board_basis}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
          {/* Display countdown timer if valid_to exists */}
          <CountdownTimer validTo={escape.validTo} />
        </CardFooter>
      </Card>
    </a>
  );
};

export default EscapeCard;
