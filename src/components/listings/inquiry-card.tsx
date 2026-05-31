"use client";

import { useState } from "react";
import type { Listing } from "@/types/listings";
import type { PublicListingOwner } from "@/types/owners";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import {
  buildInquiryMessage,
  INQUIRY_NOTE_MAX,
  INQUIRY_QUESTIONS,
  type InquiryQuestionValue,
} from "@/lib/inquiry-message";
import { recordListingMetric } from "@/components/listings/listing-metric-beacon";

/**
 * WhatsApp Inquiry Kit card (Launch Bloom Pack).
 *
 * Replaces the plain WhatsApp CTA card on the public listing detail page.
 * Travellers can add optional dates, guest count, and a question; the message
 * is built locally and handed to WhatsApp. Nothing is stored. The WhatsApp
 * click metric still fires. Blank fields still produce a valid message.
 */
interface InquiryCardProps {
  listing: Listing;
  owner: PublicListingOwner;
}

export function InquiryCard({ listing, owner }: InquiryCardProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const [question, setQuestion] = useState<InquiryQuestionValue>("available");
  const [note, setNote] = useState("");

  const message = buildInquiryMessage(listing, {
    checkIn: checkIn || undefined,
    checkOut: checkOut || undefined,
    guests: guests ? Number(guests) : undefined,
    question,
    note: note || undefined,
  });

  const href = buildWhatsappUrl({ number: owner.whatsappNumber, message });

  const onSend = () => {
    recordListingMetric(listing.id, "whatsapp_clicks");
  };

  if (!href) {
    return (
      <p className="text-sm text-muted-ink">
        WhatsApp contact will be available once the owner confirms their number.
      </p>
    );
  }

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-ink">
        Message {owner.displayName}
      </p>
      <p className="mt-2 text-sm text-ink">
        Add a few details to send a clearer inquiry. All fields are optional.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="text-muted-ink">Check-in</span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 w-full rounded-control border border-stone bg-white px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="text-sm">
          <span className="text-muted-ink">Check-out</span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="mt-1 w-full rounded-control border border-stone bg-white px-3 py-2 text-sm text-ink"
          />
        </label>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="text-muted-ink">Guests</span>
          <input
            type="number"
            min={1}
            max={listing.capacity}
            inputMode="numeric"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder={`Up to ${listing.capacity}`}
            className="mt-1 w-full rounded-control border border-stone bg-white px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="text-sm">
          <span className="text-muted-ink">Question</span>
          <select
            value={question}
            onChange={(e) => setQuestion(e.target.value as InquiryQuestionValue)}
            className="mt-1 w-full rounded-control border border-stone bg-white px-3 py-2 text-sm text-ink"
          >
            {INQUIRY_QUESTIONS.map((q) => (
              <option key={q.value} value={q.value}>
                {q.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-3 block text-sm">
        <span className="text-muted-ink">
          {question === "other" ? "Your question" : "Note (optional)"}
        </span>
        <textarea
          rows={2}
          maxLength={INQUIRY_NOTE_MAX}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1 w-full rounded-control border border-stone bg-white px-3 py-2 text-sm text-ink"
        />
      </label>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onSend}
        className="mt-4 inline-flex w-full items-center justify-center rounded-control bg-leaf px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-deep-leaf"
      >
        Send WhatsApp inquiry
      </a>
      <p className="mt-2 text-center text-[11px] text-muted-ink">
        Booking and payment stay between you and the owner.
      </p>
    </div>
  );
}
