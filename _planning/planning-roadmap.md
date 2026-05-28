# MyHomestay Planning Roadmap

## Objective

Create the smallest serious planning pack needed to build MyHomestay as a real product without running the full long BMAD workflow.

## Planning Route

Use a compact Hivemind route:

1. Product Brief
2. PRD-Lite
3. Atelier-47 Brand and UX System
4. Architecture Blueprint
5. MVP Build Spec

## Pass 1: Product Brief

Status: drafted.

Purpose:

- Summarize the product concept.
- Define first customer, problem, market wedge, MVP promise, and commercial path.

Output:

- `docs/product/product-brief.md`

## Pass 2: PRD-Lite

Status: drafted.

Purpose:

- Define MVP scope without full BMAD ceremony.
- Capture user roles, core flows, functional requirements, non-goals, success metrics, and risks.

Output:

- `docs/product/prd-lite.md`

## Pass 3: Brand and UX System

Status: drafted.

Purpose:

- Define the minimal/artisan/kampung-modern design language.
- Specify owner onboarding, listing creation, dashboard, public listing, and WhatsApp handoff experience.

Output:

- `docs/product/brand-ux-system.md`

## Pass 4: Architecture Blueprint

Status: drafted.

Purpose:

- Define the responsive web app / hybrid PWA architecture.
- Decide stack, data model, auth, listing storage, media handling, WhatsApp CTA, future subscription path, and deployment approach.

Output:

- `docs/product/architecture-blueprint.md`

## Pass 5: MVP Build Spec

Status: drafted.

Purpose:

- Turn the accepted plan into the first implementation slice.
- Define first sprint tasks, verification gates, and launch readiness checks.

Output:

- `docs/product/mvp-build-spec.md`

## Pass 6: Founder Decision Lock

Status: accepted.

Purpose:

- Ask the founder-level questions that affect scope, data model, launch posture, and first sprint order.
- Avoid baking assumptions into implementation.
- Convert the planning pack into locked decisions before Build Chapters and Work Cards.

Output:

- `docs/product/founder-decision-lock.md`

## Pass 7: Build Chapters And Work Cards

Status: drafted.

Purpose:

- Replace full BMAD epics/stories with a lighter implementation breakdown.
- Define Build Chapters as major delivery slices and Work Cards as concrete implementation units.

Output:

- `docs/product/build-chapters.md`

## Current Decision

The previous Vibe-session website has been removed from the working tree. The repo now starts from planning artifacts only.

## Guardrails

- Do not code the app before the planning pack is accepted.
- Do not create Build Chapters and Work Cards before the Founder Decision Lock is answered.
- Do not add payment or subscription implementation to MVP unless explicitly approved.
- Do not store secrets in the repo.
- Keep WhatsApp booking/payment handoff as the MVP transaction path.
- Treat Malaysia as the first market before Southeast Asia expansion.
