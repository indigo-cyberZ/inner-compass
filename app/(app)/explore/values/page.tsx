import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ValueRow } from "@/lib/values";
import { ValuesReflection } from "@/components/exercises/ValuesReflection";
import { ValueComposer } from "@/components/exercises/ValueComposer";
import { ValueCard } from "@/components/exercises/ValueCard";

export const dynamic = "force-dynamic";

export default async function ValuesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ic_exercise_responses")
    .select("id, data, created_at, updated_at")
    .eq("exercise_slug", "value")
    .order("created_at", { ascending: true })
    .limit(100);

  const values = (data ?? []) as ValueRow[];
  // Sort by importance (desc), then name.
  values.sort(
    (a, b) =>
      (b.data.importance ?? 0) - (a.data.importance ?? 0) ||
      a.data.name.localeCompare(b.data.name),
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/explore" className="text-sm text-dusk hover:underline">
        ← Explore
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-ink">Values discovery</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Your values aren&apos;t a list to pick from — they show up in what
          moves you. This is a way to notice them, in your own words.
        </p>
      </div>

      {/* Progressive-disclosure intro */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-dusk">Quick overview</h2>
        <p className="mt-1 text-ink">
          We&apos;ll walk through a few gentle reflections drawn from real
          moments in your life. Afterward, you decide which values feel like
          yours and add them to a map you can revisit and revise over time.
        </p>
        <details className="group mt-4">
          <summary className="cursor-pointer text-sm font-medium text-dusk">
            Why from experience, not a list?
          </summary>
          <p className="mt-2 text-sm text-ink-soft">
            Values chosen from a checklist can reflect what we think we{" "}
            <em>should</em> value. Drawing them from moments that actually moved
            you — an approach used in Acceptance and Commitment Therapy (ACT) —
            tends to surface what&apos;s genuinely yours. Nothing here is graded,
            and your values can change as you do.
          </p>
        </details>
      </section>

      <ValuesReflection />

      {/* Values map */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Your values map</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Only what you&apos;ve confirmed appears here. Edit, reorder by
            importance, or let any go — it&apos;s yours to shape.
          </p>
        </div>

        {values.length > 0 ? (
          <ul className="space-y-3">
            {values.map((v) => (
              <ValueCard key={v.id} value={v} />
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-ink-soft">
            Your map is empty for now. When a value feels like yours, add it
            below.
          </p>
        )}

        <ValueComposer />
      </section>
    </div>
  );
}
