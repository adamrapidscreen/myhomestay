import type { Listing } from "@/types/listings";

/**
 * Traveller Confidence Strip (Launch Bloom Pack).
 *
 * Factual confidence signals shown on the public listing detail page. Every
 * fact is derived from the listing itself, never a platform endorsement. The
 * MVP forbids "verified"/"trusted"/"certified"/"approved" language here.
 */
interface ConfidenceStripProps {
  listing: Listing;
  /** Whether the owner has any public local guide items. */
  hasLocalGuide: boolean;
}

export function ConfidenceStrip({ listing, hasLocalGuide }: ConfidenceStripProps) {
  const lastUpdated = new Date(listing.updatedAt).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const facts: { key: string; label: string }[] = [
    { key: "owner", label: "Owner-created listing" },
  ];

  if (listing.photos.length > 0) {
    facts.push({ key: "photos", label: `${listing.photos.length} photos added` });
  }
  if (listing.houseRules.length > 0) {
    facts.push({ key: "rules", label: "House rules listed" });
  }
  if (hasLocalGuide) {
    facts.push({ key: "guide", label: "Local guide available" });
  }
  facts.push({ key: "whatsapp", label: "Booking continues on WhatsApp" });

  return (
    <section className="rounded-card border border-stone bg-white p-4 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-ink">
        What we can tell you
      </p>
      <ul className="mt-3 space-y-2">
        {facts.map((fact) => (
          <li key={fact.key} className="flex items-start gap-2 text-sm text-ink">
            <span aria-hidden className="mt-0.5 flex-none text-deep-leaf">
              ✓
            </span>
            <span>{fact.label}</span>
          </li>
        ))}
        <li className="flex items-start gap-2 text-sm text-muted-ink">
          <span aria-hidden className="mt-0.5 flex-none">
            ·
          </span>
          <span>Last updated {lastUpdated}</span>
        </li>
      </ul>
    </section>
  );
}
