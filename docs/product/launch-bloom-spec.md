# Launch Bloom Features Spec-Lite

Status: draft for Adam review
Date: 2026-05-31

## Intent

Add a small set of launch features that make MyHomestay feel alive, trustworthy,
and useful to first owners without turning the MVP into a heavy marketplace.

## Current Context

The app now has a real owner-first core:

- Supabase email OTP auth
- owner onboarding and listing builder
- photo upload and public listing pages
- WhatsApp handoff for booking/payment
- admin moderation controls
- basic views and WhatsApp click metrics

The next feature wave should improve launch confidence and owner motivation,
not add complex transactions, reviews, payment, or full marketplace operations.

## Proposed Shape

### 1. Owner Trust Checklist

Give each owner/listing a simple launch-readiness checklist:

- profile complete
- WhatsApp reachable
- at least 3 good photos
- price/rules clear
- Muslim-friendly/family-friendly details confirmed
- public preview checked

This helps owners improve listings before sharing, and gives admins a simple
review vocabulary.

### 2. Share Kit

Give every published listing an owner sharing panel:

- public listing link
- copy link button
- WhatsApp share message
- Facebook/TikTok caption starter
- QR code for posters or counter display

This supports the first real growth loop: owners share their own page.

### 3. Public Confidence Layer

Improve traveller trust without using unearned "verified" language:

- "Owner-created listing" label
- "Booking continues on WhatsApp" explanation
- visible last-updated date
- photo count and house-rule presence
- report listing / contact admin affordance for abuse reports

### 4. Owner Mini Analytics

Turn raw metrics into a small dashboard strip:

- listing views
- WhatsApp clicks
- click-through rate
- last 7 days vs all-time if easy
- plain-language nudge: "Share your link to get first inquiries"

### 5. Pilot Area Pack

Create lightweight Malaysia-first launch context:

- focused pilot states/areas
- homepage/directory chips for those areas
- empty-state copy that feels local, not generic
- admin note for which areas are being actively recruited

## Acceptance Checks

- [ ] Owner can see what to improve before sharing a listing.
- [ ] Owner can copy/share a published listing link quickly.
- [ ] Public listing builds trust without claiming verification.
- [ ] Dashboard metrics are understandable to a non-technical owner.
- [ ] New UI has no horizontal overflow at 320px and 375px.
- [ ] No payment, reviews, ratings, or booking calendar is introduced.
- [ ] No public "verified" language appears.

## Out Of Scope

- Online payment
- booking calendar
- traveller accounts
- reviews and ratings
- paid subscription
- IC/business/property verification
- automated image moderation

## Risks / Decisions

- QR code generation can be client-side for MVP, but should not add a heavy
  dependency without checking bundle impact.
- "Report listing" needs an abuse-handling destination. For MVP this can be
  admin email/WhatsApp or a simple database-backed report table.
- Last-7-days analytics requires timestamped metric events, not just counters.
  If we want this, add a `listing_metric_events` table; otherwise keep all-time
  counters only.
- Pilot area pack needs Adam's business decision on first launch geography.

