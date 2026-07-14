import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WhatsAppBanner({ className, variant = 'default' }: { className?: string, variant?: 'default' | 'sidebar' }) {
  return (
    <a 
      href="https://chat.whatsapp.com/EZHm6YGae3cLBgyoHoAVoB"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center justify-between overflow-hidden rounded-xl border border-green-200 bg-green-50 shadow-sm transition-all hover:shadow-md hover:border-green-300",
        variant === 'sidebar' ? "flex-col p-6 text-center gap-5" : "p-4 sm:p-6 sm:flex-row gap-4",
        className
      )}
    >
      <div className={cn("flex items-center gap-4", variant === 'sidebar' && "flex-col")}>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
        </div>
        <div className={cn(variant === 'sidebar' && "text-center")}>
          <h3 className="font-bold text-green-900 text-base sm:text-lg font-heading">Join our WhatsApp Community</h3>
          <p className="text-sm text-green-800 mt-1 font-sans">Get instant scholarship alerts directly to your phone.</p>
        </div>
      </div>
      <div className="shrink-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors group-hover:bg-green-700 uppercase tracking-wider">
          Join Now <ExternalLink className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}
