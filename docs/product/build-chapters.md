# MyHomestay Build Chapters And Work Cards

## Status

Draft v0.1. Created after Founder Decision Lock acceptance.

This replaces full BMAD epics/stories for MyHomestay.

- **Build Chapters** are major delivery slices.
- **Work Cards** are concrete implementation units small enough to build, verify, and review.

## Source Inputs

- `docs/product/product-spine.md`
- `docs/product/product-brief.md`
- `docs/product/prd-lite.md`
- `docs/product/brand-ux-system.md`
- `docs/product/architecture-blueprint.md`
- `docs/product/mvp-build-spec.md`
- `docs/product/founder-decision-lock.md`

## Delivery Strategy

Build the MVP in a mock-first path, then harden into real auth/data/storage and launch readiness.

Do not treat Bahasa Malaysia as a vague future wish. BM support is a committed fast-follow after the MVP surface is ready.

## Build Chapter 1: App Foundation And Brand Shell

Goal: restore the repo as a clean Next.js product foundation with the selected MyHomestay brand system.

### Work Card 1.1: Scaffold Next.js App

Create the app foundation with Next.js App Router, TypeScript, Tailwind, linting, and build scripts.

Acceptance:

- App runs locally.
- `npm run lint` passes.
- `npm run build` passes.
- No deleted Vibe-session code is resurrected.

### Work Card 1.2: Implement Brand Tokens And Global Shell

Add the `Kampung Quiet Ledger Hybrid` color, type, spacing, and surface rules.

Acceptance:

- Global styles expose the core tokens.
- Buttons, badges, forms, and surfaces follow the brand system.
- UI does not collapse into a beige/brown one-note palette.

### Work Card 1.3: Add Typed Mock Data Contracts

Create owner, listing, photo, metric, and location fixtures that match the future Supabase model.

Acceptance:

- Listing fixtures cover draft, published, paused, and needs-review examples.
- At least one long Malay place name exists for wrapping checks.
- Mock data can power home, directory, listing detail, and dashboard surfaces.

### Work Card 1.4: Add Core Helpers

Create WhatsApp URL, Malaysia location, and listing completeness helpers.

Acceptance:

- WhatsApp helper generates `wa.me` links with prefilled listing inquiry copy.
- Completeness helper identifies missing required fields.
- Location helper supports state/town/area display.

## Build Chapter 2: Public Discovery And Listing Experience

Goal: make the public product feel real enough to judge, share, and test.

### Work Card 2.1: Owner-First Home Page

Build the first homepage with owner-focused positioning and a clear traveller browse path.

Acceptance:

- Primary CTA is owner-oriented.
- Secondary path opens listing browsing or sample listing.
- WhatsApp booking/payment boundary is clear.

### Work Card 2.2: Public Directory

Build `/listings` with responsive listing cards and MVP filters.

Acceptance:

- Filters include state/town, capacity, price, Muslim-friendly, and family-friendly.
- Cards show photo, name, area, capacity, price range, trust flags, and WhatsApp-ready state.
- Cards stay stable on mobile.

### Work Card 2.3: Public Listing Detail

Build `/listings/[slug]` with gallery, trust strip, details, rules, owner card, and WhatsApp CTA.

Acceptance:

- Essential trust and fit details appear before long description.
- Sticky mobile WhatsApp CTA does not cover content.
- No "verified" language appears.

### Work Card 2.4: Public Surface QA

Run browser checks across key widths.

Acceptance:

- No horizontal overflow at 320px, 375px, 768px, 1024px, and 1440px.
- Long place names and WhatsApp labels wrap cleanly.
- Listing image ratios remain stable.

## Build Chapter 3: Owner Dashboard And Listing Builder

Goal: prove the owner workflow before real auth and persistence.

### Work Card 3.1: Owner Dashboard Shell

Build `/dashboard` with listing rows, completeness, metrics, status, and next action.

Acceptance:

- Dashboard reads as an owner operations tool.
- Each listing row answers status, performance, and next action.
- Mobile layout collapses cleanly.

### Work Card 3.2: Owner Onboarding

Build `/dashboard/onboarding` for display name, public contact name, WhatsApp number, and handoff confirmation.

Acceptance:

- Labels are visible.
- Owner understands that booking/payment stays on WhatsApp.
- Save state is visible even if persistence is mock-only.

### Work Card 3.3: Listing Builder Shell

Build create/edit listing screens with sections for basics, location, price/capacity, photos, amenities, family/Muslim-friendly details, rules, preview, and publish.

Acceptance:

- Required fields are clear.
- Publish is disabled until required mock fields pass.
- Drafts can have fewer than 3 photos, published listings cannot.

### Work Card 3.4: Owner Surface QA

Verify owner routes on mobile and desktop.

Acceptance:

- Forms are one-column on mobile.
- Touch targets are usable.
- No dashboard horizontal overflow.

## Build Chapter 4: Supabase Auth, Data, And Storage

Goal: replace mock data with real protected owner data.

### Work Card 4.1: Supabase Project Wiring

Add Supabase clients, env templates, and auth callback route.

Acceptance:

- Secrets are not committed.
- Local env template documents required variables.
- Sign-in/sign-out path works locally.

### Work Card 4.2: Database Migrations And RLS

Add migrations for profiles, listings, photos, metrics, and admin review events.

Acceptance:

- RLS is enabled.
- Owner access policies protect private records.
- Public read only includes published listings.

### Work Card 4.3: Listing Persistence

Persist owner profile, listing draft, edit, publish, pause, and public listing reads.

Acceptance:

- Owner A cannot edit Owner B listings.
- Incomplete listings cannot be published.
- Free listing limit enforces up to 3 listings.

### Work Card 4.4: Photo Upload Foundation

Add Supabase Storage uploads and listing photo metadata.

Acceptance:

- Upload type and size are constrained.
- At least 3 photos are required before publish.
- Owners cannot access another owner's media records.

## Build Chapter 5: Admin Review And Launch Readiness

Goal: add the minimum operator controls and launch confidence for a controlled pilot.

### Work Card 5.1: Minimal Admin Review

Build admin listing queue and status actions.

Acceptance:

- Admin can mark published, paused, or needs review.
- Review events are append-only.
- Admin routes are protected.

### Work Card 5.2: Durable WhatsApp Metrics

Record public listing views and WhatsApp CTA clicks.

Acceptance:

- Metrics increment without exposing private user data.
- CTA remains a real WhatsApp link.
- Booking/payment boundary copy remains visible.

### Work Card 5.3: SEO And Share Metadata

Add metadata for listing pages and directory.

Acceptance:

- Public listing title/description/share image fields render.
- No private owner data leaks into metadata.

### Work Card 5.4: Security Gate And Pilot Checklist

Run pre-launch checks before any production readiness claim.

Acceptance:

- Security Gate has no critical blockers.
- Auth, RLS, public/private fields, upload limits, and admin routes are reviewed.
- Controlled pilot checklist exists.

## Build Chapter 6: Bahasa Malaysia Fast-Follow

Goal: add BM support quickly after the MVP surface is ready.

### Work Card 6.1: BM Scope Decision

Lock whether BM support starts with full UI, owner-facing pages, public listing pages, or selected helper copy.

Acceptance:

- BM scope is documented.
- Route/content strategy is chosen.
- Translation ownership is clear.

### Work Card 6.2: BM Interface Foundation

Add localization structure without destabilizing existing routes.

Acceptance:

- Shared UI strings can be translated.
- Formatting remains stable for longer BM labels.
- Language strategy does not break SEO.

### Work Card 6.3: BM Owner And Listing Copy

Translate the selected MVP surfaces.

Acceptance:

- Owner onboarding and listing builder copy are understandable.
- Public listing trust/WhatsApp copy works in BM.
- No horizontal overflow from longer labels.

## Build Chapter 7: Critical Launch Fast-Follows

Goal: handle the important but non-first-sprint work immediately after MVP validation.

Candidate Work Cards:

- abuse/spam guard around WhatsApp exposure.
- image moderation policy and admin workflow.
- PWA manifest and install basics.
- first pilot area/state content pack.
- owner support/help copy.
- analytics review dashboard.

These should be prioritized after Build Chapter 5 and BM scope lock, based on pilot risk.

## First Implementation Recommendation

Start with Build Chapter 1, then Build Chapter 2.

Do not start Build Chapter 4 until the public and owner surfaces feel right enough to avoid database churn.

## Verification Pattern

Every completed Build Chapter should have:

- implementation summary.
- commands run.
- browser/mobile evidence where UI changed.
- known risks.
- next recommended Work Card.
