"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Listing, ListingStatus } from "@/types/listings";
import { getMockCurrentOwner } from "@/data/owners";
import {
  findListingById,
  insertListing,
  listListingsByOwner,
  replaceListing,
} from "@/server/owner-store";
import { findOwnerById } from "@/server/owner-profile-store";
import { evaluateListingCompleteness } from "@/lib/listing-completeness";
import {
  buildPlaceholderPhotos,
  buildSlugFromName,
  canTransitionTo,
  parseListingBuilderInput,
  validateListingBuilderInput,
  type ListingBuilderErrors,
  type ListingBuilderInput,
} from "@/lib/listing-builder-validation";

export interface ListingBuilderFormState {
  ok: boolean;
  intent: "save-draft" | "publish" | "pause" | "resume" | null;
  errors?: ListingBuilderErrors;
  values?: ListingBuilderInput;
  message?: string;
}

const FREE_LISTING_LIMIT = 3;

function applyInputToListing(
  base: Listing,
  input: ListingBuilderInput,
): Listing {
  const photos =
    input.photoCategories.length > 0
      ? buildPlaceholderPhotos(input.photoCategories)
      : base.photos;

  const next: Listing = {
    ...base,
    name: input.name,
    summary: input.summary,
    description: input.description,
    capacity: input.capacity ?? base.capacity,
    bedrooms: input.bedrooms ?? base.bedrooms,
    location: input.state
      ? {
          ...base.location,
          state: input.state,
          area: input.area || base.location.area,
          town: input.town || base.location.town,
          postcode: input.postcode || base.location.postcode,
          id: `${input.area || base.location.area}-${input.state}`
            .toLowerCase()
            .replace(/\s+/g, "-"),
        }
      : base.location,
    price: {
      currency: "MYR",
      minPerNight: input.minPerNight ?? base.price.minPerNight,
      maxPerNight: input.maxPerNight ?? base.price.maxPerNight,
    },
    amenities: input.amenities,
    houseRules: input.houseRules,
    trust: {
      ...base.trust,
      muslimFriendly: input.muslimFriendly,
      familyFriendly: input.familyFriendly,
      houseRulesProvided: input.houseRules.length > 0,
    },
    photos,
    updatedAt: new Date().toISOString(),
  };

  return next;
}

function newDraftFromInput(
  ownerId: string,
  input: ListingBuilderInput,
): Listing {
  const id = `listing-new-${Date.now()}`;
  const slug = buildSlugFromName(input.name, id);
  return {
    id,
    slug,
    ownerId,
    name: input.name,
    summary: input.summary,
    description: input.description,
    capacity: input.capacity ?? 0,
    bedrooms: input.bedrooms ?? 0,
    location: {
      id: slug,
      area: input.area,
      town: input.town,
      state: input.state ?? "selangor",
      postcode: input.postcode,
    },
    price: {
      currency: "MYR",
      minPerNight: input.minPerNight ?? 0,
      maxPerNight: input.maxPerNight ?? 0,
    },
    photos: buildPlaceholderPhotos(input.photoCategories),
    amenities: input.amenities,
    houseRules: input.houseRules,
    trust: {
      muslimFriendly: input.muslimFriendly,
      familyFriendly: input.familyFriendly,
      whatsappReady: false,
      houseRulesProvided: input.houseRules.length > 0,
    },
    status: "draft",
    metrics: { views: 0, whatsappClicks: 0, lastUpdatedAt: new Date().toISOString() },
    updatedAt: new Date().toISOString(),
  };
}

function intentFromForm(form: FormData): ListingBuilderFormState["intent"] {
  const v = String(form.get("intent") ?? "save-draft");
  if (v === "publish" || v === "save-draft" || v === "pause" || v === "resume")
    return v;
  return "save-draft";
}

function ownerWhatsappReady(ownerId: string): boolean {
  const owner = findOwnerById(ownerId);
  if (!owner) return false;
  if (!owner.onboardingComplete) return false;
  return owner.whatsappNumber.replace(/[^0-9]/g, "").length >= 8;
}

export async function saveListingAction(
  _prev: ListingBuilderFormState,
  form: FormData,
): Promise<ListingBuilderFormState> {
  const intent = intentFromForm(form);
  const input = parseListingBuilderInput(form);
  const owner = getMockCurrentOwner();
  const listingId = String(form.get("listingId") ?? "").trim();

  const validationIntent = intent === "publish" ? "publish" : "save-draft";
  const errors = validateListingBuilderInput(input, validationIntent);

  if (Object.keys(errors).length > 0) {
    return { ok: false, intent, errors, values: input };
  }

  const isNew = !listingId;
  let listing: Listing;

  if (isNew) {
    if (intent === "publish") {
      return {
        ok: false,
        intent,
        errors: { general: "Save as draft first, then publish from the row." },
        values: input,
      };
    }
    const ownedCount = listListingsByOwner(owner.id).length;
    if (ownedCount >= FREE_LISTING_LIMIT) {
      return {
        ok: false,
        intent,
        errors: {
          general: `Free tier limit reached: ${FREE_LISTING_LIMIT} listings.`,
        },
        values: input,
      };
    }
    listing = newDraftFromInput(owner.id, input);
    insertListing(listing);
  } else {
    const existing = findListingById(listingId);
    if (!existing || existing.ownerId !== owner.id) {
      return {
        ok: false,
        intent,
        errors: { general: "Listing not found in this session." },
        values: input,
      };
    }
    listing = applyInputToListing(existing, input);
    if (intent === "publish") {
      const whatsappReady = ownerWhatsappReady(owner.id);
      const updated: Listing = {
        ...listing,
        trust: { ...listing.trust, whatsappReady },
      };
      const completeness = evaluateListingCompleteness(updated);
      if (!completeness.publishable) {
        return {
          ok: false,
          intent,
          errors: {
            general: `Cannot publish yet: ${completeness.missingTasks.join(" · ")}`,
          },
          values: input,
        };
      }
      const targetStatus: ListingStatus = "published";
      if (!canTransitionTo(updated.status, targetStatus)) {
        return {
          ok: false,
          intent,
          errors: { general: `Cannot transition from ${updated.status} to published.` },
          values: input,
        };
      }
      replaceListing({ ...updated, status: targetStatus });
    } else if (intent === "pause") {
      if (!canTransitionTo(listing.status, "paused")) {
        return {
          ok: false,
          intent,
          errors: { general: `Cannot pause from ${listing.status}.` },
          values: input,
        };
      }
      replaceListing({ ...listing, status: "paused" });
    } else if (intent === "resume") {
      if (!canTransitionTo(listing.status, "published")) {
        return {
          ok: false,
          intent,
          errors: { general: `Cannot resume from ${listing.status}.` },
          values: input,
        };
      }
      replaceListing({ ...listing, status: "published" });
    } else {
      replaceListing({ ...listing, status: "draft" });
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/listings");
  if (!isNew) revalidatePath(`/listings/${listing.slug}`);
  redirect("/dashboard");
}
