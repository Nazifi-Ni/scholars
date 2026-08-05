import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WhatsAppBanner({ className, variant = 'default' }: { className?: string, variant?: 'default' | 'sidebar' }) {
  return (
    <a 
      href="https://chat.whatsapp.com/EZHm6YGae3cLBgyoHoAVoB"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex items-center justify-between overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(37,211,102,0.6)] hover:-translate-y-1",
        "bg-gradient-to-br from-[#128C7E] via-[#075E54] to-[#043d36] text-white border border-[#25D366]/20",
        variant === 'sidebar' ? "flex-col p-6 text-center gap-6" : "p-5 sm:p-8 flex-col sm:flex-row gap-5",
        className
      )}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-[#25D366] opacity-20 mix-blend-screen blur-2xl transition-transform duration-1000 group-hover:scale-150"></div>
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 h-32 w-32 rounded-full bg-[#25D366] opacity-10 mix-blend-screen blur-xl transition-transform duration-1000 group-hover:scale-150"></div>

      <div className={cn("relative z-10 flex items-center gap-5", variant === 'sidebar' && "flex-col")}>
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-[#25D366] shadow-inner group-hover:scale-110 transition-transform duration-500 border border-white/10">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#25D366]/30 animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md">
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>
          </svg>
        </div>
        <div className={cn(variant === 'sidebar' && "text-center")}>
          <h3 className="font-bold text-white text-xl sm:text-2xl font-heading tracking-tight mb-1">
            Join Our WhatsApp Community
          </h3>
          <p className="text-sm sm:text-[15px] text-white/80 font-sans font-medium leading-relaxed">
            Get instant scholarship alerts directly to your phone. Never miss a deadline!
          </p>
        </div>
      </div>

      <div className="relative z-10 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
        <span className="flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-[#075E54] shadow-[0_4px_14px_0_rgba(255,255,255,0.2)] transition-all duration-300 group-hover:bg-[#E8F6F3] group-hover:shadow-[0_6px_20px_0_rgba(255,255,255,0.3)] uppercase tracking-wider w-full sm:w-auto">
          Join Now 
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </a>
  );
}
