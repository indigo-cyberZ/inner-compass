-- Inner Compass — Milestone 1 schema (SHARED-PROJECT SAFE variant)
--
-- This project is SHARED with another live app (my-perfume-studio), so this
-- migration is written to be collision-proof and non-destructive:
--   * All tables live in `public` but are prefixed `ic_` to avoid name clashes.
--   * NO trigger is added to auth.users (the other app may rely on its own).
--     Profiles are created lazily by the app on first authenticated load.
--   * Everything is idempotent (create ... if not exists) and additive.
--   * RLS denies by default; each user can touch only their own rows.
--
-- NOTE: auth users are shared across both apps in this project. RLS keeps each
-- user's Inner Compass rows private, but this is not true database isolation.
-- A dedicated project remains the recommended setup.

-- ---------------------------------------------------------------------------
-- Role enum (prefixed to avoid colliding with any existing type).
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'ic_app_role') then
    create type public.ic_app_role as enum ('owner', 'standard');
  end if;
end$$;

-- ---------------------------------------------------------------------------
-- ic_profiles: 1:1 with auth.users. Non-sensitive preferences only.
-- ---------------------------------------------------------------------------
create table if not exists public.ic_profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text,
  role          public.ic_app_role not null default 'standard',
  explain_level text not null default 'concise'
                check (explain_level in ('concise', 'standard', 'detailed')),
  faith_enabled boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.ic_profiles enable row level security;

-- Read only your own profile.
drop policy if exists "ic_profiles_select_own" on public.ic_profiles;
create policy "ic_profiles_select_own"
  on public.ic_profiles for select
  using (auth.uid() = id);

-- Insert only your own profile row (supports lazy creation by the app).
drop policy if exists "ic_profiles_insert_own" on public.ic_profiles;
create policy "ic_profiles_insert_own"
  on public.ic_profiles for insert
  with check (auth.uid() = id);

-- Update only your own profile, and never escalate your own role.
drop policy if exists "ic_profiles_update_own" on public.ic_profiles;
create policy "ic_profiles_update_own"
  on public.ic_profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.ic_profiles where id = auth.uid())
  );
-- (No DELETE policy for end users; rows are removed via auth cascade.)

-- ---------------------------------------------------------------------------
-- ic_feature_flags: gate not-yet-ready features. Readable by signed-in users;
-- writable only by trusted server code (no write policy = client cannot write).
-- ---------------------------------------------------------------------------
create table if not exists public.ic_feature_flags (
  key         text primary key,
  enabled     boolean not null default false,
  description text,
  updated_at  timestamptz not null default now()
);

alter table public.ic_feature_flags enable row level security;

drop policy if exists "ic_feature_flags_read" on public.ic_feature_flags;
create policy "ic_feature_flags_read"
  on public.ic_feature_flags for select
  to authenticated
  using (true);

insert into public.ic_feature_flags (key, enabled, description) values
  ('journal',        false, 'Private journal CRUD'),
  ('check_ins',      false, 'Emotional check-ins'),
  ('intentions',     false, 'Gentle intentions'),
  ('exercises',      false, 'Guided self-discovery exercises'),
  ('library',        false, 'Curated resource library'),
  ('ai_companion',   false, 'AI reflection companion'),
  ('faith_features', false, 'Faith & spiritual growth features')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- updated_at helper (prefixed; safe to coexist with the other app).
-- ---------------------------------------------------------------------------
create or replace function public.ic_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ic_profiles_set_updated_at on public.ic_profiles;
create trigger ic_profiles_set_updated_at
  before update on public.ic_profiles
  for each row execute function public.ic_set_updated_at();
