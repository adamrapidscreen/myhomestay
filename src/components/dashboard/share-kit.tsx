"use client";

import { useState } from "react";
import type { Listing } from "@/types/listings";
import type { ShareCaptions } from "@/lib/share-copy";

/**
 * Share Kit (Launch Bloom Pack).
 *
 * Owner-facing share tools for a published listing: public link with copy,
 * native share when available, a WhatsApp share link, caption starters, and a
 * server-generated QR image. Only renders share tools for published listings;
 * other statuses show an honest unavailable state. No private fields here.
 */
interface ShareKitProps {
  listing: Listing;
  publicUrl: string;
  ownerShareMessage: string;
  captions: ShareCaptions;
  qrUrl: string;
  /** Whether the listing is published and therefore shareable. */
  shareable: boolean;
  /** Reason shown when not shareable, e.g. "Restore live before sharing". */
  unavailableReason?: string;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex flex-none items-center justify-center rounded-control border border-stone bg-paper px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-rice"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

export function ShareKit({
  listing,
  publicUrl,
  ownerShareMessage,
  captions,
  qrUrl,
  shareable,
  unavailableReason,
}: ShareKitProps) {
  const [shareError, setShareError] = useState(false);

  if (!shareable) {
    return (
      <div className="rounded-card border border-clay bg-rice p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-clay">
          Sharing unavailable
        </p>
        <p className="mt-2 text-sm text-ink">
          {unavailableReason ?? "Publish this listing before sharing it."}
        </p>
      </div>
    );
  }

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    ownerShareMessage,
  )}`;

  const onNativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      setShareError(true);
      return;
    }
    try {
      await navigator.share({ title: listing.name, url: publicUrl });
    } catch {
      // User cancelled or share failed; not an error worth surfacing loudly.
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-medium uppercase tracking-[0.12em] text-muted-ink">
          Public link
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            readOnly
            value={publicUrl}
            className="min-w-0 flex-1 truncate rounded-control border border-stone bg-white px-3 py-2 text-sm text-ink"
            aria-label="Public listing link"
          />
          <div className="flex gap-2">
            <CopyButton value={publicUrl} label="Copy link" />
            <button
              type="button"
              onClick={onNativeShare}
              className="inline-flex flex-none items-center justify-center rounded-control border border-stone bg-paper px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-rice"
            >
              Share
            </button>
          </div>
        </div>
        {shareError && (
          <p className="mt-1 text-xs text-muted-ink">
            Sharing isn&apos;t available on this device. Copy the link instead.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-control bg-leaf px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-deep-leaf"
        >
          Share on WhatsApp
        </a>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-ink">
          Caption starters
        </p>
        <div className="mt-2 space-y-2">
          {(
            [
              ["Facebook", captions.facebook],
              ["TikTok", captions.tiktok],
              ["Short", captions.short],
            ] as const
          ).map(([name, text]) => (
            <div
              key={name}
              className="rounded-control border border-stone bg-white p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-ink">{name}</span>
                <CopyButton value={text} label="Copy" />
              </div>
              <p className="mt-2 whitespace-pre-line break-words text-xs text-muted-ink">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-ink">
          QR code
        </p>
        <div className="mt-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt={`QR code linking to ${listing.name}`}
            width={160}
            height={160}
            className="rounded-control border border-stone bg-white p-2"
          />
          <a
            href={qrUrl}
            download
            className="inline-flex items-center justify-center rounded-control border border-stone bg-paper px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-rice"
          >
            Download QR
          </a>
        </div>
      </div>
    </div>
  );
}
