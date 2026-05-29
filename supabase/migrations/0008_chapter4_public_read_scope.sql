-- MyHomestay Build Chapter 4 - M1 remediation (column-scoped public reads)
-- Migration 0008: close the raw-PostgREST postcode leak (Sentinel M1, A01/A02).
--
-- Problem: listings_select_published granted anon/auth SELECT on the WHOLE
-- listings row. RLS cannot column-filter, so location_postcode was readable
-- via direct PostgREST even though the app never rendered it. The same was
-- true for any authenticated non-owner.
--
-- Fix: public surfaces read through SECURITY DEFINER RPCs that return a fixed
-- safe shape WITHOUT location_postcode. The anon "published" table policies
-- are dropped so raw table access is no longer a public path. Owner-scoped
-- policies remain; owners still read their own full rows (incl. postcode).

-- ---------------------------------------------------------------------------
-- Public listing RPCs. Return ListingRow-shaped JSON minus location_postcode,
-- with nested photos + metrics. Definer-owned, so they read published rows
-- without the base table being anon-accessible.
-- ---------------------------------------------------------------------------

create or replace function public.published_listing_json(l public.listings)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'id', l.id,
    'slug', l.slug,
    'owner_id', l.owner_id,
    'name', l.name,
    'summary', l.summary,
    'description', l.description,
    'capacity', l.capacity,
    'bedrooms', l.bedrooms,
    'location_area', l.location_area,
    'location_town', l.location_town,
    'location_state', l.location_state,
    -- location_postcode intentionally omitted (T4).
    'price_currency', l.price_currency,
    'price_min_per_night', l.price_min_per_night,
    'price_max_per_night', l.price_max_per_night,
    'amenities', l.amenities,
    'house_rules', l.house_rules,
    'muslim_friendly', l.muslim_friendly,
    'family_friendly', l.family_friendly,
    'status', l.status,
    'updated_at', l.updated_at,
    'listing_photos', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', p.id, 'src', p.src, 'alt', p.alt,
            'category', p.category, 'sort_order', p.sort_order
          ) order by p.sort_order
        )
        from public.listing_photos p
        where p.listing_id = l.id
      ),
      '[]'::jsonb
    ),
    'listing_metrics', (
      select jsonb_build_object(
        'views', m.views,
        'whatsapp_clicks', m.whatsapp_clicks,
        'last_updated_at', m.last_updated_at
      )
      from public.listing_metrics m
      where m.listing_id = l.id
    )
  );
$$;

create or replace function public.get_published_listings()
returns setof jsonb
language sql
security definer
set search_path = public
stable
as $$
  select public.published_listing_json(l)
  from public.listings l
  where l.status = 'published'
  order by l.updated_at desc;
$$;

create or replace function public.get_published_listing_by_slug(p_slug text)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select public.published_listing_json(l)
  from public.listings l
  where l.slug = p_slug
    and l.status = 'published'
  limit 1;
$$;

grant execute on function public.get_published_listings() to anon, authenticated;
grant execute on function public.get_published_listing_by_slug(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Remove anon "published" table policies. Public reads now go through the
-- RPCs above; owner-scoped policies (authenticated) remain in force.
-- ---------------------------------------------------------------------------

drop policy if exists listings_select_published on public.listings;
drop policy if exists listing_photos_select_published on public.listing_photos;
drop policy if exists listing_metrics_select_published on public.listing_metrics;
