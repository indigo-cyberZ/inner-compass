-- Inner Compass — Milestone 3: emotional check-ins + gentle intentions
-- Shared-project safe: ic_ prefix, public schema, RLS deny-by-default.

-- ---------------------------------------------------------------------------
-- ic_check_ins: never mandatory; every field is optional.
-- ---------------------------------------------------------------------------
create table if not exists public.ic_check_ins (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  overall_mood  smallint check (overall_mood between 1 and 5),
  emotions      text[] not null default '{}',
  intensity     smallint check (intensity between 1 and 5),
  stress_level  smallint check (stress_level between 1 and 5),
  energy_level  smallint check (energy_level between 1 and 5),
  note          text,   -- what's influencing how I feel
  need          text,   -- what I feel I need right now
  created_at    timestamptz not null default now()
);

alter table public.ic_check_ins enable row level security;

drop policy if exists "ic_check_ins_select_own" on public.ic_check_ins;
create policy "ic_check_ins_select_own" on public.ic_check_ins
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "ic_check_ins_insert_own" on public.ic_check_ins;
create policy "ic_check_ins_insert_own" on public.ic_check_ins
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "ic_check_ins_delete_own" on public.ic_check_ins;
create policy "ic_check_ins_delete_own" on public.ic_check_ins
  for delete to authenticated using (auth.uid() = user_id);

create index if not exists ic_check_ins_user_time_idx
  on public.ic_check_ins (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- ic_intentions: gentle; no streaks, no scoring. status is self-paced.
-- ---------------------------------------------------------------------------
create table if not exists public.ic_intentions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  body        text not null,
  status      text not null default 'active'
              check (status in ('active', 'completed', 'released')),
  reflection  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.ic_intentions enable row level security;

drop policy if exists "ic_intentions_select_own" on public.ic_intentions;
create policy "ic_intentions_select_own" on public.ic_intentions
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "ic_intentions_insert_own" on public.ic_intentions;
create policy "ic_intentions_insert_own" on public.ic_intentions
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "ic_intentions_update_own" on public.ic_intentions;
create policy "ic_intentions_update_own" on public.ic_intentions
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "ic_intentions_delete_own" on public.ic_intentions;
create policy "ic_intentions_delete_own" on public.ic_intentions
  for delete to authenticated using (auth.uid() = user_id);

create index if not exists ic_intentions_user_status_idx
  on public.ic_intentions (user_id, status, created_at desc);

drop trigger if exists ic_intentions_set_updated_at on public.ic_intentions;
create trigger ic_intentions_set_updated_at
  before update on public.ic_intentions
  for each row execute function public.ic_set_updated_at();

-- Mark features shipped.
update public.ic_feature_flags set enabled = true, updated_at = now()
  where key in ('check_ins', 'intentions');
