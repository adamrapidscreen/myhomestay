-- MyHomestay Build Chapter 4 - Storage
-- Migration 0004: private listing-photos bucket and path-scoped RLS (T6).
-- Object path convention: {owner_id}/{listing_id}/{photo_id}.{ext}
-- Owner write access is gated on the first path segment matching auth.uid().

-- ---------------------------------------------------------------------------
-- Private bucket with mime allowlist and 5 MB size cap.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-photos',
  'listing-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Object policies. (storage.objects already has RLS enabled by Supabase.)
-- First path segment must equal the caller's uid for any write.
-- ---------------------------------------------------------------------------

create policy listing_photos_obj_insert_own
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy listing_photos_obj_update_own
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy listing_photos_obj_delete_own
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Owner may read own objects. Public read happens through short-lived signed
-- URLs minted server-side for published listings, so no anon select policy
-- is granted on the bucket directly.
create policy listing_photos_obj_select_own
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
