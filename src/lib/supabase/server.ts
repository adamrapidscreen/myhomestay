import "server-only";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseConfig } from "./env";

/**
 * Server Supabase client bound to the request cookie store. RLS-enforced via
 * the anon key plus the signed-in user's session. Use this in server
 * components and server actions for all owner-scoped reads and writes.
 *
 * Never carries the service role key, so RLS always applies.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getPublicSupabaseConfig();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options?: CookieOptions }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll is called from a Server Component render where cookies are
          // read-only. Session refresh is handled by middleware, so ignoring
          // this is safe.
        }
      },
    },
  });
}
