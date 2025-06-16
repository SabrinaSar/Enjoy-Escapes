import { Metadata } from "next";
import Script from "next/script";

// Configuration for the holiday widget
const HOLIDAY_WIDGET_CONFIG = {
  baseUrl: "https://supersonic-icelolly-website.pages.dev/v2/affiliate-bos",
  params: {
    destination: "39677",
    departureAirport: "ABZ",
    boardBasis: "AI",
    starRating: "4,5"
  }
};

// Build the complete URL
const buildWidgetUrl = () => {
  const params = new URLSearchParams(HOLIDAY_WIDGET_CONFIG.params);
  return `${HOLIDAY_WIDGET_CONFIG.baseUrl}?${params.toString()}`;
};

export const metadata: Metadata = {
  title: "Latest All Inclusive Holidays | Enjoy Escapes",
  description:
    "Discover the latest all inclusive holiday deals and packages. Find your perfect getaway with everything included.",
  keywords:
    "all inclusive holidays, latest deals, all inclusive packages, holiday deals, vacation packages",
  alternates: {
    canonical: "https://enjoyescapes.com/latest-all-inclusive",
  },
  openGraph: {
    title: "Latest All Inclusive Holidays | Enjoy Escapes",
    description:
      "Discover the latest all inclusive holiday deals and packages. Find your perfect getaway with everything included.",
    type: "website",
    url: "https://enjoyescapes.com/latest-all-inclusive",
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
    title: "Latest All Inclusive Holidays | Enjoy Escapes",
    description:
      "Discover the latest all inclusive holiday deals and packages. Find your perfect getaway with everything included.",
    images: ["https://enjoyescapes.com/logo.png"],
  },
};

export default function LatestAllInclusivePage() {
  const widgetUrl = buildWidgetUrl();

  return (
    <>
      <div className="w-full min-h-screen flex flex-col">
        {/* Page Header */}
        <div className="container mx-auto px-4 py-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Latest All Inclusive Holidays
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover amazing all inclusive holiday deals with everything included - 
            flights, accommodation, meals, and entertainment all in one package.
          </p>
        </div>

        {/* Holiday Connect Widget - Full Height */}
        <div className="flex-1 w-full mx-4 mb-4 rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
          <iframe
            style={{ 
              border: 0, 
              width: "100%", 
              height: "100%",
              minHeight: "600px",
              display: "block"
            }}
            id="holiday-connect-7408bd27"
            src={widgetUrl}
            title="Latest All Inclusive Holiday Deals"
          />
        </div>
      </div>

      {/* Simple script to dynamically set iframe height */}
      <Script
        id="dynamic-iframe-height"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function setIframeHeight() {
              const iframe = document.getElementById('holiday-connect-7408bd27');
              if (iframe) {
                const headerHeight = 180; // Account for header and padding
                const newHeight = Math.max(window.innerHeight - headerHeight, 600);
                iframe.style.height = newHeight + 'px';
                console.log('Iframe height set to:', newHeight + 'px');
              }
            }
            
            // Set height when page loads
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', setIframeHeight);
            } else {
              setIframeHeight();
            }
            
            // Update height when window is resized
            window.addEventListener('resize', setIframeHeight);
          `
        }}
      />
    </>
  );
} 