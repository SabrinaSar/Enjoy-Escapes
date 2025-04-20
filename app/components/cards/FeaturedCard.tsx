import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Moon, Star } from "lucide-react";

import CountdownTimer from "../CountdownTimer";
import type { EscapeData } from "@/app/actions/fetchEscapes"; // Import the type
import Image from "next/image";
import NewDealTag from "../NewDealTag";
import React from "react";
import { cn } from "@/lib/utils";

// Board Basis labels
const BOARD_BASIS_LABELS: Record<string, string> = {
  room_only: "Room Only",
  self_catering: "Self-Catering",
  bed_and_breakfast: "Bed & Breakfast",
  half_board: "Half Board",
  full_board: "Full Board",
  all_inclusive: "All Inclusive",
  ultra_all_inclusive: "Ultra All Inclusive",
  flight_only: "Flight Only",
};

// Star Rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center" aria-label={`${rating} star rating`}>
      {[...Array(rating)].map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 text-blue-500 fill-blue-500"
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

interface FeaturedCardProps {
  escape: EscapeData;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ escape }) => {
  const location = `${escape.city ? `${escape.city}, ` : ""}${escape.country || "Unknown Location"}`;
  const dealType =
    escape.type === "hotel"
      ? "Hotel"
      : escape.type === "flight"
        ? "Flight"
        : escape.type === "hotel+flight"
          ? "Hotel + Flight Package"
          : "Travel Deal";

  const dealTitle = escape.title || `${dealType} in ${location}`;
  const fullDescription = escape.subtitle
    ? escape.subtitle
    : `${dealType} in ${location}${escape.nights ? ` for ${escape.nights} nights` : ""}${escape.board_basis ? `, ${BOARD_BASIS_LABELS[escape.board_basis] || escape.board_basis}` : ""}`;

  return (
    <a
      href={escape.link ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View details for ${dealTitle} - ${fullDescription}`}
      className="block w-full h-full group cursor-pointer"
      itemScope
      itemType="https://schema.org/TravelAction"
    >
      {/* Hidden semantic SEO elements */}
      <meta itemProp="name" content={dealTitle} />
      <meta itemProp="description" content={fullDescription} />
      {escape.image && <meta itemProp="image" content={escape.image} />}
      {escape.price && (
        <meta itemProp="price" content={escape.price.toString()} />
      )}
      {escape.country && (
        <meta itemProp="addressCountry" content={escape.country} />
      )}

      <Card className="overflow-hidden border border-blue-300/50 dark:border-blue-500/40 hover:shadow-md dark:hover:shadow-black/30 transition-shadow duration-200 p-0 group-hover:shadow-lg dark:group-hover:shadow-black/40 flex flex-col h-full">
        {/* Image section */}
        <div className="relative h-48 w-full">
          <Image
            src={escape.image!}
            alt={dealTitle}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />

          {/* Tags positioned at the top-left corner of the image */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 items-start">
            {/* Featured tag */}
            <div className="inline-flex rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-blue-400/50">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-white" /> Featured
              </span>
            </div>

            {/* New Deal Tag */}
            {escape.created_at && <NewDealTag created_at={escape.created_at} />}

            {/* Countdown timer */}
            {escape.validTo && <CountdownTimer validTo={escape.validTo} />}
          </div>
        </div>

        <CardContent className="relative z-10 mt-[-1.25rem] bg-blue-50 dark:bg-blue-900/20 rounded-tr-3xl pt-6 px-4 pb-0 flex-1">
          <div className="h-full flex flex-col">
            <CardTitle className="text-lg font-semibold leading-tight group-hover:text-blue-600 transition-colors">
              {dealTitle}
            </CardTitle>
            <div className="min-h-[1.5rem]">
              {escape.star_rating && (
                <div className="mt-1">
                  <StarRating rating={escape.star_rating} />
                </div>
              )}
            </div>
            <div className="min-h-[1.5rem]">
              {(escape.country || escape.city) && (
                <div className="text-sm text-muted-foreground mt-1">
                  {location}
                </div>
              )}
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
                  <Moon className="h-4 w-4 text-blue-500" aria-hidden="true" />
                  <span>
                    {escape.nights} {escape.nights === 1 ? "night" : "nights"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 flex flex-col items-end gap-1 bg-blue-50 dark:bg-blue-900/20">
          {escape.price ? (
            <span className="whitespace-nowrap text-right">
              <span className="text-base text-muted-foreground mr-1">from</span>
              <span className="text-2xl font-bold text-blue-600 align-middle">
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
              <span className="text-2xl font-bold text-blue-600 align-middle">
                £0
              </span>
            </span>
          )}
          <div className="min-h-[1.75rem]">
            {escape.deposit_price !== null &&
              escape.deposit_price !== undefined && (
                <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
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

export default FeaturedCard;
