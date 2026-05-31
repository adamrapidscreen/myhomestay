# OpenCode Handoff: Launch Bloom Pack

Status: ready for OpenCode implementation after Adam summons Agent 47
Target release: Beta 0.17 candidate
Primary spec: `docs/product/launch-bloom-spec.md`

## Mission

Implement the MyHomestay Launch Bloom Pack end to end from `docs/product/launch-bloom-spec.md`.

This is a launch-quality feature pack for the controlled pilot baseline. It should make the app feel more complete at launch without adding bookings, payments, reviews, subscriptions, traveller accounts, or formal verification policy.

## Required Context Load

When OpenCode starts, load these in order:

1. `AGENTS.md`
2. `docs/PROJECT_AGENT_CONTEXT.md`
3. `docs/product/product-spine.md`
4. `_planning/plan-build-flow.md`
5. `_planning/build-status.md`
6. `docs/product/launch-bloom-spec.md`
7. `docs/product/brand-ux-system.md`
8. `docs/product/architecture-blueprint.md`
9. `docs/product/chapter-5-pilot-checklist.md`

Use the repo files as the source of truth. Do not implement from memory alone.

## Skills To Load

Use the smallest useful set, but this implementation should normally load:

- `implementation-plan-execution` for the build sequence
- `karpathy-guidelines` for surgical scoped changes
- `react-best-practices` for Next.js/App Router choices
- `supabase-postgres-best-practices` for migration, RLS, RPC, and policy work
- `frontend-design` for owner/public UI polish
- `security-gate` for admin, reports, RLS, and public API risk
- `self-verification-loop` for final run/test/break/reflect evidence
- `webapp-testing` for browser checks and responsive sweeps
- `agent-47-review-gate` for closeout acceptance audit

## Feature Pack

Implement the five Launch Bloom features described in the spec:

1. Owner Trust Checklist
2. Share Kit
3. Traveller Confidence Strip
4. WhatsApp Inquiry Kit
5. Local Mini-Guide

## Execution Order

Run the work cards in the spec in order:

1. LB-1 Launch Data Foundation
2. LB-2 Owner Trust Checklist
3. LB-3 Share Kit
4. LB-4 Local Mini-Guide
5. LB-5 Traveller Confidence Strip And Report Listing
6. LB-6 WhatsApp Inquiry Kit
7. LB-7 Polish, QA, And Closeout

Treat each work card as a small deliverable. Keep code close to existing patterns, and update tests as each surface becomes real.

## Database Rule

Create the migration specified by the Launch Bloom spec, expected path:

`supabase/migrations/0012_launch_bloom_pack.sql`

Adam will apply SQL to the live Supabase project manually after implementation. Do not run destructive DB operations. Do not claim live DB verification until Adam confirms migration 0012 has been applied.

Implementation should compile locally before live SQL is applied. Where missing live schema could affect runtime after deploy, document the dependency clearly in `_planning/build-status.md`.

## Scope Boundaries

Do not implement:

- bookings or calendars
- payments or subscriptions
- traveller accounts
- reviews or ratings
- formal listing verification, certification, badges, or approval language
- automated owner identity checks
- admin investigation workflow beyond the report intake in the spec
- public claims that listings are verified, certified, inspected, or approved

Trust copy must stay factual and modest. Prefer "Owner completed", "Photos added", "House rules shared", and similar evidence-based language.

## Security And Privacy Rules

- Never read or print raw `.env.local` values.
- Do not store traveller inquiry details from WhatsApp message generation.
- Public report intake must rate-limit or otherwise guard against obvious spam within the app's current architecture.
- RLS must protect owner-only guide and checklist writes.
- Admin-only report review surfaces, if added, must use the existing admin guard pattern.
- QR generation should be server-side or otherwise avoid adding unnecessary client bundle weight.

## Verification Targets

Run and record the results:

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd test`
- `npm.cmd audit --audit-level=high`
- `npm.cmd run build`

Do browser/runtime verification after build:

- owner dashboard flow to the new launch page
- `/dashboard/listings/[id]/launch`
- share kit and QR page
- local guide add/edit/delete/reorder if implemented
- public listing detail with the new confidence strip
- public report listing flow
- WhatsApp inquiry kit message generation
- responsive checks at 320, 375, 768, and 1280 widths

If live database verification is not possible because Adam has not applied migration 0012 yet, say that plainly and list the exact manual steps.

## Closeout Requirements

Before stopping:

- Update `_planning/build-status.md` with implementation status, verification receipts, manual SQL apply checklist, and remaining risks.
- Leave release/version markers unchanged unless Adam explicitly asks for a release commit.
- Do not commit or push unless Adam explicitly asks after reviewing the implementation.
- Include a concise final summary with changed files, verification results, and manual actions.

## Stop Conditions

Stop and ask Adam only if:

- the implementation would materially change the product scope in `docs/product/launch-bloom-spec.md`
- schema design must diverge materially from the spec
- a dependency choice creates unexpected bundle, license, or maintenance risk
- trust-language direction starts drifting toward verified/certified/approved claims
- a migration requires destructive data changes
- Adam asks for commit/push or version bump and the version decision is unclear

## First Prompt For OpenCode

Paste this after opening OpenCode in this repo:

```text
47

Mission: implement the MyHomestay Launch Bloom Pack from docs/product/launch-bloom-spec.md end to end as the Beta 0.17 candidate.

Load AGENTS.md and Memory Core as instructed, then read docs/PROJECT_AGENT_CONTEXT.md, docs/product/product-spine.md, _planning/plan-build-flow.md, _planning/build-status.md, docs/product/launch-bloom-spec.md, docs/product/brand-ux-system.md, docs/product/architecture-blueprint.md, and docs/product/chapter-5-pilot-checklist.md.

Use implementation-plan-execution, karpathy-guidelines, react-best-practices, supabase-postgres-best-practices, frontend-design, security-gate, self-verification-loop, webapp-testing, and agent-47-review-gate as needed.

Execute Work Cards LB-1 through LB-7 nonstop. Create supabase/migrations/0012_launch_bloom_pack.sql, but do not require the live SQL to be applied during coding. Adam will apply SQL manually afterward. Do not claim live DB verification until Adam confirms 0012 is applied.

Do not implement bookings, payments, traveller accounts, reviews, subscriptions, or verified/certified listing claims. Do not read or print .env.local values. Do not commit or push. Update _planning/build-status.md with verification receipts and manual SQL apply steps before final response.
```

## Second Prompt After Adam Applies SQL

Use this only after implementation is complete and Adam has applied migration 0012 to live Supabase:

```text
47

Adam has applied supabase/migrations/0012_launch_bloom_pack.sql to live Supabase. Run the live Launch Bloom verification pass.

Verify owner launch checklist, guide item persistence, share/QR surfaces, public confidence strip, report listing intake, and WhatsApp inquiry generation against live data. Do not change scope. Fix only defects found during verification. Update _planning/build-status.md with live verification results and any release-blocking risks.
```

## Manual Actions For Adam

After OpenCode implementation:

- Apply `supabase/migrations/0012_launch_bloom_pack.sql` to live Supabase.
- Run the second OpenCode prompt above for live verification.
- Decide whether to release as Beta 0.17 and whether to commit/push.
