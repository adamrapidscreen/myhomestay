import { NextResponse, type NextRequest } from "next/server";
import {
  incrementListingMetric,
  type ListingMetricName,
} from "@/server/listings-data";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseMetric(value: unknown): ListingMetricName | null {
  if (value === "views" || value === "whatsapp_clicks") return value;
  return null;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const record = body as { listingId?: unknown; metric?: unknown };
  const listingId =
    typeof record.listingId === "string" ? record.listingId.trim() : "";
  const metric = parseMetric(record.metric);

  if (!UUID_RE.test(listingId) || !metric) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await incrementListingMetric(listingId, metric);
  return NextResponse.json({ ok: true });
}
