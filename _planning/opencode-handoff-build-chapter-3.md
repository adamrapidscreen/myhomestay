# OpenCode Handoff: MyHomestay Build Chapter 3

## Mission

Implement Build Chapter 3: Owner Dashboard And Listing Builder.

Use this handoff as the execution source. Do not start Chapter 4 (Supabase) unless Adam explicitly asks.

## Required Context

Read these first, in this order:

1. `AGENTS.md`
2. `docs/PROJECT_AGENT_CONTEXT.md`
3. `_planning/plan-build-flow.md`
4. `_planning/build-status.md`
5. `docs/product/build-chapters.md` (Chapter 3 detail starts at "Build Chapter 3")
6. `docs/product/brand-ux-system.md`
7. `docs/product/founder-decision-lock.md`

Then inspect the existing public surface to keep visual continuity:

- `src/app/page.tsx`
- `src/app/listings/page.tsx`
- `src/app/listings/[slug]/page.tsx`
- `src/app/globals.css`
- `src/components/listings/*`

## Chapter Goal

Make the owner workflow feel real before any database or auth work. The owner experience must answer four questions on every screen:

1. What listings do I own.
2. What state are they in.
3. What is the next action I need to take.
4. How do I edit, publish, pause, or unpublish.

Mock-only persistence. No Supabase. No real auth. Use an in-memory mock owner identity (e.g. `MOCK_CURRENT_OWNER_ID`) and a session-only mutation layer so the surface feels live during the same browser session.

## Stack Constraints

- Next.js 15 App Router (Server Components default).
- Tailwind v4 token-form utilities only (`bg-leaf`, not `bg-[var(--color-leaf)]`).
- Forms can be client components; lists and shells stay server-rendered.
- No new global state library. Use React server actions plus `useFormState` / `useTransition` for mock mutations.
- Persist mock state in module-scoped memory only. Do not write to disk.
- No `next/image` until Chapter 4 ships Supabase Storage. Keep the placeholder gallery pattern.

## Carry-Forward Findings From Chapter 2

These were noted in Chapter 2 closeout and should land in this chapter:

- F4: home primary CTA `Create your homestay page` must become either a real link to `/dashboard/onboarding` or carry honest "coming soon" microcopy. Choose link once `/dashboard/onboarding` exists.
- F5: home header nav items (`Browse stays`, `For owners`, `About`) must wire to real routes (`/listings`, `/dashboard`, drop `About` until it has content).
- Add Vitest as the project test runner. Cover at minimum: `applyListingFilters`, `buildListingWhatsappUrl`, `getListingCompletenessReport`. Do not block Chapter 3 on broad test backfill; target the new helpers and the new completeness logic.
- Migrate `next lint` to ESLint CLI: `npx @next/codemod@canary next-lint-to-eslint-cli .`. Run during Work Card 3.0 (toolchain prep) before owner code lands.

## Work Card 3.0: Toolchain Prep

### Intent

Land non-app changes that should not be mixed with feature work.

### Steps

- Migrate `next lint` to ESLint CLI via the `@next/codemod` named above. Confirm `npm run lint` still passes.
- Add Vitest with `jsdom` environment. Add `@testing-library/react` only if a component test is needed; pure unit tests do not need it.
- Add `npm test` script.
- Write 3 unit specs:
  - `src/lib/listing-filters.test.ts` covering at least: empty filters, state filter, Muslim+family filter combo, price ceiling, q substring match.
  - `src/lib/whatsapp.test.ts` for `buildListingWhatsappUrl` with E.164 normalization and prefilled inquiry copy.
  - `src/lib/listing-completeness.test.ts` covering the 3-photo publish floor and the missing-fields report.
- Do not configure Playwright as a project dep yet; the Atelier review script under `.tmp/atelier/` is sufficient for Chapter 3.

### Acceptance

- `npm run lint` passes after the codemod.
- `npm test` passes with all 3 spec files.
- `npm run typecheck` and `npm run build` still pass.

## Work Card 3.1: Owner Dashboard Shell

### Intent

`/dashboard` reads as an owner operations tool, not another marketing page.

### Steps

- Add a mock current-owner constant (e.g. `getMockCurrentOwner()` returning the first non-suspended mock owner from `src/data/owners.ts`).
- Add `src/app/dashboard/layout.tsx` with an owner-context header (display name, listing count, "+ New listing" link), a left rail or top tab bar to switch between `Listings`, `Profile`, and `Help`, and the same brand shell tokens used in the public surface.
- Build `src/app/dashboard/page.tsx` listing only that owner's listings (filter `mockListings` by `ownerId`).
- Each row must show:
  - listing name and area (use `formatLocationCompact`)
  - status badge: `draft`, `published`, `paused`, `needs_review` (each gets its own token color: leaf, river-on-paper, clay, danger respectively)
  - completeness percent or "Ready to publish" / "Missing X required fields"
  - photos count vs the 3-photo floor
  - last updated date
  - next action button (e.g. `Continue draft`, `Add photos`, `Publish`, `View public page`, `Resume from pause`)
- Above the list, show the free-tier reminder: `X of 3 free listings used`.
- Empty state: copy that invites the owner to create their first listing, plus a primary CTA to `/dashboard/onboarding` if profile is incomplete, else `/dashboard/listings/new`.

### Acceptance

- `/dashboard` renders the mock owner's listings only.
- Status badges use distinct token colors and are readable at AA contrast on `paper` and `rice`.
- The 3-listing limit copy renders accurately.
- Mobile (320 / 375): row collapses to a single column with the next-action button full-width below the metadata.
- No horizontal overflow at any tested viewport.

## Work Card 3.2: Owner Onboarding

### Intent

Capture the minimum owner profile fields so a listing can be published with a real WhatsApp handoff.

### Steps

- Build `src/app/dashboard/onboarding/page.tsx` as a single-screen form: display name, public contact name, WhatsApp number (with country dropdown defaulting to MY +60), an explicit "I understand booking and payment continue on WhatsApp, not on MyHomestay" checkbox, and a save button.
- Use a server action that mutates the in-memory mock owners table.
- Validate WhatsApp number with the same E.164 logic used by `buildListingWhatsappUrl`. Reject obvious junk.
- Show inline errors using the existing `clay` (attention) and `danger` tokens.
- After save, redirect to `/dashboard`.

### Acceptance

- Required field labels are visible (no placeholder-only).
- Invalid WhatsApp number shows a clear inline error.
- Successful save updates the mock owner and the `/dashboard` header reflects the new display name.
- Reload on the same dev server preserves the change (module-scoped memory) until the server restarts; document this clearly in a small note on the page during Chapter 3.

## Work Card 3.3: Listing Builder Shell

### Intent

A draftable listing editor that proves the publish gate.

### Steps

- Build `src/app/dashboard/listings/new/page.tsx` and `src/app/dashboard/listings/[id]/edit/page.tsx`. Share a `ListingBuilder` client component.
- Sections (collapsible on mobile, all visible on desktop):
  1. Basics: name, summary (max 240 chars).
  2. Location: state (typed dropdown from `src/lib/locations/my.ts`), town, area string.
  3. Capacity & price: capacity, bedrooms, min/max RM per night.
  4. Photos: up to 8 placeholder photo slots with category select (`hero`, `bedroom`, `living`, `kitchen`, `surrounding`, `exterior`). Skip real upload; placeholders only.
  5. Amenities: multi-select chips from a typed amenity list.
  6. Trust: Muslim-friendly toggle, family-friendly toggle. Do not expose any "verified" toggle.
  7. House rules: free-text array, add/remove.
  8. Preview: read-only rendering of how the public listing will look (reuse the same trust-strip and location helpers).
  9. Publish: disabled until completeness passes.
- Use the existing `getListingCompletenessReport` to compute missing fields. Show the missing-fields list inline above the publish button.
- Save Draft button always available. Publish button enabled only when completeness passes AND photos.length >= 3.
- All mutations go through a server action that updates the in-memory mock listings table and revalidates `/dashboard` and the listing's public route.

### Acceptance

- Required fields are clearly marked (asterisk plus screen-reader label).
- Drafts can be saved with fewer than 3 photos.
- Publish is blocked until 3 photos + all required fields are present.
- Status transitions: draft -> published, published -> paused, paused -> published. needs_review is admin-only and not exposed in this chapter.
- Editing a published listing keeps it `published` unless the owner explicitly pauses or saves as draft.
- Preview section reflects the same visual structure as `/listings/[slug]`.

## Work Card 3.4: Owner Surface QA

### Intent

Match the Chapter 2 verification quality bar for the owner surface.

### Steps

- Re-run the Atelier Playwright sweep with the dashboard routes added to `.tmp/atelier/review.mjs`. New routes: `/dashboard`, `/dashboard/onboarding`, `/dashboard/listings/new`.
- Verify no horizontal overflow at 320 / 375 / 768 / 1280.
- Verify focus-visible state on every form control (the global rule in `globals.css` should already cover this; confirm visually).
- Verify color contrast on status badges against their backgrounds (manual check is fine; no automated audit yet).

### Acceptance

- Atelier review report shows all dashboard routes 200 and 0 overflow.
- Screenshots stored under `.tmp/atelier/` alongside the Chapter 2 set.
- Build Status updated with a Chapter 3 receipts block matching the Chapter 2 format.

## Carry-Forward Wiring (Within Chapter 3)

After 3.1 and 3.2 land:

- Update `src/app/page.tsx` so `Create your homestay page` links to `/dashboard/onboarding`.
- Wire home header nav: `Browse stays` -> `/listings`, `For owners` -> `/dashboard`. Remove the inert `About` until that page exists.

## Verification Commands

After each Work Card:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

After Work Card 3.4:

```powershell
node .tmp\atelier\review.mjs
```

## Browser Checks

Run after `npm run start -- -p <port>` is up:

- `/dashboard` loads without errors when the mock owner has no listings AND when they have all 4 mock listings assigned.
- `/dashboard/onboarding` save flow updates the dashboard header.
- `/dashboard/listings/new` publish button stays disabled until requirements pass.
- All routes pass the 320 / 375 / 768 / 1280 width check.

## Update Required Before Closeout

Update `_planning/build-status.md`:

- Set Chapter 3 to `done` only after Atelier review passes.
- Append a `Chapter 3 (2026-MM-DD)` receipts block listing files added, commands run, runtime probes, and Atelier results.
- Move new findings into `Open Risks` if any are deferred.
- Set next move to Chapter 4 planning checkpoint, but do NOT start Supabase code in this session.

## Stop Conditions

Stop and ask Adam before:

- adding Supabase, any auth provider, or any real database.
- introducing payment, subscription, or "verified" language.
- adding image upload or external storage.
- deleting any planning docs or rewriting Chapter 1 / Chapter 2 surfaces beyond the carry-forward wiring above.
- committing or pushing.
- adding heavy state libraries (Redux, Zustand, Jotai). React + server actions only.

## Final Response Expected

Summarize:

- Work Cards completed (3.0 -> 3.4).
- Files added/modified.
- Commands run and results (lint, test, typecheck, build, runtime probe, Atelier sweep).
- Browser checks performed.
- Build Status update.
- Carry-forward findings (the home CTA wiring, nav wiring, ESLint CLI migration, Vitest landing).
- Next recommended move (likely Adam review then Chapter 4 planning checkpoint).
