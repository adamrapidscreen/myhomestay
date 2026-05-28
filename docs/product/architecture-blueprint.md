# MyHomestay Architecture Blueprint

## Status

Draft v0.1. Created after the accepted `Kampung Quiet Ledger Hybrid` brand direction.

This blueprint is ready for review before app implementation. It is based on:

- `docs/product/product-spine.md`
- `docs/product/product-brief.md`
- `docs/product/prd-lite.md`
- `docs/product/brand-ux-system.md`

## Architecture Goal

Build a mobile-first responsive web app with a hybrid PWA path that lets Malaysian homestay owners create credible public listings, share those pages anywhere, and route booking/payment conversations to WhatsApp during the MVP.

The architecture should be simple enough to ship quickly, but strict enough that auth, listing ownership, public/private data separation, media handling, and future subscriptions do not need a full rewrite later.

## Recommended Stack

### Application

- Next.js App Router with TypeScript.
- React Server Components by default for public and dashboard data loading.
- Server Actions or route handlers for mutations where appropriate.
- Tailwind CSS for implementation speed and strict design-token control.
- Small local component layer instead of a heavy UI kit.

### Data And Auth

- Supabase Postgres for relational product data.
- Supabase Auth for owner and admin accounts.
- Supabase Storage for listing photos.
- Row Level Security as the enforcement layer for owner/admin access control.

### Hosting

- Vercel for the web application.
- Supabase managed project for database, auth, and media.
- Environment variables for Supabase URLs/keys and any later admin-only secrets.

### PWA Path

- Start as a responsive web app.
- Add manifest, install metadata, icons, and offline-light behavior after the core MVP flows work.
- Avoid complex offline listing editing in MVP.

## System Shape

```text
Browser
  -> Public routes
     -> Directory
     -> Listing page
     -> WhatsApp handoff link

  -> Owner routes
     -> Auth
     -> Dashboard
     -> Listing builder
     -> Media upload

  -> Admin routes
     -> Review queue
     -> Status changes
     -> Audit trail

Next.js App
  -> Server components for reads
  -> Server actions / route handlers for writes
  -> Supabase client with user session
  -> Supabase service role only in tightly scoped admin server paths

Supabase
  -> Auth users
  -> Postgres tables with RLS
  -> Storage buckets with ownership policies

External
  -> WhatsApp deep link / wa.me handoff
```

## Route Map

### Public

- `/` - owner-first landing and product entry.
- `/listings` - public directory.
- `/listings/[slug]` - public listing detail.
- `/owners/[ownerSlug]` - optional public owner profile page after listing pages are stable.

### Owner

- `/dashboard` - owner dashboard.
- `/dashboard/onboarding` - owner profile setup.
- `/dashboard/listings/new` - create listing.
- `/dashboard/listings/[id]/edit` - edit listing.
- `/dashboard/listings/[id]/preview` - private preview before publish.

### Admin

- `/admin/listings` - listing review queue.
- `/admin/listings/[id]` - review detail and status history.

### System

- `/auth/callback` - Supabase auth callback.
- `/api/listings/[id]/whatsapp-click` - record WhatsApp CTA click before redirect or link generation.
- `/api/health` - deployment/runtime health check.

## Data Model

### `profiles`

Owner/admin public profile and account metadata.

- `id` UUID, primary key, references auth user.
- `role` enum: `owner`, `admin`.
- `display_name` text.
- `owner_slug` text, unique.
- `whatsapp_number` text.
- `public_contact_name` text.
- `created_at` timestamp.
- `updated_at` timestamp.

### `listings`

Core property record.

- `id` UUID, primary key.
- `owner_id` UUID, references `profiles.id`.
- `slug` text, unique.
- `status` enum: `draft`, `published`, `paused`, `needs_review`.
- `name` text.
- `description` text.
- `area` text.
- `town` text.
- `state` text.
- `price_min` integer, nullable.
- `price_max` integer, nullable.
- `currency` text, default `MYR`.
- `guest_capacity` integer.
- `bedroom_count` integer.
- `bathroom_count` integer.
- `muslim_friendly` boolean.
- `family_friendly` boolean.
- `amenities` text array or normalized join table.
- `house_rules` text.
- `whatsapp_number_override` text, nullable.
- `cover_photo_id` UUID, nullable.
- `published_at` timestamp, nullable.
- `created_at` timestamp.
- `updated_at` timestamp.

### `listing_photos`

Listing media records linked to Supabase Storage objects.

- `id` UUID, primary key.
- `listing_id` UUID.
- `owner_id` UUID.
- `storage_path` text.
- `alt_text` text.
- `sort_order` integer.
- `is_cover` boolean.
- `created_at` timestamp.

### `listing_metrics`

Small MVP metrics table. Keep it intentionally modest.

- `listing_id` UUID, primary key.
- `view_count` integer.
- `whatsapp_click_count` integer.
- `last_viewed_at` timestamp, nullable.
- `last_inquiry_click_at` timestamp, nullable.
- `updated_at` timestamp.

### `admin_review_events`

Append-only review trail.

- `id` UUID, primary key.
- `listing_id` UUID.
- `admin_id` UUID.
- `previous_status` listing status.
- `new_status` listing status.
- `reason` text.
- `created_at` timestamp.

### Future Subscription Tables

Do not implement billing in MVP, but reserve the model shape:

- `plans`
- `owner_subscriptions`
- `featured_listing_slots`
- `verification_events`

These should stay inactive until pricing, payment provider, and verification policy are approved.

## Access Control

### Public Rules

- Published listings are publicly readable.
- Draft, paused, and needs-review listings are not publicly readable.
- Public pages may show owner/admin display name and public WhatsApp contact only.
- Public pages must not expose account email, auth identifiers, internal notes, or admin review history.

### Owner Rules

- Owners can read and edit their own profile.
- Owners can create up to 3 MVP listings.
- Owners can read, edit, pause, and publish their own listings.
- Owners cannot read or mutate another owner's private listing records.
- Owners cannot set admin-only fields.

### Admin Rules

- Admins can review all listings and owner public contact fields.
- Admins can change listing status and write review events.
- Admin-only server paths must be protected by session role checks plus RLS.

## Listing Completeness

Completeness should be calculated from required fields:

- name
- area, town, state
- WhatsApp number from listing or owner profile
- price range
- guest capacity
- bedroom and bathroom count
- at least 3 photos
- Muslim-friendly flag
- family-friendly flag
- amenities
- house rules
- owner/admin display name

Implementation rule: completeness can be computed in application code first. If it becomes needed for search or admin reporting, add a database view later.

## Media Handling

- Store listing photos in Supabase Storage.
- Use private upload paths owned by the listing owner.
- Publicly serve only photos for published listings.
- Reject unsupported file types and oversized files before upload when possible, and enforce server/storage policy as the real boundary.
- Generate predictable image aspect ratios in UI so owner photos do not break layout.
- Require at least 3 photos before publish.

## WhatsApp Handoff

WhatsApp remains the MVP transaction boundary.

The listing page should generate a link with:

- owner/listing WhatsApp number.
- listing name.
- area/town/state.
- a short prefilled inquiry message.

Metrics should track clicks, but the product must clearly state that booking and payment continue directly between guest and owner.

## Location Strategy

Start with a Malaysia-first static location helper:

- state
- town
- area

Use a typed local source such as `src/lib/locations/my.ts` for MVP speed. Normalize to database-backed locations only when there is enough listing density or admin need.

## Search And Browse

MVP search should be simple:

- query published listings.
- filter by state, town, guest capacity, price range, Muslim-friendly, and family-friendly.
- sort by updated date or simple featured flag later.

Database indexes should cover:

- listing status.
- state/town.
- guest capacity.
- price range.
- owner id.
- slug.

Full text search can wait until real listing volume exists.

## Component Architecture

```text
src/app
  public routes, dashboard routes, admin routes

src/components/brand
  wordmark, shell, page bands, typography helpers

src/components/ui
  button, input, select, badge, alert, tabs, drawer

src/components/listings
  listing card, gallery, trust strip, amenity list, WhatsApp CTA

src/components/owner
  dashboard row, completeness panel, listing form sections

src/components/admin
  review queue, status controls, review history

src/lib
  supabase clients, auth helpers, validation, WhatsApp helper, locations

src/server
  server-only data access and mutations

supabase
  migrations, seed data, RLS policies
```

## Validation

Use shared schemas for server-side validation:

- profile fields.
- listing fields.
- listing status changes.
- media metadata.
- WhatsApp number normalization.

Do not trust form controls or browser-only checks. Required fields and allowed enum values must be validated on the server before durable writes.

## Security And Privacy

MVP security baseline:

- RLS policies for all owner-owned tables.
- server-side role checks for dashboard/admin routes.
- no service role usage in client code.
- no secrets in repo.
- upload size/type validation.
- public/private field separation.
- rate limit public metric endpoints if abuse appears.
- append-only admin review events.

Run Security Gate before any production launch claim.

## Deployment Environments

Recommended environments:

- local development.
- preview deployment.
- production.

Required env categories:

- Supabase URL.
- Supabase anon key.
- Supabase service role key only on server, only if needed.
- site URL.
- optional analytics key later.

## Future Subscription Path

Design room for paid features without shipping them in MVP:

- feature flags or plan checks around featured placement.
- nullable premium fields that do not affect free listing publish.
- separate subscription tables, not payment fields mixed into core listings.
- verification events separate from owner profile so "verified" claims have evidence.

Do not expose paid plan promises in the app until pricing and verification rules are approved.

## Bahasa Malaysia Fast-Follow

The MVP implementation may start English-first, but the architecture must remain BM-ready.

Practical requirements:

- keep user-facing strings centralized enough to translate without hunting through every component.
- avoid hard-coded layout assumptions that break with longer BM labels.
- keep route and metadata strategy compatible with a later BM layer.
- verify mobile widths again when BM copy lands.

Full BM implementation is a committed fast-follow after the MVP surface is ready.

## First Implementation Slice

After this blueprint is accepted, the first implementation slice should:

1. Re-scaffold the Next.js TypeScript app.
2. Implement the brand tokens and core layout shell.
3. Add typed mock listing data.
4. Build public landing, directory, listing detail, owner dashboard shell, and listing builder shell.
5. Add Supabase data/auth only after the UI contract and route shape are stable.

This keeps the product visible quickly while avoiding premature database churn.

## Open Decisions

- BM from launch: full interface, partial owner-facing copy, or later?
- Free limit: exactly 1 listing or up to 3 listings?
- Listing approval: auto-publish with admin pause, or admin review before first public launch?
- Photo storage: Supabase Storage only, or external image service later?
- First verification policy before any public "verified" language.
- Payment/subscription provider when paid features begin.

## Acceptance Checks

- Architecture supports owner onboarding, listing builder, dashboard, public directory, listing page, WhatsApp handoff, and admin review.
- Public/private data boundaries are explicit.
- Owner access is enforced server-side and by RLS.
- MVP avoids in-app payment and subscription billing.
- Future subscription and verification paths have clean extension points.
- Brand implementation can follow `Kampung Quiet Ledger Hybrid`.
- PWA path is preserved without forcing offline complexity into MVP.
- First implementation slice can start without resurrecting the deleted Vibe test app.
