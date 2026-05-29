-- MyHomestay Build Chapter 4 - Public photo display
-- Migration 0009: let anon read storage objects for PUBLISHED listings only,
-- so public listing pages can mint signed URLs for their photos.
--
-- Object path convention is {owner_id}/{listing_id}/{uuid}.{ext}, so the
-- second path segment is the listing id. We grant SELECT when that listing
-- is published. Owners keep their existing folder-scoped SELECT (0004).
-- The bucket stays private; display still uses short-lived signed URLs.

create policy listing_photos_obj_select_published
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'listing-photos'
    and exists (
      select 1 from public.listings l
      where l.id::text = (storage.foldername(name))[2]
        and l.status = 'published'
    )
  );
