import { NextResponse, type NextRequest } from "next/server";
import {
  parseReportReason,
  submitListingReport,
} from "@/server/listing-reports-data";

/**
 * Public listing report intake.
 *
 * Validates the listing id and reason, clamps free text, and routes the insert
 * through the submit_listing_report SECURITY DEFINER RPC, which enforces
 * published-only intake. No report data is ever returned to the caller.
 */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DETAILS_MAX = 1000;
const CONTACT_MAX = 160;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const record = body as {
    listingId?: unknown;
    reason?: unknown;
    details?: unknown;
    reporterContact?: unknown;
  };

  const listingId =
    typeof record.listingId === "string" ? record.listingId.trim() : "";
  const reason = parseReportReason(record.reason);

  if (!UUID_RE.test(listingId) || !reason) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const details =
    typeof record.details === "string" ? record.details.slice(0, DETAILS_MAX) : "";
  const reporterContact =
    typeof record.reporterContact === "string"
      ? record.reporterContact.slice(0, CONTACT_MAX)
      : "";

  const result = await submitListingReport({
    listingId,
    reason,
    details,
    reporterContact,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
