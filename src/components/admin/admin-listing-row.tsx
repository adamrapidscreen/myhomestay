"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  moderateListingAction,
  type AdminModerationState,
} from "@/app/admin/actions";
import { LISTING_STATUS_DISPLAY } from "@/lib/listing-status-display";
import type { AdminListingSummary } from "@/server/admin-data";

const INITIAL: AdminModerationState = { ok: false };

interface AdminListingRowProps {
  listing: AdminListingSummary;
}

export function AdminListingRow({ listing }: AdminListingRowProps) {
  const [state, action, pending] = useActionState(moderateListingAction, INITIAL);
  const status = LISTING_STATUS_DISPLAY[listing.status];

  const canPause = listing.status === "published";
  const canFlag = listing.status !== "needs_review";
  const canClear = listing.status === "needs_review";

  return (
    <li className="rounded-card border border-stone bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bgClass} ${status.textClass}`}
            >
              <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
              {status.label}
            </span>
            {listing.status === "published" && (
              <Link
                href={`/listings/${listing.slug}`}
                className="text-xs text-muted-ink underline-offset-4 hover:text-ink hover:underline"
              >
                View public page
              </Link>
            )}
          </div>
          <h3 className="mt-2 break-words font-display text-lg text-ink">
            {listing.name}
          </h3>
          <p className="mt-1 text-xs text-muted-ink">
            Owner {listing.ownerId.slice(0, 8)}… · slug {listing.slug}
          </p>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="mt-3 rounded-control border border-danger bg-rice px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.ok && state.message && (
        <p className="mt-3 rounded-control bg-rice px-3 py-2 text-sm text-deep-leaf">
          {state.message}
        </p>
      )}

      <form action={action} className="mt-4 flex flex-col gap-3 border-t border-stone pt-4">
        <input type="hidden" name="listingId" value={listing.id} />
        <label htmlFor={`note-${listing.id}`} className="text-xs font-medium text-muted-ink">
          Reason / note (optional, saved to the audit trail)
        </label>
        <input
          id={`note-${listing.id}`}
          name="note"
          type="text"
          maxLength={500}
          placeholder="e.g. Photos do not match the description"
          className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-leaf"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            name="action"
            value="pause"
            disabled={pending || !canPause}
            className="rounded-control border border-clay bg-paper px-3 py-1.5 text-sm font-medium text-clay hover:bg-rice disabled:opacity-40"
          >
            Pause
          </button>
          <button
            type="submit"
            name="action"
            value="needs_review"
            disabled={pending || !canFlag}
            className="rounded-control border border-danger bg-paper px-3 py-1.5 text-sm font-medium text-danger hover:bg-rice disabled:opacity-40"
          >
            Flag for review
          </button>
          <button
            type="submit"
            name="action"
            value="clear"
            disabled={pending || !canClear}
            className="rounded-control border border-stone bg-paper px-3 py-1.5 text-sm font-medium text-ink hover:bg-rice disabled:opacity-40"
          >
            Clear to draft
          </button>
        </div>
      </form>
    </li>
  );
}
