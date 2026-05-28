import { describe, it, expect } from "vitest";
import {
  applyListingFilters,
  isFilterStateEmpty,
  parseListingFilters,
  EMPTY_FILTERS,
} from "./listing-filters";
import { mockListings } from "@/data/listings";

const published = mockListings.filter((l) => l.status === "published");

describe("parseListingFilters", () => {
  it("returns empty state for no params", () => {
    expect(parseListingFilters({})).toEqual(EMPTY_FILTERS);
  });

  it("ignores invalid state slug", () => {
    const f = parseListingFilters({ state: "atlantis" });
    expect(f.state).toBeNull();
  });

  it("parses valid state, capacity, maxPrice, flags, q", () => {
    const f = parseListingFilters({
      state: "terengganu",
      capacity: "4",
      maxPrice: "300",
      muslim: "1",
      family: "1",
      q: "Sawah",
    });
    expect(f.state).toBe("terengganu");
    expect(f.minCapacity).toBe(4);
    expect(f.maxPrice).toBe(300);
    expect(f.muslimFriendly).toBe(true);
    expect(f.familyFriendly).toBe(true);
    expect(f.query).toBe("sawah");
  });

  it("rejects non-positive numbers", () => {
    const f = parseListingFilters({ capacity: "0", maxPrice: "-5" });
    expect(f.minCapacity).toBeNull();
    expect(f.maxPrice).toBeNull();
  });
});

describe("isFilterStateEmpty", () => {
  it("true for default", () => {
    expect(isFilterStateEmpty(EMPTY_FILTERS)).toBe(true);
  });
  it("false when query is set", () => {
    expect(isFilterStateEmpty({ ...EMPTY_FILTERS, query: "foo" })).toBe(false);
  });
});

describe("applyListingFilters", () => {
  it("returns all when filters are empty", () => {
    expect(applyListingFilters(published, EMPTY_FILTERS)).toEqual(published);
  });

  it("filters by state", () => {
    const f = { ...EMPTY_FILTERS, state: "pulau-pinang" as const };
    const out = applyListingFilters(published, f);
    expect(out.length).toBeGreaterThan(0);
    for (const l of out) expect(l.location.state).toBe("pulau-pinang");
  });

  it("filters by Muslim and family combo", () => {
    const f = {
      ...EMPTY_FILTERS,
      muslimFriendly: true,
      familyFriendly: true,
    };
    const out = applyListingFilters(published, f);
    for (const l of out) {
      expect(l.trust.muslimFriendly).toBe(true);
      expect(l.trust.familyFriendly).toBe(true);
    }
  });

  it("filters by maxPrice ceiling against minPerNight", () => {
    const f = { ...EMPTY_FILTERS, maxPrice: 200 };
    const out = applyListingFilters(published, f);
    for (const l of out) expect(l.price.minPerNight).toBeLessThanOrEqual(200);
  });

  it("filters by minCapacity", () => {
    const f = { ...EMPTY_FILTERS, minCapacity: 10 };
    const out = applyListingFilters(published, f);
    for (const l of out) expect(l.capacity).toBeGreaterThanOrEqual(10);
  });

  it("free-text q searches name and area", () => {
    const f = { ...EMPTY_FILTERS, query: "sawah" };
    const out = applyListingFilters(published, f);
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((l) => /sawah/i.test(`${l.name} ${l.location.area}`))).toBe(true);
  });

  it("returns empty when nothing matches", () => {
    const f = { ...EMPTY_FILTERS, query: "thereisnowaythismatches" };
    expect(applyListingFilters(published, f)).toEqual([]);
  });
});
