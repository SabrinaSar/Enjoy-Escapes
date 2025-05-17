import Image from "next/image";
import { BannerData } from "../actions/fetchBanners";
import TrackableLink from "./cards/TrackableLink";
import { cn } from "@/lib/utils";

interface BannerProps {
  banner: BannerData;
  className?: string;
}

const Banner = ({ banner, className }: BannerProps) => {
  // Check if link exists and format it
  const hasLink = banner.link && banner.link.trim() !== "";

  // Set inline styles for colors
  const bannerStyles = {
    backgroundColor: banner.background_color || "#FFFFFF",
    color: banner.text_color || "#000000",
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg shadow-md w-full",
        className
      )}
      style={bannerStyles}
    >
      {/* Content container with flex layout */}
      <div className="flex flex-col md:flex-row h-full w-full">
        {/* Text content - left side on desktop, top on mobile */}
        <div className="p-6 md:p-8 flex flex-col justify-center md:w-1/4 space-y-4">
          <h3 className="text-xl md:text-2xl font-bold">{banner.title}</h3>
          
          {banner.description && (
            <p className="text-sm md:text-base opacity-90">{banner.description}</p>
          )}
          
          {hasLink && (
            <div className="mt-4">
              <TrackableLink 
                href={banner.link!} 
                itemId={banner.id} 
                itemType="banner"
                className="inline-flex px-5 py-2.5 rounded-lg font-medium text-sm md:text-base bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Book now
              </TrackableLink>
            </div>
          )}
        </div>
        
        {/* Image - right side on desktop, bottom on mobile */}
        <div className="md:w-3/4 h-[200px] md:h-[300px] relative">
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Banner; 