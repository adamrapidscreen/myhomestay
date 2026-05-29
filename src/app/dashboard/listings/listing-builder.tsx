"use client";

import { useActionState } from "react";
import {
  saveListingAction,
  type ListingBuilderFormState,
} from "./actions";
import { MALAYSIAN_STATES, formatStateLabel } from "@/lib/locations/my";
import type { Listing } from "@/types/listings";

const AMENITY_OPTIONS = [
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
] as const;

interface ListingBuilderProps {
  listing: Listing | null;
  isNew: boolean;
}

const INITIAL: ListingBuilderFormState = { ok: false, intent: null };

export function ListingBuilder({ listing, isNew }: ListingBuilderProps) {
  const [state, formAction, pending] = useActionState(saveListingAction, INITIAL);
  const errors = state.errors ?? {};

  const v = state.values ?? {
    name: listing?.name ?? "",
    summary: listing?.summary ?? "",
    description: listing?.description ?? "",
    state: listing?.location.state ?? null,
    town: listing?.location.town ?? "",
    area: listing?.location.area ?? "",
    postcode: listing?.location.postcode ?? "",
    capacity: listing?.capacity ?? null,
    bedrooms: listing?.bedrooms ?? null,
    minPerNight: listing?.price.minPerNight ?? null,
    maxPerNight: listing?.price.maxPerNight ?? null,
    amenities: listing?.amenities ?? [],
    houseRules: listing?.houseRules ?? [],
    muslimFriendly: listing?.trust.muslimFriendly ?? false,
    familyFriendly: listing?.trust.familyFriendly ?? false,
    photoCategories: listing?.photos.map((p) => p.category) ?? [],
  };

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {listing && <input type="hidden" name="listingId" value={listing.id} />}
      {errors.general && (
        <p
          role="alert"
          className="rounded-control border border-danger bg-rice px-3 py-2 text-sm text-danger"
        >
          {errors.general}
        </p>
      )}

      <Section title="Basics">
        <Field id="name" label="Listing name" error={errors.name}>
          <input
            id="name"
            name="name"
            defaultValue={v.name}
            maxLength={80}
            required
            className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm"
          />
        </Field>
        <Field
          id="summary"
          label="Short summary"
          hint="One line, scannable. Max 240 characters."
          error={errors.summary}
        >
          <input
            id="summary"
            name="summary"
            defaultValue={v.summary}
            maxLength={240}
            className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm"
          />
        </Field>
        <Field id="description" label="Longer description" error={errors.description}>
          <textarea
            id="description"
            name="description"
            defaultValue={v.description}
            rows={5}
            className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm"
          />
        </Field>
      </Section>

      <Section title="Location">
        <Field id="state" label="State" error={errors.state}>
          <select
            id="state"
            name="state"
            defaultValue={v.state ?? ""}
            className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm"
          >
            <option value="">Select a state</option>
            {MALAYSIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {formatStateLabel(s)}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="town" label="Town" error={errors.town}>
            <input
              id="town"
              name="town"
              defaultValue={v.town}
              className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm"
            />
          </Field>
          <Field id="area" label="Area" error={errors.area}>
            <input
              id="area"
              name="area"
              defaultValue={v.area}
              className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm"
            />
          </Field>
        </div>
        <Field id="postcode" label="Postcode (optional)" error={errors.postcode}>
          <input
            id="postcode"
            name="postcode"
            inputMode="numeric"
            maxLength={5}
            defaultValue={v.postcode}
            className="w-full max-w-[160px] rounded-control border border-stone bg-white px-3 py-2 text-sm"
          />
        </Field>
      </Section>

      <Section title="Capacity and price">
        <div className="grid grid-cols-2 gap-4">
          <Field id="capacity" label="Guest capacity" error={errors.capacity}>
            <input
              id="capacity"
              name="capacity"
              type="number"
              inputMode="numeric"
              min={1}
              defaultValue={v.capacity ?? ""}
              className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm"
            />
          </Field>
          <Field id="bedrooms" label="Bedrooms" error={errors.bedrooms}>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              inputMode="numeric"
              min={1}
              defaultValue={v.bedrooms ?? ""}
              className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field id="minPerNight" label="Min RM/night" error={errors.minPerNight}>
            <input
              id="minPerNight"
              name="minPerNight"
              type="number"
              inputMode="numeric"
              min={1}
              defaultValue={v.minPerNight ?? ""}
              className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm"
            />
          </Field>
          <Field id="maxPerNight" label="Max RM/night" error={errors.maxPerNight}>
            <input
              id="maxPerNight"
              name="maxPerNight"
              type="number"
              inputMode="numeric"
              min={1}
              defaultValue={v.maxPerNight ?? ""}
              className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm"
            />
          </Field>
        </div>
      </Section>

      <Section title="Amenities">
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((a) => (
            <label
              key={a}
              className="inline-flex items-center gap-2 rounded-full border border-stone bg-white px-3 py-1 text-sm has-[:checked]:border-leaf has-[:checked]:bg-rice"
            >
              <input
                type="checkbox"
                name="amenities"
                value={a}
                defaultChecked={v.amenities.includes(a)}
                className="h-3 w-3"
              />
              {a.replace(/-/g, " ")}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Trust">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="muslimFriendly"
            defaultChecked={v.muslimFriendly}
            className="h-4 w-4"
          />
          Muslim-friendly
        </label>
        <label className="mt-2 flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="familyFriendly"
            defaultChecked={v.familyFriendly}
            className="h-4 w-4"
          />
          Family-friendly
        </label>
      </Section>

      <Section title="House rules" hint="One rule per line.">
        {errors.houseRules && (
          <p role="alert" className="mb-2 text-sm text-danger">
            {errors.houseRules}
          </p>
        )}
        <textarea
          id="houseRules"
          name="houseRules"
          defaultValue={v.houseRules.join("\n")}
          rows={4}
          className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm"
        />
      </Section>

      <div className="flex flex-wrap items-center gap-3 border-t border-stone pt-6">
        <button
          type="submit"
          name="intent"
          value="save-draft"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-control border border-stone bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-rice disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save as draft"}
        </button>
        {!isNew && (
          <>
            <button
              type="submit"
              name="intent"
              value="publish"
              disabled={pending}
              className="inline-flex items-center justify-center rounded-control bg-leaf px-5 py-2.5 text-sm font-medium text-paper hover:bg-deep-leaf disabled:opacity-60"
            >
              Publish
            </button>
            {listing?.status === "published" && (
              <button
                type="submit"
                name="intent"
                value="pause"
                disabled={pending}
                className="inline-flex items-center justify-center rounded-control border border-clay bg-paper px-4 py-2 text-sm font-medium text-clay hover:bg-rice disabled:opacity-60"
              >
                Pause
              </button>
            )}
          </>
        )}
      </div>
    </form>
  );
}

interface SectionProps {
  title: string;
  hint?: string;
  children: React.ReactNode;
}

function Section({ title, hint, children }: SectionProps) {
  return (
    <section className="space-y-4 rounded-card border border-stone bg-white p-4 sm:p-6">
      <header>
        <h2 className="font-display text-lg text-ink">{title}</h2>
        {hint && <p className="mt-1 text-xs text-muted-ink">{hint}</p>}
      </header>
      {children}
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-muted-ink">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && (
        <p role="alert" className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
