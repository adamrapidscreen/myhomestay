"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/server/auth";
import { findListingById, nextPhotoSortOrder } from "@/server/listings-data";
import {
  uploadListingPhoto,
  deleteListingPhoto,
} from "@/server/listing-photos-storage";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ListingPhotoCategory } from "@/types/photos";

const VALID_CATEGORIES: ReadonlySet<string> = new Set([
  "exterior",
  "bedroom",
  "bathroom",
  "kitchen",
  "living",
  "surrounding",
  "other",
]);

export interface PhotoActionResult {
  ok: boolean;
  added: number;
  errors: string[];
}

/**
 * Upload one or more photos to a listing the caller owns. Each file is
 * validated + uploaded by the storage helper, then a listing_photos row is
 * inserted. Returns per-file results so partial failures surface.
 */
export async function uploadListingPhotosAction(
  listingId: string,
  formData: FormData,
): Promise<PhotoActionResult> {
  const owner = await requireOwner();

  const listing = await findListingById(listingId);
  if (!listing || listing.ownerId !== owner.id) {
    return { ok: false, added: 0, errors: ["Listing not found in this session."] };
  }

  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return { ok: false, added: 0, errors: ["No files selected."] };
  }

  const supabase = await createSupabaseServerClient();
  let sortOrder = await nextPhotoSortOrder(listingId);
  const errors: string[] = [];
  let added = 0;

  for (const file of files) {
    const upload = await uploadListingPhoto(owner.id, listingId, file);
    if (!upload.ok) {
      errors.push(`${file.name}: ${upload.error}`);
      continue;
    }
    const { error } = await supabase.from("listing_photos").insert({
      listing_id: listingId,
      src: upload.path,
      alt: `${listing.name} photo`,
      category: "other",
      sort_order: sortOrder,
    });
    if (error) {
      // Roll back the orphaned object so storage and DB stay consistent.
      await deleteListingPhoto(upload.path);
      errors.push(`${file.name}: could not save photo record.`);
      continue;
    }
    sortOrder += 1;
    added += 1;
  }

  revalidatePath(`/dashboard/listings/${listingId}/edit`);
  revalidatePath("/dashboard");
  return { ok: added > 0, added, errors };
}

/** Set the category of one photo on a listing the caller owns. */
export async function setPhotoCategoryAction(
  listingId: string,
  photoId: string,
  category: string,
): Promise<{ ok: boolean; error?: string }> {
  const owner = await requireOwner();

  if (!VALID_CATEGORIES.has(category)) {
    return { ok: false, error: "Unknown category." };
  }

  const listing = await findListingById(listingId);
  if (!listing || listing.ownerId !== owner.id) {
    return { ok: false, error: "Listing not found in this session." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("listing_photos")
    .update({ category: category as ListingPhotoCategory })
    .eq("id", photoId)
    .eq("listing_id", listingId);

  if (error) return { ok: false, error: "Could not update the category." };

  revalidatePath(`/dashboard/listings/${listingId}/edit`);
  return { ok: true };
}

/** Delete one photo (storage object + row) from a listing the caller owns. */
export async function deleteListingPhotoAction(
  listingId: string,
  photoId: string,
): Promise<{ ok: boolean; error?: string }> {
  const owner = await requireOwner();

  const listing = await findListingById(listingId);
  if (!listing || listing.ownerId !== owner.id) {
    return { ok: false, error: "Listing not found in this session." };
  }

  const supabase = await createSupabaseServerClient();

  // Look up the object path (RLS-scoped) before deleting the row.
  const { data: row } = await supabase
    .from("listing_photos")
    .select("src")
    .eq("id", photoId)
    .eq("listing_id", listingId)
    .maybeSingle();

  const { error } = await supabase
    .from("listing_photos")
    .delete()
    .eq("id", photoId)
    .eq("listing_id", listingId);

  if (error) return { ok: false, error: "Could not remove the photo." };

  if (row?.src) {
    await deleteListingPhoto(row.src);
  }

  revalidatePath(`/dashboard/listings/${listingId}/edit`);
  revalidatePath("/dashboard");
  return { ok: true };
}
