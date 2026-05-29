-- MyHomestay Build Chapter 4 - Business Rules (part 1)
-- Migration 0003: DB-layer enforcement of free-tier (T7), role guard (T5),
-- and status transitions (T11). Publish gate (T8) + metrics RPC (T9) follow
-- in 0003b. Mirrors canTransitionTo in src/lib/listing-builder-validation.ts.

-- ---------------------------------------------------------------------------
-- Free-tier limit (T7): max 3 listings per owner. UI check is secondary.
-- ---------------------------------------------------------------------------

create or replace function public.enforce_free_listing_limit()
returns trigger
language plpgsql
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

create trigger trg_enforce_free_listing_limit
  before insert on public.listings
  for each row execute function public.enforce_free_listing_limit();

-- ---------------------------------------------------------------------------
-- Role guard (T5): a non-admin cannot change their own role. Only an existing
-- admin may set roles. Blocks privilege escalation through profile UPDATE.
-- ---------------------------------------------------------------------------

create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if not public.is_admin() then
      raise exception 'Only an admin can change a profile role.'
        using errcode = 'insufficient_privilege';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_guard_profile_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- ---------------------------------------------------------------------------
-- Status transitions (T11): allow only the MVP-approved moves.
--   draft       -> published | draft
--   published   -> paused | draft | published
--   paused      -> published | draft | paused
--   needs_review-> draft | published | needs_review
-- Same-status updates are always allowed (field edits without a move).
-- ---------------------------------------------------------------------------

create or replace function public.enforce_status_transition()
returns trigger
language plpgsql
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

create trigger trg_enforce_status_transition
  before update on public.listings
  for each row execute function public.enforce_status_transition();
