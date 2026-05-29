import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { findListingById } from "@/server/listings-data";
import type { Listing } from "@/types/listings";

/**
 * Admin moderation data layer.
 *
 * Reads/writes go through the RLS-bound server client; admin policies +
 * is_admin() are the authoritative gate. The status-transition trigger
 * (migration 0010) lets an admin move any listing to needs_review and the
 * column-scope guard limits non-owner admin edits to status only.
 *
 * Every moderation action records an admin_review audit row.
 */

interface AdminListingRow {
  id: string;
  slug: string;
  name: string;
  status: string;
  owner_id: string;
  updated_at: string;
}

export interface AdminListingSummary {
  id: string;
  slug: string;
  name: string;
  status: Listing["status"];
  ownerId: string;
  updatedAt: string;
}

/** All listings across all owners, newest first. Admin-scoped via RLS. */
export async function listAllListingsForAdmin(): Promise<AdminListingSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id, slug, name, status, owner_id, updated_at")
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return (data as AdminListingRow[]).map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    status: r.status as Listing["status"],
    ownerId: r.owner_id,
    updatedAt: r.updated_at,
  }));
}

export type ModerationAction = "pause" | "needs_review" | "clear";

export interface ModerationResult {
  ok: boolean;
  error?: string;
}

function friendlyModerationError(message: string | undefined): string {
  const m = message ?? "";
  if (m.includes("status only")) return "Admins may only change listing status.";
  if (m.includes("Illegal listing status transition")) {
    return "That status change is not allowed from the current state.";
  }
  if (m.startsWith("Cannot publish:")) return m;
  return "Could not apply the moderation action. Please try again.";
}

/**
 * Apply a moderation action via the atomic moderate_listing RPC. The RPC
 * asserts is_admin(), changes status, and writes the audit row (admin_id =
 * auth.uid()) in one transaction, so status and audit cannot diverge and the
 * actor cannot be forged.
 * - pause: published/paused listing -> paused
 * - needs_review: any -> needs_review (admin path in trigger)
 * - clear: needs_review -> draft (owner re-publishes after fixing)
 */
export async function moderateListing(
  listingId: string,
  action: ModerationAction,
  note: string,
): Promise<ModerationResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("moderate_listing", {
    p_listing_id: listingId,
    p_action: action,
    p_note: note.trim() ? note.trim().slice(0, 500) : null,
  });

  if (error) {
    return { ok: false, error: friendlyModerationError(error.message) };
  }
  return { ok: true };
}

export interface AdminReviewEntry {
  id: string;
  action: string;
  note: string | null;
  createdAt: string;
}

/** Recent moderation history for a listing. Admin-only via RLS. */
export async function getListingReviewHistory(
  listingId: string,
): Promise<AdminReviewEntry[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_review")
    .select("id, action, note, created_at")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !data) return [];
  return (data as { id: string; action: string; note: string | null; created_at: string }[]).map(
    (r) => ({ id: r.id, action: r.action, note: r.note, createdAt: r.created_at }),
  );
}

/** Detail for one listing in the admin view (reuses owner-scoped read; admin RLS permits). */
export async function getAdminListingDetail(
  listingId: string,
): Promise<Listing | null> {
  return findListingById(listingId);
}
