# Security Gate: MyHomestay Build Chapter 4

Gate level: **Release-oriented design gate (front-loaded).**
Date: 2026-05-29
Owner: Agent 47 with Sentinel-47 scrutiny.
Status: Design accepted; migrations authored; not yet applied to Supabase; app wiring pending (4.1+).

This gate runs **before** any Supabase wiring per the Founder Decision Lock. It defines
the schema, RLS, storage policy, and database-layer business rules that the rest of
Chapter 4 must implement. No "fully secure" claim is made; this is a design contract
plus residual-risk register.

## Founder Decisions Locked (2026-05-29)

- Auth: **Supabase Auth email OTP code** (not magic link).
- Admin: **`role` enum on `profiles`** (`owner` | `admin`), default `owner`, admin set
  manually in the Supabase dashboard. RLS gates admin actions on this column.
- Preview: **Skip Vercel preview**; wire Chapter 4 locally because mock stores reset on
  serverless restart and would mislead a live review.

## Scope and Authorization

- Target: `C:\Users\Adam_Rapidscreen\myhomestay`, owned by Adam.
- Surfaces in scope: owner auth/session, `profiles`, `listings`, `listing_photos`,
  `listing_metrics`, `admin_review`, Storage bucket `listing-photos`, service-role usage,
  env strategy, free-tier and publish-gate enforcement.
- Out of scope this chapter: payments, subscriptions, public submission forms, BM locale.

## Threat Model (OWASP-mapped)

| # | Surface | Threat | OWASP | Control |
| --- | --- | --- | --- | --- |
| T1 | Owner auth | Account takeover, weak/forged session | A07 | Supabase Auth OTP, httpOnly cookies via `@supabase/ssr`, server-side `getUser()` checks |
| T2 | Listing ownership | Cross-owner read/update/delete (BOLA) | A01 | RLS `owner_id = auth.uid()` on all writes; no service role in owner paths |
| T3 | Public reads | Leaking draft/paused/needs_review rows | A01 | RLS public SELECT predicate `status = 'published'` only |
| T4 | PII exposure | Raw WhatsApp number, full name, postcode leaked publicly | A01/A02 | WhatsApp + full_name + postcode never in public-readable policy; public consumes a column-scoped path |
| T5 | Admin actions | Privilege escalation to pause/needs_review | A01 | RLS admin policies require `is_admin()`; role not self-settable |
| T6 | Photo upload | Malicious type, oversized, path traversal, cross-owner write | A04/A08 | Storage RLS path-scoped to `{auth.uid}/...`, mime allowlist, size cap |
| T7 | Free tier | Bypass 3-listing cap via direct PostgREST insert | A04 | `BEFORE INSERT` trigger counts owner rows; UI check is secondary |
| T8 | Publish gate | Publishing incomplete listing via direct API | A04 | DB trigger enforces completeness on transition to `published` |
| T9 | Metrics | Unauthenticated inflation of views/clicks | A04 | No direct write; `SECURITY DEFINER` RPC with fixed increments |
| T10 | Service role | RLS bypass if key leaks or reaches client | A05 | Server-only env, never `NEXT_PUBLIC_`, used only in admin/trusted server code |
| T11 | Status enum | Invalid status string written | A04 | Postgres enum type, not free text |
| T12 | Secrets | Key committed to git | A05 | `.env.local` gitignored (verified); `.env.example` carries names only |

## Schema Overview

Tables (all in `public`, all RLS-enabled):

- `profiles` — 1:1 with `auth.users`. id = `auth.uid()`. Holds full_name, display_name,
  whatsapp_number, region_label, role, onboarding_complete, created_at.
- `listings` — FK `owner_id -> profiles.id`. Mirrors the `Listing` aggregate; nested
  trust/price/location flattened into columns + a `locations`-style embedded set.
- `listing_photos` — FK `listing_id -> listings.id ON DELETE CASCADE`.
- `listing_metrics` — 1:1 with `listings`, FK `listing_id` PK.
- `admin_review` — FK `listing_id`, admin-only audit of pause / needs_review actions.

Enums:

- `listing_status`: `draft | published | paused | needs_review`.
- `user_role`: `owner | admin`.
- `photo_category`: `exterior | bedroom | bathroom | kitchen | living | surrounding | other`.

## RLS Policy Intent

- **profiles**: owner SELECT/UPDATE own row (`id = auth.uid()`); INSERT own row on first
  login; no public SELECT on the table directly (public owner data is read through the
  published-listing join path only). `role` column is not updatable by the owner
  (enforced by trigger guarding role changes to admins only).
- **listings**: owner full CRUD where `owner_id = auth.uid()`; public/anon SELECT only
  where `status = 'published'`; admin UPDATE currently spans all columns (only
  the status *value* is trigger-validated). Admin is manually provisioned and
  trusted; column-scoping admin edits to status-only is deferred to Chapter 5
  (Admin Review). Tracked as Sentinel finding L1.
- **listing_photos**: owner CRUD through listing ownership; public SELECT only when the
  parent listing is `published`.
- **listing_metrics**: owner SELECT own; public SELECT only for published listings;
  no INSERT/UPDATE except via `increment_listing_metric` RPC.
- **admin_review**: `is_admin()` only for all operations.

`is_admin()` is a `SECURITY DEFINER` helper reading `profiles.role` for `auth.uid()`,
with a locked `search_path`.

## Database-Layer Business Rules (not just UI)

- **Free-tier cap (T7)**: trigger `enforce_free_listing_limit` rejects INSERT when the
  owner already has 3 listings. Error message: `Free tier limit reached: 3 listings.`
- **Publish gate (T8)**: trigger `enforce_publish_completeness` rejects any transition to
  `published` unless name, summary, description, capacity>=1, bedrooms>=1, area, price
  (min>0, max>=min), >=3 photos, >=1 house rule, and owner `whatsapp_number` present.
- **Status transitions (T11)**: trigger `enforce_status_transition` mirrors
  `canTransitionTo` from `listing-builder-validation.ts`.
- **Role guard (T5)**: trigger `guard_profile_role` blocks a non-admin from changing
  their own `role`.

## Storage Policy (T6)

- Bucket `listing-photos`, **private** (not public). Public listing pages use signed URLs
  or a public-read path scoped to published listings via a render helper.
- Object path convention: `{owner_id}/{listing_id}/{photo_id}.{ext}`.
- RLS on `storage.objects`: insert/update/delete allowed only when the first path segment
  equals `auth.uid()::text`.
- Mime allowlist enforced at upload: `image/jpeg`, `image/png`, `image/webp`.
- Size cap: 5 MB per object (enforced in server action + bucket file size limit).

## Env Strategy

| Var | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | auth redirect, metadata |
| `NEXT_PUBLIC_SUPABASE_URL` | public | client + server SDK |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | anon client (RLS-bound) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server-only** | admin/trusted server code only; never imported in a client component or `NEXT_PUBLIC_` |
| `SUPABASE_LISTING_PHOTOS_BUCKET` | server | bucket name |

Rule: any module importing the service role key must carry `import "server-only"`.

## Migration Files (authored in this gate)

- `supabase/migrations/0001_chapter4_schema.sql` — enums, tables, indexes, updated_at.
- `supabase/migrations/0002_chapter4_rls.sql` — RLS enable + policies + `is_admin()`.
- `supabase/migrations/0003_chapter4_rules.sql` — triggers (free-tier, publish gate,
  status transition, role guard) + `increment_listing_metric` RPC.
- `supabase/migrations/0004_chapter4_storage.sql` — bucket + storage object policies.

These are **authored, not applied**. Applying them to the Supabase project and the
service-role retest are tracked as manual actions in the closeout.

## Residual Risk (to revisit at the Release/Production gate)

- OTP email deliverability and rate-limit tuning are Supabase-managed; confirm at deploy.
- Signed-URL TTL vs public bucket trade-off for photos is a UX/security choice; default
  to private bucket + signed URLs unless review shows it harms public page caching.
- No CAPTCHA on OTP request; Supabase built-in rate limits accepted for MVP.
- Metrics RPC is open to anon by design (public view/click counting); abuse is low-impact
  and capped to +1 per call. Revisit if abuse appears.

## Verdict

No blocking issues in the design for the checked scope. The schema, RLS, triggers, and
storage policy enforce ownership, public-read scoping, free-tier, and the publish gate at
the database layer. Proceed to 4.1 (client setup) implementing exactly this contract.
Re-run a Feature Gate after wiring with live RLS negative tests before any closeout claim.
