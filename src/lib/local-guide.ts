import type { GuideItemCategory } from "@/types/launch";

/**
 * Pure local-guide helpers.
 *
 * Validation, clamping, and display labels for owner guide items. Kept free of
 * server/database imports so they are unit-testable and reusable on client and
 * server. The database (migration 0012) is the authoritative backstop for
 * length and enum constraints; these mirror them for friendly inline errors.
 */

export const GUIDE_TITLE_MAX = 80;
export const GUIDE_NOTE_MAX = 240;
export const GUIDE_DISTANCE_MAX = 60;

/** Ordered category list for select menus. */
export const GUIDE_CATEGORIES: GuideItemCategory[] = [
  "food",
  "mosque-surau",
  "groceries",
  "attraction",
  "transport",
  "check-in",
  "local-tip",
  "other",
];

/** Display label for each category. Plain, scannable, English-first. */
export const GUIDE_CATEGORY_LABELS: Record<GuideItemCategory, string> = {
  food: "Food nearby",
  "mosque-surau": "Mosque / surau",
  groceries: "Groceries",
  attraction: "Attraction",
  transport: "Transport",
  "check-in": "Check-in note",
  "local-tip": "Local tip",
  other: "Other",
};

/** Narrow an unknown value to a valid category, defaulting to "local-tip". */
export function parseGuideCategory(value: unknown): GuideItemCategory {
  return GUIDE_CATEGORIES.includes(value as GuideItemCategory)
    ? (value as GuideItemCategory)
    : "local-tip";
}

export interface GuideItemDraft {
  category: GuideItemCategory;
  title: string;
  note: string;
  distanceLabel: string;
  isPublic: boolean;
}

export type GuideItemFieldError =
  | "title-required"
  | "title-too-long"
  | "note-too-long"
  | "distance-too-long";

export interface GuideItemValidation {
  ok: boolean;
  errors: GuideItemFieldError[];
}

/** Trim and clamp raw form values into a normalized draft. */
export function normalizeGuideDraft(input: {
  category?: unknown;
  title?: unknown;
  note?: unknown;
  distanceLabel?: unknown;
  isPublic?: unknown;
}): GuideItemDraft {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  return {
    category: parseGuideCategory(input.category),
    title: str(input.title),
    note: str(input.note),
    distanceLabel: str(input.distanceLabel),
    isPublic: input.isPublic !== false && input.isPublic !== "false",
  };
}

/** Validate a normalized draft against length/required rules. */
export function validateGuideDraft(draft: GuideItemDraft): GuideItemValidation {
  const errors: GuideItemFieldError[] = [];
  if (draft.title.length === 0) errors.push("title-required");
  if (draft.title.length > GUIDE_TITLE_MAX) errors.push("title-too-long");
  if (draft.note.length > GUIDE_NOTE_MAX) errors.push("note-too-long");
  if (draft.distanceLabel.length > GUIDE_DISTANCE_MAX) {
    errors.push("distance-too-long");
  }
  return { ok: errors.length === 0, errors };
}

/** Display copy for guide field errors. */
export const GUIDE_ERROR_LABELS: Record<GuideItemFieldError, string> = {
  "title-required": "Add a short title.",
  "title-too-long": `Title must be ${GUIDE_TITLE_MAX} characters or fewer.`,
  "note-too-long": `Note must be ${GUIDE_NOTE_MAX} characters or fewer.`,
  "distance-too-long": `Distance label must be ${GUIDE_DISTANCE_MAX} characters or fewer.`,
};
