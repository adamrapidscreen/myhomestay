"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  isValidWhatsappNumber,
  normalizeWhatsappNumber,
} from "@/lib/whatsapp";

export interface OnboardingFormState {
  ok: boolean;
  errors?: {
    displayName?: string;
    fullName?: string;
    whatsappNumber?: string;
    consent?: string;
    general?: string;
  };
  values?: {
    displayName: string;
    fullName: string;
    whatsappNumber: string;
    consent: boolean;
  };
}

export async function saveOwnerProfileAction(
  _prev: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const whatsappRaw = String(formData.get("whatsappNumber") ?? "").trim();
  const consent = formData.get("consent") === "on";

  const errors: NonNullable<OnboardingFormState["errors"]> = {};

  if (!displayName) errors.displayName = "Add a public display name.";
  if (displayName.length > 60) errors.displayName = "Keep display name under 60 characters.";

  if (!fullName) errors.fullName = "Add your full name for our records.";

  if (!whatsappRaw) {
    errors.whatsappNumber = "Add your WhatsApp number including country code.";
  } else if (!isValidWhatsappNumber(whatsappRaw)) {
    errors.whatsappNumber =
      "That does not look like a valid international number.";
  }

  if (!consent) {
    errors.consent =
      "Please confirm that booking and payment continue on WhatsApp.";
  }

  const values = { displayName, fullName, whatsappNumber: whatsappRaw, consent };

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values };
  }

  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const normalized = normalizeWhatsappNumber(whatsappRaw);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      full_name: fullName,
      whatsapp_number: `+${normalized}`,
      onboarding_complete: true,
    })
    .eq("id", user.id);

  if (error) {
    return {
      ok: false,
      errors: { general: "Could not save your profile. Please try again." },
      values,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/onboarding");
  redirect("/dashboard");
}
