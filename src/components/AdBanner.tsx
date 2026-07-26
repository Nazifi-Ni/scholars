import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface AdBannerProps {
  className?: string;
  variant?: 'sidebar' | 'horizontal';
  type?: 'adsense' | 'custom';
  // AdSense props
  adClient?: string;
  adSlot?: string;
  // Custom Ad props
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
}

export function AdBanner({ 
  className, 
  variant = 'horizontal', 
  type = 'custom',
  adClient,
  adSlot,
  imageUrl,
  linkUrl,
  altText = "Advertisement"
}: AdBannerProps) {
  
  useEffect(() => {
    if (type === 'adsense') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [type]);

  if (type === 'custom') {
    if (!imageUrl) {
      return null;
    }
    return (
      <div className={cn("overflow-hidden rounded-xl border border-border bg-card text-left relative group shadow-sm hover:shadow-md transition-all duration-300", className)}>
        <span className="absolute top-0 right-0 bg-white/90 text-muted-foreground text-[10px] px-2 py-0.5 rounded-bl-lg rounded-tr-xl uppercase tracking-wider z-10 font-bold shadow-sm">
          Advertisement
        </span>
        <a href={linkUrl || "#"} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
          <img src={imageUrl} alt={altText} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        </a>
      </div>
    );
  }

  // AdSense Implementation
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-muted/10 text-center relative", className)}>
      <span className="absolute top-0 right-0 bg-white/90 text-muted-foreground text-[10px] px-2 py-0.5 rounded-bl-lg rounded-tr-xl uppercase tracking-wider z-10 font-bold shadow-sm">Advertisement</span>
      <div className="p-2">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
