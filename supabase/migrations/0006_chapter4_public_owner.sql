-- MyHomestay Build Chapter 4 - Public owner access
-- Migration 0006: controlled public read of owner contact fields.
--
-- profiles has no public SELECT policy (T4), but public listing pages must
-- show the owner's display name and WhatsApp number to route guests. This
-- SECURITY DEFINER function returns ONLY the safe owner fields and ONLY for
-- a PUBLISHED listing. full_name and postcode are never exposed.

create or replace function public.get_listing_owner_public(p_listing_id uuid)
returns table (
  display_name text,
  whatsapp_number text,
  region_label text
)
language sql
security definer
set search_path = public
stable
as $$
  select p.display_name, p.whatsapp_number, p.region_label
  from public.listings l
  join public.profiles p on p.id = l.owner_id
  where l.id = p_listing_id
    and l.status = 'published';
$$;

grant execute on function public.get_listing_owner_public(uuid) to anon, authenticated;
