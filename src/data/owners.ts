import type { OwnerProfile } from "@/types/owners";

/**
 * Mock owner profiles for local development.
 *
 * These mirror future Supabase `profiles` rows. Phone numbers are
 * fictional and use the +60 prefix only for shape testing.
 */
export const mockOwners: OwnerProfile[] = [
  {
    id: "owner-aini",
    fullName: "Nur Aini binti Hassan",
    displayName: "Kak Aini",
    whatsappNumber: "+60123456701",
    regionLabel: "Pulau Pinang",
    createdAt: "2026-04-12T08:30:00Z",
    onboardingComplete: true,
  },
  {
    id: "owner-faizal",
    fullName: "Mohd Faizal bin Ramli",
    displayName: "Pakcik Faizal",
    whatsappNumber: "+60198765432",
    regionLabel: "Terengganu",
    createdAt: "2026-04-22T03:11:00Z",
    onboardingComplete: true,
  },
  {
    id: "owner-siti",
    fullName: "Siti Khadijah binti Ibrahim",
    displayName: "Siti & Family",
    whatsappNumber: "+60177012345",
    regionLabel: "Kelantan",
    createdAt: "2026-05-02T11:00:00Z",
    onboardingComplete: false,
  },
];

/** Look up a mock owner by id. Returns undefined if not found. */
export function findMockOwnerById(id: string): OwnerProfile | undefined {
  return mockOwners.find((owner) => owner.id === id);
}

/**
 * Mock current owner id used by the owner dashboard until real auth
 * lands in Build Chapter 4. Pinned to a deterministic owner so dev
 * sessions are repeatable.
 */
export const MOCK_CURRENT_OWNER_ID = "owner-aini";

/**
 * Mock current owner accessor. Returns the pinned current owner from
 * the shared mock owner list. Falls back to the first owner if the
 * pinned id is missing.
 */
export function getMockCurrentOwner(): OwnerProfile {
  return findMockOwnerById(MOCK_CURRENT_OWNER_ID) ?? mockOwners[0];
}
