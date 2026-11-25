import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  type JournalEntry,
  formatEntryDate,
  moodMeta,
  snippet,
} from "@/lib/journal";
import { createEntry } from "./actions";

export const dynamic = "force-dynamic";

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const supabase = await createClient();

  let request = supabase
    .from("ic_journal_entries")
    .select("id, title, body, mood, tags, ai_shareable, entry_date, created_at, updated_at")
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(200);

  if (query) {
    request = request.textSearch("search", query, { type: "websearch" });
  }

  const { data, error } = await request;
  const entries = (data ?? []) as JournalEntry[];

  // Group by entry_date for calendar-style browsing.
  const groups = new Map<string, JournalEntry[]>();
  for (const e of entries) {
    const list = groups.get(e.entry_date) ?? [];
    list.push(e);
    groups.set(e.entry_date, list);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Journal</h1>
          <p className="mt-1 text-sm text-ink-soft">Your private writing space.</p>
        </div>
        <form action={createEntry}>
          <button
            type="submit"
            className="rounded-2xl bg-clay px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
          >
            + New entry
          </button>
        </form>
      </div>

      <form method="get" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search your entries…"
          aria-label="Search entries"
          className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-ink outline-none transition focus:border-clay"
        />
        <button
          type="submit"
          className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:text-ink"
        >
          Search
        </button>
      </form>

      {error ? (
        <p className="rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">
          Couldn&apos;t load entries right now. Please try again.
        </p>
      ) : null}

      {entries.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line p-10 text-center text-sm text-ink-soft">
          {query
            ? `No entries match “${query}”.`
            : "Nothing here yet. When you're ready, start a new entry — there's no right way to do this."}
        </div>
      ) : (
        <div className="space-y-8">
          {[...groups.entries()].map(([date, items]) => (
            <section key={date}>
              <h2 className="mb-2 text-sm font-semibold text-dusk">
                {formatEntryDate(date)}
              </h2>
              <ul className="space-y-3">
                {items.map((e) => {
                  const mm = moodMeta(e.mood);
                  return (
                    <li key={e.id}>
                      <Link
                        href={`/journal/${e.id}`}
                        className="block rounded-2xl border border-line bg-surface p-4 shadow-sm transition hover:border-clay-soft"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold text-ink">
                            {e.title || "Untitled entry"}
                          </h3>
                          {mm ? (
                            <span
                              className="shrink-0 text-sm text-ink-soft"
                              title={mm.label}
                            >
                              {mm.emoji} {mm.label}
                            </span>
                          ) : null}
                        </div>
                        {e.body ? (
                          <p className="mt-1 text-sm text-ink-soft">
                            {snippet(e.body)}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm italic text-ink-soft/70">
                            Empty draft
                          </p>
                        )}
                        {e.tags.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {e.tags.map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-sage/15 px-2 py-0.5 text-xs text-ink-soft"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
