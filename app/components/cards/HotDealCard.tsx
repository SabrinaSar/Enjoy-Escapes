import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Flame, Moon, Star } from "lucide-react";

import type { EscapeData } from "@/app/actions/fetchEscapes"; // Import the type
import Image from "next/image";
import NewDealTag from "../NewDealTag";
import React from "react";
import TrackableLink from "./TrackableLink"; // Import the TrackableLink component
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
          className="h-4 w-4 text-accent fill-accent"
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

interface HotDealCardProps {
  escape: EscapeData;
}

const HotDealCard: React.FC<HotDealCardProps> = ({ escape }) => {
  const dealType =
    escape.type === "hotel"
      ? "Hotel"
      : escape.type === "flight"
        ? "Flight"
        : escape.type === "hotel+flight"
          ? "Hotel + Flight Package"
          : "Travel Deal";

  const dealTitle = escape.title || `${dealType}`;
  const fullDescription = `${dealType}${escape.nights ? ` for ${escape.nights} nights` : ""}${escape.board_basis ? `, ${BOARD_BASIS_LABELS[escape.board_basis] || escape.board_basis}` : ""}`;

  return (
    <TrackableLink
      href={escape.link ?? "#"}
      itemId={escape.id}
      itemType="escape"
      ariaLabel={`View details for ${dealTitle} - ${fullDescription}`}
      className="block w-full h-full group cursor-pointer"
      itemScope={true}
      microDataItemType="https://schema.org/TravelAction"
    >
      {/* Hidden semantic SEO elements */}
      <meta itemProp="name" content={dealTitle} />
      <meta itemProp="description" content={fullDescription} />
      {escape.image && <meta itemProp="image" content={escape.image} />}
      {escape.price && (
        <meta itemProp="price" content={escape.price.toString()} />
      )}

      <Card className="overflow-hidden border border-accent/40 dark:border-accent/50 shadow-lg shadow-accent/30 dark:shadow-accent/20 hover:shadow-md dark:hover:shadow-black/30 transition-all duration-300 p-0 group-hover:shadow-xl dark:group-hover:shadow-black/40 flex flex-col h-full group-hover:translate-y-[-10px] group-hover:scale-[1.03] group-hover:border-accent/70 dark:group-hover:border-accent/80">
        {/* Image section */}
        <div className="relative h-40 md:h-48 w-full overflow-hidden">
          <Image
            src={escape.image!}
            alt={dealTitle}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />

          {/* Tags positioned at the top-left corner of the image */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 items-start">
            {/* Hot deal tag */}
            <div className="inline-flex rounded-md bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-orange-400/50">
              <span className="flex items-center gap-1">
                <Flame className="h-3 w-3" /> Hot Deal
              </span>
            </div>

            {/* New Deal Tag */}
            {escape.created_at && <NewDealTag created_at={escape.created_at} />}
          </div>

          {/* Hot deal indicator on the top-right corner */}
          <div className="absolute top-2 right-2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Flame className="h-5 w-5" />
          </div>
        </div>

        <CardContent className="relative z-10 mt-[-1rem] md:mt-[-1.25rem] bg-[#fefaf1] dark:bg-[#37343c] rounded-tr-3xl pt-4 md:pt-6 px-3 md:px-4 pb-0 flex-1">
          <div className="h-full flex flex-col">
            <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors duration-300">
              {dealTitle}
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
              {escape.star_rating && (
                <StarRating rating={escape.star_rating} />
              )}
              
              {escape.board_basis && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
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
              
              {escape.nights && (
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Moon className="h-4 w-4 text-accent" aria-hidden="true" />
                  <span>
                    {escape.nights} {escape.nights === 1 ? "night" : "nights"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 md:p-4 pt-1 md:pt-2 flex flex-col items-end gap-1 bg-[#fefaf1] dark:bg-[#37343c]">
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
          {escape.deposit_price !== null &&
            escape.deposit_price !== undefined && (
              <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                £{escape.deposit_price}
                {escape.deposit_price_unit
                  ? ` ${escape.deposit_price_unit}`
                  : ""}{" "}
                deposit
              </span>
            )}
        </CardFooter>
      </Card>
    </TrackableLink>
  );
};

export default HotDealCard;
