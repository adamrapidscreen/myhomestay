# MyHomestay PRD-Lite

## Status

Draft v0.1. Source-bounded to `product-spine.md` and `product-brief.md`.

## Product Goal

Launch a free owner-first MVP that lets Malaysian homestay owners create trustworthy public listings quickly, share them anywhere, and route interested customers to WhatsApp for booking and payment.

## MVP Principle

Owner onboarding comes first. The product succeeds when an owner can create a credible listing in under 10 minutes and share a link that reduces repetitive questions from potential guests.

## Primary Users

### Owner

A homestay owner, family operator, or small local business that wants a more credible online presence and basic listing tools.

### Owner Admin

A family member, staff member, or helper who manages listing details and WhatsApp inquiries for the owner.

### Traveller

A customer browsing a public listing who wants enough trust and practical detail before messaging the owner.

### Platform Admin

The MyHomestay operator who reviews listings, handles basic moderation, and later manages verification or featured placement.

## MVP Scope

### Included

- Owner sign-up and sign-in.
- Owner profile with display name and WhatsApp contact.
- Create, edit, draft, and publish homestay listings.
- 1 to 3 free listings per owner.
- Required listing fields:
  - homestay name
  - area, town, and state
  - WhatsApp number or inherited owner WhatsApp
  - starting price or price range
  - guest capacity
  - bedroom count
  - bathroom count
  - at least 3 photos
  - Muslim-friendly flag
  - family-friendly flag
  - basic amenities
  - house rules
  - owner or admin display name
- Public listing page.
- Public owner profile snippet/card.
- WhatsApp booking CTA.
- Basic owner dashboard.
- Listing completeness indicator.
- Basic listing status: draft, published, paused, needs review.
- Basic performance signals:
  - listing views
  - WhatsApp CTA clicks
  - last updated date
- Malaysia-first state/town/location structure.
- Basic search and browse for public listings.
- Filters for Muslim-friendly, family-friendly, guest capacity, state/town, and price range.

### Deferred

- In-app payment.
- Commission handling.
- Automatic booking confirmation.
- Availability calendar with real conflict prevention.
- Reviews and ratings.
- Full verification workflow.
- Paid subscription billing.
- Advanced analytics.
- AI listing helper.
- Multi-language support.
- Southeast Asia expansion beyond Malaysia.
- Native mobile app.

## Core User Flows

### Owner Onboarding

1. Owner creates an account.
2. Owner enters display name and WhatsApp contact.
3. Owner starts first listing.
4. Owner completes required listing fields.
5. System shows listing completeness and preview.
6. Owner publishes listing.
7. Owner receives shareable public listing URL.

### Listing Management

1. Owner opens dashboard.
2. Owner sees listings and status.
3. Owner edits listing details, photos, price, amenities, or rules.
4. Owner can pause or republish a listing.
5. Owner sees view and WhatsApp-click signals.

### Traveller Discovery

1. Traveller opens public directory or shared listing URL.
2. Traveller reads stay details, photos, capacity, location area, rules, and Muslim-friendly/family-friendly signals.
3. Traveller taps WhatsApp CTA.
4. WhatsApp opens with a prefilled inquiry message.
5. Booking and payment continue directly between traveller and owner.

### Platform Admin Review

1. Platform admin sees newly published or flagged listings.
2. Admin can mark listing as needs review, published, or paused.
3. Admin can see owner contact and listing status.
4. Admin does not handle payment in MVP.

## Functional Requirements

### Accounts And Access

- FR1: The system shall allow owners to create an account.
- FR2: The system shall allow owners to sign in and sign out.
- FR3: The system shall protect owner dashboard routes from unauthenticated access.
- FR4: The system shall prevent one owner from editing another owner's listing.
- FR5: The system shall support a platform admin role for review/moderation.

### Owner Profile

- FR6: The system shall store owner display name.
- FR7: The system shall store owner WhatsApp contact.
- FR8: The system shall allow owners to edit their profile details.
- FR9: The system shall expose public owner/admin display info on listings without exposing private account fields.

### Listings

- FR10: The system shall allow an owner to create a listing draft.
- FR11: The system shall require the MVP listing fields before public publishing.
- FR12: The system shall allow an owner to edit a listing.
- FR13: The system shall allow an owner to pause a published listing.
- FR14: The system shall generate a public listing URL.
- FR15: The system shall support up to 3 free listings per owner in MVP.
- FR16: The system shall support listing statuses: draft, published, paused, needs review.
- FR17: The system shall show listing completeness before publishing.

### Photos And Media

- FR18: The system shall require at least 3 photos before publishing.
- FR19: The system shall support listing cover photo selection.
- FR20: The system shall optimize public listing images for responsive display.
- FR21: The system shall reject unsupported or oversized image uploads.

### Public Discovery

- FR22: The system shall render a public directory page.
- FR23: The system shall render public listing detail pages.
- FR24: The system shall allow travellers to filter by state/town, price range, guest capacity, Muslim-friendly, and family-friendly fields.
- FR25: The system shall show clear trust and fit details on listing pages.
- FR26: The system shall not require traveller accounts for MVP browsing.

### WhatsApp Handoff

- FR27: The system shall show a WhatsApp CTA on public listing pages.
- FR28: The system shall generate a prefilled WhatsApp inquiry message.
- FR29: The system shall track WhatsApp CTA clicks as a basic performance signal.
- FR30: The system shall make clear that booking and payment happen directly with the owner in MVP.

### Owner Dashboard

- FR31: The system shall show all owner listings in a dashboard.
- FR32: The system shall show listing status and completeness.
- FR33: The system shall show basic performance signals: views, WhatsApp CTA clicks, and last updated date.
- FR34: The system shall provide clear next actions for incomplete listings.

### Platform Admin

- FR35: The system shall provide a minimal admin review surface.
- FR36: The system shall allow admin to pause or mark a listing as needs review.
- FR37: The system shall preserve an audit trail for admin status changes.

## Non-Functional Requirements

- NFR1: Mobile-first responsive web experience.
- NFR2: Hybrid PWA path should be possible from the architecture.
- NFR3: Public listing pages should load quickly on mobile connections.
- NFR4: Public pages should be SEO-friendly.
- NFR5: Owner onboarding should be usable by non-technical owners.
- NFR6: Forms should validate clearly and avoid data loss.
- NFR7: Sensitive owner account data must not leak on public pages.
- NFR8: Access control must be enforced server-side.
- NFR9: The system should be designed so subscription features can be added later without rewriting core listing data.
- NFR10: The interface should preserve the minimal, artisan, kampung-modern brand direction.

## Data Objects

### Owner

- id
- display name
- email or auth identifier
- WhatsApp contact
- created at
- updated at

### Listing

- id
- owner id
- slug
- status
- name
- area
- town
- state
- price range
- guest capacity
- bedroom count
- bathroom count
- amenities
- house rules
- Muslim-friendly flag
- family-friendly flag
- description
- cover photo
- photo gallery
- created at
- updated at

### Listing Metrics

- listing id
- view count
- WhatsApp click count
- last viewed at
- last inquiry click at

### Admin Review Event

- id
- listing id
- admin id
- previous status
- new status
- reason
- created at

## MVP Success Metrics

- Owners onboarded.
- Listings created.
- Published listings.
- Listing completion rate.
- Time to first published listing.
- Public listing page views.
- WhatsApp CTA clicks.
- Repeat owner logins.
- Owner-reported booking or inquiry quality.
- Owners asking for paid features.

## Risks

- Owners may not complete listings if photo and detail requirements feel too heavy.
- Traveller demand may not appear until enough supply exists.
- WhatsApp handoff may limit trackability of bookings.
- Trust claims such as verified owner cards require a real verification policy before launch.
- Paid subscription value must be proven before pricing is introduced.
- Public listing data and owner contact details need privacy and abuse controls.

## Open Questions

- Should MVP support Bahasa Malaysia from day one or after the first owner pilot?
- What exact Malaysia location hierarchy should be used: state/town/area only, or add district?
- Should listing approval be manual before first public launch?
- What image storage and moderation approach should be used?
- What does "verified owner profile card" require: IC/business check, phone check, property proof, or admin relationship?
- Should income tracking be manual-only first, or tied to booking records later?
- Should free owners get exactly 1 listing or up to 3?

## Acceptance For This PRD-Lite

- It preserves owner-first MVP direction.
- It keeps WhatsApp handoff as the MVP transaction path.
- It avoids in-app payment/subscription implementation in MVP.
- It gives architecture enough scope to design auth, data model, media, public pages, and future subscription hooks.
- It gives Atelier-47 enough scope to design onboarding, dashboard, directory, listing page, and trust signals.

## Source Boundary

This PRD-Lite is derived from Adam's stated direction, `docs/product/product-spine.md`, and `docs/product/product-brief.md`. It does not include external market, legal, payment, or tourism-industry research yet.
