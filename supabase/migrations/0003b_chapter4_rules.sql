-- MyHomestay Build Chapter 4 - Business Rules (part 2)
-- Migration 0003b: publish-completeness gate (T8) and metrics RPC (T9).
-- Mirrors evaluateListingCompleteness in src/lib/listing-completeness.ts.

-- ---------------------------------------------------------------------------
-- Publish gate (T8): a listing may only become 'published' when it meets the
-- MVP completeness rules. Enforced at the DB so a direct PostgREST update
-- cannot publish an incomplete listing, bypassing the UI.
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
  -- Only gate the moment of becoming published.
  if new.status <> 'published' then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.status = 'published' then
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

-- Both this and trg_enforce_status_transition are BEFORE triggers; either one
-- raising aborts the write, so firing order does not affect correctness.
create trigger trg_enforce_publish_completeness
  before insert or update on public.listings
  for each row execute function public.enforce_publish_completeness();

-- ---------------------------------------------------------------------------
-- Metrics RPC (T9): the only write path to listing_metrics. Anon may call it
-- to count a public view or WhatsApp click on a PUBLISHED listing only.
-- Fixed +1 increment; metric name validated; no arbitrary writes.
-- ---------------------------------------------------------------------------

create or replace function public.increment_listing_metric(
  p_listing_id uuid,
  p_metric text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_metric not in ('views', 'whatsapp_clicks') then
    raise exception 'Unknown metric: %', p_metric using errcode = 'check_violation';
  end if;

  -- Only count metrics for published listings.
  if not exists (
    select 1 from public.listings
    where id = p_listing_id and status = 'published'
  ) then
    return;
  end if;

  insert into public.listing_metrics (listing_id, views, whatsapp_clicks, last_updated_at)
  values (
    p_listing_id,
    case when p_metric = 'views' then 1 else 0 end,
    case when p_metric = 'whatsapp_clicks' then 1 else 0 end,
    now()
  )
  on conflict (listing_id) do update
  set views = public.listing_metrics.views
        + case when p_metric = 'views' then 1 else 0 end,
      whatsapp_clicks = public.listing_metrics.whatsapp_clicks
        + case when p_metric = 'whatsapp_clicks' then 1 else 0 end,
      last_updated_at = now();
end;
$$;

grant execute on function public.increment_listing_metric(uuid, text) to anon, authenticated;
