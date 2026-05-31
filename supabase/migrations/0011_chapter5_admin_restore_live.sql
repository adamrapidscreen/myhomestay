-- MyHomestay Build Chapter 5 - Admin restore live action
-- Migration 0011: let the admin moderation RPC restore eligible listings to
-- published, and let the audit table record that action.

alter table public.admin_review
  drop constraint if exists action_allowed;

alter table public.admin_review
  add constraint action_allowed
  check (action in ('pause', 'needs_review', 'publish', 'note', 'clear'));

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
  elsif p_action = 'publish' then
    target := 'published';
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
