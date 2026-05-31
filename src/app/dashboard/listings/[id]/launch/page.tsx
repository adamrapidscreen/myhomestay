import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwner } from "@/server/auth";
import { findListingById } from "@/server/listings-data";
import { listGuideItems } from "@/server/local-guide-data";
import { evaluateLaunchChecklist } from "@/lib/launch-checks";
import {
  buildOwnerShareMessage,
  buildPublicListingUrl,
  buildShareCaptions,
} from "@/lib/share-copy";
import { getSiteUrl } from "@/lib/supabase/env";
import { LISTING_STATUS_DISPLAY } from "@/lib/listing-status-display";
import { LaunchChecklist } from "@/components/dashboard/launch-checklist";
import { ShareKit } from "@/components/dashboard/share-kit";
import { LocalGuideManager } from "@/components/dashboard/local-guide-manager";

interface LaunchPageParams {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: LaunchPageParams): Promise<Metadata> {
  const { id } = await params;
  const listing = await findListingById(id);
  return { title: listing ? `Launch kit · ${listing.name}` : "Launch kit" };
}

export default async function LaunchKitPage({ params }: LaunchPageParams) {
  const { id } = await params;
  const owner = await requireOwner();
  const listing = await findListingById(id);
  if (!listing || listing.ownerId !== owner.id) notFound();

  const guideItems = await listGuideItems(id);
  const publicGuideItemCount = guideItems.filter((g) => g.isPublic).length;
  const checklist = evaluateLaunchChecklist({
    listing,
    owner,
    publicGuideItemCount,
  });
  const status = LISTING_STATUS_DISPLAY[listing.status];

  const publicUrl = buildPublicListingUrl(getSiteUrl(), listing.slug);
  const shareable = listing.status === "published";
  const unavailableReason =
    listing.status === "paused"
      ? "Restore this listing live before sharing it."
      : listing.status === "needs_review"
        ? "Resolve the admin review note before sharing."
        : "Publish this listing before sharing it.";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-ink">
          Launch kit
        </p>
        <h1 className="mt-2 break-words font-display text-3xl text-ink sm:text-4xl">
          {listing.name}
        </h1>
        <p className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bgClass} ${status.textClass}`}
          >
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`}
            />
            {status.label}
          </span>
          <Link
            href={`/dashboard/listings/${id}/edit`}
            className="text-muted-ink underline-offset-4 hover:text-ink hover:underline"
          >
            Edit listing
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-ink underline-offset-4 hover:text-ink hover:underline"
          >
            ← Back to dashboard
          </Link>
        </p>
      </div>

      <section className="rounded-card border border-stone bg-paper p-4 sm:p-6">
        <h2 className="font-display text-xl text-ink">Before you share</h2>
        <p className="mt-1 text-sm text-muted-ink">
          These checks come from your listing. Nothing here is a MyHomestay
          endorsement. They help guests trust your page before they message you.
        </p>
        <div className="mt-4">
          <LaunchChecklist result={checklist} />
        </div>
      </section>

      <section className="rounded-card border border-stone bg-paper p-4 sm:p-6">
        <h2 className="font-display text-xl text-ink">Share your listing</h2>
        <p className="mt-1 text-sm text-muted-ink">
          Copy the link, post a caption, or show the QR code. Booking and
          payment still happen with you directly on WhatsApp.
        </p>
        <div className="mt-4">
          <ShareKit
            listing={listing}
            publicUrl={publicUrl}
            ownerShareMessage={buildOwnerShareMessage(listing, publicUrl)}
            captions={buildShareCaptions(listing, publicUrl)}
            qrUrl={`/dashboard/listings/${id}/qr`}
            shareable={shareable}
            unavailableReason={unavailableReason}
          />
        </div>
      </section>

      <section className="rounded-card border border-stone bg-paper p-4 sm:p-6">
        <h2 className="font-display text-xl text-ink">Local mini-guide</h2>
        <p className="mt-1 text-sm text-muted-ink">
          Add nearby places and tips guests usually ask about. Public notes show
          on your listing page.
        </p>
        <div className="mt-4">
          <LocalGuideManager listingId={id} items={guideItems} />
        </div>
      </section>
    </div>
  );
}
