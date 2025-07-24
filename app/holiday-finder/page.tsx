import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { DynamicIframe } from "./components/DynamicIframe";

// Build the complete URL from database params
const buildWidgetUrl = async () => {
  const supabase = await createClient();
  
  // Default parameters that are always included
  const defaultParams = new URLSearchParams({
    utm_source: "hc-d73673bf-1025-4875-9fb9-dc86749318cc",
    utm_medium: "holconn",
    orgId: "d73673bf-1025-4875-9fb9-dc86749318cc",
    poweredBy: "icelolly"
  });
  
  // Get the category and its embed parameters
  const { data: category } = await supabase
    .from("categories")
    .select(`
      *,
      category_embed_params (*)
    `)
    .eq("slug", "holiday-finder")
    .eq("is_active", true)
    .single();

  // Start with default base URL
  let baseUrl = "https://holidayconnect-app.icetravelgroup.com/holiday-deals";
  
  // If category exists, use its base URL and merge parameters
  if (category && category.category_embed_params.length) {
    // Use the base_url from the first embed param if available
    baseUrl = category.category_embed_params[0]?.base_url || baseUrl;
    
    // Add/override default params with database params
    category.category_embed_params.forEach((param: any) => {
      defaultParams.set(param.param_name, param.param_value);
    });
  }

  return `${baseUrl}?${defaultParams.toString()}`;
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