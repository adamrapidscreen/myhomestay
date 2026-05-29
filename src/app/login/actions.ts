"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Email OTP auth actions.
 *
 * Two-step flow: request a 6-digit code by email, then verify it. No password
 * storage. Sessions are cookie-based via @supabase/ssr. See
 * _planning/security-gate-chapter-4.md founder decision (Email OTP).
 */

export interface LoginFormState {
  step: "request" | "verify";
  email: string;
  error?: string;
  message?: string;
}

function isValidEmail(value: string): boolean {
  // Conservative shape check; Supabase performs authoritative validation.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export async function requestOtpAction(
  _prev: LoginFormState,
  form: FormData,
): Promise<LoginFormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();

  if (!isValidEmail(email)) {
    return { step: "request", email, error: "Enter a valid email address." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    return {
      step: "request",
      email,
      error: "Could not send the code. Please try again in a moment.",
    };
  }

  return {
    step: "verify",
    email,
    message: `We sent a sign-in code to ${email}. Enter it below.`,
  };
}

export async function verifyOtpAction(
  _prev: LoginFormState,
  form: FormData,
): Promise<LoginFormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const token = String(form.get("token") ?? "").replace(/\D/g, "").trim();

  if (!isValidEmail(email)) {
    return { step: "request", email, error: "Enter a valid email address." };
  }
  if (token.length < 6 || token.length > 10) {
    return {
      step: "verify",
      email,
      error: "Enter the code from your email.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    return {
      step: "verify",
      email,
      error: "That code is invalid or expired. Request a new one.",
    };
  }

  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
