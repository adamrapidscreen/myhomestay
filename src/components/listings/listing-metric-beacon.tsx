"use client";

import { useEffect } from "react";

type ListingMetric = "views" | "whatsapp_clicks";

export function recordListingMetric(listingId: string, metric: ListingMetric) {
  const payload = JSON.stringify({ listingId, metric });
  const url = "/api/listing-metrics";
  const sendWithFetch = () => {
    void fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    });
  };

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon(url, blob)) return;
    sendWithFetch();
    return;
  }

  sendWithFetch();
}

export function ListingViewBeacon({ listingId }: { listingId: string }) {
  useEffect(() => {
    recordListingMetric(listingId, "views");
  }, [listingId]);

  return null;
}
