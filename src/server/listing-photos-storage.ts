import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getListingPhotosBucket } from "@/lib/supabase/env";

/**
 * Listing photo storage helper.
 *
 * Enforces the security-gate upload constraints (T6) in application code in
 * addition to the bucket-level policy: mime allowlist, size cap, and an
 * owner-scoped object path {owner_id}/{listing_id}/{file}. The bucket is
 * private; public listing pages read photos through short-lived signed URLs.
 */

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type PhotoUploadResult =
  | { ok: true; path: string }
  | { ok: false; error: string };

/**
 * Validate then upload a photo for a listing the caller owns. The path's
 * first segment is the owner id, which the storage RLS policy checks against
 * auth.uid(). Validation here is defense in depth, not the only guard.
 */
export async function uploadListingPhoto(
  ownerId: string,
  listingId: string,
  file: File,
): Promise<PhotoUploadResult> {
  if (!ALLOWED_MIME.has(file.type)) {
    return { ok: false, error: "Photo must be a JPEG, PNG, or WebP image." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Photo must be 5 MB or smaller." };
  }

  const ext = EXT_BY_MIME[file.type] ?? "jpg";
  const objectPath = `${ownerId}/${listingId}/${crypto.randomUUID()}.${ext}`;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage
    .from(getListingPhotosBucket())
    .upload(objectPath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return { ok: false, error: "Could not upload the photo. Please try again." };
  }
  return { ok: true, path: objectPath };
}

/** Delete a stored photo object. RLS scopes deletion to the owner's folder. */
export async function deleteListingPhoto(objectPath: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage
    .from(getListingPhotosBucket())
    .remove([objectPath]);
  return !error;
}

/**
 * Mint a short-lived signed URL for a stored object. Used to render private
 * bucket photos on public listing pages. Returns null on failure so callers
 * can fall back to a placeholder panel.
 */
export async function getSignedPhotoUrl(
  objectPath: string,
): Promise<string | null> {
  // Placeholder paths from Chapter 3 are not real storage objects.
  if (objectPath.startsWith("/mock/")) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(getListingPhotosBucket())
    .createSignedUrl(objectPath, SIGNED_URL_TTL_SECONDS);

  if (error || !data) return null;
  return data.signedUrl;
}
