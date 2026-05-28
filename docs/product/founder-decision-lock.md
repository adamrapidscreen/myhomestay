# MyHomestay Founder Decision Lock

## Status

Accepted v0.1. Adam accepted the recommended default pack, with one added constraint: after the MVP surface is ready, Bahasa Malaysia and other critical launch features must be added as fast-follow Build Chapters.

This checkpoint sits between the MVP Build Spec and the Build Chapters / Work Cards breakdown.

Purpose: lock the founder-level decisions that materially affect product scope, data model, first sprint order, and launch posture before implementation starts.

## How To Use This

Adam can answer in one of two ways:

- `Use defaults except...`
- answer each decision with a short line.

After answers are confirmed, update:

- `docs/product/architecture-blueprint.md`
- `docs/product/mvp-build-spec.md`
- future Build Chapters / Work Cards

## Decision Set

### 1. Launch Language

Question: Should the MVP interface launch English-only first, Bahasa Malaysia-first, or bilingual?

Recommended default: English-first with BM-ready architecture and selected BM helper copy later.

Why it matters: full bilingual UI affects content structure, validation copy, route strategy, testing, and owner support workload.

Decision: English-first MVP, with BM-ready architecture and Bahasa Malaysia added as a fast-follow after the MVP surface is ready.

### 2. First Market Scope

Question: Should the first pilot be Malaysia-wide, or focused on one state/area first?

Recommended default: Malaysia-wide data structure, but pilot messaging and seed listings focused on one or two owner-dense areas.

Why it matters: directory filters and empty states feel different if the product starts broad but inventory is sparse.

Decision: Malaysia-wide data structure, with pilot messaging and seed listings focused on one or two owner-dense areas.

### 3. Free Listing Limit

Question: Should a free owner get exactly 1 listing or up to 3 listings?

Recommended default: up to 3 listings.

Why it matters: this affects dashboard design, listing limit enforcement, future subscription packaging, and owner value perception.

Decision: Up to 3 free listings.

### 4. Publish Policy

Question: Can owners publish immediately after required fields are complete, or should admin approval be required before public listing?

Recommended default: owner can publish immediately, with admin able to pause or mark needs review.

Why it matters: approval-first increases trust control but slows owner activation and creates admin workload immediately.

Decision: Owners can publish immediately after required fields pass; admin can pause or mark needs review.

### 5. First Build Data Mode

Question: Should the first implementation sprint use typed mock data first, or wire Supabase auth/data immediately?

Recommended default: typed mock data first for Phase 0 and Phase 1, then Supabase in Phase 3 after the product surface feels right.

Why it matters: mock-first makes design/product iteration faster; Supabase-first proves real auth/data earlier but hardens details sooner.

Decision: Typed mock data first for Phase 0 and Phase 1, then Supabase after the product surface feels right.

### 6. Supabase Commitment

Question: Is Supabase accepted as the MVP auth/database/storage foundation?

Recommended default: yes, use Supabase for Auth, Postgres, Storage, and RLS.

Why it matters: auth, media, access control, deployment, and cost expectations all depend on this.

Decision: Supabase accepted for MVP Auth, Postgres, Storage, and RLS.

### 7. Homepage Primary Audience

Question: Should the first homepage speak mainly to owners, travellers, or a balanced owner/traveller audience?

Recommended default: owner-first, with a clear traveller browsing path.

Why it matters: it determines first-viewport copy, CTA hierarchy, and whether marketplace browsing competes with owner onboarding.

Decision: Owner-first homepage with a clear traveller browsing path.

### 8. Photo Requirement Strictness

Question: Should publishing require at least 3 photos from day one, or allow one-photo drafts to go live during early owner onboarding?

Recommended default: require 3 photos to publish, but allow drafts with fewer photos.

Why it matters: photos drive trust, but strict upload rules may slow early owner adoption.

Decision: Require 3 photos to publish, but allow drafts with fewer photos.

### 9. WhatsApp Contact Visibility

Question: Should WhatsApp numbers be visible as text on public listings, or only exposed through the WhatsApp CTA?

Recommended default: show contact name and CTA, but do not display the raw number prominently unless the owner chooses to expose it.

Why it matters: public phone exposure affects trust, spam risk, and owner comfort.

Decision: Show contact name and WhatsApp CTA; do not display the raw number prominently by default unless the owner chooses to expose it.

### 10. Admin Surface Timing

Question: Should the admin review surface be built in the first real release, or after owner/listing flows work?

Recommended default: include a minimal admin foundation after Supabase, not in the mock-first first sprint.

Why it matters: admin review is important, but building it too early can slow the owner-facing MVP.

Decision: Include minimal admin foundation after Supabase, not in the mock-first first sprint.

### 11. Verification Language

Question: Should the MVP show any "verified" or trust badge language, or avoid it completely until a real verification policy exists?

Recommended default: avoid "verified"; use factual trust details only, such as photos added, rules listed, owner contact available, and last updated.

Why it matters: verification language creates a promise the product must actually support.

Decision: Avoid public "verified" language until a real verification policy exists.

### 12. First Build Breakdown Name

Question: Should implementation planning use "Build Chapters" and "Work Cards" instead of epics and stories?

Recommended default: yes.

Why it matters: this keeps the Lean Product Spine workflow distinct from full BMAD while preserving implementation discipline.

Decision: Use Build Chapters and Work Cards.

## Fast-Follow Critical Features

After the MVP surface is ready, the next planning and implementation pass must prioritize critical launch features rather than drifting into optional polish.

Committed fast-follow:

- Bahasa Malaysia interface and owner-facing copy support.
- Supabase-backed auth, data, and storage if not already completed.
- Admin review foundation.
- Security Gate before production/public launch confidence.
- SEO and share metadata for public listing pages.
- PWA basics if the MVP is stable enough.

Pending prioritization:

- exact BM scope: full UI, owner-facing pages only, or public listing pages first.
- first pilot area/state.
- image moderation policy.
- basic abuse/spam protection around WhatsApp exposure.
- controlled launch checklist.

## Accepted Default Pack

- English-first, BM-ready later.
- Malaysia-wide structure, pilot focus in one or two owner-dense areas.
- Up to 3 free listings.
- Owner can publish immediately after required fields pass; admin can pause or mark needs review.
- Mock-first for Phase 0 and Phase 1.
- Supabase accepted for MVP auth/database/storage.
- Owner-first homepage with traveller browsing path.
- Require 3 photos to publish, allow drafts with fewer.
- WhatsApp CTA visible; raw number not prominent by default.
- Admin foundation after Supabase, not in first sprint.
- No public "verified" language until policy exists.
- Use Build Chapters and Work Cards.
- Add Bahasa Malaysia and critical launch features as fast-follow Build Chapters after the MVP surface is ready.

## Output After Lock

After decisions are answered:

1. Update architecture and build specs.
2. Create `docs/product/build-chapters.md`.
3. Break the MVP into Build Chapters and Work Cards.
4. Start implementation with Build Chapter 1.
