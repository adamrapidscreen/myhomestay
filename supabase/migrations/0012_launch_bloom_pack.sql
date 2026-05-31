-- MyHomestay Launch Bloom Pack (Beta 0.17 candidate)
-- Migration 0012: owner local guide items + public listing reports.
--
-- Design follows the Chapter 4 public-read decision (Sentinel M1, 0008):
--   * Public reads NEVER use a broad anon table SELECT. They go through
--     column-scoped SECURITY DEFINER RPCs.
--   * Sensitive intake (reports) is inserted only through a SECURITY DEFINER
--     RPC that validates published status server-side, matching the
--     moderate_listing / increment_listing_metric pattern. No public INSERT
--     policy is granted on listing_reports, so direct PostgREST inserts are
--     impossible.
--   * Owner CRUD on guide items is RLS-scoped through listing ownership.
--
-- This migration adds NO payments, bookings, accounts, reviews, ratings, or
-- "verified" semantics.

-- ---------------------------------------------------------------------------
-- 1. Enums
-- ---------------------------------------------------------------------------

create type public.guide_item_category as enum (
  'food',
  'mosque-surau',
  'groceries',
  'attraction',
  'transport',
  'check-in',
  'local-tip',
  'other'
);

create type public.listing_report_reason as enum (
  'misleading',
  'inappropriate',
  'not-real-place',
  'scam-phishing',
  'other'
);

create type public.listing_report_status as enum (
  'new',
  'reviewed',
  'dismissed'
);

-- ---------------------------------------------------------------------------
-- 2. listing_guide_items: owner-managed nearby/local notes
-- ---------------------------------------------------------------------------

create table public.listing_guide_items (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  category public.guide_item_category not null default 'local-tip',
  title text not null default '',
  note text not null default '',
  distance_label text,
  is_public boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guide_title_len check (char_length(title) <= 80),
  constraint guide_note_len check (char_length(note) <= 240),
  constraint guide_distance_len
    check (char_length(coalesce(distance_label, '')) <= 60)
);

-- Foreign-key + ordering index (schema-foreign-key-indexes best practice).
create index listing_guide_items_listing_idx
  on public.listing_guide_items (listing_id, sort_order);

create trigger trg_listing_guide_items_updated_at
  before update on public.listing_guide_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. listing_reports: public abuse/quality intake (admin-readable only)
-- ---------------------------------------------------------------------------

create table public.listing_reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  reason public.listing_report_reason not null,
  details text not null default '',
  reporter_contact text,
  status public.listing_report_status not null default 'new',
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint report_details_len check (char_length(details) <= 1000),
  constraint reporter_contact_len
    check (char_length(coalesce(reporter_contact, '')) <= 160)
);

create index listing_reports_listing_idx
  on public.listing_reports (listing_id);
create index listing_reports_status_idx
  on public.listing_reports (status, created_at desc);

-- ---------------------------------------------------------------------------
-- 4. RLS: listing_guide_items
--    Owner CRUD scoped by listing ownership; admin read-all; no anon access
--    (public reads go through the RPC below).
-- ---------------------------------------------------------------------------

alter table public.listing_guide_items enable row level security;

create policy listing_guide_items_select_owner
  on public.listing_guide_items
  for select
  to authenticated
  using (
    listing_id in (
      select l.id from public.listings l where l.owner_id = (select auth.uid())
    )
  );

create policy listing_guide_items_select_admin
  on public.listing_guide_items
  for select
  to authenticated
  using (public.is_admin());

create policy listing_guide_items_insert_owner
  on public.listing_guide_items
  for insert
  to authenticated
  with check (
    listing_id in (
      select l.id from public.listings l where l.owner_id = (select auth.uid())
    )
  );

create policy listing_guide_items_update_owner
  on public.listing_guide_items
  for update
  to authenticated
  using (
    listing_id in (
      select l.id from public.listings l where l.owner_id = (select auth.uid())
    )
  )
  with check (
    listing_id in (
      select l.id from public.listings l where l.owner_id = (select auth.uid())
    )
  );

create policy listing_guide_items_delete_owner
  on public.listing_guide_items
  for delete
  to authenticated
  using (
    listing_id in (
      select l.id from public.listings l where l.owner_id = (select auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- 5. RLS: listing_reports
--    Admin select/update only. Inserts happen ONLY through submit_listing_report
--    (SECURITY DEFINER), so no insert policy is defined. Owners cannot read
--    reports in this pack.
-- ---------------------------------------------------------------------------

alter table public.listing_reports enable row level security;

create policy listing_reports_select_admin
  on public.listing_reports
  for select
  to authenticated
  using (public.is_admin());

create policy listing_reports_update_admin
  on public.listing_reports
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6. Public read RPC: published listing guide items only.
--    Returns a fixed safe shape and only when the parent listing is published
--    and the item is public. Definer-owned so no anon table grant is needed.
-- ---------------------------------------------------------------------------

create or replace function public.get_published_listing_guide_items(
  p_listing_id uuid
)
returns table (
  id uuid,
  category public.guide_item_category,
  title text,
  note text,
  distance_label text,
  sort_order integer
)
language sql
security definer
set search_path = public
stable
as $$
  select g.id, g.category, g.title, g.note, g.distance_label, g.sort_order
  from public.listing_guide_items g
  join public.listings l on l.id = g.listing_id
  where g.listing_id = p_listing_id
    and g.is_public = true
    and l.status = 'published'
  order by g.sort_order, g.created_at;
$$;

grant execute on function public.get_published_listing_guide_items(uuid)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 7. Public intake RPC: submit a listing report.
--    Validates the listing is currently published, normalises/clamps inputs,
--    and inserts under definer rights. No public INSERT policy exists, so this
--    RPC is the only intake path. Reason is validated by the enum cast.
-- ---------------------------------------------------------------------------

create or replace function public.submit_listing_report(
  p_listing_id uuid,
  p_reason public.listing_report_reason,
  p_details text default null,
  p_reporter_contact text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  is_published boolean;
begin
  select (l.status = 'published') into is_published
  from public.listings l
  where l.id = p_listing_id;

  if is_published is distinct from true then
    raise exception 'Reports can only be filed for published listings.'
      using errcode = 'check_violation';
  end if;

  insert into public.listing_reports (listing_id, reason, details, reporter_contact)
  values (
    p_listing_id,
    p_reason,
    left(coalesce(p_details, ''), 1000),
    nullif(left(coalesce(p_reporter_contact, ''), 160), '')
  );
end;
$$;

grant execute on function public.submit_listing_report(
  uuid, public.listing_report_reason, text, text
) to anon, authenticated;
