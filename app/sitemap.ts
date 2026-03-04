import { MetadataRoute } from "next";
import { fetchEscapes } from "@/app/actions/fetchEscapes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the production URL
  const baseUrl = "https://enjoyescapes.com";

  // Updated categories based on fetchEscapes function filters
  const categories = [
    "all-inclusive",
    "deals-under-300",
    "school-holidays",
    "last-minute",
    "long-haul",
  ];

  // Fetch some escapes to include individual pages (if they exist)
  const escapesData = await fetchEscapes(1);

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ];

  // Add category pages with appropriate priorities
  const categoryRoutes = categories.map((category) => {
    // Set different priorities based on category importance
    let priority = 0.8;
    if (category === "all-inclusive") {
      priority = 0.9; // Higher priority for most popular categories
    } else if (category === "deals-under-300" || category === "last-minute") {
      priority = 0.85; // Medium-high priority for time-sensitive deals
    }

    return {
      url: `${baseUrl}?category=${category}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority,
    };
  });

  // If you have individual escape detail pages, you can add them here
  // const escapeRoutes = escapesData.escapes.map(escape => ({
  //   url: `${baseUrl}/escape/${escape.id}`,
  //   lastModified: new Date(escape.created_at),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }));

  return [
    ...routes,
    ...categoryRoutes,
    // ...escapeRoutes, // Uncomment if you have individual escape pages
  ];
}
