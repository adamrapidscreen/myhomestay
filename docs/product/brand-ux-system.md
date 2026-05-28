# MyHomestay Brand and UX System

## Status

Accepted v0.2. Atelier-47 direction based on `product-spine.md`, `product-brief.md`, and `prd-lite.md`.

See `brand-routes-proof-sheet.md` for the 2026-05-28 Apple, CBTL, and Agoda reference intake and the recommended hybrid route.

Decision: Adam selected the hybrid direction on 2026-05-28.

## Direction Name

Kampung Quiet Ledger Hybrid

## Design Thesis

MyHomestay should feel like a calm, trustworthy owner tool first and a local stay directory second.

The selected hybrid is: **Kampung Quiet Ledger, warmed with Rumah Artisan, disciplined by Stayflow Malaysia.**

The visual system should borrow from three worlds:

- the quiet credibility of a well-kept guest register
- the warmth of kampung-modern hospitality
- the precision of a simple owner operations dashboard

The result should be minimal and artisan without becoming rustic decoration. It should help non-technical owners feel capable and help travellers feel that the listing is real, cared for, and easy to act on.

## Brand Position

MyHomestay is not a global marketplace clone. It is a local trust layer for Malaysian homestay owners.

The brand should communicate:

- owner dignity
- practical trust
- local warmth
- simple publishing
- easy WhatsApp continuation
- Malaysia-first credibility

## Audience Jobs

### Owner Job

"Help me make my homestay look credible online, without making me manage a complicated booking platform."

### Traveller Job

"Show me enough trustworthy details so I can decide whether to WhatsApp the owner."

### Platform Admin Job

"Help me review listing quality, trust signals, and owner readiness without getting buried."

## Keep / Change / Remove

### Keep

- Owner-first product focus.
- WhatsApp handoff as the MVP booking path.
- Clean public listing pages.
- Malaysia-first location structure.
- Muslim-friendly and family-friendly trust details.
- Simple owner dashboard.

### Change

- Replace generic travel-site drama with operational calm.
- Replace card-heavy marketing layout with structured owner workflows.
- Make listing completeness feel like helpful progress, not a warning system.
- Make public listings feel like verified local records, not ads.

### Remove

- Generic hero gradients.
- Decorative blobs, bokeh, and visual noise.
- Overly rounded SaaS cards.
- AirBnB-style imitation.
- Heavy destination fantasy language.
- Cluttered marketplace chrome before there is marketplace density.

## Visual Principles

1. Calm before clever.
2. Owner actions must be obvious.
3. Public trust details should be scannable.
4. Local warmth should come from texture, language, photography, and spacing, not gimmicks.
5. Every screen should work on a modest phone first.
6. Use less UI chrome than expected, but more clarity than a social post.

## Color System

Avoid a one-note beige/brown theme. The base can be warm, but the system needs clear green, blue, charcoal, and clay accents for meaning.

### Core Tokens

- `ink`: `#1E211B` - primary text
- `muted-ink`: `#62665A` - secondary text
- `paper`: `#FBFAF5` - page background
- `rice`: `#F3EFE4` - subtle section background
- `stone`: `#D8D1C3` - borders and dividers
- `leaf`: `#2F6B4F` - primary action, trust, publish
- `deep-leaf`: `#214B39` - strong action hover
- `river`: `#2F5F8F` - links, informational states
- `clay`: `#B66A3C` - attention, incomplete listing hints
- `sun`: `#D9A441` - featured or premium hint
- `danger`: `#A33A32` - destructive or blocked state
- `white`: `#FFFFFF` - elevated surfaces

### State Use

- Publish / active / verified: leaf
- Informational / link / analytics: river
- Incomplete / needs attention: clay
- Featured / premium: sun
- Paused / rejected / risky: danger

Do not rely on color alone. Pair all states with text and icons.

## Typography

Use two type roles:

- A warm editorial display face for product and listing identity.
- A clear sans-serif for all operational UI.

Recommended direction:

- Display: `Fraunces`, `Newsreader`, or similar restrained serif.
- UI: `Inter`, `Geist`, or similar neutral sans.
- Numeric/dashboard details: use tabular numerals where available.

### Type Rules

- Public listing names can use display type.
- Owner dashboard headings should be smaller and practical.
- Do not use hero-scale type inside dashboard panels.
- Letter spacing should remain normal except small uppercase labels.
- Long Malay place names and owner-entered names must wrap cleanly.

## Layout System

### Page Rhythm

Use structured full-width bands with constrained inner content. Do not nest cards inside cards.

Preferred widths:

- Public pages: max `1120px`
- Owner dashboard: max `1280px`
- Forms: max `760px`
- Reading/detail columns: max `720px`

### Grid

- Mobile: one column, sticky bottom action when needed.
- Tablet: two columns for preview + form support.
- Desktop: dashboard shell with left navigation and main work area.

### Surface Rules

- Cards may be used for listings, metrics, modals, and repeated items.
- Page sections should not look like floating cards.
- Border radius should stay at `6px` or `8px`.
- Shadows should be minimal; prefer borders, spacing, and subtle background shifts.
- Avoid nested framed boxes. If hierarchy is needed, use dividers and spacing.

## Core Screens

### 1. Owner Welcome

Purpose: get the owner to create the first listing quickly.

Must include:

- simple brand mark and product promise
- primary action: create first listing
- secondary action: view example listing
- plain explanation that booking/payment remains on WhatsApp for MVP
- no marketing-heavy hero

Tone: "Set up your homestay page" rather than "Join the future of travel."

### 2. Owner Onboarding

Purpose: collect owner profile basics before first listing.

Flow:

1. Owner/admin name
2. WhatsApp number
3. Preferred public display name
4. Confirmation of direct WhatsApp booking/payment handoff

Design:

- single task per screen or clearly grouped steps
- progress indicator with plain labels
- save state visible
- no dark patterns around future paid plans

### 3. Listing Builder

Purpose: help owners complete a credible listing without feeling overwhelmed.

Sections:

- Stay basics
- Location
- Price and capacity
- Photos
- Amenities
- Muslim-friendly and family-friendly details
- House rules
- Preview and publish

Design:

- left or top checklist for completeness
- form grouped by owner mental model, not database model
- live public preview on desktop
- separate "save draft" and "publish" actions
- publish button disabled until required fields pass, with clear missing-field summary

### 4. Owner Dashboard

Purpose: manage listings and understand basic performance.

Primary modules:

- listing status rows
- completeness score
- views
- WhatsApp clicks
- last updated
- next action

Design:

- dense but calm
- table/list hybrid for mobile-friendly scanning
- no giant decorative stats
- each listing row should answer: status, what changed, what should owner do next

### 5. Public Directory

Purpose: let travellers browse without becoming the main MVP complexity.

Design:

- search/filter rail with state, town, price, capacity, Muslim-friendly, family-friendly
- listing cards with real photo, area, capacity, price range, trust flags
- avoid infinite marketplace clutter
- empty states should encourage direct search or browsing nearby areas

### 6. Public Listing Page

Purpose: convert interest into a WhatsApp inquiry.

Must answer quickly:

- name and area
- photos
- guest capacity
- price range
- amenities
- Muslim-friendly/family-friendly details
- house rules
- owner/admin display name
- WhatsApp CTA

Design:

- strong photo gallery but not full-screen-first
- details should be in scan blocks
- sticky WhatsApp CTA on mobile
- trust strip near top
- owner profile card near CTA
- clear text: booking and payment continue directly with owner

### 7. Admin Review

Purpose: keep early supply credible.

Design:

- list new or flagged listings
- quick status actions: publish, pause, needs review
- owner contact visible only to admin
- review history visible
- avoid a complicated moderation suite in MVP

## Component Treatments

### Primary Button

Use for one clear action per context:

- Create first listing
- Save and continue
- Publish listing
- WhatsApp owner

Treatment:

- leaf background
- white text
- `6px` radius
- clear focus ring
- icon when useful, especially WhatsApp or publish

### Secondary Button

Use outline or quiet surface for preview, save draft, edit, copy link.

### Listing Card

Must show:

- photo
- listing name
- area/town/state
- price range
- capacity
- Muslim-friendly/family-friendly flags
- WhatsApp-ready indicator only if CTA is configured

Avoid:

- oversized badges
- too many icons
- hidden key facts

### Trust Strip

Small row of facts, not a certification unless actually verified.

Examples:

- Owner contact available
- Family-friendly
- Muslim-friendly
- Rules listed
- Photos added

### Completeness Indicator

Use task language:

- "Ready to publish"
- "Needs photos"
- "Add house rules"

Avoid gamified percentages as the only signal.

### Verified Owner Profile Card

Deferred paid/trust feature. In MVP it may appear as a planned placeholder in docs only.

Do not use "verified" publicly until verification policy exists.

## Motion Grammar

Motion should feel like paper and tools, not a game.

Use motion for:

- step transitions
- save confirmation
- publish success
- filter result updates
- drawer open/close

Rules:

- short duration: 120-220ms
- ease out for entrances
- no bouncing
- no constant background animation
- respect reduced motion

## Content Voice

Plain, direct, owner-respecting.

Use:

- "Create your homestay page"
- "Add at least 3 photos"
- "Guests will contact you on WhatsApp"
- "Booking and payment stay between you and the guest"
- "Publish when these details are complete"

Avoid:

- "Supercharge your hospitality business"
- "Unlock your travel empire"
- "AI-powered marketplace revolution"
- vague premium language before the product earns it

## Image Policy

Public listings depend on owner photos. The UI should help imperfect real photos look organized without pretending they are luxury shoots.

Rules:

- use real listing photos as primary imagery
- crop predictably
- avoid dark overlays that hide details
- guide owners to upload exterior, bedroom, bathroom, kitchen/living, and surrounding area photos
- show missing-photo placeholders that feel helpful, not broken

## Mobile Rules

- Design from 360px upward; verify 320px if possible.
- No horizontal scrolling except intentional image carousels.
- Sticky WhatsApp CTA on public listing pages.
- Forms must use one-column flow on mobile.
- Owner dashboard rows must collapse into stacked summaries.
- Buttons must be touch-friendly.
- Long location names, house rules, and WhatsApp numbers must wrap.
- Public listing page should show essential trust details before long descriptions.

## Accessibility Rules

- All form fields need visible labels.
- Required fields need text explanation, not only asterisk.
- Focus states must be visible.
- State badges require text, not color alone.
- Images need owner-provided or generated alt text prompts.
- WhatsApp CTA must be a real link with understandable accessible name.
- Reduced motion must be supported.
- Contrast must meet WCAG AA for body text and controls.

## Implementation File Map

Future implementation should likely create:

- `src/app/page.tsx` - public home / owner-first entry
- `src/app/listings/page.tsx` - public directory
- `src/app/listings/[slug]/page.tsx` - public listing detail
- `src/app/dashboard/page.tsx` - owner dashboard
- `src/app/dashboard/listings/new/page.tsx` - listing builder start
- `src/app/dashboard/listings/[id]/edit/page.tsx` - listing editor
- `src/app/admin/listings/page.tsx` - admin review
- `src/components/brand/*` - brand mark, shell, typography helpers
- `src/components/listings/*` - listing card, gallery, trust strip
- `src/components/owner/*` - dashboard rows, completeness, onboarding forms
- `src/components/ui/*` - buttons, fields, badges, alerts
- `src/lib/whatsapp.ts` - WhatsApp URL and prefilled message helpers
- `src/lib/locations/my.ts` - Malaysia location helpers

Exact paths may change after the architecture blueprint.

## Acceptance Checks

- The design system supports owner onboarding, listing builder, owner dashboard, public directory, public listing page, WhatsApp handoff, and admin review.
- The visual direction is recognizably MyHomestay, not a generic marketplace clone.
- The system avoids decorative gradients, nested cards, and AI-template visuals.
- The mobile owner onboarding flow can be understood without training.
- The public listing page can answer trust/fit questions before the WhatsApp CTA.
- The owner dashboard remains practical and quiet, not marketing-heavy.
- Future paid features have visual room without polluting the free MVP.
- No screen relies on color alone for state.
- The eventual implementation can be checked for horizontal overflow at 320, 375, 768, 1024, and 1440 px.

## Open Design Questions

- Should Bahasa Malaysia be present from launch as UI copy, listing content support, or both?
- Should the brand mark lean toward a wordmark only, or include a simple house/register symbol?
- Should public listings prioritize owner trust first or property photos first?
- What is the first verification policy before any "verified" visual language appears?
- Should premium/featured styling be visible in MVP as a disabled future cue, or hidden until monetization begins?

## Source Boundary

This Brand and UX System is based on Adam's stated direction and the local product artifacts. It does not include external competitor research, visual reference boards, or user testing yet.
