# MyHomestay Build Status

Last updated: 2026-05-29
Tracker type: KD Plan & Build Flow pilot

## Current Focus

Chapter 4 in progress. Work Card 4.0 (front-loaded Security Gate) is done: threat model, schema, RLS, DB-layer business rules, storage policy, and auth bootstrap are authored as migrations under `supabase/migrations/`. Next is 4.1 Supabase client setup.

## Next Move

Apply the 9 migrations to a fresh Supabase project in numeric order (0001 → 0009) when deploying elsewhere. Chapter 4 is done and live-verified. Next: Chapter 5 (Admin Review), where Sentinel finding L1 (admin column-scope) is also closed. Optional fast-follows: photo reorder / cover-choose, optional photo caption column for richer alt text.

## Build Chapters

| Chapter | Name | Status | Notes |
| --- | --- | --- | --- |
| 1 | App Foundation And Brand Shell | done | Scaffold, brand shell, mock data, helpers. |
| 2 | Public Discovery And Listing Experience | done | Closed out 2026-05-28 with Atelier review. |
| 3 | Owner Dashboard And Listing Builder | implemented | Awaiting Adam review across owner routes. |
| 4 | Supabase Auth, Data, And Storage | done | Auth, RLS data layer, storage + full photo upload/display loop all live-verified against real Supabase. 9 migrations applied. L1 admin column-scope deferred to Ch5. |
| 5 | Admin Review And Launch Readiness | pending | Requires Supabase foundation. |
| 6 | Bahasa Malaysia Fast-Follow | pending | Committed fast-follow after MVP surface is ready. |
| 7 | Critical Launch Fast-Follows | pending | Prioritize based on pilot risk. |

## Active Work Cards

### Chapter 3 (implemented)

| Card | Name | Status | Verification Target | Notes |
| --- | --- | --- | --- | --- |
| 3.0 | Toolchain prep (ESLint CLI + Vitest) | done | lint, test | Migrated `next lint` to `eslint .`. Vitest 4.1 + jsdom. 36 tests across 3 specs. |
| 3.1 | Owner Dashboard Shell | done | typecheck, build, Atelier sweep | `/dashboard` lists owner listings with status, completeness, photos, capacity, views, WhatsApp clicks, and decided next-action button. |
| 3.2 | Owner Onboarding | done | typecheck, build, Atelier sweep | `/dashboard/onboarding` server action validates display name, full name, WhatsApp E.164, and consent. Updates session store and redirects to dashboard. |
| 3.3 | Listing Builder Shell | done | typecheck, build, Atelier sweep | `/dashboard/listings/new` and `/dashboard/listings/[id]/edit` share `ListingBuilder`. Save-draft / publish / pause intents validated server-side via `evaluateListingCompleteness` and `canTransitionTo`. |
| 3.4 | Owner Surface QA | done | Playwright Atelier sweep | 32/32 probes 200, zero overflow at 320/375/768/1280. |

### Chapter 2 (done)

| Card | Name | Status | Verification Target | Notes |
| --- | --- | --- | --- | --- |
| 2.1 | Owner-First Home Page | done | lint, build, runtime probe | Home now reads real published listing teaser, links to /listings and /listings/[slug]. |
| 2.2 | Public Directory | done | lint, build, runtime probe | /listings is server-rendered, filters via URL search params (state, capacity, maxPrice, muslim, family, q). Empty/match states + reset link. |
| 2.3 | Public Listing Detail | done | lint, build, runtime probe (200 + 404) | /listings/[slug] uses generateStaticParams over published listings; non-published and unknown slugs 404 via notFound(). Sticky mobile WhatsApp CTA. |
| 2.4 | Public Surface QA | done | live probes + Atelier Playwright sweep | All routes 200; published 200, paused 404, unknown 404; filter combos all 200. Playwright screenshots at 320/375/768/1280 stored at `.tmp/atelier/`. |

## Verification Receipts

### Chapter 1 (2026-05-28)

Toolchain:

- Node v24.11.1
- npm 11.6.2
- Next.js 15.5.18
- React 19
- Tailwind v4 (@tailwindcss/postcss)
- TypeScript 5.7

Commands run:

- `npm install` - 326 packages, clean (one ECONNRESET retry).
- `npm run typecheck` (`tsc --noEmit`) - clean.
- `npm run lint` (`next lint`) - 0 errors, 0 warnings. Note: `next lint` deprecation notice in Next 16 is informational; migrate to ESLint CLI in a later chapter.
- `npm run build` - compiled in ~2.3s, 4 static pages generated, 0 errors. First Load JS 103 kB on `/`.

Runtime probe:

- `next start -p 3210` - HTTP 200, 19,313 bytes returned.
- Body contains `MyHomestay` masthead and `Create your homestay page` primary CTA.

Mobile width safety (static audit):

- Page uses `max-w-[var(--container-public)]` containers with `mx-auto px-4 sm:px-6` only.
- Hero, register card, and step grid collapse to single column below `md`.
- No `fixed`/`absolute` chrome, no `whitespace-nowrap`, no fixed-pixel widths.
- Long Malay place name (`Rumah Kampung Padang Kuala Besut, Terengganu Utara`) included in mock data for future wrapping checks.
- 320px / 375px DOM-level browser screenshot verification deferred to a Chapter 2 Playwright pass once test runner lands.

### Chapter 2 (2026-05-28)

Files added:

- `src/lib/listing-filters.ts` - pure filter logic, URL search-param parser.
- `src/components/listings/listing-card.tsx` - public directory card with placeholder photo region.
- `src/components/listings/directory-filters.tsx` - client form, drives `/listings` via `router.replace`.
- `src/components/listings/listing-gallery.tsx` - placeholder grid keyed by photo category.
- `src/components/listings/trust-strip.tsx` - shows only true trust facts; no "verified" language.
- `src/components/listings/owner-card.tsx` - public owner profile, never exposes raw WhatsApp number.
- `src/components/listings/whatsapp-cta.tsx` - inline + sticky-mobile variants, real wa.me with prefilled inquiry.
- `src/app/listings/page.tsx` - server component, reads `searchParams` Promise.
- `src/app/listings/[slug]/page.tsx` - SSG via `generateStaticParams` over published listings; `notFound()` for non-published / unknown.

Files modified:

- `src/app/page.tsx` - swapped hardcoded sample card for first published mock listing; "See an example listing" now links to `/listings/[slug]` of that listing.

Commands run:

- `npm run typecheck` - clean.
- `npm run lint` - 0 errors, 0 warnings.
- `npm run build` - compiled in 2.2s, 6 pages generated, 0 errors.
  - `/` - static, 106 kB First Load JS.
  - `/listings` - dynamic (searchParams), 107 kB First Load JS.
  - `/listings/[slug]` - SSG (1 path: `rumah-tepi-sawah-balik-pulau`), 107 kB First Load JS.

Runtime probes (`next start -p 3211`):

- `/` -> 200, 19,931 bytes.
- `/listings` -> 200, 21,442 bytes.
- `/listings?state=terengganu` -> 200, 17,199 bytes (filtered).
- `/listings?muslim=1&family=1` -> 200, 21,814 bytes.
- `/listings?capacity=10` -> 200, 17,191 bytes.
- `/listings/rumah-tepi-sawah-balik-pulau` -> 200, 30,099 bytes (published).
- `/listings/rumah-tok-wan-kota-bharu` -> 404 (paused, correctly hidden).
- `/listings/does-not-exist` -> 404 (notFound).

Mobile width safety (static audit):

- All routes use `mx-auto + max-w-[var(--container-public)] + px-4 sm:px-6` containers.
- Directory grid is single-column below `sm`, two-column at `sm`, three-column at `lg`.
- Detail page uses `min-w-0` + `break-words` on long location names.
- Sticky WhatsApp CTA only renders below `sm`; main `aside` becomes `md:sticky` from `md` upward, never overlapping content.
- Long Malay place name (`Rumah Kampung Padang Kuala Besut, Terengganu Utara`) wraps cleanly in card, register, and filter results.

### Chapter 2 Closeout (2026-05-28)

Re-verification after the build-status.md "implemented" -> closeout pass:

- `npm run typecheck` - clean.
- `npm run lint` - 0 errors, 0 warnings (`next lint` deprecation notice only).
- `npm run build` - 6 pages, 0 errors, First Load JS unchanged.

Live runtime probes (`next start -p 3220`, 10/10 pass):

- `/` -> 200, 17,946b
- `/listings` -> 200, 19,213b
- `/listings?state=terengganu` -> 200, 15,522b
- `/listings?muslim=1&family=1` -> 200, 19,564b
- `/listings?capacity=10` -> 200, 15,514b
- `/listings?maxPrice=200` -> 200, 15,517b
- `/listings?q=sawah` -> 200, 19,506b
- `/listings/rumah-tepi-sawah-balik-pulau` -> 200, 26,968b
- `/listings/rumah-tok-wan-kota-bharu` -> 404 (paused, correctly hidden)
- `/listings/does-not-exist` -> 404 (notFound)

Atelier-47 Playwright sweep (Chromium, headless, port 3221):

- 16/16 routes status 200, 0 horizontal overflow at 320 / 375 / 768 / 1280.
- Routes covered: `/`, `/listings`, `/listings?muslim=1&family=1`, `/listings/rumah-tepi-sawah-balik-pulau`.
- Screenshots: `.tmp/atelier/{home,directory,directory-filtered,listing-detail}-{320,375,768,1280}.png`.
- Report: `.tmp/atelier/review-report.json`.
- Helper script: `.tmp/atelier/review.mjs`.

Atelier copy findings (fixed in-pass):

- F1: removed footer `Build Chapter 1 - Foundation shell` from home (planning artifact in live UI). Now reads `Free for homestay owners in Malaysia - Beta`.
- F2: removed `Public directory - Mock data` and `Public listing - Mock data` footers. Both now read `... - Beta`.
- F3: home aside eyebrow `Listing register - Sample` -> `Featured listing` (product-natural, not internal).

Findings deferred to Chapter 3:

- F4: home primary CTA `Create your homestay page` is currently an inert `<button>`. Should become a real link or carry honest "coming soon" microcopy when the owner onboarding flow lands.
- F5: header nav items `Browse stays / For owners / About` on the home page are inert `<span>`. Wire to real routes when their target screens exist.

Verification of copy fixes (`next start -p 3223`):

- home no longer contains `Build Chapter 1` or `Listing register`. Now contains `Featured listing` and `Free for homestay owners in Malaysia`.
- /listings no longer contains `Mock data`. Now contains `Public directory`.
- /listings/[slug] no longer contains `Mock data`. Now contains `Public listing`.

Toolchain additions:

- Added `playwright@1.60.0` as devDependency for visual review at the public surface. Chromium browser cached at `%USERPROFILE%\AppData\Local\ms-playwright\chromium-1223`.
- npm audit reports 2 moderate severity vulnerabilities (transitive); accept and review under Chapter 4 security gate.

### Chapter 3 (2026-05-28)

Files added:

- `src/server/owner-store.ts` - session-scoped mutable listing store; mirrors `mockListings` and adds insert/replace/find helpers.
- `src/server/owner-profile-store.ts` - session-scoped mutable owner profile store.
- `src/lib/listing-status-display.ts` - status badge tokens (label, dotClass, bgClass, textClass) for all 4 statuses.
- `src/lib/listing-builder-validation.ts` - parser + validator for listing builder form, slug builder, status transition guard, placeholder photo builder.
- `src/components/dashboard/dashboard-listing-row.tsx` - owner row with status, completeness summary, metrics, and decided next-action button.
- `src/app/dashboard/layout.tsx` - owner shell header (display name + listing count + new-listing CTA) and tab nav.
- `src/app/dashboard/page.tsx` - owner workspace page with onboarding-incomplete banner, empty state, and listing rows.
- `src/app/dashboard/onboarding/actions.ts` - `saveOwnerProfileAction` server action.
- `src/app/dashboard/onboarding/onboarding-form.tsx` - client form using `useActionState`.
- `src/app/dashboard/onboarding/page.tsx` - onboarding screen.
- `src/app/dashboard/listings/actions.ts` - `saveListingAction` handles save-draft / publish / pause / resume intents with completeness + transition guards.
- `src/app/dashboard/listings/listing-builder.tsx` - shared client form for new and edit; sectioned UI for basics, location, capacity/price, photos, amenities, trust, rules.
- `src/app/dashboard/listings/new/page.tsx` - new listing page.
- `src/app/dashboard/listings/[id]/edit/page.tsx` - edit page with completeness banner and status badge.
- `src/lib/listing-filters.test.ts`, `src/lib/whatsapp.test.ts`, `src/lib/listing-completeness.test.ts` - 36 unit tests.
- `vitest.config.ts` - jsdom environment, `@/*` alias.

Files modified:

- `src/data/owners.ts` - added `MOCK_CURRENT_OWNER_ID` and `getMockCurrentOwner()`.
- `src/app/page.tsx` - home CTA now links to `/dashboard/onboarding`; nav now links `Browse stays` -> `/listings` and `For owners` -> `/dashboard`. Removed inert `About`.
- `eslint.config.mjs` - added flat-config ignores for `.next/**`, `next-env.d.ts`, `node_modules/**`, `.tmp/**`, `out/**`, `build/**`, `dist/**`, `coverage/**`. Required because `eslint .` does not auto-ignore the way `next lint` did.
- `package.json` - `lint: eslint .`, added `test: vitest run` and `test:watch: vitest`. Added `vitest`, `@vitest/coverage-v8`, `jsdom` dev deps.
- `.tmp/atelier/review.mjs` - extended ROUTES to include `/dashboard`, `/dashboard/onboarding`, `/dashboard/listings/new`, and one edit route.

Commands run:

- `npm install --save-dev vitest @vitest/coverage-v8 jsdom` - 84 packages added.
- `npm test` - 3 spec files, 36 tests, all passing in 1.29s.
- `npm run lint` - 0 errors, 0 warnings (ESLint CLI flat config).
- `npm run typecheck` - clean.
- `npm run build` (clean `.next/` first) - 8 pages, 0 errors.
  - `/` - static, 106 kB First Load JS.
  - `/dashboard` - static, 106 kB First Load JS.
  - `/dashboard/listings/[id]/edit` - dynamic, 109 kB First Load JS.
  - `/dashboard/listings/new` - static, 109 kB First Load JS.
  - `/dashboard/onboarding` - static, 104 kB First Load JS.
  - `/listings` - dynamic, 107 kB First Load JS.
  - `/listings/[slug]` - SSG, 107 kB First Load JS.

Atelier sweep (Chromium, headless, port 3221):

- 32/32 routes status 200, 0 horizontal overflow at 320 / 375 / 768 / 1280.
- Public routes covered: `/`, `/listings`, `/listings?muslim=1&family=1`, `/listings/rumah-tepi-sawah-balik-pulau`.
- Owner routes covered: `/dashboard`, `/dashboard/onboarding`, `/dashboard/listings/new`, `/dashboard/listings/listing-rumah-tepi-sawah/edit`.
- Screenshots: `.tmp/atelier/{home,directory,directory-filtered,listing-detail,dashboard,dashboard-onboarding,dashboard-listing-new,dashboard-listing-edit}-{320,375,768,1280}.png`.
- Report: `.tmp/atelier/review-report.json`.

Carry-forward findings resolved:

- F4 (Chapter 2): home primary CTA now links to `/dashboard/onboarding`.
- F5 (Chapter 2): home header nav now wires to `/listings` and `/dashboard`. Inert `About` removed.

Status transition matrix verified in code:

- draft -> published (via publish action) when completeness passes.
- draft -> draft (save-draft).
- published -> paused (pause intent).
- paused -> published (resume intent).
- needs_review -> draft or published (admin-only entry path; not exposed in this chapter).

Free tier enforcement verified in code:

- New listing rejects with `Free tier limit reached: 3 listings.` when owner already has 3.
- Edit transitions are owner-scoped: cross-owner edits return `Listing not found in this session.`.

Mock data session caveat (intentional):

- Owner workflow uses module-scoped working stores (`workingListings`, `workingOwners`).
- All edits reset on `next start` restart. The dashboard footer and onboarding form both display this caveat in user copy.

### Chapter 4 (2026-05-29)

Founder decisions locked: email OTP auth; `role` enum on `profiles` (admin set in Supabase dashboard); skip Vercel preview, wire locally.

Security Gate (4.0): `_planning/security-gate-chapter-4.md` — threat model (T1-T12, OWASP-mapped), schema, RLS intent, DB-layer business rules, storage policy, env strategy, residual risk.

Migrations authored (NOT applied):

- `0001_chapter4_schema.sql` — enums, 5 tables, indexes, updated_at.
- `0002_chapter4_rls.sql` — RLS enable, `is_admin()`, ownership + published-only + admin policies.
- `0003_chapter4_rules.sql` — free-tier (3-listing) trigger, role guard, status-transition trigger.
- `0003b_chapter4_rules.sql` — publish-completeness gate trigger, `increment_listing_metric` RPC.
- `0004_chapter4_storage.sql` — private `listing-photos` bucket (mime allowlist, 5MB), path-scoped object RLS.
- `0005_chapter4_auth_bootstrap.sql` — auto-create profile on new auth user.
- `0006_chapter4_public_owner.sql` — `get_listing_owner_public` RPC (safe owner fields, published only).

Files added:

- `src/lib/supabase/{env,client,server,admin}.ts` — env accessor + browser/server/service-role clients.
- `src/middleware.ts` — `@supabase/ssr` session refresh.
- `src/server/auth.ts` — `getSessionUser`, `getCurrentOwner`, `requireOwner`, `isAdmin`.
- `src/app/login/{page,login-form,actions}.tsx` — email OTP two-step login + sign-out.
- `src/server/listings-data.ts` — RLS-bound listing reads/writes; replaces mock stores.
- `src/server/listing-photos-storage.ts` — upload (mime/size/path validation), delete, signed URL.

Files modified:

- `src/app/dashboard/{layout,page}.tsx`, `dashboard/onboarding/{page,actions}.ts`, `dashboard/listings/actions.ts`, `dashboard/listings/[id]/edit/page.tsx` — real auth + Supabase.
- `src/app/{page,listings/page,listings/[slug]/page}.tsx` — public reads via Supabase; detail page is now dynamic (was SSG) and uses the public-owner RPC.
- `src/components/listings/{owner-card,whatsapp-cta}.tsx` — narrowed to `PublicListingOwner` (no full name/postcode).
- `src/types/owners.ts` — added `PublicListingOwner`.

Files deleted:

- `src/server/owner-store.ts`, `src/server/owner-profile-store.ts` — non-RLS mock mutation layer, fully replaced.

Dependencies: added `@supabase/supabase-js`, `@supabase/ssr`. `npm audit fix` resolved the `@supabase/auth-js` advisory (GHSA-8r88-6cj9-9fh5). 2 moderate transitive advisories remain (postcss under Next; build-time only; no non-breaking fix; accepted).

Commands run (static verification only):

- `npm run typecheck` — clean.
- `npm run lint` — 0 errors, 0 warnings.
- `npm test` — 36/36 passing.
- `npm run build` (clean `.next/`) — 9 routes, 0 errors. All routes now `ƒ` (dynamic) + middleware registered.

NOT verified: no code in this chapter has run against a live Supabase project. Auth, RLS, triggers, storage, and the metrics RPC are unproven at runtime until the manual-action gate below is completed.

### Chapter 4 Photo Upload (4.4, 2026-05-29) — live-verified

Atelier-47 direction ("Contact Sheet, not Card Wall"): per-photo category, uniform aspect-[4/3] crop, optimistic preview, upload on edit page only.

Files added:
- `src/components/dashboard/photo-manager.tsx` — client grid: add-tile-first, optimistic "Uploading…" tiles, per-photo category select, two-step inline delete, progress meter (N of 3 → ready), aria-live.
- `src/app/dashboard/listings/[id]/photos/actions.ts` — 3 server actions (upload w/ per-file validation + orphan rollback, set-category, delete), all `requireOwner` + owner-scoped.

Files modified:
- `src/server/listings-data.ts` — added `getListingPhotos` (owner-scoped) + `nextPhotoSortOrder`.
- `src/app/dashboard/listings/[id]/edit/page.tsx` — mints signed URLs, renders PhotoManager.
- `src/app/listings/[slug]/page.tsx` — mints signed URLs for public gallery.
- `src/components/listings/listing-gallery.tsx` — renders real `<img>` (was Ch3 placeholder) with placeholder fallback.
- `src/app/dashboard/listings/listing-builder.tsx` — removed fake category-checkbox grid (also fixed latent data-loss: syncPlaceholderPhotos no longer wipes real photos on edit).
- `src/lib/listing-builder-validation.ts` — dropped app-level photoCategories publish check (DB trigger + real photo count authoritative).

Migrations added:
- `0009_chapter4_public_photo_read.sql` — anon SELECT on storage objects for PUBLISHED listings only (path segment 2 = listing id). Bucket stays private; display uses signed URLs.

Verified live (real Supabase): owner uploads 3 photos on edit page → thumbnails render → published → photos display on public listing page. Full owner→private-storage→signed-URL→public loop proven end to end. typecheck clean, lint 0/0, tests 36/36, build clean.

Known fast-follows: photo reorder / cover-choose (cover = first uploaded for now); optional caption column for richer alt text (currently `{name} photo`).

### Chapter 4 Security Review (2026-05-29, Sentinel-47 + Agent 47 Review Gate)

Sentinel-47 read all 7 migrations + 14 app files against the gate contract. Verdict: "no blocking design flaws in source, 2 contract deviations, 0 runtime verification yet."

Confirmed sound at source: cross-owner RLS (owner_id = auth.uid() on USING + WITH CHECK), role-escalation guard, service-role boundary (admin.ts server-only, never called from client), getUser()-based auth, no open redirects, full_name never anon-reachable, all 7 SECURITY DEFINER funcs had locked search_path.

Findings + actions:

- M1 (postcode public leak, A01/A02) — FULLY FIXED: app nulls postcode on public reads via `publicView`; migration `0008` removes anon table SELECT policies and routes public reads through column-scoped SECURITY DEFINER RPCs (`get_published_listings`, `get_published_listing_by_slug`) that omit postcode. Owners still read their own full rows.
- M2 (publish gate violable post-publish, A04) — PATCHED: migration `0007` re-validates completeness on ANY update while status = published, not only the transition.
- I1 (2 triggers missing locked search_path) — PATCHED: `0007` pins search_path on enforce_free_listing_limit + enforce_status_transition.
- L1 (admin UPDATE not column-scoped, A01) — DEFERRED to Ch5 Admin Review; gate doc corrected to stop claiming status-only admin edits.
- L2/I2/I3/I4 — accepted/deferred residuals (OTP rate-limit reliance, free-tier insert race, anon metrics +1, storage litter). Documented.
- I5 (real upload unwired; publish gate counts placeholder photo rows) — deliberate Ch4 scope; real upload UI is the deferred follow-up.

Migration added: `0007_chapter4_security_fixes.sql`. Re-verified after fixes: typecheck clean, lint 0/0, tests 36/36, dev server healthy.

Live login proven this session (real Supabase): OTP request → emailed code → verify → session → /dashboard. 4 runtime bugs found and fixed during live test (hidden duplicate email field; 6-vs-8 digit code length; "6-digit" copy string; `EMPTY_STATE` non-async export in a "use server" file). Profile save (RLS-bound profiles UPDATE) confirmed working.

## Chapter 4 Manual-Action Gate (REQUIRED before any "done" / production claim)

- [ ] Apply migrations `0001`..`0008` to the Supabase project (SQL editor or `supabase db push`). Note: `0007` (publish-gate/search_path fixes) and `0008` (public-read column scope) were added after the security review and MUST be applied for M1/M2/I1 fixes to take effect.
- [ ] Create the `listing-photos` bucket if `0004` did not (verify private + mime + size limit).
- [ ] Enable email OTP in Supabase Auth settings; set redirect/site URL to match `NEXT_PUBLIC_SITE_URL`.
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (already present per prior session) and confirm it is never `NEXT_PUBLIC_`.
- [ ] Live retest (Feature Gate): sign in via OTP; create draft; confirm 4th listing insert is rejected by the DB trigger; confirm publish is blocked when <3 photos / missing fields; confirm a second account cannot read/edit the first owner's draft (RLS); confirm anon can read only published listings; confirm public listing page shows owner display name + WhatsApp but never full name/postcode.
- [ ] Promote `role='admin'` on one profile in the dashboard; confirm admin-only pause/needs_review path.
- [ ] Record retest evidence in a Chapter 4 retest receipt before marking Chapter 4 `done`.

## Decisions
- Use Build Chapters and Work Cards instead of epics/stories.
- English-first MVP with BM-ready architecture; BM is a committed fast-follow.
- Mock-first for Chapter 1 and Chapter 2.
- Supabase accepted for MVP auth, data, storage, and RLS after the product surface is stable.
- Up to 3 free listings per owner.
- Owners can publish after required fields pass; admin can pause or mark needs review.
- No public "verified" language until a verification policy exists.

## Blockers

- None for Chapter 1 closeout. Awaiting Adam review.

## Open Risks

- `next lint` is deprecated in Next 16; current `npm run lint` still works on Next 15.5. Migrate to ESLint CLI in early Chapter 3 before more components land.
- Helper and filter logic still have no automated tests. WhatsApp link generation, location formatting, completeness, and `applyListingFilters` are typecheck/build/runtime-probe verified only. Add Vitest in early Chapter 3.
- Mock photo paths under `/mock/listings/...` remain unserved. Listing card and detail use placeholder panels that render without image dependency. Real Supabase Storage images land in Chapter 4.
- Chapter 2 click tracking on `WhatsappCta` is `console.debug` only in dev. Durable WhatsApp metrics are deferred to Chapter 5 once Supabase persistence exists.
- DOM-level mobile screenshot verification at 320px / 375px still deferred. Static audit confirms no fixed widths, no horizontal overflow primitives, and clean wrapping; real browser screenshots land with Playwright in Chapter 3.
- The 4-photo Wadah Marang listing falls below the 3-photo publish floor only on `bedroom + living + surrounding + exterior` mix; trust strip already gates the "n photos" badge to listings with 3+ photos.

## Chapter 1 Closeout Requirements

Status as of 2026-05-28:

- [x] Work Cards 1.1 through 1.4 are done.
- [x] `npm run lint` passes (0 errors, 0 warnings).
- [x] `npm run build` passes (4 static pages, 0 errors).
- [x] `npm run typecheck` passes.
- [x] Home route renders locally (verified via `next start`, HTTP 200).
- [x] Static audit confirms no overflow patterns (no fixed widths, single-column layout below md, mx-auto containers only).
- [x] Build Status updated with verification receipts.
- [ ] DOM-level mobile screenshot verification at 320px / 375px - **deferred to Chapter 3 with test runner**.

Deviations from scaffold plan:

- `create-next-app` was rejected because `AGENTS.md`, `README.md`, and `_planning/` already existed. Manual scaffold used instead with the same canonical config (Next 15 App Router + TS + Tailwind v4 + ESLint flat config + `src/` + `@/*` alias).
- Tailwind v4 was selected over v3 because the brand spec maps cleanly to `@theme` CSS-first tokens. No `tailwind.config` file is needed.
- Test runner not added in Chapter 1; helper logic verified through typecheck/build only per the handoff's "tests deferred" allowance.

## Chapter 2 Closeout Requirements

Status as of 2026-05-28:

- [x] Work Cards 2.1 through 2.4 are done.
- [x] `npm run lint` passes (0 errors, 0 warnings).
- [x] `npm run build` passes (6 pages: 1 static, 1 dynamic, 1 SSG, plus _not-found and root variants).
- [x] `npm run typecheck` passes.
- [x] All three public routes render locally with `next start` (200 status).
- [x] Filter URL search-param round-trip works (state, capacity, maxPrice, muslim, family, q).
- [x] Non-published listings (`paused`, `needs_review`, `draft`) and unknown slugs return 404 via `notFound()`.
- [x] WhatsApp CTA generates real `wa.me` URL with prefilled inquiry copy via `buildListingWhatsappUrl`.
- [x] No "verified" language present in public surface (grep-clean).
- [x] Booking/payment boundary copy visible on home, directory, detail, and sticky CTA.
- [x] Static audit confirms long Malay place name wraps; sticky mobile CTA only below `sm`; aside becomes sticky from `md`.
- [x] Build Status updated with verification receipts.
- [ ] DOM-level mobile screenshot verification at 320px / 375px - **still deferred to Chapter 3 with Playwright**.

Deviations from Chapter 2 plan:

- Mock photo paths are not served. Gallery and card use typed placeholder panels keyed by photo category. The `<Image />` swap-in is mechanical once Supabase Storage lands in Chapter 4.
- Filters live in URL search params (server reads, client form pushes via `router.replace`) rather than client-only React state. Cost: a small client component. Benefit: shareable links, server-rendered filtered HTML, no hydration mismatch.
- WhatsApp click tracking is `console.debug` in dev only. Durable metrics deferred to Chapter 5 with Supabase.
- Test runner still not added; deferred to early Chapter 3 alongside ESLint CLI migration.

### Tailwind v4 Token Bug (caught during Chapter 2 review)

Initial Chapter 1 + Chapter 2 implementation used `bg-[var(--color-leaf)]` arbitrary-value classes everywhere. The `@theme` block defined the tokens correctly and the body rule applied (page wasn't fully unstyled), but the JIT scanner did not emit utilities for the arbitrary `var()` references. Result: black-and-white text on first review.

Fix applied 2026-05-28: ran a single regex pass across all 9 component/page files converting `[var(--color-X)]` -> `X` (and `[var(--radius-card)]` -> `card`, `[var(--container-public)]` -> `public`). After the fix, the compiled CSS contains `.bg-leaf`, `.bg-paper`, `.text-ink`, `.border-stone`, `.rounded-card`, `.max-w-public`, plus the hover and focus variants.

Reusable rule for this repo: when a `@theme` token is defined in v4, **always use the token-form utility (`bg-leaf`)** rather than the arbitrary-value form (`bg-[var(--color-leaf)]`). The arbitrary form is for one-off values that aren't tokens.
