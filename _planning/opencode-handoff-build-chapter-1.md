# OpenCode Handoff: MyHomestay Build Chapter 1

## Mission

Implement Build Chapter 1: App Foundation And Brand Shell.

Use this handoff as the execution source. Do not implement later chapters unless Adam explicitly asks.

## Required Context

Read these first:

1. `AGENTS.md`
2. `docs/PROJECT_AGENT_CONTEXT.md`
3. `_planning/plan-build-flow.md`
4. `_planning/build-status.md`
5. `docs/product/brand-ux-system.md`
6. `docs/product/build-chapters.md`

## Chapter Goal

Restore MyHomestay as a clean Next.js product foundation with:

- App Router.
- TypeScript.
- Tailwind.
- lint/build scripts.
- MyHomestay brand tokens.
- typed mock data contracts.
- WhatsApp, location, and listing completeness helpers.

## Work Card 1.1: Scaffold Next.js App

### Intent

Create the clean app foundation without resurrecting the deleted Vibe-session test website.

### Steps

- Inspect Node and npm versions.
- Scaffold or restore a clean Next.js App Router TypeScript app in the repo root.
- Use Tailwind and ESLint.
- Use `src/` layout.
- Use import alias if supported.
- Do not create a nested git repo.
- Do not add app-local agent instruction files.
- Preserve existing planning docs.

### Acceptance

- `package.json` exists with useful scripts.
- `src/app/page.tsx`, layout, and global CSS exist.
- `npm run lint` passes or any generated lint command equivalent is documented.
- `npm run build` passes.
- No old `src/data/homestays.ts` or deleted Vibe directory pages are resurrected.

## Work Card 1.2: Implement Brand Tokens And Global Shell

### Intent

Implement the `Kampung Quiet Ledger Hybrid` foundation.

### Steps

- Add global tokens from `docs/product/brand-ux-system.md`.
- Implement page shell, typography, buttons, badges, and basic surfaces.
- Keep radius at 6px or 8px.
- Avoid decorative blobs, generic gradients, nested cards, and a one-note beige/brown palette.
- Keep text strings easy to centralize for future Bahasa Malaysia support.

### Acceptance

- Home route visually reflects MyHomestay's owner-first direction.
- Primary action uses `leaf`.
- Informational links use `river`.
- Attention/incomplete states use `clay`.
- Layout has no horizontal overflow on narrow mobile.

## Work Card 1.3: Add Typed Mock Data Contracts

### Intent

Create mock data that resembles the future Supabase model.

### Suggested Files

- `src/data/listings.ts`
- `src/types/listings.ts`

### Requirements

- Include owner profile shape.
- Include listing statuses: `draft`, `published`, `paused`, `needs_review`.
- Include photo metadata shape.
- Include listing metrics shape.
- Include at least one long Malay place name for wrapping checks.
- Include Muslim-friendly and family-friendly flags.

### Acceptance

- Mock data can power home, directory, listing page, and dashboard later.
- TypeScript build passes.

## Work Card 1.4: Add Core Helpers

### Suggested Files

- `src/lib/whatsapp.ts`
- `src/lib/locations/my.ts`
- `src/lib/listing-completeness.ts`

### Requirements

- WhatsApp helper generates `wa.me` link with prefilled listing inquiry.
- Location helper formats state/town/area.
- Completeness helper returns missing required publish fields.
- Published listings require at least 3 photos.
- Draft listings may have fewer photos.

### Acceptance

- Helper tests exist if the project test runner is added.
- If no test runner is added in Chapter 1, validate helpers through TypeScript/build and document that tests are deferred.

## Verification Commands

Run after implementation:

```powershell
npm.cmd run lint
npm.cmd run build
```

If a typecheck script is available:

```powershell
npm.cmd run typecheck
```

If a dev server is started, prefer Windows-safe commands and avoid stale background processes.

## Browser Checks

After the app runs locally:

- `/` loads.
- no horizontal overflow at 320px.
- no horizontal overflow at 375px.
- no obvious overlap at 768px, 1024px, and 1440px.
- home page looks owner-first, not like a travel marketplace clone.

## Update Required Before Closeout

Update `_planning/build-status.md`:

- set completed Work Cards to `done`.
- add commands run and pass/fail results.
- add any deviations.
- set next move to Chapter 2 planning if Chapter 1 is complete, otherwise the next unfinished Work Card.

## Stop Conditions

Stop and ask Adam before:

- changing the accepted stack away from Next.js/Tailwind.
- wiring Supabase earlier than planned.
- deleting planning docs.
- adding payment/subscription code.
- adding public "verified" language.
- committing or pushing.

## Final Response Expected

Summarize:

- Work Cards completed.
- files changed.
- commands run and results.
- browser checks performed.
- build-status update.
- next recommended move.
