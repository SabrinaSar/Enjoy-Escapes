import {
  fetchEscapes,
  getLatestEscapeTimestamp,
} from "@/app/actions/fetchEscapes";

import CategoryFilter from "@/app/components/CategoryFilter";
import EscapeGrid from "@/app/components/EscapeGrid";
import { Metadata } from "next";
import { format } from "date-fns"; // Using date-fns for formatting

export const metadata: Metadata = {
  title: "Latest Travel Deals & Escapes | Enjoy Escapes",
  description:
    "Discover curated travel deals, last-minute escapes, all-inclusive holidays, city breaks, and budget-friendly getaways from Enjoy Escapes.",
  keywords:
    "travel deals, hotel discounts, flight deals, all-inclusive holidays, last-minute travel, city breaks, budget travel, school holidays, long haul",
  alternates: {
    canonical: "https://enjoyescapes.com/",
  },
  openGraph: {
    title: "Latest Travel Deals & Escapes | Enjoy Escapes",
    description:
      "Discover curated travel deals, last-minute escapes, all-inclusive holidays, city breaks, and budget-friendly getaways.",
    type: "website",
    url: "https://enjoyescapes.com/",
    siteName: "Enjoy Escapes",
    images: [
      {
        url: "https://enjoyescapes.com/logo.png",
        width: 735,
        height: 735,
        alt: "Enjoy Escapes - Curated Travel Deals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest Travel Deals & Escapes | Enjoy Escapes",
    description:
      "Discover curated travel deals, last-minute escapes, all-inclusive holidays, city breaks, and budget-friendly getaways.",
    images: ["https://enjoyescapes.com/logo.png"],
  },
};

export default async function Home() {
  // Fetch initial data on the server
  const initialData = await fetchEscapes(1); // Fetch first page
  const latestTimestamp = await getLatestEscapeTimestamp();

  const formattedTimestamp = latestTimestamp
    ? format(new Date(latestTimestamp), "PPPp") // Format: Sep 21, 2023, 4:30 PM
    : "Not available";

  // Generate structured data for search engines
  const escapeListData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialData.escapes.map((escape, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TravelAction",
        name: escape.title,
        description: escape.title || "Travel escape",
        image: escape.image,
        url: escape.link,
        priceSpecification: {
          "@type": "PriceSpecification",
          price: escape.price,
          priceCurrency: "GBP",
        },
        destination: {
          "@type": "Place",
          name: escape.title ? escape.title.split(" - ").pop() : "Destination",
          address: {
            "@type": "PostalAddress",
            addressCountry: escape.title
              ? escape.title.split(" - ").pop()
              : "Destination",
          },
        },
      },
    })),
  };

  // Add website organization data for better branding in search
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Enjoy Escapes",
    url: "https://enjoyescapes.com/",
    logo: "https://enjoyescapes.com/logo.png",
    description:
      "Curated travel deals and escapes for budget-friendly holidays, flights, and hotels.",
    sameAs: [
      "https://tiktok.com/@sabrinaescapes",
      "https://instagram.com/sabrinaescapes",
    ],
  };

  // Add structured data for breadcrumbs for better navigation in search results
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://enjoyescapes.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Latest Escapes",
        item: "https://enjoyescapes.com/",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(escapeListData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="container mx-auto px-4 py-3">
        {/* Category Filters */}
        <div className="mb-3">
          <CategoryFilter />
        </div>

        {/* Last Updated Info */}
        <div className="mb-2 text-sm text-muted-foreground text-center md:text-right">
          Last updated: {formattedTimestamp}
        </div>

        {/* Escape Grid */}
        {initialData.error ? (
          <div className="text-center text-red-600 dark:text-red-400">
            <p>Could not load initial escape deals:</p>
            <p>{initialData.error}</p>
          </div>
        ) : (
          <EscapeGrid
            initialEscapes={initialData.escapes}
            initialHasMore={initialData.hasMore}
          />
        )}
      </div>
    </>
  );
}
