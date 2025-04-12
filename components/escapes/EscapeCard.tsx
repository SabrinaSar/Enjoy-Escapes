import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AspectRatio } from "@/components/ui/aspect-ratio"; // For consistent image size
import CountdownTimer from "./CountdownTimer";
import type { EscapeData } from "@/app/actions/fetchEscapes"; // Import the type
import Image from "next/image";
import Link from "next/link"; // Use next/link for internal links if needed, but <a> for external
import NewDealTag from "./NewDealTag";
import React from "react";

interface EscapeCardProps {
  escape: EscapeData;
}

const EscapeCard: React.FC<EscapeCardProps> = ({ escape }) => {
  const placeholderImage = "/placeholder-image.png"; // Add a placeholder image to your public folder

  return (
    <Card className="overflow-hidden flex flex-col h-full border hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-0">
        {/* Link wraps the image */}
        <a
          href={escape.link ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View details for ${escape.title}`}
        >
          <AspectRatio ratio={16 / 9}>
            <Image
              src={escape.image ?? placeholderImage}
              alt={escape.title ?? "Escape deal image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
              priority={false} // Set to true for above-the-fold images if needed, false for lazy loading
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.srcset = placeholderImage; // Use srcset to cover different resolutions if needed
                target.src = placeholderImage;
              }}
            />
          </AspectRatio>
        </a>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <CardTitle className="text-lg font-semibold leading-tight">
            <a
              href={escape.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {escape.title || "Untitled Escape"}
            </a>
          </CardTitle>
          {escape.price && (
            <span className="text-lg font-bold text-accent whitespace-nowrap">
              {escape.price}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {escape.country || "Unknown Location"}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <NewDealTag validFrom={escape.valid_from} />
          {/* Countdown timer might be better placed in footer or here */}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        {/* Display countdown timer if valid_to exists */}
        <CountdownTimer validTo={escape.valid_to} />
      </CardFooter>
    </Card>
  );
};

export default EscapeCard;
