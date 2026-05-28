# MyHomestay Brand Routes Proof Sheet

## Status

Accepted v0.2. Created on 2026-05-28 as an Atelier-47 and Designlang Adapter checkpoint before implementation.

Decision: Adam selected the hybrid direction on 2026-05-28.

This document answers one practical question:

> How do we know Adam will like the MyHomestay branding before we build too much?

The answer is to compare a few source-backed brand routes, choose the emotional center, then build a small visual proof sheet before app implementation.

## Source Boundary

These references are inspiration inputs, not clone targets. MyHomestay must not copy logos, brand marks, proprietary images, campaign copy, exact layouts, illustration systems, or distinctive brand compositions.

The safe pattern is:

- borrow product principles
- translate them into MyHomestay's owner-first job
- use original palette, typography, components, copy, photography, and layout
- validate with a small proof sheet before committing to the app UI

## Source Ledger

| Source | Upstream tool/version | Capture date | Direct outputs | Interpretation target | Boundary notes |
| --- | --- | --- | --- | --- | --- |
| Apple Malaysia, `https://www.apple.com/my/` | `designlang@12.14.0` | 2026-05-28 | `C:\Users\Adam_Rapidscreen\hivemind\.tmp\designlang-intake\20260528-154021-myhomestay-ref-apple-my` | Restraint, hierarchy, finish, calm confidence | Do not copy Apple page layouts, product framing, brand voice, SF-only identity, or visual campaign style. |
| Coffee Bean Malaysia, `https://www.coffeebean.com.my/` | `designlang@12.14.0` | 2026-05-28 | `C:\Users\Adam_Rapidscreen\hivemind\.tmp\designlang-intake\20260528-154021-myhomestay-ref-cbtl-my` | Artisan warmth, cafe hospitality, crafted surface | Do not copy purple/brown ownership, cafe retail identity, brand marks, menu layout, or exact color pairing. |
| Agoda, `https://www.agoda.com/` | `designlang@12.14.0` | 2026-05-28 | `C:\Users\Adam_Rapidscreen\hivemind\.tmp\designlang-intake\20260528-154021-myhomestay-ref-agoda` | Travel utility, filters, scan density, listings and conversion | Do not copy Agoda blue/red identity, marketplace chrome, exact search flow, card layout, or urgency patterns. |

## Direct Extraction Highlights

### Apple Malaysia

Direct evidence from Designlang intake:

- High restraint: white and near-white base, black foreground, sparse blue action color.
- Flat material: almost no visible shadow dependency.
- Very large spacing steps and precise hierarchy.
- Buttons and links are clear, with restrained visual drama.
- Typography relies on quiet confidence and disciplined scale.

Safe to adapt:

- Trust through restraint.
- Breathing room around important decisions.
- Strong hierarchy without noisy decoration.
- Sparse action color so primary actions feel obvious.

Do not copy:

- Exact Apple layout rhythm.
- Product campaign composition.
- Apple-specific typography identity.
- Minimalism so extreme that owner tasks feel under-supported.

### Coffee Bean Malaysia

Direct evidence from Designlang intake:

- Warm hospitality cues through deep color, accent contrast, and cafe-like personality.
- More tactile and retail-like than Apple.
- Uses strong brand color presence and occasional hard-edged graphic treatments.
- Some contrast and CSS hygiene issues were flagged in the extraction.

Safe to adapt:

- Local warmth and hospitality texture.
- More human, less clinical first impression.
- Artisan feeling through small details, not through heavy decoration.
- A warmer accent language for onboarding and public listing pages.

Do not copy:

- CBTL purple/brown identity.
- Cafe menu/product retail framing.
- Low-contrast combinations.
- Busy promo feel.

### Agoda

Direct evidence from Designlang intake:

- Strong tokenized travel utility system.
- Dense component set: filters, listing cards, badges, tabs, switches, modals, dropdowns.
- Clear search/listing conversion patterns.
- Blue/red action and urgency vocabulary.
- Strong design-system score in the intake.

Safe to adapt:

- Filter mechanics and browsing density.
- Listing card scannability.
- Search results patterns.
- Direct host/list-your-place CTA clarity.
- Robust component coverage for future scale.

Do not copy:

- Agoda blue/red identity.
- Urgency-heavy travel marketplace psychology.
- Exact listing card composition.
- Traveller-first complexity before the owner MVP is solid.

## Route 1: Kampung Quiet Ledger

### Thesis

Apple restraint translated into a Malaysian owner operations product.

MyHomestay feels like a clean, trusted online register for homestay owners: precise, quiet, readable, and dignified.

### Best For

- Owner onboarding.
- Owner dashboard.
- Listing builder.
- Building early trust with non-technical hosts.

### Emotional Read

Calm, capable, premium, owner-respecting.

### Token Sketch

| Role | Token | Value |
| --- | --- | --- |
| Page | `paper` | `#FBFAF5` |
| Surface | `white` | `#FFFFFF` |
| Section | `rice` | `#F3EFE4` |
| Ink | `ink` | `#1E211B` |
| Muted text | `muted-ink` | `#62665A` |
| Primary | `leaf` | `#2F6B4F` |
| Link/info | `river` | `#2F5F8F` |
| Border | `stone` | `#D8D1C3` |
| Attention | `clay` | `#B66A3C` |

### Component Feel

- Buttons: flat, 6px radius, strong text clarity.
- Cards: bordered, minimal shadow, dense enough for real owner work.
- Forms: one task at a time, with completion states.
- Public listing: almost editorial, with trust facts surfaced early.

### Risk

Could become too quiet or too document-like if photography and warm copy are weak.

## Route 2: Rumah Artisan

### Thesis

CBTL warmth translated into kampung-modern hospitality.

MyHomestay feels more crafted and human: still simple, but with richer warmth, stronger local texture, and a more memorable hospitality mood.

### Best For

- Public listing pages.
- Brand launch visuals.
- Owner profile cards.
- Premium host identity later.

### Emotional Read

Warm, local, welcoming, handmade, hosted.

### Token Sketch

| Role | Token | Value |
| --- | --- | --- |
| Page | `paper` | `#FBF7EF` |
| Surface | `white` | `#FFFFFF` |
| Section | `woven` | `#EFE4D4` |
| Ink | `charcoal` | `#211F1A` |
| Muted text | `warm-gray` | `#6A6258` |
| Primary | `daun` | `#315F46` |
| Accent | `terracotta` | `#B7613F` |
| Premium | `brass` | `#B88A3D` |
| Border | `thread` | `#D9CDBE` |

### Component Feel

- Buttons: slightly warmer, maybe heavier text weight.
- Cards: 8px radius, tactile borders, very subtle woven/paper surface only in brand moments.
- Forms: still operational, but with friendlier empty states.
- Public listing: stronger owner identity, photo-led, better for "this place has soul."

### Risk

Can drift into beige/brown homestay cliche if overused. Must keep green, river blue, and white space in the system.

## Route 3: Stayflow Malaysia

### Thesis

Agoda utility translated into a simpler owner-first travel platform.

MyHomestay feels like a practical discovery and listing engine: fast to scan, easy to filter, clear to contact.

### Best For

- Public directory.
- Search filters.
- Listing comparison.
- Future multi-country scale.

### Emotional Read

Fast, useful, commercial, familiar, conversion-ready.

### Token Sketch

| Role | Token | Value |
| --- | --- | --- |
| Page | `white` | `#FFFFFF` |
| Surface | `mist` | `#F5F8FA` |
| Ink | `ink` | `#17201B` |
| Muted text | `slate` | `#5D6870` |
| Primary | `river` | `#276A8C` |
| Trust | `leaf` | `#2E6B4E` |
| Action | `whatsapp-green` | `#1F8F55` |
| Featured | `sun` | `#D9A441` |
| Border | `line` | `#DDE3E1` |

### Component Feel

- Buttons: crisp, practical, stronger affordance.
- Cards: compact, comparison-friendly, with stable image ratios.
- Forms: more dashboard-like, more efficient for repeated edits.
- Public listing: conversion-focused, with WhatsApp CTA always easy to reach.

### Risk

Could feel too generic travel marketplace if the owner-first language and local details are not strong.

## Recommendation

Selected direction:

**Kampung Quiet Ledger, warmed with Rumah Artisan, disciplined by Stayflow Malaysia.**

In plain terms:

- Apple gives MyHomestay restraint, polish, and trust.
- CBTL gives it warmth, hospitality, and artisan touch.
- Agoda gives it travel utility, filters, and scalable listing patterns.

The MyHomestay-owned result should not feel like any one of those references. It should feel like a calm Malaysian homestay operating system that happens to have a beautiful public face.

## Brand Route Decision

Selected route for MVP:

- Product shell: Kampung Quiet Ledger.
- Owner onboarding: Kampung Quiet Ledger with Rumah Artisan warmth.
- Listing builder: Kampung Quiet Ledger.
- Owner dashboard: Kampung Quiet Ledger with Stayflow density.
- Public directory: Stayflow Malaysia with Kampung restraint.
- Public listing page: Rumah Artisan content warmth inside Kampung structure.
- Premium features later: brass/sun highlights, never loud gold upsell styling.

## Proof Sheet Components

Build these before full app implementation:

### 1. Owner Welcome Header

Purpose: prove first impression.

Must show:

- MyHomestay wordmark placeholder.
- "Set up your homestay page" as the practical headline.
- Primary CTA: "Create listing".
- Secondary CTA: "View sample page".
- One sentence explaining direct WhatsApp booking/payment handoff.

Taste check:

- Does this feel dignified for owners?
- Does it avoid startup hype?
- Does it feel local without becoming rustic decoration?

### 2. Owner Onboarding Step

Purpose: prove owner-first UX.

Must show:

- step label
- one form group
- save state
- WhatsApp number field
- plain consent for public contact handoff

Taste check:

- Can a non-technical owner understand the step in five seconds?
- Does the UI feel calm, not like a complicated booking system?

### 3. Listing Card

Purpose: prove public browsing.

Must show:

- stable photo ratio
- stay name
- area/state
- capacity
- price range
- Muslim-friendly and family-friendly badges
- "WhatsApp owner" action

Taste check:

- Is the listing scannable on mobile?
- Is the card trustworthy without feeling like an ad?

### 4. Dashboard Row

Purpose: prove owner operations.

Must show:

- listing name
- status
- completeness
- WhatsApp clicks
- last updated
- next action

Taste check:

- Can owners see what to do next?
- Does density feel useful rather than stressful?

### 5. Public Listing Trust Strip

Purpose: prove conversion support.

Must show:

- owner profile status
- last updated
- facilities/trust facts
- Muslim-friendly details
- house rules summary

Taste check:

- Does it increase confidence before WhatsApp?
- Does it avoid fake marketplace verification language?

### 6. WhatsApp CTA

Purpose: prove the MVP booking handoff.

Must show:

- sticky mobile treatment
- desktop inline treatment
- message preview
- clear label: "WhatsApp owner"

Taste check:

- Is the handoff obvious without making MyHomestay pretend to process bookings?

## Visual Acceptance Checks

Before app scaffolding uses this branding:

- Mobile width has no horizontal overflow at 360px.
- Buttons have stable dimensions and do not resize on hover.
- Long Malay place names wrap cleanly.
- Listing cards retain stable image aspect ratio.
- Badges do not overwhelm listing cards.
- Color does not collapse into a beige/brown one-note palette.
- Primary action color is used sparingly.
- WhatsApp CTA is obvious but not visually desperate.
- Owner dashboard is dense enough for repeated use.
- Public listing page feels warmer than the dashboard.

## Next Move

Create a static browser proof sheet using these six components before selecting the final stack and before building the MVP app.

Current lightweight preview:

- `docs/product/brand-preview.html`

Recommended file if scaffolding the app first:

- `src/app/brand-preview/page.tsx`

The proof sheet renders the hybrid and route ingredients as a taste checkpoint. The hybrid is now the approved direction for MVP planning and implementation.
