-- Inner Compass — Milestone 2: private journal
-- Shared-project safe: ic_ prefix, public schema, RLS deny-by-default.

create table if not exists public.ic_journal_entries (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text,
  body          text not null default '',
  mood          text,
  tags          text[] not null default '{}',
  -- Explicit per-entry consent for AI (defaults OFF; nothing is shared unless chosen).
  ai_shareable  boolean not null default false,
  entry_date    date not null default current_date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- Full-text search over title + body.
  search        tsvector generated always as (
                  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))
                ) stored
);

alter table public.ic_journal_entries enable row level security;

-- Each user can only see/create/edit/delete their OWN entries.
drop policy if exists "ic_journal_select_own" on public.ic_journal_entries;
create policy "ic_journal_select_own"
  on public.ic_journal_entries for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "ic_journal_insert_own" on public.ic_journal_entries;
create policy "ic_journal_insert_own"
  on public.ic_journal_entries for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "ic_journal_update_own" on public.ic_journal_entries;
create policy "ic_journal_update_own"
  on public.ic_journal_entries for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "ic_journal_delete_own" on public.ic_journal_entries;
create policy "ic_journal_delete_own"
  on public.ic_journal_entries for delete
  to authenticated
  using (auth.uid() = user_id);

-- Indexes for browsing and search.
create index if not exists ic_journal_user_date_idx
  on public.ic_journal_entries (user_id, entry_date desc, created_at desc);
create index if not exists ic_journal_search_idx
  on public.ic_journal_entries using gin (search);
create index if not exists ic_journal_tags_idx
  on public.ic_journal_entries using gin (tags);

drop trigger if exists ic_journal_set_updated_at on public.ic_journal_entries;
create trigger ic_journal_set_updated_at
  before update on public.ic_journal_entries
  for each row execute function public.ic_set_updated_at();

-- Mark the journal feature as shipped.
update public.ic_feature_flags set enabled = true, updated_at = now() where key = 'journal';
