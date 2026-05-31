import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { requireOwner } from "@/server/auth";
import { findListingById } from "@/server/listings-data";
import { getSiteUrl } from "@/lib/supabase/env";
import { buildPublicListingUrl, qrFileName } from "@/lib/share-copy";

/**
 * Owner-only QR code for a published listing's public URL.
 *
 * Generated server-side so the QR library never ships to the client bundle.
 * The QR encodes only the public listing URL, never owner contact details.
 * Access is gated by requireOwner + explicit ownership + published status.
 */
interface QrRouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: QrRouteParams) {
  const { id } = await params;
  const owner = await requireOwner();
  const listing = await findListingById(id);

  if (!listing || listing.ownerId !== owner.id) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (listing.status !== "published") {
    return new NextResponse("Listing is not published", { status: 409 });
  }

  const url = buildPublicListingUrl(getSiteUrl(), listing.slug);
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 1,
    width: 320,
    color: { dark: "#1e211b", light: "#fbfaf5" },
  });

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "private, max-age=300",
      "content-disposition": `inline; filename="${qrFileName(listing.slug)}"`,
    },
  });
}
