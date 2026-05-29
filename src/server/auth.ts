import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { OwnerProfile } from "@/types/owners";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Server-side auth identity for MyHomestay.
 *
 * Replaces the Chapter 3 mock owner identity. All reads go through the
 * RLS-bound server client, so a profile row is only ever returned for the
 * signed-in user. See _planning/security-gate-chapter-4.md (T1, T2).
 */

/** Raw profiles row shape returned by Supabase. */
interface ProfileRow {
  id: string;
  full_name: string;
  display_name: string;
  whatsapp_number: string;
  region_label: string | null;
  role: "owner" | "admin";
  onboarding_complete: boolean;
  created_at: string;
}

function mapProfile(row: ProfileRow): OwnerProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    displayName: row.display_name,
    whatsappNumber: row.whatsapp_number,
    regionLabel: row.region_label ?? undefined,
    createdAt: row.created_at,
    onboardingComplete: row.onboarding_complete,
  };
}

/** The authenticated Supabase user, or null when signed out. */
export async function getSessionUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** True when the signed-in user has the admin role. */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return data?.role === "admin";
}

/** Current owner profile, or null when signed out or no profile row exists. */
export async function getCurrentOwner(): Promise<OwnerProfile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, display_name, whatsapp_number, region_label, role, onboarding_complete, created_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return mapProfile(data as ProfileRow);
}

/**
 * Require an authenticated owner. Redirects to /login when signed out.
 * Use at the top of every owner-only server component or action.
 */
export async function requireOwner(): Promise<OwnerProfile> {
  const owner = await getCurrentOwner();
  if (!owner) {
    redirect("/login");
  }
  return owner;
}

/**
 * Require an authenticated admin. Redirects signed-out users to /login and
 * non-admins to /dashboard. Use at the top of every admin-only server
 * component or action. RLS + is_admin() remain the authoritative gate; this
 * is the app-layer guard for routing and UX.
 */
export async function requireAdmin(): Promise<OwnerProfile> {
  const owner = await getCurrentOwner();
  if (!owner) {
    redirect("/login");
  }
  if (!(await isAdmin())) {
    redirect("/dashboard");
  }
  return owner;
}
