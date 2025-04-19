import { MetadataRoute } from "next";
import { fetchEscapes } from "@/app/actions/fetchEscapes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the production URL
  const baseUrl = "https://enjoyescapes.com";

  // Fetch all available categories
  const categories = [
    "holidays",
    "all-inclusive",
    "last-minute",
    "breaks-under-100",
    "city-breaks",
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
  ];

  // Add category pages
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}?category=${category}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

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
