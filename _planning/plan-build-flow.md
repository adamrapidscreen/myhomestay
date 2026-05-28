# MyHomestay Plan & Build Flow

## Status

Active pilot flow for MyHomestay.

This is the local application of the KD Plan & Build Flow candidate. It is lighter than full BMAD and does not require GitHub Spec Kit tooling.

## Why This Flow

Adam wanted a serious planning/build process without the full BMAD flow.

The chosen approach borrows:

- BMAD's traceability, acceptance criteria, status tracking, and review discipline.
- GitHub Spec Kit's spec -> plan -> tasks -> implement structure, human gates, and resumable workflow idea.
- Hivemind's skills and Agent 47 operating model.

## Local Artifact Map

| Concern | File |
| --- | --- |
| Product thesis | `docs/product/product-spine.md` |
| Product framing | `docs/product/product-brief.md` |
| MVP requirements | `docs/product/prd-lite.md` |
| Brand and UX | `docs/product/brand-ux-system.md` |
| Architecture | `docs/product/architecture-blueprint.md` |
| Implementation phases | `docs/product/mvp-build-spec.md` |
| Founder decisions | `docs/product/founder-decision-lock.md` |
| Chapter roadmap | `docs/product/build-chapters.md` |
| Current state | `_planning/build-status.md` |
| OpenCode handoff | `_planning/opencode-handoff-build-chapter-1.md` |

## Terminology

- **Build Chapter**: major delivery slice.
- **Work Card**: concrete implementation unit.
- **Build Status**: current tracker and resume surface.
- **Founder Decision Lock**: founder-level decision checkpoint before implementation.
- **Chapter Review**: closeout check before moving to the next chapter.
- **Fast-Follow Chapter**: committed post-MVP chapter, not vague backlog.

## Status Values

- `pending`: known but not ready to start.
- `ready`: enough context exists to begin.
- `in-progress`: actively being implemented.
- `review`: implementation finished, verification/review not complete.
- `done`: accepted with evidence.
- `blocked`: cannot continue without external decision/action.
- `deferred`: intentionally moved out of the current delivery horizon.

## Build Loop

1. Read `_planning/build-status.md`.
2. Read the active chapter in `docs/product/build-chapters.md`.
3. Read the matching OpenCode handoff if using OpenCode.
4. Execute one Work Card or a tight batch.
5. Verify with the commands and browser checks named in the handoff.
6. Update `_planning/build-status.md`.
7. Record blockers, decisions, and verification receipts.
8. Move to Chapter Review before starting the next Build Chapter.

## Powers By Stage

| Stage | Use |
| --- | --- |
| Chapter intake | Agent 47, `observation-system`, `project-flow-router` |
| Work Card detail | `spec-lite-planning`, `karpathy-guidelines` |
| Implementation | `implementation-plan-execution`, `react-best-practices` |
| UI/design | Atelier-47, `frontend-design`, `web-design-guidelines`, `webapp-testing` |
| Verification | `self-verification-loop` |
| Auth/data/storage/security | Sentinel-47, `security-gate`, `supabase-postgres-best-practices` |
| Decisions/doctrine | `custodian-47` |

## Operating Rules

- Keep all chapters visible, but detail only the next chapter deeply.
- Do not implement from memory summary alone.
- Do not mark a Work Card `done` without verification evidence.
- Do not start Supabase migrations until public and owner surfaces feel right.
- Do not let Bahasa Malaysia drift into vague future scope; it is Build Chapter 6.
- Do not use public "verified" language until a real verification policy exists.
- Keep OpenCode handoffs short enough to execute, but specific enough to resume.

## First Active Chapter

Current focus:

- Build Chapter 1: App Foundation And Brand Shell.

Start:

- Work Card 1.1: Scaffold Next.js App.
