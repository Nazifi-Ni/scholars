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
            className={cn("h-9 w-9 rounded-lg", className)}
            aria-label={defaultLabel}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant={buttonVariant}
            className={cn(
              "rounded-xl px-7 py-6 text-sm font-semibold shadow-xs transition-all",
              className,
            )}
            aria-label={defaultLabel}
          >
            <Share2 className="mr-2 h-4 w-4" />
            {defaultLabel}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl p-6 sm:p-7 shadow-xl border border-border">
        <DialogHeader className="text-left space-y-1.5 pb-2">
          <DialogTitle className="text-xl font-bold font-heading text-navy flex items-center gap-2">
            <Share2 className="h-5 w-5 text-secondary" />
            Share Opportunity
          </DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            Spread the word to fellow students and academic networks.
          </p>
        </DialogHeader>

        {/* Opportunity Card Preview Header */}
        <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 my-1">
          <p className="text-xs font-bold text-navy font-heading line-clamp-2 leading-snug">
            {opportunity.title}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 truncate">
            https://www.scholarsconnect.com.ng/opportunities/{opportunity.slug}
          </p>
        </div>

        {/* Actions Stack */}
        <div className="space-y-3 pt-2">
          {/* Primary: Share via WhatsApp */}
          <Button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2.5 transition-all"
            aria-label="Share opportunity via WhatsApp"
          >
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.587 1.761.88 2.79.88h.001c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.748 0-3.385-.45-4.819-1.24l-5.181 1.356 1.378-5.039c-.896-1.488-1.378-3.21-1.378-5.077 0-5.518 4.482-10 10-10s10 4.482 10 10z" />
            </svg>
            Share on WhatsApp
          </Button>

          {/* Secondary: Copy Link */}
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyLink}
            className="w-full h-11 rounded-xl font-semibold text-sm border-border flex items-center justify-center gap-2 hover:bg-muted/50"
            aria-label="Copy opportunity link"
          >
            {copiedLink ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-muted-foreground" />
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
              className="w-full h-11 rounded-xl font-semibold text-sm border-border flex items-center justify-center gap-2 hover:bg-muted/50"
              aria-label="Share via device options"
            >
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span>More Share Options...</span>
            </Button>
          )}
        </div>

        {/* Message Preview Accordion */}
        <div className="pt-2 border-t border-border/60 mt-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-navy transition-colors py-1"
            aria-expanded={showPreview}
          >
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-secondary" />
              Preview WhatsApp Message Text
            </span>
            {showPreview ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {showPreview && (
            <div className="mt-3 space-y-2 animate-in fade-in-50 duration-200">
              <div className="rounded-xl bg-slate-900 text-slate-100 p-3.5 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto border border-slate-800">
                {message}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyMessage}
                className="w-full text-xs font-semibold h-8 text-muted-foreground hover:text-navy"
              >
                {copiedMessage ? (
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                {copiedMessage ? "Message Text Copied" : "Copy Formatted Message"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
