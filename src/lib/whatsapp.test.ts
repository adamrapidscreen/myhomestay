import { describe, it, expect } from "vitest";
import {
  buildListingInquiryMessage,
  buildListingWhatsappUrl,
  buildWhatsappUrl,
  isValidWhatsappNumber,
  normalizeWhatsappNumber,
} from "./whatsapp";
import { mockListings } from "@/data/listings";

const sampleListing = mockListings[0];

describe("normalizeWhatsappNumber", () => {
  it("strips spaces, dashes, plus", () => {
    expect(normalizeWhatsappNumber("+60 12-345 6789")).toBe("60123456789");
  });
  it("returns empty for non-digit string", () => {
    expect(normalizeWhatsappNumber("abc")).toBe("");
  });
});

describe("isValidWhatsappNumber", () => {
  it("accepts a plausible MY number", () => {
    expect(isValidWhatsappNumber("+60123456789")).toBe(true);
  });
  it("rejects numbers shorter than 8 digits", () => {
    expect(isValidWhatsappNumber("1234567")).toBe(false);
  });
  it("rejects numbers longer than 15 digits", () => {
    expect(isValidWhatsappNumber("1234567890123456")).toBe(false);
  });
  it("rejects empty string", () => {
    expect(isValidWhatsappNumber("")).toBe(false);
  });
});

describe("buildWhatsappUrl", () => {
  it("returns null for invalid number", () => {
    expect(buildWhatsappUrl({ number: "junk" })).toBeNull();
  });
  it("builds base wa.me URL when no message", () => {
    expect(buildWhatsappUrl({ number: "+60123456789" })).toBe(
      "https://wa.me/60123456789",
    );
  });
  it("URL-encodes the message", () => {
    const url = buildWhatsappUrl({
      number: "+60123456789",
      message: "Hi & hello?\nLine two",
    });
    expect(url).toBe(
      "https://wa.me/60123456789?text=Hi%20%26%20hello%3F%0ALine%20two",
    );
  });
});

describe("buildListingInquiryMessage", () => {
  it("includes the listing name in the first line", () => {
    const msg = buildListingInquiryMessage(sampleListing);
    expect(msg.startsWith(`Hi, I'm interested in your stay "${sampleListing.name}".`)).toBe(true);
  });
  it("references the area", () => {
    const msg = buildListingInquiryMessage(sampleListing);
    expect(msg).toContain(sampleListing.location.area);
  });
});

describe("buildListingWhatsappUrl", () => {
  it("returns null when owner number is invalid", () => {
    expect(buildListingWhatsappUrl(sampleListing, "junk")).toBeNull();
  });
  it("returns wa.me URL with prefilled inquiry text", () => {
    const url = buildListingWhatsappUrl(sampleListing, "+60123456789")!;
    expect(url.startsWith("https://wa.me/60123456789?text=")).toBe(true);
    expect(decodeURIComponent(url.split("text=")[1])).toContain(sampleListing.name);
  });
});
