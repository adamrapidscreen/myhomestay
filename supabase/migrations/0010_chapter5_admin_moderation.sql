-- MyHomestay Build Chapter 5 - Admin moderation rules
-- Migration 0010: enable admin moderation transitions + close Sentinel L1.
--
-- Two changes:
-- 1. enforce_status_transition gains an admin path INTO needs_review. Before
--    this, NO state could move to needs_review, so moderation was impossible.
-- 2. guard_admin_listing_scope (L1): when an admin edits a listing they do
--    NOT own, only the status column may change. Owners editing their own
--    listings keep normal owner rules.

-- ---------------------------------------------------------------------------
-- 1. Allow admin to move any active listing into needs_review.
--    Owner transitions are unchanged. needs_review can still be cleared to
--    draft/published (existing rule + admin).
-- ---------------------------------------------------------------------------

create or replace function public.enforce_status_transition()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  ok boolean := false;
begin
  if new.status = old.status then
    return new;
  end if;

  -- Admin moderation: an admin may flag any listing for review.
  if new.status = 'needs_review' and public.is_admin() then
    return new;
  end if;

  if old.status = 'draft' and new.status in ('published', 'draft') then
    ok := true;
  elsif old.status = 'published' and new.status in ('paused', 'draft') then
    ok := true;
  elsif old.status = 'paused' and new.status in ('published', 'draft') then
    ok := true;
  elsif old.status = 'needs_review' and new.status in ('draft', 'published') then
    ok := true;
  end if;

  if not ok then
    raise exception 'Illegal listing status transition from % to %.',
      old.status, new.status
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. L1: admin editing a listing they do NOT own may change status only.
--    Runs BEFORE UPDATE. If the actor is not the owner, every non-status,
--    non-updated_at column must be unchanged. RLS already ensures only the
--    owner or an admin can reach an UPDATE, so a non-owner here is an admin.
-- ---------------------------------------------------------------------------

create or replace function public.guard_admin_listing_scope()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Owners editing their own rows are governed by normal owner rules.
  -- Keyed on OLD.owner_id (who owned the row BEFORE this edit) so an admin
  -- cannot self-assign ownership in the same UPDATE to skip the content guard.
  if old.owner_id = auth.uid() then
    return new;
  end if;

  -- Non-owner (admin) edit: status (and the auto updated_at) only.
  if new.id is distinct from old.id
     or new.slug is distinct from old.slug
     or new.owner_id is distinct from old.owner_id
     or new.name is distinct from old.name
     or new.summary is distinct from old.summary
     or new.description is distinct from old.description
     or new.capacity is distinct from old.capacity
     or new.bedrooms is distinct from old.bedrooms
     or new.location_area is distinct from old.location_area
     or new.location_town is distinct from old.location_town
     or new.location_state is distinct from old.location_state
     or new.location_postcode is distinct from old.location_postcode
     or new.price_currency is distinct from old.price_currency
     or new.price_min_per_night is distinct from old.price_min_per_night
     or new.price_max_per_night is distinct from old.price_max_per_night
     or new.amenities is distinct from old.amenities
     or new.house_rules is distinct from old.house_rules
     or new.muslim_friendly is distinct from old.muslim_friendly
     or new.family_friendly is distinct from old.family_friendly
     or new.created_at is distinct from old.created_at then
    raise exception 'Admins may change listing status only, not listing content.'
      using errcode = 'insufficient_privilege';
  end if;

  return new;
end;
$$;

-- All listing BEFORE-UPDATE triggers fire alphabetically by trigger name
-- (trg_enforce_publish_completeness, trg_enforce_status_transition,
-- trg_guard_admin_listing_scope, trg_listings_updated_at). Order does not
-- affect correctness: each is a BEFORE trigger and any raise aborts the write.
create trigger trg_guard_admin_listing_scope
  before update on public.listings
  for each row execute function public.guard_admin_listing_scope();

-- ---------------------------------------------------------------------------
-- 3. Atomic moderation RPC (M1 + M2). Status change + audit row in ONE
--    transaction. Asserts is_admin() internally and forces admin_id to
--    auth.uid() so the audit actor cannot be forged. The app calls this
--    instead of doing two separate writes.
-- ---------------------------------------------------------------------------

create or replace function public.moderate_listing(
  p_listing_id uuid,
  p_action text,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.listing_status;
begin
  if not public.is_admin() then
    raise exception 'Admin role required.' using errcode = 'insufficient_privilege';
  end if;

  if p_action = 'pause' then
    target := 'paused';
  elsif p_action = 'needs_review' then
    target := 'needs_review';
  elsif p_action = 'clear' then
    target := 'draft';
  else
    raise exception 'Unknown moderation action: %', p_action
      using errcode = 'check_violation';
  end if;

  update public.listings
  set status = target
  where id = p_listing_id;

  if not found then
    raise exception 'Listing not found.' using errcode = 'no_data_found';
  end if;

  insert into public.admin_review (listing_id, admin_id, action, note)
  values (
    p_listing_id,
    auth.uid(),
    p_action,
    nullif(left(coalesce(p_note, ''), 500), '')
  );
end;
$$;

grant execute on function public.moderate_listing(uuid, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. M2: pin admin_review.admin_id to the acting admin even on direct writes.
-- ---------------------------------------------------------------------------

drop policy if exists admin_review_all_admin on public.admin_review;

create policy admin_review_select_admin
  on public.admin_review
  for select
  to authenticated
  using (public.is_admin());

create policy admin_review_insert_admin
  on public.admin_review
  for insert
  to authenticated
  with check (public.is_admin() and admin_id = auth.uid());
