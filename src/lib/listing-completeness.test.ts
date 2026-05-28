import { describe, it, expect } from "vitest";
import {
  evaluateListingCompleteness,
  summarizeCompleteness,
  MIN_PUBLISH_PHOTOS,
} from "./listing-completeness";
import { mockListings } from "@/data/listings";
import type { Listing } from "@/types/listings";

const baseListing: Listing = mockListings.find((l) => l.status === "published")!;

function clone(overrides: Partial<Listing>): Listing {
  return { ...baseListing, ...overrides };
}

describe("evaluateListingCompleteness", () => {
  it("the seeded published mock is publishable", () => {
    const r = evaluateListingCompleteness(baseListing);
    expect(r.publishable).toBe(true);
    expect(r.reasons).toEqual([]);
    expect(r.missingTasks).toEqual([]);
  });

  it("flags missing-photos when fewer than 3 photos", () => {
    const l = clone({ photos: baseListing.photos.slice(0, 2) });
    const r = evaluateListingCompleteness(l);
    expect(r.publishable).toBe(false);
    expect(r.reasons).toContain("missing-photos");
  });

  it("does not flag missing-photos at exactly the publish floor", () => {
    const l = clone({ photos: baseListing.photos.slice(0, MIN_PUBLISH_PHOTOS) });
    const r = evaluateListingCompleteness(l);
    expect(r.reasons).not.toContain("missing-photos");
  });

  it("flags missing-house-rules when empty", () => {
    const l = clone({ houseRules: [] });
    const r = evaluateListingCompleteness(l);
    expect(r.reasons).toContain("missing-house-rules");
  });

  it("flags missing-whatsapp when whatsappReady is false", () => {
    const l = clone({ trust: { ...baseListing.trust, whatsappReady: false } });
    const r = evaluateListingCompleteness(l);
    expect(r.reasons).toContain("missing-whatsapp");
  });

  it("flags missing-price when max < min", () => {
    const l = clone({ price: { currency: "MYR", minPerNight: 300, maxPerNight: 200 } });
    const r = evaluateListingCompleteness(l);
    expect(r.reasons).toContain("missing-price");
  });

  it("flags blank name and summary", () => {
    const l = clone({ name: "  ", summary: "" });
    const r = evaluateListingCompleteness(l);
    expect(r.reasons).toContain("missing-name");
    expect(r.reasons).toContain("missing-summary");
  });
});

describe("summarizeCompleteness", () => {
  it("returns 'Ready to publish' for publishable", () => {
    const r = evaluateListingCompleteness(baseListing);
    expect(summarizeCompleteness(r)).toBe("Ready to publish");
  });
  it("returns the single missing task when only one", () => {
    const l = clone({ houseRules: [] });
    const r = evaluateListingCompleteness(l);
    expect(summarizeCompleteness(r)).toBe("Add house rules");
  });
  it("joins first two missing tasks with separator", () => {
    const l = clone({ houseRules: [], photos: [] });
    const r = evaluateListingCompleteness(l);
    expect(summarizeCompleteness(r)).toContain("·");
  });
});
