import Link from "next/link";
import type { ListingReport } from "@/types/launch";

/**
 * Compact admin view of submitted listing reports.
 *
 * Read-only intake display for the controlled pilot: reason, details, optional
 * reporter contact, and a link to the listing. Full case-management workflow
 * (status changes, owner notification) is an explicit future follow-up.
 */
const REASON_LABELS: Record<ListingReport["reason"], string> = {
  misleading: "Misleading details",
  inappropriate: "Inappropriate content",
  "not-real-place": "Not a real place",
  "scam-phishing": "Scam / phishing",
  other: "Other",
};

const STATUS_LABELS: Record<ListingReport["status"], string> = {
  new: "New",
  reviewed: "Reviewed",
  dismissed: "Dismissed",
};

interface AdminReportsSectionProps {
  reports: ListingReport[];
  /** Map of listing id -> { name, slug } for display + linking. */
  listingLookup: Record<string, { name: string; slug: string }>;
}

export function AdminReportsSection({
  reports,
  listingLookup,
}: AdminReportsSectionProps) {
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-2xl text-ink">Listing reports</h2>
        {reports.length > 0 && (
          <span className="rounded-full bg-rice px-2.5 py-1 text-xs font-medium text-muted-ink">
            {reports.length} total
          </span>
        )}
      </div>

      {reports.length === 0 ? (
        <p className="mt-4 rounded-card border border-dashed border-stone bg-white p-6 text-center text-sm text-muted-ink">
          No reports submitted.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {reports.map((report) => {
            const listing = listingLookup[report.listingId];
            const created = new Date(report.createdAt).toLocaleDateString(
              "en-MY",
              { year: "numeric", month: "short", day: "numeric" },
            );
            return (
              <li
                key={report.id}
                className="rounded-card border border-stone bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-danger px-2 py-0.5 text-xs font-medium text-paper">
                    {REASON_LABELS[report.reason]}
                  </span>
                  <span className="rounded-full border border-stone px-2 py-0.5 text-xs text-muted-ink">
                    {STATUS_LABELS[report.status]}
                  </span>
                  <span className="text-xs text-muted-ink">{created}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-ink">
                  {listing ? (
                    <Link
                      href={`/listings/${listing.slug}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {listing.name}
                    </Link>
                  ) : (
                    <span className="text-muted-ink">Listing unavailable</span>
                  )}
                </p>
                {report.details && (
                  <p className="mt-1 break-words text-sm text-muted-ink">
                    {report.details}
                  </p>
                )}
                {report.reporterContact && (
                  <p className="mt-1 break-words text-xs text-muted-ink">
                    Contact: {report.reporterContact}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
