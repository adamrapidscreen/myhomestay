-- MyHomestay Build Chapter 4 - Row Level Security
-- Migration 0002: enable RLS, is_admin() helper, policies.
-- Depends on 0001. Enforces ownership (T2), public-read scoping (T3/T4),
-- and admin gating (T5) from the security gate.

-- ---------------------------------------------------------------------------
-- Admin helper. SECURITY DEFINER with locked search_path.
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS on every table. Default-deny until a policy allows.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.listing_metrics enable row level security;
alter table public.admin_review enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- Owner reads/updates own row. First-login insert of own row. Admin reads all.
-- No public/anon SELECT on this table; public owner data is reached only
-- through the published-listing join in the app's render helper.
-- ---------------------------------------------------------------------------

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy profiles_insert_own
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- listings
-- Owner full CRUD on own rows. Public/anon SELECT only published.
-- Admin may SELECT all and UPDATE (status moderation; column scope enforced
-- by the status-transition trigger in 0003).
-- ---------------------------------------------------------------------------

create policy listings_select_published
  on public.listings
  for select
  to anon, authenticated
  using (status = 'published');

create policy listings_select_own
  on public.listings
  for select
  to authenticated
  using (owner_id = auth.uid() or public.is_admin());

create policy listings_insert_own
  on public.listings
  for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy listings_update_own
  on public.listings
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy listings_update_admin
  on public.listings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy listings_delete_own
  on public.listings
  for delete
  to authenticated
  using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- listing_photos
-- Owner CRUD through listing ownership. Public SELECT only for published.
-- ---------------------------------------------------------------------------

create policy listing_photos_select_published
  on public.listing_photos
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.status = 'published'
    )
  );

create policy listing_photos_select_own
  on public.listing_photos
  for select
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy listing_photos_write_own
  on public.listing_photos
  for all
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- listing_metrics
-- Owner SELECT own. Public SELECT only for published. No direct writes;
-- increments go through increment_listing_metric (0003).
-- ---------------------------------------------------------------------------

create policy listing_metrics_select_published
  on public.listing_metrics
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.status = 'published'
    )
  );

create policy listing_metrics_select_own
  on public.listing_metrics
  for select
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.owner_id = auth.uid() or public.is_admin())
    )
  );

-- ---------------------------------------------------------------------------
-- admin_review
-- Admin-only for all operations.
-- ---------------------------------------------------------------------------

create policy admin_review_all_admin
  on public.admin_review
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
