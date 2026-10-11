import { Link } from "@tanstack/react-router";
import { BadgeCheck, Clock, ExternalLink, HelpCircle, Shield, AlertTriangle } from "lucide-react";

interface VerifiedBadgeProps {
  status?: string | null;
  officialSourceUrl?: string | null;
  lastVerifiedAt?: string | null;
  verifiedBy?: string | null;
  className?: string;
}

export function VerifiedBadge({
  status = "verified",
  officialSourceUrl,
  lastVerifiedAt,
  verifiedBy = "ScholarsConnect Editorial Team",
  className = "",
}: VerifiedBadgeProps) {
  const isVerified = status === "verified";
  const isNeedsReview = status === "needs_review";

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all ${
        isVerified
          ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-950"
          : isNeedsReview
            ? "bg-amber-50/70 border-amber-200/80 text-amber-950"
            : "bg-muted/40 border-border text-foreground"
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isVerified
                ? "bg-emerald-600 text-white shadow-sm"
                : isNeedsReview
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {isVerified ? (
              <BadgeCheck className="h-6 w-6" />
            ) : isNeedsReview ? (
              <AlertTriangle className="h-6 w-6" />
            ) : (
              <Shield className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading font-bold text-base sm:text-lg">
                {isVerified
                  ? "Verified by ScholarsConnect"
                  : isNeedsReview
                    ? "Under Editorial Review"
                    : "Listing Verification Pending"}
              </h3>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isVerified
                    ? "bg-emerald-100 text-emerald-800"
                    : isNeedsReview
                      ? "bg-amber-100 text-amber-800"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isVerified
                  ? "Official Source Checked"
                  : isNeedsReview
                    ? "Review in Progress"
                    : "Editorial Intake"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/80 mt-1 leading-relaxed">
              Reviewed by{" "}
              <strong className="font-semibold">
                {verifiedBy || "ScholarsConnect Editorial Team"}
              </strong>
              {lastVerifiedAt && (
                <>
                  {" "}
                  • Last checked:{" "}
                  <span className="font-medium">
                    {new Date(lastVerifiedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center shrink-0 text-xs sm:text-sm">
          {officialSourceUrl && (
            <a
              href={officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              Official Source <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <Link
            to="/how-we-verify-opportunities"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground hover:underline"
          >
            How we verify <HelpCircle className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
