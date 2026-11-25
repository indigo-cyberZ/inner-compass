-- Inner Compass — Milestone 4: guided exercises
-- One flexible table holds responses for every exercise type. Each exercise
-- defines its own fields in code and stores them in `data` (jsonb), so new
-- exercises need no schema change. Shared-project safe, RLS deny-by-default.

create table if not exists public.ic_exercise_responses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  exercise_slug text not null,
  data          jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.ic_exercise_responses enable row level security;

drop policy if exists "ic_exercise_select_own" on public.ic_exercise_responses;
create policy "ic_exercise_select_own" on public.ic_exercise_responses
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "ic_exercise_insert_own" on public.ic_exercise_responses;
create policy "ic_exercise_insert_own" on public.ic_exercise_responses
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "ic_exercise_update_own" on public.ic_exercise_responses;
create policy "ic_exercise_update_own" on public.ic_exercise_responses
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "ic_exercise_delete_own" on public.ic_exercise_responses;
create policy "ic_exercise_delete_own" on public.ic_exercise_responses
  for delete to authenticated using (auth.uid() = user_id);

create index if not exists ic_exercise_user_slug_idx
  on public.ic_exercise_responses (user_id, exercise_slug, created_at desc);

drop trigger if exists ic_exercise_set_updated_at on public.ic_exercise_responses;
create trigger ic_exercise_set_updated_at
  before update on public.ic_exercise_responses
  for each row execute function public.ic_set_updated_at();

update public.ic_feature_flags set enabled = true, updated_at = now()
  where key = 'exercises';
