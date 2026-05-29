-- MyHomestay Build Chapter 4 - Security review fixes
-- Migration 0007: addresses Sentinel-47 findings M2 and I1.
--
-- M2 (A04): enforce_publish_completeness only gated the transition INTO
--   published. An owner could UPDATE a published listing to remove photos /
--   blank required fields and it stayed published. Re-validate on ANY update
--   while the new status is 'published'.
-- I1: enforce_free_listing_limit and enforce_status_transition had no locked
--   search_path. Pin them for consistency with the rest of the suite.

-- ---------------------------------------------------------------------------
-- M2: re-validate completeness whenever the row is (or stays) published.
-- ---------------------------------------------------------------------------

create or replace function public.enforce_publish_completeness()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  photo_count integer;
  owner_whatsapp text;
begin
  -- Only enforce when the resulting row is published. Drafts/paused are free
  -- to be incomplete. This now covers BOTH the transition into published and
  -- any later edit while published (M2).
  if new.status <> 'published' then
    return new;
  end if;

  if coalesce(new.name, '') = '' then
    raise exception 'Cannot publish: missing name.' using errcode = 'check_violation';
  end if;
  if coalesce(new.summary, '') = '' then
    raise exception 'Cannot publish: missing summary.' using errcode = 'check_violation';
  end if;
  if coalesce(new.description, '') = '' then
    raise exception 'Cannot publish: missing description.' using errcode = 'check_violation';
  end if;
  if coalesce(new.capacity, 0) < 1 then
    raise exception 'Cannot publish: capacity required.' using errcode = 'check_violation';
  end if;
  if coalesce(new.bedrooms, 0) < 1 then
    raise exception 'Cannot publish: bedrooms required.' using errcode = 'check_violation';
  end if;
  if coalesce(new.location_area, '') = '' then
    raise exception 'Cannot publish: location area required.' using errcode = 'check_violation';
  end if;
  if coalesce(new.price_min_per_night, 0) <= 0
     or coalesce(new.price_max_per_night, 0) <= 0
     or new.price_max_per_night < new.price_min_per_night then
    raise exception 'Cannot publish: valid price range required.' using errcode = 'check_violation';
  end if;
  if coalesce(array_length(new.house_rules, 1), 0) < 1 then
    raise exception 'Cannot publish: at least one house rule required.' using errcode = 'check_violation';
  end if;

  select count(*) into photo_count
  from public.listing_photos
  where listing_id = new.id;
  if photo_count < 3 then
    raise exception 'Cannot publish: at least 3 photos required.' using errcode = 'check_violation';
  end if;

  select whatsapp_number into owner_whatsapp
  from public.profiles
  where id = new.owner_id;
  if coalesce(length(regexp_replace(owner_whatsapp, '[^0-9]', '', 'g')), 0) < 8 then
    raise exception 'Cannot publish: owner WhatsApp number required.' using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- I1: pin search_path on the two remaining trigger functions.
-- ---------------------------------------------------------------------------

create or replace function public.enforce_free_listing_limit()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  owned_count integer;
begin
  select count(*) into owned_count
  from public.listings
  where owner_id = new.owner_id;

  if owned_count >= 3 then
    raise exception 'Free tier limit reached: 3 listings.'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

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
