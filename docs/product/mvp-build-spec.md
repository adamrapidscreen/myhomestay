# MyHomestay MVP Build Spec

## Status

Draft v0.1. Depends on review of `docs/product/architecture-blueprint.md`.

## Intent

Turn the accepted product direction into the first buildable MyHomestay web app foundation without recreating the deleted Vibe-session test site.

The first build should prove the real product shape:

- owner-first landing.
- public directory.
- public listing page.
- WhatsApp handoff.
- owner dashboard shell.
- listing builder shell.
- brand system implementation.

Authentication, Supabase persistence, uploads, admin review, and production launch gates follow after the route and UI contract are stable.

## Current Context

The repo currently contains planning artifacts only. The previous app files are intentionally deleted from the working tree and recoverable through Git history if needed.

Accepted product direction:

- owner-first.
- Malaysia-first.
- WhatsApp booking/payment handoff.
- free MVP.
- later subscription path.
- `Kampung Quiet Ledger Hybrid` brand system.

## Build Principle

Build the smallest serious product surface first, not a throwaway demo.

Use typed mock data only where it accelerates UI and route validation. The mock contracts should resemble the future Supabase schema so the data layer can be swapped without redesigning components.

## Phase 0: Scaffold And Design Foundation

### Goals

- Restore a clean Next.js TypeScript app.
- Implement the MyHomestay visual tokens.
- Establish route, layout, and component structure.

### Tasks

- Create app scaffold with Next.js App Router, TypeScript, Tailwind, ESLint, and basic scripts.
- Add core metadata and responsive viewport setup.
- Add brand tokens from `brand-ux-system.md`.
- Create reusable UI primitives:
  - button
  - input
  - select
  - badge
  - alert
  - card/list surface
  - page shell
- Add typed listing/profile fixtures in `src/data`.
- Add helpers:
  - `src/lib/whatsapp.ts`
  - `src/lib/locations/my.ts`
  - `src/lib/listing-completeness.ts`

### Acceptance Checks

- `npm run lint` passes.
- `npm run build` passes.
- Home route renders at mobile and desktop widths.
- No horizontal overflow at 320px, 375px, 768px, 1024px, and 1440px.
- UI colors do not collapse into a beige/brown one-note palette.

## Phase 1: Public Product Surface

### Goals

Prove traveller-facing discovery and WhatsApp conversion with mock listings.

### Routes

- `/`
- `/listings`
- `/listings/[slug]`

### Tasks

- Build owner-first home page with:
  - practical headline.
  - create listing CTA.
  - sample listing CTA.
  - clear WhatsApp handoff explanation.
- Build public directory with:
  - listing cards.
  - state/town filter.
  - capacity filter.
  - Muslim-friendly and family-friendly filters.
  - price range display.
- Build public listing detail with:
  - photo gallery.
  - trust strip.
  - details blocks.
  - amenities.
  - house rules.
  - owner/admin display card.
  - sticky mobile WhatsApp CTA.
- Track WhatsApp click locally in the mock layer or console only; durable metrics wait for Supabase.

### Acceptance Checks

- Directory cards stay stable with long Malay place names.
- Listing detail shows essential trust and fit details before long description.
- WhatsApp CTA uses a real `wa.me` URL with a prefilled message.
- Booking/payment boundary copy is visible and plain.
- Public listing pages do not use "verified" language.

## Phase 2: Owner Product Surface

### Goals

Prove owner workflow and dashboard clarity before wiring auth/persistence.

### Routes

- `/dashboard`
- `/dashboard/onboarding`
- `/dashboard/listings/new`
- `/dashboard/listings/[id]/edit`

### Tasks

- Build dashboard shell with listing rows:
  - status.
  - completeness.
  - views.
  - WhatsApp clicks.
  - last updated.
  - next action.
- Build onboarding screen:
  - display name.
  - WhatsApp number.
  - public contact name.
  - direct booking/payment confirmation.
- Build listing builder shell:
  - stay basics.
  - location.
  - price and capacity.
  - photos placeholder.
  - amenities.
  - Muslim-friendly/family-friendly details.
  - house rules.
  - preview/publish panel.
- Implement listing completeness helper against fixture data.

### Acceptance Checks

- Owner dashboard reads as an operations tool, not a marketing page.
- Listing builder shows missing required fields clearly.
- Publish action is disabled until required fields pass in the mock contract.
- Form labels are visible.
- Touch targets are usable on mobile.

## Phase 3: Supabase Foundation

### Goals

Replace the mock data layer with authenticated owner data and RLS-protected persistence.

### Tasks

- Add Supabase client setup.
- Add migrations for:
  - `profiles`
  - `listings`
  - `listing_photos`
  - `listing_metrics`
  - `admin_review_events`
- Add RLS policies for owner and admin access.
- Add sign-in/sign-out.
- Protect dashboard and admin routes.
- Add listing create/edit draft persistence.
- Add public read path for published listings only.

### Acceptance Checks

- Unauthenticated users cannot access dashboard pages.
- Owner A cannot read or edit Owner B private listings.
- Published listings are publicly readable.
- Draft/paused/needs-review listings are not publicly readable.
- Server-side validation rejects invalid enum values and incomplete publish attempts.

## Phase 4: Media And Admin MVP

### Goals

Add the minimum credible media and review flow.

### Tasks

- Configure Supabase Storage bucket for listing photos.
- Add upload UI and metadata records.
- Enforce at least 3 photos before publish.
- Add admin listing review queue.
- Add admin status updates and review event trail.
- Add durable WhatsApp click metrics.

### Acceptance Checks

- Unsupported or oversized image uploads are rejected.
- Owners cannot access another owner's media records.
- Admin status changes write append-only review events.
- WhatsApp click metrics increment without exposing private user data.

## Phase 5: Launch Readiness

### Goals

Prepare the MVP for a controlled pilot, not a broad public claim.

### Tasks

- Add SEO metadata for public listings.
- Add sitemap/robots rules.
- Add basic PWA manifest and icons.
- Add production env documentation.
- Run Security Gate.
- Run mobile/browser QA.
- Run owner pilot walkthrough.

### Acceptance Checks

- `npm run lint` passes.
- `npm run build` passes.
- Route smoke tests pass.
- Security Gate has no critical blockers.
- Mobile overflow checks pass at 320px and 375px.
- Manual owner flow completes from sign-up to published listing.
- Public listing WhatsApp handoff works on desktop and mobile.

## Out Of Scope For MVP Build

- In-app payment.
- Commission handling.
- Paid subscription billing.
- Full booking calendar.
- Reviews and ratings.
- Public "verified owner" claims.
- AI listing helper.
- Native mobile app.
- Southeast Asia expansion.

## First Sprint Recommendation

Implement Phase 0 and Phase 1 first.

Reason: it gives Adam a real product surface to judge quickly, proves the selected brand in app form, and keeps the data layer from hardening before the UX contract is visible.

Do not commit to Supabase migrations until the public listing and owner dashboard shapes feel right.

## Fast-Follow Commitment

After the MVP surface is ready, prioritize Bahasa Malaysia and critical launch features as the next Build Chapters.

BM should not be treated as an indefinite future enhancement. The first implementation can be English-first for speed, but the architecture and component copy structure should avoid choices that make BM expensive to add later.

## Verification Plan For First Sprint

- `npm run lint`
- `npm run build`
- Manual route checks:
  - `/`
  - `/listings`
  - `/listings/[sample-slug]`
- Browser width checks:
  - 320px
  - 375px
  - 768px
  - 1024px
  - 1440px
- Inspect:
  - no horizontal overflow.
  - sticky WhatsApp CTA does not cover content.
  - long place names wrap.
  - listing cards have stable image ratios.
  - primary action color is used sparingly.

## Approval Gate

Implementation should start after Adam accepts:

- architecture stack direction.
- first sprint scope: Phase 0 + Phase 1.
- mock-first data approach before Supabase migrations.
- any decision on BM launch scope if it affects visible copy.

## Open Decisions Before Phase 3

- Supabase project name and environment strategy.
- exact free listing limit: 1 or 3.
- admin review before publish or publish-first with admin pause.
- image upload max size and accepted formats.
- BM interface scope.
- verification policy for future owner profile cards.
