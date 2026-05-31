import { describe, expect, it } from "vitest";
import {
  buildOwnerShareMessage,
  buildPublicListingUrl,
  buildShareCaptions,
  qrFileName,
} from "./share-copy";
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
    location: { id: "x", area: "Balik Pulau", town: "Pulau Pinang", state: "pulau-pinang" },
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

describe("buildPublicListingUrl", () => {
  it("joins origin and slug, trimming trailing slash", () => {
    expect(buildPublicListingUrl("https://my.test/", "abc")).toBe(
      "https://my.test/listings/abc",
    );
    expect(buildPublicListingUrl("https://my.test", "abc")).toBe(
      "https://my.test/listings/abc",
    );
  });
});

describe("buildOwnerShareMessage", () => {
  it("includes name, area, and url", () => {
    const url = "https://my.test/listings/rumah-tepi-sawah";
    const msg = buildOwnerShareMessage(makeListing(), url);
    expect(msg).toContain("Rumah Tepi Sawah");
    expect(msg).toContain("Balik Pulau, Pulau Pinang");
    expect(msg).toContain(url);
  });

  it("uses area only when town matches area", () => {
    const listing = makeListing({
      location: { id: "x", area: "Langkawi", town: "Langkawi", state: "kedah" },
    });
    const msg = buildOwnerShareMessage(listing, "u");
    expect(msg).toContain("Langkawi");
    expect(msg).not.toContain("Langkawi, Langkawi");
  });
});

describe("buildShareCaptions", () => {
  it("produces facebook, tiktok, and short captions with the url", () => {
    const url = "https://my.test/listings/rumah-tepi-sawah";
    const captions = buildShareCaptions(makeListing(), url);
    expect(captions.facebook).toContain(url);
    expect(captions.tiktok).toContain(url);
    expect(captions.short).toContain(url);
    expect(captions.facebook).toContain("6 guests");
  });

  it("never includes verified/certified/approved claims", () => {
    const captions = buildShareCaptions(makeListing(), "u");
    const blob = `${captions.facebook} ${captions.tiktok} ${captions.short}`.toLowerCase();
    expect(blob).not.toContain("verified");
    expect(blob).not.toContain("certified");
    expect(blob).not.toContain("approved");
  });
});

describe("qrFileName", () => {
  it("builds a slug-based file name", () => {
    expect(qrFileName("rumah-tepi-sawah")).toBe(
      "myhomestay-rumah-tepi-sawah-qr.svg",
    );
    expect(qrFileName("abc", "png")).toBe("myhomestay-abc-qr.png");
  });
});
