"use client";

import { useActionState } from "react";
import {
  requestOtpAction,
  verifyOtpAction,
  type LoginFormState,
} from "./actions";

const INITIAL: LoginFormState = { step: "request", email: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(
    async (prev: LoginFormState, form: FormData) => {
      const intent = String(form.get("intent") ?? "");
      if (intent === "verify") return verifyOtpAction(prev, form);
      return requestOtpAction(prev, form);
    },
    INITIAL,
  );

  const onVerifyStep = state.step === "verify";

  return (
    <form action={action} className="space-y-5">
      {/* Only carry email via hidden field on the verify step. On the request
          step the visible email input is the single source, so two fields
          named "email" never coexist (FormData.get returns the first). */}
      {onVerifyStep && (
        <input type="hidden" name="email" value={state.email} />
      )}

      {state.message && (
        <p className="rounded-control bg-rice px-3 py-2 text-sm text-ink">
          {state.message}
        </p>
      )}
      {state.error && (
        <p
          role="alert"
          className="rounded-control border border-danger bg-white px-3 py-2 text-sm text-danger"
        >
          {state.error}
        </p>
      )}

      {!onVerifyStep ? (
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            defaultValue={state.email}
            placeholder="you@example.com"
            className="w-full rounded-control border border-stone bg-white px-3 py-2 text-base text-ink focus-visible:outline-2 focus-visible:outline-leaf"
          />
          <input type="hidden" name="intent" value="request" />
          <p className="text-xs text-muted-ink">
            We email you a 6-digit code. No password needed.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="token" className="block text-sm font-medium text-ink">
            Verification code
          </label>
          <input
            id="token"
            name="token"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={10}
            required
            placeholder="Enter the code"
            className="w-full rounded-control border border-stone bg-white px-3 py-2 text-center text-lg tracking-[0.4em] text-ink focus-visible:outline-2 focus-visible:outline-leaf"
          />
          <input type="hidden" name="intent" value="verify" />
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-control bg-leaf px-4 py-2.5 text-sm font-medium text-paper hover:bg-deep-leaf disabled:opacity-60"
      >
        {pending
          ? "Working…"
          : onVerifyStep
            ? "Verify and continue"
            : "Send code"}
      </button>

      {onVerifyStep && (
        <button
          type="submit"
          name="intent"
          value="request"
          disabled={pending}
          className="w-full text-center text-sm text-muted-ink underline hover:text-ink disabled:opacity-60"
        >
          Use a different email or resend code
        </button>
      )}
    </form>
  );
}
