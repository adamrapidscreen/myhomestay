"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/server/auth";
import { findListingById } from "@/server/listings-data";
import {
  createGuideItem,
  deleteGuideItem,
  updateGuideItem,
} from "@/server/local-guide-data";
import { normalizeGuideDraft, validateGuideDraft } from "@/lib/local-guide";

/**
 * Owner local-guide server actions for the launch route.
 *
 * Every action re-confirms ownership (RLS is the authoritative gate; this is
 * defense in depth and a friendly not-found message). Inputs are normalized
 * and validated against the same length rules the database enforces.
 */

export interface GuideActionResult {
  ok: boolean;
  error?: string;
}

async function assertOwnsListing(listingId: string): Promise<string | null> {
  const owner = await requireOwner();
  const listing = await findListingById(listingId);
  if (!listing || listing.ownerId !== owner.id) {
    return "Listing not found in this session.";
  }
  return null;
}

function firstError(errors: ReturnType<typeof validateGuideDraft>["errors"]): string {
  switch (errors[0]) {
    case "title-required":
      return "Add a short title.";
    case "title-too-long":
      return "Title is too long.";
    case "note-too-long":
      return "Note is too long.";
    case "distance-too-long":
      return "Distance label is too long.";
    default:
      return "Please check the guide details.";
  }
}

export async function addGuideItemAction(
  listingId: string,
  formData: FormData,
): Promise<GuideActionResult> {
  const ownErr = await assertOwnsListing(listingId);
  if (ownErr) return { ok: false, error: ownErr };

  const draft = normalizeGuideDraft({
    category: formData.get("category"),
    title: formData.get("title"),
    note: formData.get("note"),
    distanceLabel: formData.get("distanceLabel"),
    isPublic: formData.get("isPublic") ?? "true",
  });
  const validation = validateGuideDraft(draft);
  if (!validation.ok) return { ok: false, error: firstError(validation.errors) };

  const result = await createGuideItem(listingId, draft);
  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath(`/dashboard/listings/${listingId}/launch`);
  return { ok: true };
}

export async function updateGuideItemAction(
  listingId: string,
  itemId: string,
  formData: FormData,
): Promise<GuideActionResult> {
  const ownErr = await assertOwnsListing(listingId);
  if (ownErr) return { ok: false, error: ownErr };

  const draft = normalizeGuideDraft({
    category: formData.get("category"),
    title: formData.get("title"),
    note: formData.get("note"),
    distanceLabel: formData.get("distanceLabel"),
    isPublic: formData.get("isPublic") ?? "true",
  });
  const validation = validateGuideDraft(draft);
  if (!validation.ok) return { ok: false, error: firstError(validation.errors) };

  const result = await updateGuideItem(itemId, draft);
  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath(`/dashboard/listings/${listingId}/launch`);
  return { ok: true };
}

export async function deleteGuideItemAction(
  listingId: string,
  itemId: string,
): Promise<GuideActionResult> {
  const ownErr = await assertOwnsListing(listingId);
  if (ownErr) return { ok: false, error: ownErr };

  const result = await deleteGuideItem(itemId);
  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath(`/dashboard/listings/${listingId}/launch`);
  return { ok: true };
}
