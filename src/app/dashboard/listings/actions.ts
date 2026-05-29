"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/server/auth";
import {
  createDraftListing,
  findListingById,
  setListingStatus,
  updateListingFields,
} from "@/server/listings-data";
import {
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

function intentFromForm(form: FormData): ListingBuilderFormState["intent"] {
  const v = String(form.get("intent") ?? "save-draft");
  if (v === "publish" || v === "save-draft" || v === "pause" || v === "resume")
    return v;
  return "save-draft";
}

export async function saveListingAction(
  _prev: ListingBuilderFormState,
  form: FormData,
): Promise<ListingBuilderFormState> {
  const intent = intentFromForm(form);
  const input = parseListingBuilderInput(form);
  const owner = await requireOwner();
  const listingId = String(form.get("listingId") ?? "").trim();

  // App-level validation for friendly inline errors. The database triggers
  // are the authoritative backstop for free-tier and the publish gate.
  const validationIntent = intent === "publish" ? "publish" : "save-draft";
  const errors = validateListingBuilderInput(input, validationIntent);
  if (Object.keys(errors).length > 0) {
    return { ok: false, intent, errors, values: input };
  }

  const isNew = !listingId;

  // New listings always start as drafts; publishing happens from the row/edit.
  if (isNew) {
    if (intent === "publish") {
      return {
        ok: false,
        intent,
        errors: { general: "Save as draft first, then publish from the row." },
        values: input,
      };
    }
    const result = await createDraftListing(owner.id, input);
    if (!result.ok) {
      return { ok: false, intent, errors: { general: result.error }, values: input };
    }
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

  // Existing listing: confirm ownership (RLS already scopes, this is defense
  // in depth and a friendly not-found message).
  const existing = await findListingById(listingId);
  if (!existing || existing.ownerId !== owner.id) {
    return {
      ok: false,
      intent,
      errors: { general: "Listing not found in this session." },
      values: input,
    };
  }

  // Always persist the edited fields first.
  const saved = await updateListingFields(listingId, input);
  if (!saved.ok) {
    return { ok: false, intent, errors: { general: saved.error }, values: input };
  }

  // Then apply any status change. DB triggers enforce the publish gate and
  // legal transitions; surface their messages verbatim when they fire.
  if (intent === "publish" || intent === "pause" || intent === "resume") {
    const targetStatus = intent === "pause" ? "paused" : "published";
    const moved = await setListingStatus(listingId, targetStatus);
    if (!moved.ok) {
      return { ok: false, intent, errors: { general: moved.error }, values: input };
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/listings");
  revalidatePath(`/listings/${saved.listing.slug}`);
  redirect("/dashboard");
}
