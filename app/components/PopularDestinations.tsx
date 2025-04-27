"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Compass } from "lucide-react";

// Destinations data
const destinations = [
  {
    name: "Greece",
    image: "/destinations/greece.jpg",
    query: "Greece",
  },
  {
    name: "Dubai",
    image: "/destinations/dubai.jpg",
    query: "Dubai",
  },
  {
    name: "Turkey",
    image: "/destinations/turkey.jpg",
    query: "Turkey",
  },
  {
    name: "Egypt",
    image: "/destinations/egypt.jpg",
    query: "Egypt",
  },
];

export default function PopularDestinations() {
  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-3">
        <Compass className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-xl font-bold text-center">Popular Destinations</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {destinations.map((destination) => (
          <Link
            key={destination.name}
            href={`/search?q=${encodeURIComponent(destination.query)}`}
            className="block h-full group cursor-pointer"
          >
            <Card className="overflow-hidden border hover:shadow-md dark:hover:shadow-black/30 transition-all duration-300 p-0 h-full group-hover:translate-y-[-8px] group-hover:scale-[1.02] group-hover:shadow-lg dark:group-hover:shadow-black/40">
              <div className="relative h-40 w-full overflow-hidden">
                {/* Use a placeholder color until the image loads */}
                <div className="absolute inset-0 bg-muted" />
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 group-hover:from-black/70 transition-all z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white font-semibold text-lg z-20">
                  {destination.name}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 