import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  type Resource,
  EVIDENCE_META,
  TYPE_LABEL,
} from "@/lib/resources";
import { ResourceNote } from "@/components/learn/ResourceNote";
import { toggleBookmark } from "./actions";

export const dynamic = "force-dynamic";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; saved?: string }>;
}) {
  const { q, saved } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const onlySaved = saved === "1";

  const supabase = await createClient();
  const [{ data: resourceRows }, { data: bookmarkRows }, { data: noteRows }] =
    await Promise.all([
      supabase
        .from("ic_resources")
        .select("*")
        .order("organization", { ascending: true }),
      supabase.from("ic_resource_bookmarks").select("resource_id"),
      supabase.from("ic_resource_notes").select("resource_id, note"),
    ]);

  const resources = (resourceRows ?? []) as Resource[];
  const bookmarked = new Set((bookmarkRows ?? []).map((b) => b.resource_id));
  const notes = new Map(
    (noteRows ?? []).map((n) => [n.resource_id as string, n.note as string]),
  );

  const filtered = resources.filter((r) => {
    if (onlySaved && !bookmarked.has(r.id)) return false;
    if (!query) return true;
    const hay = [
      r.title,
      r.summary,
      r.organization ?? "",
      r.creator ?? "",
      r.approach ?? "",
      ...r.topics,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Learn</h1>
        <p className="mt-1 text-sm text-ink-soft">
          A small, curated set of reputable resources. We link to official
          sources and don&apos;t reproduce their content.
        </p>
      </div>

      <form method="get" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search resources…"
          aria-label="Search resources"
          className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-ink outline-none transition focus:border-clay"
        />
        <button className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:text-ink">
          Search
        </button>
      </form>

      <div className="flex gap-2 text-sm">
        <Link
          href="/learn"
          className={`rounded-full px-3 py-1 ${!onlySaved ? "bg-clay/15 text-clay" : "text-ink-soft hover:text-ink"}`}
        >
          All
        </Link>
        <Link
          href="/learn?saved=1"
          className={`rounded-full px-3 py-1 ${onlySaved ? "bg-clay/15 text-clay" : "text-ink-soft hover:text-ink"}`}
        >
          Bookmarked
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-soft">
          {onlySaved
            ? "No bookmarks yet — tap the bookmark on a resource to save it."
            : "No resources match your search."}
        </p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((r) => {
            const ev = r.evidence_level
              ? EVIDENCE_META[r.evidence_level]
              : null;
            const isSaved = bookmarked.has(r.id);
            return (
              <li
                key={r.id}
                className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-ink">{r.title}</h2>
                    <p className="text-xs text-ink-soft">
                      {[r.creator, r.organization].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <form action={toggleBookmark.bind(null, r.id)}>
                    <button
                      aria-label={isSaved ? "Remove bookmark" : "Bookmark"}
                      aria-pressed={isSaved}
                      className={`rounded-lg px-2 py-1 text-lg transition ${
                        isSaved ? "text-clay" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      {isSaved ? "★" : "☆"}
                    </button>
                  </form>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-ink-soft">
                    {TYPE_LABEL[r.type]}
                  </span>
                  {ev ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs ${ev.tone}`}>
                      {ev.label}
                    </span>
                  ) : null}
                  {r.approach ? (
                    <span className="rounded-full bg-dusk/10 px-2 py-0.5 text-xs text-dusk">
                      {r.approach}
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-sm text-ink-soft">{r.summary}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-clay hover:underline"
                  >
                    Open original ↗
                  </a>
                  {r.related_exercise ? (
                    <Link
                      href={`/explore/${r.related_exercise}`}
                      className="font-medium text-dusk hover:underline"
                    >
                      Try a related exercise →
                    </Link>
                  ) : null}
                </div>

                <ResourceNote resourceId={r.id} initial={notes.get(r.id) ?? ""} />
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-center text-xs text-ink-soft">
        Curated from reputable organizations. Links are checked as the library
        grows; if one is broken, it&apos;ll be replaced.
      </p>
    </div>
  );
}
