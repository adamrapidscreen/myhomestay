# Launch Bloom Pack - BMAD Quick Spec

Status: implementation-ready draft for Adam review
Date: 2026-06-01
Target release: Beta 0.17 candidate
Workflow: KD Plan & Build / BMAD Quick Spec hybrid

## 1. Mission

Ship the smallest high-impact feature pack that helps MyHomestay listings feel
credible, shareable, local, and easy to inquire about at launch.

The pack combines:

1. Owner Trust Checklist
2. Share Kit
3. Traveller Confidence Strip
4. WhatsApp Inquiry Kit
5. Local Mini-Guide

This should make the MVP "bloom" without turning it into a full marketplace.
It does not introduce payments, booking calendars, traveller accounts, reviews,
ratings, subscriptions, or public "verified" claims.

## 2. Source Evidence

The feature pack is grounded in current source-backed patterns:

- Airbnb host rules emphasize listing accuracy, amenities/house rules, timely
  communication, and cleanliness as core trust expectations:
  https://www.airbnb.com/help/article/2895
- Airbnb lets users report misleading, inappropriate, fake, scam, or phishing
  listings:
  https://www.airbnb.com/help/article/3598
- Airbnb asks hosts to respond within 24 hours because quick responses build
  trust and help guests move toward confirmed reservations:
  https://www.airbnb.com/help/article/2414
- WhatsApp Business positions the channel around business-customer
  conversations:
  https://business.whatsapp.com/
- Airbnb guidebooks help hosts share local tips in one easy-to-update place:
  https://www.airbnb.com/resources/hosting-homes/a/recommend-local-activities-with-this-simple-tool-477
- Tourism Malaysia frames homestay around Malaysian hospitality, kampung life,
  and authentic local experiences:
  https://www.tourism.gov.my/niche/homestay

Product interpretation: MyHomestay should not copy marketplace mechanics. It
should create a Malaysia-first trust and sharing layer around owner-created
listings, then convert interest through WhatsApp.

## 3. Product Outcomes

### Owner Outcomes

- Owner knows exactly what to improve before sharing a listing.
- Owner can share a published listing quickly via link, WhatsApp, QR, and
  caption starters.
- Owner can make the listing feel local with a small guide.
- Owner sees simple performance feedback and a nudge to keep sharing.

### Traveller Outcomes

- Traveller sees practical confidence signals before messaging.
- Traveller can send a cleaner WhatsApp inquiry with dates, guest count, and
  one question.
- Traveller understands booking/payment remains directly with the owner.
- Traveller can report suspicious or misleading listings.

### Admin Outcomes

- Admin gets clearer review vocabulary around listing readiness.
- Admin has a first abuse-report queue.
- Admin can review local-guide content if needed without building a moderation
  suite.

## 4. Design Principles

- Calm, owner-first, operational. No marketplace bloat.
- Public confidence is factual, not promotional.
- Never use public "verified" language in this pack.
- Make WhatsApp better; do not replace it.
- Local context should feel useful, not decorative.
- The first screen on mobile must still answer: what is this stay, can I trust
  it enough, and how do I contact the owner?

## 5. UX Design

### 5.1 Owner Trust Checklist

#### Placement

- Dashboard listing row: compact checklist summary and "Launch kit" action.
- Listing edit page: checklist panel near the top, before publish controls.
- New route: `/dashboard/listings/[id]/launch` for the full launch kit.

#### Checklist Items

Computed, not manually checked:

- Profile complete: display name + WhatsApp + onboarding complete.
- WhatsApp reachable: valid E.164-ish number.
- Photos ready: at least 3 photos.
- Photo quality spread: at least 2 distinct categories among photos.
- Listing essentials: name, summary, description, location, capacity, bedrooms,
  price range.
- House rules provided.
- Muslim-friendly/family-friendly details confirmed.
- Local guide started: at least 1 public guide item.
- Public preview available: listing is published.

#### UI Treatment

- Compact state: "6 of 9 launch checks complete".
- Full state: vertical checklist with status icon, short label, and direct edit
  link.
- State colors:
  - `leaf`: complete
  - `clay`: needs work
  - `river`: informational link
- Use text with icons; never color alone.

#### Empty / Edge States

- Draft listing: checklist helps owner reach publishability.
- Paused listing: checklist remains visible, but share kit says "Restore live
  before sharing".
- Needs-review listing: checklist says "Fix admin review notes before sharing".

### 5.2 Share Kit

#### Placement

- Full launch route `/dashboard/listings/[id]/launch`.
- Dashboard row for published listings: "Share" secondary action.
- Listing edit page after publish success: success panel with share actions.

#### Share Tools

- Public link display.
- Copy link button.
- Native share button when `navigator.share` is available.
- WhatsApp share message:
  - "Hi, this is my homestay page on MyHomestay: {url}"
  - Include listing name and area.
- Caption starters:
  - Facebook caption
  - TikTok caption
  - Short bilingual-ready caption structure, English first.
- QR code:
  - server-generated QR SVG/PNG route for published listings.
  - downloadable file name: `myhomestay-{slug}-qr.png` or `.svg`.

#### QR Architecture Decision

Use a proven QR library server-side instead of hand-rolling QR encoding. Keep it
out of the client bundle. Proposed route:

- `GET /dashboard/listings/[id]/qr`

The route:

- requires owner access.
- confirms listing is owned by signed-in owner.
- confirms listing is published.
- returns QR for the public listing URL.

### 5.3 Traveller Confidence Strip

#### Placement

- Public listing page, under the title/summary and before or beside the current
  `TrustStrip`.
- Listing card can show only 1-2 compact facts; full confidence strip belongs
  on listing detail.

#### Facts

Show factual signals only:

- Owner-created listing.
- Photos added: `{n} photos`.
- House rules listed.
- Last updated date.
- Booking continues on WhatsApp.
- Local guide available if at least 1 guide item.

Never show:

- "Verified"
- "Trusted owner"
- "Certified"
- "Approved by MyHomestay"

#### Report Listing

Add a quiet "Report listing" affordance:

- visible near confidence/owner card.
- opens a modal or inline form.
- reasons:
  - misleading details
  - inappropriate photo/content
  - not a real place
  - scam/phishing concern
  - other
- optional details textarea.
- optional contact field.
- submission creates `listing_reports` row.
- no public display of reports.

### 5.4 WhatsApp Inquiry Kit

#### Placement

- Replace the current plain WhatsApp CTA card on public listing detail with a
  compact inquiry card.
- Sticky mobile CTA can remain one-tap, but if the user expands or taps primary,
  route to the same message builder.

#### Fields

Client-only form state before opening WhatsApp:

- Check-in date, optional.
- Check-out date, optional.
- Guest count, optional numeric.
- Quick question select:
  - Is this available?
  - Can you confirm total price?
  - Is parking available?
  - Is early check-in possible?
  - Other
- Optional custom note, max 240 chars.

#### Generated Message

Message structure:

```text
Hi, I'm interested in "{listing.name}" on MyHomestay.
Area: {area, town/state}
Dates: {check-in} to {check-out}
Guests: {guest count}
Question: {question/custom note}
Could you confirm availability and total price?
Thank you.
```

Rules:

- Do not store traveller inquiry details.
- Do not introduce booking state.
- Still increment WhatsApp click metric on CTA.
- Validate text length before generating link.
- Keep fallback simple: if fields are blank, current message still works.

#### Owner Quick Replies

Add owner-facing copy templates in launch kit:

- "Available, please share dates and number of guests."
- "Sorry, not available on those dates."
- "Total price is RM __ for __ nights."
- "Check-in is from __ and parking is __."

These are copyable snippets only; no messaging inbox.

### 5.5 Local Mini-Guide

#### Placement

- Owner launch route: editable guide item manager.
- Listing edit page: link to launch route or compact guide summary.
- Public listing detail: "Nearby and local notes" section after amenities/house
  rules and before footer; on desktop it can sit in the main content column.

#### Guide Item Categories

Allowlisted categories:

- food
- mosque-surau
- groceries
- attraction
- transport
- check-in
- local-tip
- other

#### Fields

- category
- title, max 80 chars
- note, max 240 chars
- distance label, optional, max 60 chars (`5 min drive`, `walking distance`)
- public/private toggle, default public
- sort order

Do not collect exact coordinates in this pack.

#### UI Treatment

- Owner: simple list editor with add/edit/delete/reorder.
- Public: grouped compact rows, not cards inside cards.
- Empty public state: hide the section.
- Empty owner state: "Add one local note guests usually ask about."

## 6. Technical Architecture

### 6.1 Route Map

New owner routes:

- `/dashboard/listings/[id]/launch`
- `/dashboard/listings/[id]/qr`

New public/API routes:

- `POST /api/listing-reports`

Existing routes modified:

- `/dashboard`
- `/dashboard/listings/[id]/edit`
- `/listings/[slug]`
- `/api/listing-metrics`

### 6.2 Proposed File Map

```text
src/app/dashboard/listings/[id]/launch/page.tsx
src/app/dashboard/listings/[id]/launch/actions.ts
src/app/dashboard/listings/[id]/qr/route.ts

src/app/api/listing-reports/route.ts

src/components/dashboard/launch-checklist.tsx
src/components/dashboard/share-kit.tsx
src/components/dashboard/local-guide-manager.tsx
src/components/dashboard/owner-quick-replies.tsx

src/components/listings/confidence-strip.tsx
src/components/listings/inquiry-card.tsx
src/components/listings/local-mini-guide.tsx
src/components/listings/report-listing-form.tsx

src/lib/launch-checks.ts
src/lib/share-copy.ts
src/lib/inquiry-message.ts
src/lib/local-guide.ts

src/server/launch-data.ts
src/server/local-guide-data.ts
src/server/listing-reports-data.ts

supabase/migrations/0012_launch_bloom_pack.sql
```

### 6.3 Database Migration

Create migration:

`supabase/migrations/0012_launch_bloom_pack.sql`

#### `listing_guide_items`

```sql
create type public.guide_item_category as enum (
  'food',
  'mosque-surau',
  'groceries',
  'attraction',
  'transport',
  'check-in',
  'local-tip',
  'other'
);

create table public.listing_guide_items (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  category public.guide_item_category not null default 'local-tip',
  title text not null default '',
  note text not null default '',
  distance_label text,
  is_public boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guide_title_len check (char_length(title) <= 80),
  constraint guide_note_len check (char_length(note) <= 240),
  constraint guide_distance_len check (char_length(coalesce(distance_label, '')) <= 60)
);
```

RLS:

- owner can select/insert/update/delete guide items for own listings.
- admin can select all guide items.
- public must not get broad table select; public reads should go through a
  column-scoped RPC for published listings.

RPC:

```sql
get_published_listing_guide_items(p_listing_id uuid)
```

Returns only:

- id
- category
- title
- note
- distance_label
- sort_order

Only when parent listing is `published` and item `is_public = true`.

#### `listing_reports`

```sql
create type public.listing_report_reason as enum (
  'misleading',
  'inappropriate',
  'not-real-place',
  'scam-phishing',
  'other'
);

create type public.listing_report_status as enum (
  'new',
  'reviewed',
  'dismissed'
);

create table public.listing_reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  reason public.listing_report_reason not null,
  details text not null default '',
  reporter_contact text,
  status public.listing_report_status not null default 'new',
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint report_details_len check (char_length(details) <= 1000),
  constraint reporter_contact_len check (char_length(coalesce(reporter_contact, '')) <= 160)
);
```

RLS:

- anon/authenticated can insert reports only for currently published listings.
- anon/authenticated cannot select reports.
- admins can select/update reports.
- owners cannot read reports directly in this pack; admin decides whether to
  contact owner.

### 6.4 Data Access Rules

Server modules must remain server-only:

- `local-guide-data.ts`
- `listing-reports-data.ts`
- `launch-data.ts`

All mutations validate:

- listing ownership through RLS and explicit owner checks.
- category/reason/status allowlists server-side.
- length limits before database write.
- no service role in public/client code.

### 6.5 Public Read Strategy

Keep current public listing read path intact:

- `get_published_listings`
- `get_published_listing_by_slug`
- `get_listing_owner_public`

Add local guide public read as a separate RPC instead of expanding public table
select. This preserves the Chapter 4 public/private column-scope decision.

### 6.6 QR Strategy

Dependency choice:

- Use a proven QR generation package server-side.
- Do not ship QR generator code to the client bundle.
- Route returns SVG by default; PNG download can be a follow-up if SVG is
  enough for launch.

Security:

- owner-only route.
- published listings only.
- no raw owner contact details in QR payload; QR points to public listing URL.

### 6.7 Inquiry Privacy

The inquiry builder must not store traveller-entered details. It only builds a
prefilled WhatsApp message locally and opens WhatsApp.

Do not add:

- inquiry database table
- guest phone/email storage
- booking state
- availability state

## 7. Implementation Work Cards

### Work Card LB-1: Launch Data Foundation

Implement migration `0012_launch_bloom_pack.sql`.

Tasks:

- Add `guide_item_category`, `listing_report_reason`, `listing_report_status`.
- Add `listing_guide_items`.
- Add `listing_reports`.
- Add RLS policies.
- Add public guide-items RPC.
- Add server data modules.
- Add unit tests for pure helpers.

Acceptance:

- Owners can CRUD guide items only for their listings.
- Public can read guide items only for published listings via RPC.
- Public can insert reports for published listings only.
- Public cannot select reports.
- Admin can select/update reports.

### Work Card LB-2: Owner Trust Checklist

Implement computed checklist.

Tasks:

- Add `src/lib/launch-checks.ts`.
- Add dashboard row compact checklist summary.
- Add edit-page checklist panel.
- Add `/dashboard/listings/[id]/launch` shell.

Acceptance:

- Checklist reflects profile, listing, photos, guide items, and publish state.
- Each incomplete item has a useful owner action link.
- No database writes are needed to mark checks complete.

### Work Card LB-3: Share Kit

Implement owner share tools.

Tasks:

- Add share copy helpers.
- Add copy link button.
- Add native share fallback behavior.
- Add WhatsApp owner-share URL.
- Add caption starters.
- Add QR route and UI.

Acceptance:

- Published listing shows full share kit.
- Draft/paused/needs-review listings show honest unavailable state.
- Copy/share actions do not expose private fields.
- QR route returns only for owner-owned published listings.

### Work Card LB-4: Local Mini-Guide

Implement guide manager and public section.

Tasks:

- Add owner guide item manager on launch route.
- Add add/edit/delete actions.
- Add public local guide section.
- Add guide item count to checklist/confidence strip.

Acceptance:

- Owner can add, edit, delete, and hide guide items.
- Public listing shows only public guide items for published listings.
- Empty guide does not create public clutter.
- Mobile layout has no horizontal overflow.

### Work Card LB-5: Traveller Confidence Strip And Report Listing

Implement public confidence layer.

Tasks:

- Add `ConfidenceStrip`.
- Add report listing form/modal.
- Add report insert route/action.
- Add admin report visibility on `/admin` or a compact section.

Acceptance:

- Public listing shows factual trust details.
- No public "verified" language appears.
- Report form validates reason and max lengths.
- Reports are not publicly readable.
- Admin can see new reports.

### Work Card LB-6: WhatsApp Inquiry Kit

Implement inquiry composer.

Tasks:

- Add `inquiry-message.ts` helper.
- Replace simple CTA card with inquiry card.
- Keep sticky mobile CTA, but ensure it uses generated/default inquiry path.
- Add owner quick replies in launch kit.

Acceptance:

- Traveller can open WhatsApp with generated inquiry message.
- Blank fields still produce valid message.
- Overlong note is blocked or trimmed safely.
- WhatsApp click metric still increments.
- No traveller inquiry data is stored.

### Work Card LB-7: Polish, QA, And Closeout

Tasks:

- Playwright/mobile sweep at 320, 375, 768, 1280.
- Test owner, public, admin paths.
- Test RLS negative paths.
- Update `build-status.md`.
- Add release notes.

Acceptance:

- `npm.cmd run typecheck` passes.
- `npm.cmd run lint` passes.
- `npm.cmd test` passes.
- `npm.cmd run build` passes.
- Public pages have no horizontal overflow.
- Protected routes enforce owner/admin boundaries.
- Spec acceptance checks are all satisfied or explicitly deferred.

## 8. Test Plan

### Unit Tests

Add tests for:

- `launch-checks.ts`
- `share-copy.ts`
- `inquiry-message.ts`
- `local-guide.ts`

### Integration / Runtime Probes

Routes:

- `/dashboard`
- `/dashboard/listings/[id]/edit`
- `/dashboard/listings/[id]/launch`
- `/dashboard/listings/[id]/qr`
- `/listings/[slug]`
- `/api/listing-reports`

### RLS / Security Checks

- Owner A cannot CRUD Owner B guide items.
- Public cannot read draft/paused/needs-review guide items.
- Public cannot select listing reports.
- Public report insert rejects non-published listing.
- QR route rejects unauthenticated and cross-owner access.
- Inquiry kit stores no traveller data.

### UX QA

Widths:

- 320
- 375
- 768
- 1280

Check:

- no horizontal overflow.
- buttons wrap professionally.
- long listing names and local guide notes wrap.
- sticky CTA does not cover content.
- report form usable on mobile.

## 9. Out Of Scope

- Online payment
- Booking calendar
- Availability management
- Traveller accounts
- Reviews/ratings
- Paid subscription
- Public verification claims
- IC/business/property verification
- Automated image moderation
- Full admin case-management workflow
- Stored guest inquiries
- Last-7-days analytics events

## 10. Risks And Decisions

### Accepted For MVP

- Public metrics remain directional and can be inflated.
- Local guide content is owner-generated and not pre-moderated.
- Report listing is a lightweight safety valve, not full Trust & Safety tooling.
- QR code points to public listing only; it does not encode owner phone.

### Decision Needed Before Build

Pilot area pack is intentionally omitted from this pack. It is valuable, but it
depends on Adam's first launch geography. Keep it as a later content/business
decision after this pack ships.

### Future Follow-Ups

- Admin report queue with statuses and owner notification.
- Better photo reorder/cover selection.
- BM version of share captions and inquiry templates.
- Local guide item reordering via drag/drop.
- Last-7-days analytics using event table.

## 11. Final Acceptance Checklist

- [ ] Owner can see what to fix before sharing.
- [ ] Owner can open one launch page for checklist, share kit, local guide, and
      quick replies.
- [ ] Owner can copy/share a published listing link.
- [ ] Owner can download or display a QR code for a published listing.
- [ ] Traveller sees confidence facts without "verified" language.
- [ ] Traveller can compose a better WhatsApp inquiry.
- [ ] Public listing shows local guide items when owner added them.
- [ ] Traveller can report a suspicious/misleading listing.
- [ ] Admin can see submitted reports.
- [ ] RLS protects owner guide items and report reads.
- [ ] No payment, booking, review, rating, traveller account, or subscription
      feature is introduced.
- [ ] `rg -i "verified|certified|approved" src docs/product/launch-bloom-spec.md`
      returns no public claim violations except explicit "do not use" guidance.
- [ ] Typecheck, lint, tests, build pass.
- [ ] Browser/mobile QA passes at 320, 375, 768, and 1280.

## 12. Recommended Implementation Order

1. LB-1 Launch Data Foundation
2. LB-2 Owner Trust Checklist
3. LB-3 Share Kit
4. LB-4 Local Mini-Guide
5. LB-5 Traveller Confidence Strip And Report Listing
6. LB-6 WhatsApp Inquiry Kit
7. LB-7 Polish, QA, And Closeout

This order gives the implementation run a stable data base first, then owner
activation, then public trust/conversion.
