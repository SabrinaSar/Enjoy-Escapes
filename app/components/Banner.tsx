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
      <div className="flex flex-row h-full w-full">
        {/* Text content - adjusts width responsively */}
        <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-center w-3/4 sm:w-1/2 xl:w-1/4 space-y-2 sm:space-y-3 md:space-y-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{banner.title}</h3>
          
          {banner.description && (
            <p className="text-xs sm:text-sm md:text-base opacity-90">{banner.description}</p>
          )}
          
          {hasLink && (
            <div className="mt-2 sm:mt-3 md:mt-4">
              <TrackableLink 
                href={banner.link!} 
                itemId={banner.id} 
                itemType="banner"
                className="inline-flex px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg font-medium text-xs sm:text-sm md:text-base bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Book now
              </TrackableLink>
            </div>
          )}
        </div>
        
        {/* Image - adjusts width responsively */}
        <div className="w-1/4 sm:w-1/2 xl:w-3/4 relative flex-1 min-h-[150px]">
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 25vw, (max-width: 768px) 50vw, 75vw"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Banner; 