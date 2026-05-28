# MyHomestay Build Status

Last updated: 2026-05-28
Tracker type: KD Plan & Build Flow pilot

## Current Focus

Build Chapter 1: App Foundation And Brand Shell.

## Next Move

Start Work Card 1.1 in OpenCode using:

- `_planning/opencode-handoff-build-chapter-1.md`

## Build Chapters

| Chapter | Name | Status | Notes |
| --- | --- | --- | --- |
| 1 | App Foundation And Brand Shell | ready | Start here. |
| 2 | Public Discovery And Listing Experience | pending | Detail after Chapter 1 closeout. |
| 3 | Owner Dashboard And Listing Builder | pending | Product/design checkpoint after Chapter 2 first. |
| 4 | Supabase Auth, Data, And Storage | pending | Do not start until UI contract feels right. |
| 5 | Admin Review And Launch Readiness | pending | Requires Supabase foundation. |
| 6 | Bahasa Malaysia Fast-Follow | pending | Committed fast-follow after MVP surface is ready. |
| 7 | Critical Launch Fast-Follows | pending | Prioritize based on pilot risk. |

## Active Work Cards

| Card | Name | Status | Verification Target | Notes |
| --- | --- | --- | --- | --- |
| 1.1 | Scaffold Next.js App | ready | lint, build, route smoke | Create clean app foundation. |
| 1.2 | Implement Brand Tokens And Global Shell | pending | lint, build, visual/mobile check | Use Kampung Quiet Ledger Hybrid. |
| 1.3 | Add Typed Mock Data Contracts | pending | typecheck/build, route data render | Include long Malay place names. |
| 1.4 | Add Core Helpers | pending | helper tests or focused runtime checks | WhatsApp, locations, completeness. |

## Verification Receipts

- Pending. No implementation has started under this flow.

## Decisions

- Founder Decision Lock accepted on 2026-05-28.
- Use Build Chapters and Work Cards instead of epics/stories.
- English-first MVP with BM-ready architecture; BM is a committed fast-follow.
- Mock-first for Chapter 1 and Chapter 2.
- Supabase accepted for MVP auth, data, storage, and RLS after the product surface is stable.
- Up to 3 free listings per owner.
- Owners can publish after required fields pass; admin can pause or mark needs review.
- No public "verified" language until a verification policy exists.

## Blockers

- None for Work Card 1.1.

## Open Risks

- Stack versions may differ from existing deleted app state; inspect current Node/npm before scaffolding.
- Need to avoid resurrecting the deleted Vibe-session app.
- UI implementation must preserve mobile width safety at 320px and 375px.
- BM fast-follow means copy structure should avoid hard-coded strings that are hard to localize later.

## Chapter 1 Closeout Requirements

Before Chapter 1 can be marked done:

- Work Cards 1.1 through 1.4 are done.
- `npm run lint` passes.
- `npm run build` passes.
- Home route renders locally.
- Browser checks confirm no horizontal overflow at 320px, 375px, 768px, 1024px, and 1440px.
- Build Status is updated with verification receipts.
- Any deviations from the scaffold plan are recorded.
