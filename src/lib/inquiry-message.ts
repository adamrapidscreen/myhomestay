import type { Listing } from "@/types/listings";

/**
 * WhatsApp Inquiry Kit message builder (Launch Bloom Pack).
 *
 * Pure functions that compose a prefilled WhatsApp inquiry from optional
 * traveller fields. Nothing here is stored: the message is built locally and
 * handed to WhatsApp. No booking or availability state is introduced.
 */

export const INQUIRY_NOTE_MAX = 240;

/** Preset quick questions the traveller can pick. */
export const INQUIRY_QUESTIONS = [
  { value: "available", label: "Is this available?" },
  { value: "total-price", label: "Can you confirm total price?" },
  { value: "parking", label: "Is parking available?" },
  { value: "early-check-in", label: "Is early check-in possible?" },
  { value: "other", label: "Other (write below)" },
] as const;

export type InquiryQuestionValue = (typeof INQUIRY_QUESTIONS)[number]["value"];

const QUESTION_TEXT: Record<InquiryQuestionValue, string> = {
  available: "Is this available?",
  "total-price": "Can you confirm the total price?",
  parking: "Is parking available?",
  "early-check-in": "Is early check-in possible?",
  other: "",
};

export interface InquiryFields {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  question?: InquiryQuestionValue;
  note?: string;
}

function areaPhrase(listing: Listing): string {
  const town = listing.location.town;
  if (town && town !== listing.location.area) {
    return `${listing.location.area}, ${town}`;
  }
  return listing.location.area;
}

/**
 * Build the prefilled inquiry message. Blank fields are omitted so the message
 * stays clean. With no fields supplied it still produces a valid baseline.
 * The custom note is clamped to INQUIRY_NOTE_MAX.
 */
export function buildInquiryMessage(
  listing: Listing,
  fields: InquiryFields = {},
): string {
  const lines: string[] = [];
  lines.push(`Hi, I'm interested in "${listing.name}" on MyHomestay.`);
  lines.push(`Area: ${areaPhrase(listing)}`);

  if (fields.checkIn || fields.checkOut) {
    const from = fields.checkIn || "?";
    const to = fields.checkOut || "?";
    lines.push(`Dates: ${from} to ${to}`);
  }
  if (typeof fields.guests === "number" && fields.guests > 0) {
    lines.push(`Guests: ${fields.guests}`);
  }

  const note = (fields.note ?? "").trim().slice(0, INQUIRY_NOTE_MAX);
  if (fields.question === "other" && note) {
    lines.push(`Question: ${note}`);
  } else if (fields.question && fields.question !== "other") {
    lines.push(`Question: ${QUESTION_TEXT[fields.question]}`);
    if (note) lines.push(`Note: ${note}`);
  } else if (note) {
    lines.push(`Note: ${note}`);
  }

  lines.push("Could you confirm availability and total price?");
  lines.push("Thank you.");
  return lines.join("\n");
}

/** Owner copy-paste quick replies for the launch kit. No messaging inbox. */
export const OWNER_QUICK_REPLIES: string[] = [
  "Available, please share your dates and number of guests.",
  "Sorry, not available on those dates.",
  "Total price is RM ___ for ___ nights.",
  "Check-in is from ___ and parking is ___.",
];
