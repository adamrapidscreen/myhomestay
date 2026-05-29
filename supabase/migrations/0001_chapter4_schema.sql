-- MyHomestay Build Chapter 4 - Schema
-- Migration 0001: enums, tables, indexes, updated_at trigger.
-- Authored under _planning/security-gate-chapter-4.md. RLS lives in 0002.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.user_role as enum ('owner', 'admin');

create type public.listing_status as enum (
  'draft',
  'published',
  'paused',
  'needs_review'
);

create type public.photo_category as enum (
  'exterior',
  'bedroom',
  'bathroom',
  'kitchen',
  'living',
  'surrounding',
  'other'
);

create type public.malaysian_state as enum (
  'johor',
  'kedah',
  'kelantan',
  'melaka',
  'negeri-sembilan',
  'pahang',
  'perak',
  'perlis',
  'pulau-pinang',
  'sabah',
  'sarawak',
  'selangor',
  'terengganu',
  'wp-kuala-lumpur',
  'wp-labuan',
  'wp-putrajaya'
);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  display_name text not null default '',
  whatsapp_number text not null default '',
  region_label text,
  role public.user_role not null default 'owner',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint display_name_len check (char_length(display_name) <= 60),
  constraint full_name_len check (char_length(full_name) <= 120),
  constraint whatsapp_len check (char_length(whatsapp_number) <= 24)
);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- listings
-- ---------------------------------------------------------------------------

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null default '',
  summary text not null default '',
  description text not null default '',
  capacity integer not null default 0,
  bedrooms integer not null default 0,
  location_area text not null default '',
  location_town text,
  location_state public.malaysian_state not null default 'selangor',
  location_postcode text,
  price_currency text not null default 'MYR',
  price_min_per_night numeric(10, 2) not null default 0,
  price_max_per_night numeric(10, 2) not null default 0,
  amenities text[] not null default '{}',
  house_rules text[] not null default '{}',
  muslim_friendly boolean not null default false,
  family_friendly boolean not null default false,
  status public.listing_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint name_len check (char_length(name) <= 80),
  constraint summary_len check (char_length(summary) <= 240),
  constraint capacity_nonneg check (capacity >= 0),
  constraint bedrooms_nonneg check (bedrooms >= 0),
  constraint price_currency_myr check (price_currency = 'MYR'),
  constraint price_nonneg check (
    price_min_per_night >= 0 and price_max_per_night >= 0
  )
);

create trigger trg_listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

-- Owner dashboard reads listings by owner.
create index idx_listings_owner_id on public.listings (owner_id);

-- Public directory reads only published listings; partial index keeps it tight.
create index idx_listings_published
  on public.listings (status)
  where status = 'published';

-- ---------------------------------------------------------------------------
-- listing_photos
-- ---------------------------------------------------------------------------

create table public.listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  src text not null,
  alt text not null default '',
  category public.photo_category not null default 'other',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_listing_photos_listing_id
  on public.listing_photos (listing_id);

-- ---------------------------------------------------------------------------
-- listing_metrics (1:1 with listings)
-- ---------------------------------------------------------------------------

create table public.listing_metrics (
  listing_id uuid primary key
    references public.listings (id) on delete cascade,
  views integer not null default 0,
  whatsapp_clicks integer not null default 0,
  last_updated_at timestamptz not null default now(),
  constraint views_nonneg check (views >= 0),
  constraint clicks_nonneg check (whatsapp_clicks >= 0)
);

-- ---------------------------------------------------------------------------
-- admin_review (admin-only audit of moderation actions)
-- ---------------------------------------------------------------------------

create table public.admin_review (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  admin_id uuid not null references public.profiles (id),
  action text not null,
  note text,
  created_at timestamptz not null default now(),
  constraint action_allowed check (action in ('pause', 'needs_review', 'note', 'clear'))
);

create index idx_admin_review_listing_id
  on public.admin_review (listing_id);
