import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { DynamicIframe } from "./components/DynamicIframe";

// Build the complete URL from database params
const buildWidgetUrl = async () => {
  const supabase = await createClient();
  
  // Get the category and its embed parameters
  const { data: category } = await supabase
    .from("categories")
    .select(`
      *,
      category_embed_params (*)
    `)
    .eq("slug", "icelolly")
    .eq("is_active", true)
    .single();

  if (!category || !category.category_embed_params.length) {
    // Fallback to default configuration
    const defaultParams = new URLSearchParams({
      destination: "39677",
      departureAirport: "ABZ",
      boardBasis: "AI",
      starRating: "4,5"
    });
    return `https://supersonic-icelolly-website.pages.dev/v2/affiliate-bos?${defaultParams.toString()}`;
  }

  // Use the base_url from the first embed param (they should all have the same base_url)
  const baseUrl = category.category_embed_params[0]?.base_url || "https://supersonic-icelolly-website.pages.dev/v2/affiliate-bos";

  // Build params from database
  const params = new URLSearchParams();
  category.category_embed_params.forEach((param: any) => {
    params.append(param.param_name, param.param_value);
  });

  return `${baseUrl}?${params.toString()}`;
};

export const metadata: Metadata = {
  title: "Icelolly | Enjoy Escapes",
  description:
    "Discover the latest all inclusive holiday deals and packages. Find your perfect getaway with everything included.",
  keywords:
    "all inclusive holidays, latest deals, all inclusive packages, holiday deals, vacation packages",
  alternates: {
    canonical: "https://enjoyescapes.com/icelolly",
  },
  openGraph: {
    title: "Icelolly | Enjoy Escapes",
    description:
      "Discover the latest all inclusive holiday deals and packages. Find your perfect getaway with everything included.",
    type: "website",
    url: "https://enjoyescapes.com/icelolly",
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
    title: "Icelolly | Enjoy Escapes",
    description:
      "Discover the latest all inclusive holiday deals and packages. Find your perfect getaway with everything included.",
    images: ["https://enjoyescapes.com/logo.png"],
  },
};

export default async function LatestAllInclusivePage() {
  const widgetUrl = await buildWidgetUrl();

  return (
    <div className="w-full min-h-screen flex flex-col">
      <DynamicIframe 
        src={widgetUrl} 
        title="Latest All Inclusive Holiday Deals" 
      />
    </div>
  );
} 