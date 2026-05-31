# Chapter 5 Pilot Checklist

Status: draft closeout receipt
Date: 2026-05-31

## Scope

Chapter 5 closes the minimum admin and launch-readiness layer for a controlled
MyHomestay pilot:

- admin moderation actions
- append-only moderation audit
- durable listing views and WhatsApp click metrics
- listing and directory SEO/share metadata
- pilot readiness checks before any production-readiness claim

## Admin Review Checks

- [x] Admin route is protected by `requireAdmin()`.
- [x] Non-admin signed-in users are redirected to `/dashboard`.
- [x] First admin bootstrap requires temporarily disabling `trg_guard_profile_role`.
- [x] Admin can pause a published listing.
- [x] Admin can restore a paused listing to published.
- [x] Admin can flag a listing as needs review. Adam manual review passed for controlled pilot.
- [x] Admin can clear a needs-review listing to draft. Adam manual review passed for controlled pilot.
- [x] Admin moderation writes through `moderate_listing`.
- [x] Audit rows use `auth.uid()` inside the RPC, not a client-supplied admin id.

## Public Visibility Checks

- [x] Paused listings are removed from public directory/detail reads.
- [x] Restored published listings return to public directory/detail reads.
- [x] Needs-review listings are removed from public directory/detail reads by published-only RPC scope.
- [x] Draft listings are removed from public directory/detail reads by published-only RPC scope.

## Metrics Checks

- [x] Public listing view posts a `views` metric through `/api/listing-metrics`.
- [x] WhatsApp CTA posts a `whatsapp_clicks` metric through `/api/listing-metrics`.
- [x] The API accepts only UUID listing ids and known metric names.
- [x] The database RPC only increments metrics for published listings.
- [x] Live metric probe incremented Hawa Homestay WhatsApp clicks from 0 to 1.
- [x] Live owner dashboard metric refresh accepted in Adam manual review.

## SEO And Share Checks

- [x] Directory route has canonical, Open Graph, and Twitter metadata.
- [x] Listing detail route has canonical, Open Graph, Twitter metadata, and an OG image route.
- [x] Rendered metadata for Hawa Homestay includes `og:title`, `og:image`, and canonical link.
- [x] Hawa Homestay OG image route returns `200 image/png`.

## Security And Release Checks

- [x] `npm.cmd run typecheck` passes.
- [x] `npm.cmd run lint` passes.
- [x] `npm.cmd test` passes.
- [x] `npm.cmd run build` passes.
- [x] `npm.cmd audit --audit-level=high` checked; no high/critical issues found.
- [x] `git check-ignore -v .env.local` confirms local env is ignored.
- [x] `git diff --check` passes with CRLF warnings only.
- [x] Admin and metrics residual risks are accepted for controlled pilot.

## Residual Risks

- Metrics can be inflated by repeated public requests. This is acceptable for
  MVP directional owner signals, not billing or ranking.
- Admin role bootstrap currently needs manual SQL trigger disable/enable for
  the first admin. This should be documented and later replaced with a safer
  setup script or seed migration for non-production projects.
- No image moderation workflow exists yet. Do not claim marketplace-level trust
  or verification until that policy exists.
- WhatsApp booking/payment remains outside the platform. Copy must continue to
  say that payment happens directly between guest and owner.
