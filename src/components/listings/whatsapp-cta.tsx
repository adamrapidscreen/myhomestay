"use client";

import type { Listing } from "@/types/listings";
import type { PublicListingOwner } from "@/types/owners";
import { buildListingWhatsappUrl } from "@/lib/whatsapp";
import { recordListingMetric } from "@/components/listings/listing-metric-beacon";

/**
 * WhatsApp continuation CTA.
 *
 * Renders a real wa.me link with a prefilled inquiry message. The
 * primary inline variant lives near the owner card. The optional
 * sticky mobile bar is rendered separately so it can sit at the
 * bottom of the page without covering content above the safe area.
 *
 * Click tracking posts a fixed +1 metric to a public route. The DB RPC only
 * counts published listings and does not expose private owner data.
 */
interface WhatsappCtaProps {
  listing: Listing;
  owner: PublicListingOwner;
  variant?: "inline" | "sticky";
}

export function WhatsappCta({ listing, owner, variant = "inline" }: WhatsappCtaProps) {
  const href = buildListingWhatsappUrl(listing, owner.whatsappNumber);

  const handleClick = () => {
    recordListingMetric(listing.id, "whatsapp_clicks");
  };

  if (!href) {
    return (
      <p className="text-sm text-muted-ink">
        WhatsApp contact will be available once the owner confirms their number.
      </p>
    );
  }

  if (variant === "sticky") {
    return (
      <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-stone bg-paper/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-paper/80 sm:hidden">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex w-full items-center justify-center rounded-control bg-leaf px-4 py-3 text-sm font-medium text-paper transition-colors hover:bg-deep-leaf"
        >
          WhatsApp the owner
        </a>
        <p className="mt-1 text-center text-[11px] text-muted-ink">
          Booking and payment stay between you and the owner.
        </p>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-control bg-leaf px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-deep-leaf"
    >
      WhatsApp {owner.displayName}
    </a>
  );
}
