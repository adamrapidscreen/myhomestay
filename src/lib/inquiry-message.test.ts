import { describe, expect, it } from "vitest";
import { buildInquiryMessage, INQUIRY_NOTE_MAX } from "./inquiry-message";
import type { Listing } from "@/types/listings";

function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "1",
    slug: "rumah-tepi-sawah",
    ownerId: "owner-1",
    name: "Rumah Tepi Sawah",
    summary: "Calm kampung stay.",
    description: "Longer description.",
    capacity: 6,
    bedrooms: 3,
    location: {
      id: "x",
      area: "Balik Pulau",
      town: "Pulau Pinang",
      state: "pulau-pinang",
    },
    price: { currency: "MYR", minPerNight: 150, maxPerNight: 220 },
    photos: [],
    amenities: [],
    houseRules: [],
    trust: {
      muslimFriendly: true,
      familyFriendly: true,
      whatsappReady: true,
      houseRulesProvided: true,
    },
    status: "published",
    metrics: { views: 0, whatsappClicks: 0, lastUpdatedAt: "" },
    updatedAt: "",
    ...overrides,
  };
}

describe("buildInquiryMessage", () => {
  it("produces a valid baseline with no fields", () => {
    const msg = buildInquiryMessage(makeListing());
    expect(msg).toContain('Hi, I\'m interested in "Rumah Tepi Sawah"');
    expect(msg).toContain("Area: Balik Pulau, Pulau Pinang");
    expect(msg).toContain("availability and total price");
    expect(msg).not.toContain("Dates:");
    expect(msg).not.toContain("Guests:");
  });

  it("includes dates when either is provided", () => {
    const msg = buildInquiryMessage(makeListing(), { checkIn: "2026-06-10" });
    expect(msg).toContain("Dates: 2026-06-10 to ?");
  });

  it("includes guests only when positive", () => {
    expect(buildInquiryMessage(makeListing(), { guests: 4 })).toContain(
      "Guests: 4",
    );
    expect(buildInquiryMessage(makeListing(), { guests: 0 })).not.toContain(
      "Guests:",
    );
  });

  it("maps a preset question to its full text", () => {
    const msg = buildInquiryMessage(makeListing(), { question: "parking" });
    expect(msg).toContain("Question: Is parking available?");
  });

  it("uses the custom note as the question when question is 'other'", () => {
    const msg = buildInquiryMessage(makeListing(), {
      question: "other",
      note: "Do you allow pets?",
    });
    expect(msg).toContain("Question: Do you allow pets?");
  });

  it("clamps an overlong note", () => {
    const longNote = "a".repeat(INQUIRY_NOTE_MAX + 50);
    const msg = buildInquiryMessage(makeListing(), {
      question: "other",
      note: longNote,
    });
    const noteLine = msg
      .split("\n")
      .find((l) => l.startsWith("Question: a"));
    expect(noteLine).toBeDefined();
    expect(noteLine!.length).toBeLessThanOrEqual("Question: ".length + INQUIRY_NOTE_MAX);
  });
});
