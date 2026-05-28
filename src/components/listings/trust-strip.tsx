import type { Listing } from "@/types/listings";

/**
 * Trust strip for the public listing detail page.
 *
 * Renders only the trust facts that are actually true for the listing.
 * The MVP avoids any "verified" language until a real verification
 * policy exists. House rules and photo count are derived facts, not
 * platform endorsements.
 */
interface TrustStripProps {
  listing: Listing;
}

interface TrustFact {
  key: string;
  label: string;
}

export function TrustStrip({ listing }: TrustStripProps) {
  const facts: TrustFact[] = [];

  if (listing.trust.muslimFriendly) {
    facts.push({ key: "muslim", label: "Muslim-friendly" });
  }
  if (listing.trust.familyFriendly) {
    facts.push({ key: "family", label: "Family-friendly" });
  }
  if (listing.trust.whatsappReady) {
    facts.push({ key: "whatsapp", label: "WhatsApp-ready" });
  }
  if (listing.houseRules.length > 0) {
    facts.push({ key: "rules", label: "House rules listed" });
  }
  if (listing.photos.length >= 3) {
    facts.push({ key: "photos", label: `${listing.photos.length} photos` });
  }

  if (facts.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-1.5 text-xs">
      {facts.map((fact) => (
        <li
          key={fact.key}
          className="rounded-full border border-stone bg-rice px-2.5 py-1 text-muted-ink"
        >
          {fact.label}
        </li>
      ))}
    </ul>
  );
}
