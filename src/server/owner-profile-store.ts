import "server-only";
import type { OwnerProfile } from "@/types/owners";
import { mockOwners } from "@/data/owners";

/**
 * Session-scoped owner profile store.
 *
 * Mirrors the static `mockOwners` seed in mutable form so the
 * onboarding flow can update display name and WhatsApp number within
 * a single dev-server lifetime. Restarting `next start` resets to seed.
 */

let workingOwners: OwnerProfile[] = mockOwners.map((o) => ({ ...o }));

export function listAllOwners(): OwnerProfile[] {
  return workingOwners;
}

export function findOwnerById(id: string): OwnerProfile | undefined {
  return workingOwners.find((o) => o.id === id);
}

export function replaceOwner(updated: OwnerProfile): void {
  workingOwners = workingOwners.map((o) => (o.id === updated.id ? updated : o));
}

export function resetOwnerStore(): void {
  workingOwners = mockOwners.map((o) => ({ ...o }));
}
