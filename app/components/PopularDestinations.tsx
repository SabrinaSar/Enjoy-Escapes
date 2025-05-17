"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Compass } from "lucide-react";

// Destinations data with descriptions
const destinations = [
  {
    name: "Greece",
    image: "/destinations/greece.jpg",
    query: "Greece",
    description: "Steeped in history and blessed with golden beaches, Greece offers visitors the perfect blend of ancient culture, delicious cuisine, and breathtaking landscapes. It’s no wonder Greek holidays remain an enduring favourite among travellers.",
  },
  {
    name: "Dubai",
    image: "/destinations/dubai.jpg",
    query: "Dubai",
    description: "With its dazzling skyscrapers, luxury shopping, and year-round sunshine, Dubai effortlessly blends opulence with adventure. Whether you're seeking relaxation or excitement, holidays to Dubai promise something extraordinary.",
  },
  {
    name: "Turkey",
    image: "/destinations/turkey.jpg",
    query: "Turkey",
    description: "Rich in heritage, vibrant bazaars, and stunning coastlines, Turkey captivates visitors with its unique East-meets-West charm. It's clear why holidays here continue to draw travellers eager for both culture and sunshine.",
  },
  {
    name: "Egypt",
    image: "/destinations/egypt.jpg",
    query: "Egypt",
    description: "Home to iconic ancient landmarks, vibrant markets, and the crystal-clear waters of the Red Sea, Egypt seamlessly combines historical wonders with beachside relaxation. Holidays to Egypt are a timeless choice for sun-seekers and explorers alike.",
  },
];

export default function PopularDestinations() {
  return (
    <div className="py-8 bg-muted/30 rounded-lg">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Compass className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-xl font-bold text-center">Popular Destinations</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
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
              <div className="p-3 bg-white dark:bg-card">
                <p className="text-sm text-muted-foreground">
                  {destination.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 