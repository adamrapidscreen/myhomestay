/**
 * Supabase environment access.
 *
 * Public values are safe in the browser (RLS-bound anon key). The service
 * role key is server-only and must never be read from a client component.
 * See _planning/security-gate-chapter-4.md "Env Strategy".
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Public Supabase config. Safe to use in browser and server. */
export function getPublicSupabaseConfig(): { url: string; anonKey: string } {
  return {
    url: required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  };
}

/** Site URL used for auth redirects and absolute links. */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

/** Storage bucket name for listing photos. */
export function getListingPhotosBucket(): string {
  return process.env.SUPABASE_LISTING_PHOTOS_BUCKET ?? "listing-photos";
}
