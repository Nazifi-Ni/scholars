import * as React from "react";
import { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  buildWhatsAppShareMessage,
  openWhatsAppShare,
  copyOpportunityUrl,
  shareViaNativeDevice,
  trackOpportunityShare,
  DEFAULT_WHATSAPP_COMMUNITY_URL,
  type OpportunityShareData,
} from "@/lib/share-utils";

interface ShareOpportunityModalProps {
  opportunity: OpportunityShareData;
  whatsappCommunityUrl?: string;
  trigger?: React.ReactNode;
  className?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost";
  buttonText?: string;
  showIconOnly?: boolean;
}

export function ShareOpportunityModal({
  opportunity,
  whatsappCommunityUrl = DEFAULT_WHATSAPP_COMMUNITY_URL,
  trigger,
  className,
  buttonVariant = "outline",
  buttonText,
  showIconOnly = false,
}: ShareOpportunityModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const supportsNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const message = React.useMemo(
    () => buildWhatsAppShareMessage(opportunity, whatsappCommunityUrl),
    [opportunity, whatsappCommunityUrl],
  );

  const handleWhatsAppShare = () => {
    trackOpportunityShare(opportunity.id, opportunity.slug, "whatsapp");
    openWhatsAppShare(message);
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    trackOpportunityShare(opportunity.id, opportunity.slug, "copy_link");
    const ok = await copyOpportunityUrl(opportunity.slug);
    if (ok) {
      setCopiedLink(true);
      toast.success("Opportunity link copied to clipboard");
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      toast.error("Failed to copy link");
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessage(true);
      toast.success("Formatted WhatsApp message copied");
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      toast.error("Failed to copy text");
    }
  };

  const handleNativeShare = async () => {
    trackOpportunityShare(opportunity.id, opportunity.slug, "device_native");
    try {
      const ok = await shareViaNativeDevice(opportunity);
      if (ok) setIsOpen(false);
    } catch {
      // User dismissed
    }
  };

  const defaultLabel =
    buttonText ||
    ((opportunity as any).opportunity_type === "scholarship"
      ? "Share Scholarship"
      : "Share Opportunity");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : showIconOnly ? (
          <Button
            type="button"
            variant={buttonVariant}
            size="icon"
            className={cn("h-9 w-9 rounded-lg shrink-0", className)}
            aria-label={defaultLabel}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant={buttonVariant}
            className={cn(
              "w-full sm:w-auto rounded-xl px-5 sm:px-7 py-3 sm:py-6 text-xs sm:text-sm font-semibold shadow-xs transition-all",
              className,
            )}
            aria-label={defaultLabel}
          >
            <Share2 className="mr-2 h-4 w-4 shrink-0" />
            <span>{defaultLabel}</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[390px] rounded-2xl p-4 sm:p-5 shadow-2xl border border-border max-h-[calc(100dvh-2.5rem)] overflow-y-auto flex flex-col gap-3 min-w-0">
        <DialogHeader className="text-left space-y-1 pb-0.5 pr-8 min-w-0">
          <DialogTitle className="text-base sm:text-lg font-bold font-heading text-navy flex items-center gap-2 leading-tight">
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0" />
            <span>Share Opportunity</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground font-sans">
            Spread the word to fellow students and academic networks.
          </p>
        </DialogHeader>

        {/* Opportunity Card Preview Header */}
        <div className="rounded-xl border border-border/80 bg-muted/40 p-3 min-w-0 overflow-hidden">
          <p className="text-xs font-bold text-navy font-heading line-clamp-2 leading-snug break-words">
            {opportunity.title}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 truncate block break-all">
            https://www.scholarsconnect.com.ng/opportunities/{opportunity.slug}
          </p>
        </div>

        {/* Actions Stack */}
        <div className="space-y-2 pt-0.5 min-w-0">
          {/* Primary: Share via WhatsApp */}
          <Button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            aria-label="Share opportunity via WhatsApp"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 fill-current shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.587 1.761.88 2.79.88h.001c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.748 0-3.385-.45-4.819-1.24l-5.181 1.356 1.378-5.039c-.896-1.488-1.378-3.21-1.378-5.077 0-5.518 4.482-10 10-10s10 4.482 10 10z" />
            </svg>
            <span>Share on WhatsApp</span>
          </Button>

          {/* Secondary: Copy Link */}
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyLink}
            className="w-full h-10 rounded-xl font-semibold text-xs sm:text-sm border-border flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer"
            aria-label="Copy opportunity link"
          >
            {copiedLink ? (
              <>
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Copy Opportunity Link</span>
              </>
            )}
          </Button>

          {/* Native Device Share Sheet (when supported) */}
          {supportsNativeShare && (
            <Button
              type="button"
              variant="outline"
              onClick={handleNativeShare}
              className="w-full h-10 rounded-xl font-semibold text-xs sm:text-sm border-border flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer"
              aria-label="Share via device options"
            >
              <Smartphone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>More Share Options...</span>
            </Button>
          )}
        </div>

        {/* Message Preview Accordion */}
        <div className="pt-2 border-t border-border/60 min-w-0">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-navy transition-colors py-1 cursor-pointer"
            aria-expanded={showPreview}
          >
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-secondary shrink-0" />
              <span>Preview WhatsApp Message</span>
            </span>
            {showPreview ? (
              <ChevronUp className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            )}
          </button>

          {showPreview && (
            <div className="mt-2 space-y-2 animate-in fade-in-50 duration-200 min-w-0">
              <div className="rounded-xl bg-slate-900 text-slate-100 p-2.5 sm:p-3 text-[11px] font-mono whitespace-pre-wrap break-all leading-relaxed max-h-36 overflow-y-auto border border-slate-800">
                {message}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyMessage}
                className="w-full text-xs font-semibold h-8 text-muted-foreground hover:text-navy cursor-pointer"
              >
                {copiedMessage ? (
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-600 shrink-0" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1 shrink-0" />
                )}
                <span>{copiedMessage ? "Message Text Copied" : "Copy Formatted Message"}</span>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
