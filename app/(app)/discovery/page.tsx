import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  DISCOVERY_CATEGORIES,
  type DiscoveryItem,
} from "@/lib/discovery";
import type { ValueRow } from "@/lib/values";
import type { Intention } from "@/lib/intentions";
import { DiscoveryComposer } from "@/components/discovery/DiscoveryComposer";
import { DiscoveryItemCard } from "@/components/discovery/DiscoveryItemCard";

export const dynamic = "force-dynamic";

export default async function DiscoveryPage() {
  const supabase = await createClient();

  const [{ data: itemRows }, { data: valueRows }, { data: intentionRows }] =
    await Promise.all([
      supabase
        .from("ic_exercise_responses")
        .select("id, data, created_at, updated_at")
        .eq("exercise_slug", "discovery-item")
        .order("created_at", { ascending: true }),
      supabase
        .from("ic_exercise_responses")
        .select("id, data, created_at, updated_at")
        .eq("exercise_slug", "value"),
      supabase
        .from("ic_intentions")
        .select("id, body, status, reflection, created_at, updated_at")
        .eq("status", "active")
        .order("created_at", { ascending: false }),
    ]);

  const items = (itemRows ?? []) as DiscoveryItem[];
  const values = (valueRows ?? []) as ValueRow[];
  const intentions = (intentionRows ?? []) as Intention[];

  const byCategory = new Map<string, DiscoveryItem[]>();
  for (const it of items) {
    const list = byCategory.get(it.data.category) ?? [];
    list.push(it);
    byCategory.set(it.data.category, list);
  }

  const isEmpty =
    items.length === 0 && values.length === 0 && intentions.length === 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Your Discovery Map</h1>
        <p className="mt-1 text-sm text-ink-soft">
          A living picture of what you&apos;ve come to know about yourself —
          yours to shape, revisit, and revise. It&apos;s a work in progress, not
          a personality assessment or a fixed verdict.
        </p>
      </div>

      <p className="rounded-2xl bg-surface-2 px-4 py-3 text-xs text-ink-soft">
        Everything here is what <span className="font-medium text-ink">you</span>{" "}
        confirmed. (Inner Compass doesn&apos;t add AI suggestions yet — if it
        ever does, they&apos;ll be clearly marked and always yours to accept,
        edit, or reject.)
      </p>

      <DiscoveryComposer />

      {isEmpty ? (
        <div className="rounded-3xl border border-dashed border-line p-10 text-center text-sm text-ink-soft">
          Your map is empty for now. Add something above, or try{" "}
          <Link href="/explore/discover-who-i-am" className="text-dusk hover:underline">
            Discover who I am
          </Link>{" "}
          to get started.
        </div>
      ) : null}

      {/* Values (managed in Values discovery) */}
      {values.length > 0 ? (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-dusk">🧭 Values</h2>
            <Link
              href="/explore/values"
              className="text-xs text-dusk hover:underline"
            >
              Edit in Values discovery
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {values
              .slice()
              .sort(
                (a, b) =>
                  (b.data.importance ?? 0) - (a.data.importance ?? 0) ||
                  a.data.name.localeCompare(b.data.name),
              )
              .map((v) => (
                <span
                  key={v.id}
                  className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink shadow-sm"
                >
                  {v.data.name}
                </span>
              ))}
          </div>
        </section>
      ) : null}

      {/* Discovery items by category */}
      {DISCOVERY_CATEGORIES.map((c) => {
        const list = byCategory.get(c.key);
        if (!list || list.length === 0) return null;
        return (
          <section key={c.key}>
            <h2 className="mb-2 text-sm font-semibold text-dusk">
              {c.emoji} {c.label}
            </h2>
            <ul className="space-y-2">
              {list.map((it) => (
                <DiscoveryItemCard key={it.id} item={it} />
              ))}
            </ul>
          </section>
        );
      })}

      {/* Active intentions (managed in Intentions) */}
      {intentions.length > 0 ? (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-dusk">🌱 Active intentions</h2>
            <Link href="/intentions" className="text-xs text-dusk hover:underline">
              Manage
            </Link>
          </div>
          <ul className="space-y-2">
            {intentions.map((i) => (
              <li
                key={i.id}
                className="rounded-2xl border border-line bg-surface p-3 text-sm text-ink shadow-sm"
              >
                {i.body}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
