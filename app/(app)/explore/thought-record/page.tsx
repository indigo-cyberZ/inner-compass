import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ExerciseResponse, ThoughtRecordData } from "@/lib/exercises";
import { ThoughtRecord } from "@/components/exercises/ThoughtRecord";
import { deleteThoughtRecord } from "./actions";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ThoughtRecordPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ic_exercise_responses")
    .select("id, exercise_slug, data, created_at, updated_at")
    .eq("exercise_slug", "thought-record")
    .order("created_at", { ascending: false })
    .limit(20);

  const past = (data ?? []) as ExerciseResponse[];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/explore" className="text-sm text-dusk hover:underline">
        ← Explore
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-ink">Thought record</h1>
        <p className="mt-1 text-sm text-ink-soft">
          A CBT tool for looking at a painful thought with a little more
          distance.
        </p>
      </div>

      {/* Progressive disclosure intro */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-dusk">Quick overview</h2>
        <p className="mt-1 text-ink">
          When a situation stirs up a strong feeling, it&apos;s often driven by a
          fast, automatic thought. A thought record slows that down: you name the
          thought, weigh the evidence for and against it, and find a more balanced
          view.
        </p>

        <details className="group mt-4">
          <summary className="cursor-pointer text-sm font-medium text-dusk">
            Why it matters
          </summary>
          <p className="mt-2 text-sm text-ink-soft">
            Automatic thoughts feel like facts, but they&apos;re interpretations —
            and often skewed when we&apos;re distressed. Examining them
            (sometimes called cognitive restructuring) is a core, well-studied
            part of cognitive behavioral therapy. The goal isn&apos;t forced
            positivity; it&apos;s a fairer, kinder read of the situation.
          </p>
        </details>

        <details className="group mt-3">
          <summary className="cursor-pointer text-sm font-medium text-dusk">
            A quick example
          </summary>
          <p className="mt-2 text-sm text-ink-soft">
            Situation: a friend didn&apos;t reply all day. Automatic thought:
            &ldquo;They&apos;re upset with me.&rdquo; Evidence against: they were
            traveling; they&apos;ve been warm lately. Balanced thought:
            &ldquo;It&apos;s more likely they&apos;re just busy — I can check in
            without assuming the worst.&rdquo;
          </p>
        </details>

      </section>

      <ThoughtRecord />

      {past.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-dusk">Your past records</h2>
          <ul className="space-y-3">
            {past.map((r) => {
              const dd = r.data as ThoughtRecordData;
              return (
                <li
                  key={r.id}
                  className="rounded-2xl border border-line bg-surface p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-ink">
                      {dd.situation || "Untitled situation"}
                    </p>
                    <span className="shrink-0 text-xs text-ink-soft">
                      {fmt(r.created_at)}
                    </span>
                  </div>
                  {dd.balancedThought ? (
                    <p className="mt-2 text-sm text-ink-soft">
                      <span className="font-medium text-ink">Balanced:</span>{" "}
                      {dd.balancedThought}
                    </p>
                  ) : null}
                  {dd.emotion ? (
                    <p className="mt-1 text-xs text-ink-soft">
                      {dd.emotion}: {dd.intensityBefore} → {dd.intensityAfter}
                    </p>
                  ) : null}
                  <form action={deleteThoughtRecord.bind(null, r.id)} className="mt-2">
                    <button className="text-xs text-ink-soft transition hover:text-clay">
                      Delete
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
