"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseConfig } from "./env";

/**
 * Browser Supabase client. RLS-bound through the anon key. Safe for use in
 * client components (login form, photo upload). Never has the service role.
 */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getPublicSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
