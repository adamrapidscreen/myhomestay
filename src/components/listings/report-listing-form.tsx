"use client";

import { useState, useTransition } from "react";
import type { ListingReportReason } from "@/types/launch";

/**
 * Report Listing form (Launch Bloom Pack).
 *
 * A quiet safety affordance on the public listing page. Opens an inline form,
 * posts to /api/listing-reports, and shows a thank-you state. Reports are never
 * publicly displayed. No traveller account or login required.
 */
const REASONS: { value: ListingReportReason; label: string }[] = [
  { value: "misleading", label: "Misleading details" },
  { value: "inappropriate", label: "Inappropriate photo or content" },
  { value: "not-real-place", label: "Not a real place" },
  { value: "scam-phishing", label: "Scam or phishing concern" },
  { value: "other", label: "Other" },
];

const DETAILS_MAX = 1000;
const CONTACT_MAX = 160;

export function ReportListingForm({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<ListingReportReason>("misleading");
  const [pending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    setError(null);
    const details = String(formData.get("details") ?? "").slice(0, DETAILS_MAX);
    const reporterContact = String(formData.get("reporterContact") ?? "").slice(
      0,
      CONTACT_MAX,
    );
    startTransition(async () => {
      try {
        const res = await fetch("/api/listing-reports", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ listingId, reason, details, reporterContact }),
        });
        if (!res.ok) {
          setError("Could not submit the report. Please try again.");
          return;
        }
        setDone(true);
      } catch {
        setError("Could not submit the report. Please try again.");
      }
    });
  };

  if (done) {
    return (
      <p className="mt-3 text-xs text-muted-ink">
        Thank you. Our team will take a look.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 text-xs text-muted-ink underline-offset-4 hover:text-ink hover:underline"
      >
        Report this listing
      </button>
    );
  }

  return (
    <form
      action={onSubmit}
      className="mt-3 rounded-control border border-stone bg-white p-4"
    >
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-ink">
        Report this listing
      </p>
      <label className="mt-3 block text-sm">
        <span className="text-muted-ink">Reason</span>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value as ListingReportReason)}
          className="mt-1 w-full rounded-control border border-stone bg-paper px-3 py-2 text-sm text-ink"
        >
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-3 block text-sm">
        <span className="text-muted-ink">Details (optional)</span>
        <textarea
          name="details"
          rows={3}
          maxLength={DETAILS_MAX}
          className="mt-1 w-full rounded-control border border-stone bg-paper px-3 py-2 text-sm text-ink"
        />
      </label>
      <label className="mt-3 block text-sm">
        <span className="text-muted-ink">Your contact (optional)</span>
        <input
          name="reporterContact"
          maxLength={CONTACT_MAX}
          placeholder="Email or phone, if you want a reply"
          className="mt-1 w-full rounded-control border border-stone bg-paper px-3 py-2 text-sm text-ink"
        />
      </label>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-control bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-deep-leaf disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex items-center justify-center rounded-control border border-stone bg-paper px-4 py-2 text-sm text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
