-- Inner Compass — Milestone 5: Learn library
-- Global resources (read-only to users) are SEPARATE from private user data
-- (bookmarks, notes). Shared-project safe: ic_ prefix, RLS deny-by-default.
-- (Applied via Supabase MCP apply_migration; this file is the versioned copy.)

create table if not exists public.ic_resources (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  creator          text,
  organization     text,
  type             text not null
                   check (type in ('article','research','guideline','video','website','workbook')),
  url              text not null,
  youtube_id       text,
  topics           text[] not null default '{}',
  summary          text not null,
  approach         text,
  evidence_level   text
                   check (evidence_level in ('evidence-based','evidence-informed','official-guidance','general-wellness')),
  related_exercise text,
  published_on     date,
  reviewed_on      date not null default current_date,
  created_at       timestamptz not null default now()
);

alter table public.ic_resources enable row level security;

drop policy if exists "ic_resources_read" on public.ic_resources;
create policy "ic_resources_read" on public.ic_resources
  for select to authenticated using (true);

create table if not exists public.ic_resource_bookmarks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  resource_id uuid not null references public.ic_resources (id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, resource_id)
);

alter table public.ic_resource_bookmarks enable row level security;

drop policy if exists "ic_bookmarks_select_own" on public.ic_resource_bookmarks;
create policy "ic_bookmarks_select_own" on public.ic_resource_bookmarks
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "ic_bookmarks_insert_own" on public.ic_resource_bookmarks;
create policy "ic_bookmarks_insert_own" on public.ic_resource_bookmarks
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "ic_bookmarks_delete_own" on public.ic_resource_bookmarks;
create policy "ic_bookmarks_delete_own" on public.ic_resource_bookmarks
  for delete to authenticated using (auth.uid() = user_id);

create table if not exists public.ic_resource_notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  resource_id uuid not null references public.ic_resources (id) on delete cascade,
  note        text not null,
  updated_at  timestamptz not null default now(),
  unique (user_id, resource_id)
);

alter table public.ic_resource_notes enable row level security;

drop policy if exists "ic_notes_select_own" on public.ic_resource_notes;
create policy "ic_notes_select_own" on public.ic_resource_notes
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "ic_notes_insert_own" on public.ic_resource_notes;
create policy "ic_notes_insert_own" on public.ic_resource_notes
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "ic_notes_update_own" on public.ic_resource_notes;
create policy "ic_notes_update_own" on public.ic_resource_notes
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "ic_notes_delete_own" on public.ic_resource_notes;
create policy "ic_notes_delete_own" on public.ic_resource_notes
  for delete to authenticated using (auth.uid() = user_id);

drop trigger if exists ic_notes_set_updated_at on public.ic_resource_notes;
create trigger ic_notes_set_updated_at
  before update on public.ic_resource_notes
  for each row execute function public.ic_set_updated_at();

-- Seed and feature flag are applied in the MCP migration; the seed is curated
-- reputable landing pages with original summaries (no fabricated citations).
update public.ic_feature_flags set enabled = true, updated_at = now() where key = 'library';
