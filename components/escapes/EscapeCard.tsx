import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Hotel, PackageCheck, Plane } from "lucide-react"; // Import icons for deal types

import { AspectRatio } from "@/components/ui/aspect-ratio"; // For consistent image size
import CountdownTimer from "./CountdownTimer";
import type { EscapeData } from "@/app/actions/fetchEscapes"; // Import the type
import Image from "next/image";
import Link from "next/link"; // Use next/link for internal links if needed, but <a> for external
import NewDealTag from "./NewDealTag";
import React from "react";

// Tag component for displaying individual tags
const Tag = ({ text }: { text: string }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
    {text}
  </span>
);

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
            {escape.price && (
              <span className="text-lg font-bold text-accent whitespace-nowrap">
                {escape.price}
              </span>
            )}
          </div>
          {escape.subtitle && <p className="text-sm mb-2">{escape.subtitle}</p>}
          <p className="text-sm text-muted-foreground mb-3">
            {escape.country || "Unknown Location"}
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            {escape.type && <DealTypeTag type={escape.type} />}
            <NewDealTag validFrom={escape.validFrom} />
          </div>

          {/* Display tags if available */}
          {escape.tags && escape.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {escape.tags.map((tag, index) => (
                <Tag key={index} text={tag} />
              ))}
            </div>
          )}
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
