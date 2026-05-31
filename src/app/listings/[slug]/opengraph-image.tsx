import { ImageResponse } from "next/og";
import { findPublishedListingBySlug } from "@/server/listings-data";
import { formatLocationDetail } from "@/lib/locations/my";

export const runtime = "edge";

export const alt = "MyHomestay listing";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

interface ListingOgParams {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ListingOgParams) {
  const { slug } = await params;
  const listing = await findPublishedListingBySlug(slug);

  const title = listing?.name ?? "MyHomestay";
  const location = listing ? formatLocationDetail(listing.location) : "Malaysia";
  const summary =
    listing?.summary ??
    "Trusted, owner-created homestays across Malaysia.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F3EA",
          color: "#1D1B16",
          padding: 64,
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 36, fontWeight: 700 }}>MyHomestay</div>
          <div
            style={{
              border: "1px solid #C9BFAF",
              borderRadius: 999,
              padding: "10px 18px",
              fontSize: 22,
              color: "#52685A",
            }}
          >
            Malaysia
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 24,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#687063",
              marginBottom: 24,
            }}
          >
            {location}
          </div>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1,
              letterSpacing: 0,
              maxWidth: 940,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.35,
              color: "#4E5650",
              maxWidth: 900,
            }}
          >
            {summary}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #D9D0C2",
            paddingTop: 24,
            fontSize: 24,
            color: "#52685A",
          }}
        >
          <span>Owner-created listings</span>
          <span>Continue on WhatsApp</span>
        </div>
      </div>
    ),
    size,
  );
}
