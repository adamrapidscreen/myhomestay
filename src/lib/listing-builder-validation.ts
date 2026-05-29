import type { Listing, ListingStatus } from "@/types/listings";
import type { MalaysianState } from "@/types/locations";
import { isMalaysianState } from "@/lib/locations/my";

export interface ListingBuilderInput {
  name: string;
  summary: string;
  description: string;
  state: MalaysianState | null;
  town: string;
  area: string;
  postcode: string;
  capacity: number | null;
  bedrooms: number | null;
  minPerNight: number | null;
  maxPerNight: number | null;
  amenities: string[];
  houseRules: string[];
  muslimFriendly: boolean;
  familyFriendly: boolean;
  photoCategories: string[];
}

export type ListingBuilderErrors = Partial<
  Record<keyof ListingBuilderInput | "general", string>
>;

const ALLOWED_AMENITIES = new Set([
  "wifi",
  "kitchen",
  "shared-kitchen",
  "parking",
  "fan",
  "air-conditioning",
  "washing-machine",
  "kettle",
  "outdoor-seating",
  "tv",
]);

const ALLOWED_PHOTO_CATEGORIES = new Set([
  "exterior",
  "bedroom",
  "living",
  "kitchen",
  "bathroom",
  "surrounding",
  "hero",
]);

function num(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const n = Number(String(v).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

function arr(v: FormDataEntryValue[] | null): string[] {
  if (!v) return [];
  return v.map((x) => String(x).trim()).filter(Boolean);
}

export function parseListingBuilderInput(form: FormData): ListingBuilderInput {
  const stateRaw = str(form.get("state"));
  const state = isMalaysianState(stateRaw) ? stateRaw : null;

  const amenities = arr(form.getAll("amenities")).filter((a) =>
    ALLOWED_AMENITIES.has(a),
  );
  const photoCategories = arr(form.getAll("photoCategories")).filter((c) =>
    ALLOWED_PHOTO_CATEGORIES.has(c),
  );
  const rulesRaw = str(form.get("houseRules"));
  const houseRules = rulesRaw
    .split(/\r?\n/)
    .map((r) => r.trim())
    .filter(Boolean);

  return {
    name: str(form.get("name")),
    summary: str(form.get("summary")),
    description: str(form.get("description")),
    state,
    town: str(form.get("town")),
    area: str(form.get("area")),
    postcode: str(form.get("postcode")),
    capacity: num(form.get("capacity")),
    bedrooms: num(form.get("bedrooms")),
    minPerNight: num(form.get("minPerNight")),
    maxPerNight: num(form.get("maxPerNight")),
    amenities,
    houseRules,
    muslimFriendly: form.get("muslimFriendly") === "on",
    familyFriendly: form.get("familyFriendly") === "on",
    photoCategories,
  };
}

export function validateListingBuilderInput(
  input: ListingBuilderInput,
  intent: "save-draft" | "publish",
): ListingBuilderErrors {
  const errors: ListingBuilderErrors = {};

  if (!input.name) errors.name = "Add a listing name.";
  else if (input.name.length > 80) errors.name = "Keep name under 80 characters.";

  if (input.summary.length > 240) errors.summary = "Keep summary under 240 characters.";

  if (intent === "publish") {
    if (!input.summary) errors.summary = "Add a short summary.";
    if (!input.description) errors.description = "Add a longer description.";
    if (!input.state) errors.state = "Select a state.";
    if (!input.area) errors.area = "Add an area.";
    if (!input.capacity || input.capacity < 1) errors.capacity = "Set guest capacity.";
    if (!input.bedrooms || input.bedrooms < 1) errors.bedrooms = "Set number of bedrooms.";
    if (!input.minPerNight) errors.minPerNight = "Set minimum nightly price.";
    if (!input.maxPerNight) errors.maxPerNight = "Set maximum nightly price.";
    if (
      input.minPerNight &&
      input.maxPerNight &&
      input.maxPerNight < input.minPerNight
    ) {
      errors.maxPerNight = "Maximum cannot be less than minimum.";
    }
    if (input.houseRules.length === 0) errors.houseRules = "Add at least one house rule.";
  }

  return errors;
}

/** Build a slug from a listing name. Falls back to an id-based slug. */
export function buildSlugFromName(name: string, fallbackId: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  return base || fallbackId;
}

/** True if a target status transition is allowed in the MVP. */
export function canTransitionTo(from: ListingStatus, to: ListingStatus): boolean {
  if (from === to) return true;
  if (from === "draft" && (to === "published" || to === "draft")) return true;
  if (from === "published" && (to === "paused" || to === "draft")) return true;
  if (from === "paused" && (to === "published" || to === "draft")) return true;
  if (from === "needs_review" && (to === "draft" || to === "published")) return true;
  return false;
}

/** Build a placeholder photo set from selected categories. */
export function buildPlaceholderPhotos(
  categories: string[],
): Listing["photos"] {
  return categories.map((category, index) => ({
    id: `photo-${index + 1}`,
    src: `/mock/listings/placeholder/${category}.jpg`,
    alt: `${category} placeholder photo`,
    category: category as Listing["photos"][number]["category"],
    order: index + 1,
  }));
}
