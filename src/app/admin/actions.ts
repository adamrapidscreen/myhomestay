"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth";
import { moderateListing, type ModerationAction } from "@/server/admin-data";

export interface AdminModerationState {
  ok: boolean;
  message?: string;
  error?: string;
}

function parseAction(value: string): ModerationAction | null {
  if (
    value === "pause" ||
    value === "needs_review" ||
    value === "publish" ||
    value === "clear"
  ) {
    return value;
  }
  return null;
}

export async function moderateListingAction(
  _prev: AdminModerationState,
  form: FormData,
): Promise<AdminModerationState> {
  await requireAdmin();

  const listingId = String(form.get("listingId") ?? "").trim();
  const action = parseAction(String(form.get("action") ?? ""));
  const note = String(form.get("note") ?? "");

  if (!listingId) return { ok: false, error: "Missing listing." };
  if (!action) return { ok: false, error: "Unknown moderation action." };

  const result = await moderateListing(listingId, action, note);
  if (!result.ok) {
    return { ok: false, error: result.error ?? "Could not apply the action." };
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/listings");

  const label =
    action === "pause"
      ? "paused"
      : action === "needs_review"
        ? "flagged for review"
        : action === "publish"
          ? "restored live"
          : "cleared to draft";
  return {
    ok: true,
    message: `Listing ${label}.${result.error ? ` (${result.error})` : ""}`,
  };
}
