import type { PublicListingOwner } from "@/types/owners";

/**
 * Owner profile card shown near the WhatsApp CTA on listing pages.
 *
 * Public surface only: never exposes internal owner full name or
 * unmasked WhatsApp number on the page itself. The number is delivered
 * through the WhatsApp link instead.
 */
interface OwnerCardProps {
  owner: PublicListingOwner;
}

export function OwnerCard({ owner }: OwnerCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-stone bg-white p-4 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-ink">
        Hosted by
      </p>
      <div className="min-w-0">
        <p className="break-words font-display text-lg text-ink">
          {owner.displayName}
        </p>
        {owner.regionLabel && (
          <p className="mt-1 text-sm text-muted-ink">
            {owner.regionLabel}
          </p>
        )}
      </div>
      <p className="border-t border-stone pt-3 text-xs text-muted-ink">
        Booking and payment continue directly with the owner. MyHomestay
        does not handle payment.
      </p>
    </div>
  );
}
