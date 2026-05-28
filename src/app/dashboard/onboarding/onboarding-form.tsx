"use client";

import { useActionState } from "react";
import {
  saveOwnerProfileAction,
  type OnboardingFormState,
} from "./actions";

interface OnboardingFormProps {
  initial: {
    displayName: string;
    fullName: string;
    whatsappNumber: string;
    onboardingComplete: boolean;
  };
}

const INITIAL_STATE: OnboardingFormState = { ok: false };

export function OnboardingForm({ initial }: OnboardingFormProps) {
  const [state, formAction, pending] = useActionState(
    saveOwnerProfileAction,
    INITIAL_STATE,
  );

  const values = state.values ?? {
    displayName: initial.displayName,
    fullName: initial.fullName,
    whatsappNumber: initial.whatsappNumber,
    consent: initial.onboardingComplete,
  };
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {errors.general && (
        <p
          role="alert"
          className="rounded-control border border-danger bg-rice px-3 py-2 text-sm text-danger"
        >
          {errors.general}
        </p>
      )}

      <Field
        id="displayName"
        label="Public display name"
        hint="Shown on your listings, e.g. 'Kak Aini' or 'Pakcik Faizal'."
        error={errors.displayName}
      >
        <input
          id="displayName"
          name="displayName"
          type="text"
          defaultValue={values.displayName}
          maxLength={60}
          required
          aria-invalid={Boolean(errors.displayName) || undefined}
          className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm text-ink focus:border-leaf"
        />
      </Field>

      <Field
        id="fullName"
        label="Full name"
        hint="Used in our records only. Not shown publicly."
        error={errors.fullName}
      >
        <input
          id="fullName"
          name="fullName"
          type="text"
          defaultValue={values.fullName}
          maxLength={120}
          required
          aria-invalid={Boolean(errors.fullName) || undefined}
          className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm text-ink focus:border-leaf"
        />
      </Field>

      <Field
        id="whatsappNumber"
        label="WhatsApp number"
        hint="Include country code, e.g. +60 12 345 6789."
        error={errors.whatsappNumber}
      >
        <input
          id="whatsappNumber"
          name="whatsappNumber"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={values.whatsappNumber}
          required
          aria-invalid={Boolean(errors.whatsappNumber) || undefined}
          className="w-full rounded-control border border-stone bg-white px-3 py-2 text-sm text-ink focus:border-leaf"
        />
      </Field>

      <div className="rounded-card border border-stone bg-rice p-4">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            name="consent"
            defaultChecked={values.consent}
            className="mt-0.5 h-4 w-4 rounded border-stone"
            aria-invalid={Boolean(errors.consent) || undefined}
          />
          <span>
            I understand that <span className="font-medium">booking and payment continue on WhatsApp</span>,
            not on MyHomestay. Travellers will message me directly to confirm
            dates and price.
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="mt-2 text-sm text-danger">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-control bg-leaf px-5 py-2.5 text-sm font-medium text-paper hover:bg-deep-leaf disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
        <p className="text-xs text-muted-ink">
          Mock data session. Changes reset when the dev server restarts.
        </p>
      </div>
    </form>
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
