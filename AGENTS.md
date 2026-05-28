# MyHomestay Agent Bootstrap

This repo is now the greenfield home for the real MyHomestay product.

## Activation

Load shared Agent 47 memory from:

`C:\Users\Adam_Rapidscreen\hivemind\Memory Core\master-memory.md`

Then load this repo-local context:

1. `docs/PROJECT_AGENT_CONTEXT.md`
2. `docs/product/product-spine.md`
3. `_planning/planning-roadmap.md`
4. `_planning/plan-build-flow.md` when implementation planning or OpenCode handoff is involved
5. `_planning/build-status.md` when resuming build work

## Repo Role

MyHomestay is no longer a Vibe 101 test site. Treat the old app as deleted and recoverable only through Git history.

This repo should become an owner-first, Malaysia-first homestay platform with a responsive web app / hybrid PWA path.

## Current Mode

Plan & Build pilot. Do not implement from memory alone; use `_planning/build-status.md` and the active OpenCode handoff when building.

Current active implementation entry point:

- `_planning/opencode-handoff-build-chapter-1.md`

## Boundaries

- Local truth authority lives in this repo.
- Hivemind provides shared Agent 47 identity, planning discipline, design gates, and security gates.
- Do not store secrets in this repo.
- Do not claim production readiness until security, payment/subscription, and deployment gates pass.
- Use Build Chapters and Work Cards instead of epics/stories unless Adam explicitly switches to full BMAD.
