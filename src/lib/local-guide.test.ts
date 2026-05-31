import { describe, expect, it } from "vitest";
import {
  GUIDE_DISTANCE_MAX,
  GUIDE_NOTE_MAX,
  GUIDE_TITLE_MAX,
  normalizeGuideDraft,
  parseGuideCategory,
  validateGuideDraft,
} from "./local-guide";

describe("parseGuideCategory", () => {
  it("accepts a valid category", () => {
    expect(parseGuideCategory("food")).toBe("food");
    expect(parseGuideCategory("mosque-surau")).toBe("mosque-surau");
  });

  it("defaults unknown values to local-tip", () => {
    expect(parseGuideCategory("not-a-category")).toBe("local-tip");
    expect(parseGuideCategory(undefined)).toBe("local-tip");
    expect(parseGuideCategory(42)).toBe("local-tip");
  });
});

describe("normalizeGuideDraft", () => {
  it("trims strings and defaults public to true", () => {
    const draft = normalizeGuideDraft({
      category: "food",
      title: "  Warung Pak Mat  ",
      note: "  Best nasi lemak  ",
      distanceLabel: "  5 min drive  ",
    });
    expect(draft.title).toBe("Warung Pak Mat");
    expect(draft.note).toBe("Best nasi lemak");
    expect(draft.distanceLabel).toBe("5 min drive");
    expect(draft.isPublic).toBe(true);
  });

  it("treats explicit false / 'false' as private", () => {
    expect(normalizeGuideDraft({ title: "x", isPublic: false }).isPublic).toBe(
      false,
    );
    expect(
      normalizeGuideDraft({ title: "x", isPublic: "false" }).isPublic,
    ).toBe(false);
  });

  it("falls back to local-tip for bad category", () => {
    expect(normalizeGuideDraft({ title: "x", category: "bogus" }).category).toBe(
      "local-tip",
    );
  });
});

describe("validateGuideDraft", () => {
  const base = {
    category: "food" as const,
    title: "Title",
    note: "Note",
    distanceLabel: "",
    isPublic: true,
  };

  it("passes a valid draft", () => {
    expect(validateGuideDraft(base)).toEqual({ ok: true, errors: [] });
  });

  it("requires a title", () => {
    const result = validateGuideDraft({ ...base, title: "" });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("title-required");
  });

  it("rejects an over-long title", () => {
    const result = validateGuideDraft({
      ...base,
      title: "a".repeat(GUIDE_TITLE_MAX + 1),
    });
    expect(result.errors).toContain("title-too-long");
  });

  it("rejects an over-long note", () => {
    const result = validateGuideDraft({
      ...base,
      note: "a".repeat(GUIDE_NOTE_MAX + 1),
    });
    expect(result.errors).toContain("note-too-long");
  });

  it("rejects an over-long distance label", () => {
    const result = validateGuideDraft({
      ...base,
      distanceLabel: "a".repeat(GUIDE_DISTANCE_MAX + 1),
    });
    expect(result.errors).toContain("distance-too-long");
  });
});
