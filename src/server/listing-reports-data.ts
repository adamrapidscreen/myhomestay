import "server-only";

import type {
  ListingReport,
  ListingReportReason,
  ListingReportStatus,
} from "@/types/launch";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Supabase-backed listing reports data layer.
 *
 * Public intake goes through the submit_listing_report RPC (SECURITY DEFINER,
 * migration 0012), which validates published status server-side. No public
 * INSERT policy exists on the table, so this RPC is the only intake path.
 * Admin reads are RLS-gated by is_admin(). Owners cannot read reports.
 */

const REPORT_REASONS: ListingReportReason[] = [
  "misleading",
  "inappropriate",
  "not-real-place",
  "scam-phishing",
  "other",
];

/** Narrow an unknown value to a valid report reason, or null. */
export function parseReportReason(value: unknown): ListingReportReason | null {
  return REPORT_REASONS.includes(value as ListingReportReason)
    ? (value as ListingReportReason)
    : null;
}

interface ReportRow {
  id: string;
  listing_id: string;
  reason: string;
  details: string;
  reporter_contact: string | null;
  status: string;
  created_at: string;
}

export type ReportSubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Submit a public report for a published listing. Routes through the definer
 * RPC; the DB rejects non-published listings. Details/contact are clamped both
 * here and in the RPC. Returns a friendly result; never throws to the caller.
 */
export async function submitListingReport(input: {
  listingId: string;
  reason: ListingReportReason;
  details?: string;
  reporterContact?: string;
}): Promise<ReportSubmitResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("submit_listing_report", {
    p_listing_id: input.listingId,
    p_reason: input.reason,
    p_details: (input.details ?? "").slice(0, 1000),
    p_reporter_contact: (input.reporterContact ?? "").slice(0, 160) || null,
  });

  if (error) {
    if (error.message.includes("published listings")) {
      return { ok: false, error: "This listing can no longer be reported." };
    }
    return { ok: false, error: "Could not submit the report. Please try again." };
  }
  return { ok: true };
}

/** All reports for the admin queue. RLS returns rows only to admins. */
export async function listListingReportsForAdmin(): Promise<ListingReport[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("listing_reports")
    .select("id, listing_id, reason, details, reporter_contact, status, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as ReportRow[]).map((row) => ({
    id: row.id,
    listingId: row.listing_id,
    reason: row.reason as ListingReportReason,
    details: row.details,
    reporterContact: row.reporter_contact ?? undefined,
    status: row.status as ListingReportStatus,
    createdAt: row.created_at,
  }));
}

/** Count of unreviewed reports, for an admin badge. */
export async function countNewListingReports(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("listing_reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (error || count == null) return 0;
  return count;
}
