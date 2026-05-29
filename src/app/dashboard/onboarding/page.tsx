import type { Metadata } from "next";
import { requireOwner } from "@/server/auth";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = {
  title: "Owner profile",
};

export default async function OnboardingPage() {
  const owner = await requireOwner();

  return (
    <div className="max-w-form mx-auto space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-ink">
          Owner profile
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Set up your owner profile
        </h1>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-muted-ink">
          We use these details on your public listing pages and the WhatsApp
          handoff. You can change them any time.
        </p>
      </div>

      <OnboardingForm
        initial={{
          displayName: owner.displayName,
          fullName: owner.fullName,
          whatsappNumber: owner.whatsappNumber,
          onboardingComplete: owner.onboardingComplete,
        }}
      />
    </div>
  );
}
