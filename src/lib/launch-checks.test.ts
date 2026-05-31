import { describe, expect, it } from "vitest";
import { evaluateLaunchChecklist } from "./launch-checks";
import type { Listing } from "@/types/listings";
import type { OwnerProfile } from "@/types/owners";

function makeOwner(overrides: Partial<OwnerProfile> = {}): OwnerProfile {
  return {
    id: "owner-1",
    fullName: "Aini binti Hassan",
    displayName: "Aini",
    whatsappNumber: "+60123456789",
    regionLabel: "Pulau Pinang",
    createdAt: new Date().toISOString(),
    onboardingComplete: true,
    ...overrides,
  };
}

function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "rumah-tepi-sawah",
    ownerId: "owner-1",
    name: "Rumah Tepi Sawah",
    summary: "A calm kampung stay beside the paddy fields.",
    description: "A longer description of the homestay and what to expect.",
    capacity: 6,
    bedrooms: 3,
    location: { id: "rumah-tepi-sawah", area: "Balik Pulau", state: "pulau-pinang" },
    price: { currency: "MYR", minPerNight: 150, maxPerNight: 220 },
    photos: [
      { id: "p1", src: "/a.jpg", alt: "bedroom", category: "bedroom", order: 1 },
      { id: "p2", src: "/b.jpg", alt: "living", category: "living", order: 2 },
      { id: "p3", src: "/c.jpg", alt: "exterior", category: "exterior", order: 3 },
    ],
    amenities: ["wifi", "parking"],
    houseRules: ["No smoking indoors"],
    trust: {
      muslimFriendly: true,
      familyFriendly: true,
      whatsappReady: true,
      houseRulesProvided: true,
    },
    status: "published",
    metrics: {
      views: 0,
      whatsappClicks: 0,
      lastUpdatedAt: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("evaluateLaunchChecklist", () => {
  it("marks every check complete for a fully-ready published listing", () => {
    const result = evaluateLaunchChecklist({
      listing: makeListing(),
      owner: makeOwner(),
      publicGuideItemCount: 2,
    });
    expect(result.totalCount).toBe(9);
    expect(result.allComplete).toBe(true);
    expect(result.completeCount).toBe(9);
    expect(result.checks.every((c) => c.actionHref === null)).toBe(true);
  });

  it("flags a draft with no guide items and no photos", () => {
    const result = evaluateLaunchChecklist({
      listing: makeListing({ status: "draft", photos: [] }),
      owner: makeOwner(),
      publicGuideItemCount: 0,
    });
    expect(result.allComplete).toBe(false);

    const byId = Object.fromEntries(result.checks.map((c) => [c.id, c]));
    expect(byId["photos-ready"].done).toBe(false);
    expect(byId["photo-spread"].done).toBe(false);
    expect(byId["local-guide"].done).toBe(false);
    expect(byId["published"].done).toBe(false);
    expect(byId["photos-ready"].actionHref).toContain("/photos");
    expect(byId["local-guide"].actionHref).toContain("/launch");
  });

  it("treats an invalid WhatsApp number as not reachable", () => {
    const result = evaluateLaunchChecklist({
      listing: makeListing(),
      owner: makeOwner({ whatsappNumber: "123" }),
      publicGuideItemCount: 1,
    });
    const byId = Object.fromEntries(result.checks.map((c) => [c.id, c]));
    expect(byId["whatsapp-reachable"].done).toBe(false);
    expect(byId["profile-complete"].done).toBe(false);
  });

  it("requires 2 distinct photo categories for the spread check", () => {
    const result = evaluateLaunchChecklist({
      listing: makeListing({
        photos: [
          { id: "p1", src: "/a.jpg", alt: "b", category: "bedroom", order: 1 },
          { id: "p2", src: "/b.jpg", alt: "b", category: "bedroom", order: 2 },
          { id: "p3", src: "/c.jpg", alt: "b", category: "bedroom", order: 3 },
        ],
      }),
      owner: makeOwner(),
      publicGuideItemCount: 1,
    });
    const byId = Object.fromEntries(result.checks.map((c) => [c.id, c]));
    expect(byId["photos-ready"].done).toBe(true);
    expect(byId["photo-spread"].done).toBe(false);
  });
});
