import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "./env";

/**
 * Service-role Supabase client. BYPASSES RLS. Use only in trusted server code
 * for admin moderation actions (pause / needs_review) and never on a public
 * or owner-self path where RLS is the intended guard.
 *
 * This module is `server-only`. The key is read from SUPABASE_SERVICE_ROLE_KEY
 * and must never be exposed through NEXT_PUBLIC_* or imported by a client
 * component. See _planning/security-gate-chapter-4.md "Env Strategy" (T10).
 */
export function createSupabaseAdminClient() {
  const { url } = getPublicSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey || serviceRoleKey.trim().length === 0) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. The admin client cannot be created.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
