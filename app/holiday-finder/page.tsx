import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import IframeRenderer from "@/app/components/IframeRenderer";

// Get the iframe embed code from the database
const getIframeEmbedCode = async () => {
  const supabase = await createClient();
  
  // Get the category and its iframe embed code
  const { data: category } = await supabase
    .from("categories")
    .select("iframe_embed_code")
    .eq("slug", "holiday-finder")
    .eq("is_active", true)
    .single();

  return category?.iframe_embed_code || null;
};

export const metadata: Metadata = {
  title: "Holiday Finder | Enjoy Escapes",
  description:
    "Discover the latest all inclusive holiday deals and packages. Find your perfect getaway with everything included.",
  keywords:
    "all inclusive holidays, latest deals, all inclusive packages, holiday deals, vacation packages",
  alternates: {
    canonical: "https://enjoyescapes.com/holiday-finder",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Holiday Finder | Enjoy Escapes",
    description:
      "Discover the latest all inclusive holiday deals and packages. Find your perfect getaway with everything included.",
    type: "website",
    url: "https://enjoyescapes.com/holiday-finder",
    siteName: "Enjoy Escapes",
    images: [
      {
        url: "https://enjoyescapes.com/logo.png",
        width: 735,
        height: 735,
        alt: "Enjoy Escapes - Latest All Inclusive Holidays",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Holiday Finder | Enjoy Escapes",
    description:
      "Discover the latest all inclusive holiday deals and packages. Find your perfect getaway with everything included.",
    images: ["https://enjoyescapes.com/logo.png"],
  },
};

export default async function LatestAllInclusivePage() {
  const iframeEmbedCode = await getIframeEmbedCode();

  if (!iframeEmbedCode) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <p className="text-center text-muted-foreground">
          No holiday finder widget configured. Please contact the administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <IframeRenderer embedCode={iframeEmbedCode} />
    </div>
  );
} 