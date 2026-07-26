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
    const targetLink = linkUrl || "https://omg10.com/4/11424429";
    return (
      <div className={cn("overflow-hidden rounded-xl border border-border bg-card text-left relative group shadow-sm hover:shadow-md transition-all duration-300", className)}>
        <span className="absolute top-0 right-0 bg-navy text-white text-[10px] px-2.5 py-0.5 rounded-bl-lg rounded-tr-xl uppercase tracking-wider z-10 font-bold shadow-sm">
          Sponsored Offer
        </span>
        {imageUrl ? (
          <a href={targetLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <img src={imageUrl} alt={altText} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          </a>
        ) : (
          <a
            href={targetLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "block w-full transition-all duration-300 p-6 relative overflow-hidden",
              variant === 'sidebar'
                ? "min-h-[250px] flex flex-col justify-between bg-gradient-to-br from-navy/5 via-secondary/5 to-primary/5"
                : "bg-gradient-to-r from-navy/5 via-card to-secondary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            )}
          >
            <div className="space-y-2 max-w-xl pr-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/20 px-3 py-0.5 text-xs font-bold text-navy">
                ✨ Special Student Benefit
              </div>
              <h4 className="font-extrabold text-navy text-lg md:text-xl font-heading group-hover:text-primary transition-colors">
                Global Student Opportunities & Tech Perks 2026
              </h4>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                Discover exclusive grants, discounted learning tools, and career readiness programs available for African students.
              </p>
            </div>
            <div className={cn("shrink-0", variant === 'sidebar' ? "mt-4 w-full" : "")}>
              <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white shadow-md group-hover:bg-secondary group-hover:text-navy transition-all w-full sm:w-auto">
                Explore Now →
              </span>
            </div>
          </a>
        )}
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
