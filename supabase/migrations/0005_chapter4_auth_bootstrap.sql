-- MyHomestay Build Chapter 4 - Auth bootstrap
-- Migration 0005: auto-create a profiles row when a new auth user is created.
-- Prevents the "authenticated user with no profile" state (T1-adjacent).
-- The app onboarding flow then fills display_name / whatsapp_number and sets
-- onboarding_complete = true. Role always defaults to 'owner'; never 'admin'.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, display_name, whatsapp_number)
  values (new.id, '', '', '')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function public.handle_new_user();
