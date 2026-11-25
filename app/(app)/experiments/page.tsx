import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  EXPERIMENT_SUGGESTIONS,
  type ExperimentRow,
  themeMeta,
} from "@/lib/experiments";
import { CustomExperiment } from "@/components/experiments/CustomExperiment";
import {
  startExperiment,
  reflectOnExperiment,
  releaseExperiment,
  reactivateExperiment,
  deleteExperiment,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function ExperimentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: rows }, { data: profile }] = await Promise.all([
    supabase
      .from("ic_exercise_responses")
      .select("id, data, created_at, updated_at")
      .eq("exercise_slug", "experiment")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("ic_profiles")
      .select("faith_enabled")
      .eq("id", user?.id ?? "")
      .maybeSingle(),
  ]);

  const all = (rows ?? []) as ExperimentRow[];
  const active = all.filter((r) => r.data.status === "active");
  const past = all.filter((r) => r.data.status !== "active");
  const faithOn = profile?.faith_enabled ?? false;

  const suggestions = EXPERIMENT_SUGGESTIONS.filter(
    (s) => faithOn || s.theme !== "faith",
  );

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Small experiments</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Reflection grows roots when it meets real life. Pick one small thing to
          try — then come back and notice how it went. No streaks, no grading;
          this is about self-trust, not getting it perfect.
        </p>
      </div>

      {/* Active experiments */}
      {active.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-dusk">In progress</h2>
          {active.map((r) => {
            const tm = themeMeta(r.data.theme);
            return (
              <div
                key={r.id}
                className="rounded-2xl border border-clay-soft bg-surface p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-ink">{r.data.prompt}</p>
                  {tm ? (
                    <span className="shrink-0 text-xs text-ink-soft">
                      {tm.emoji} {tm.label}
                    </span>
                  ) : null}
                </div>
                <form
                  action={reflectOnExperiment.bind(null, r.id)}
                  className="mt-3 space-y-2"
                >
                  <textarea
                    name="reflection"
                    rows={2}
                    placeholder="How did it go? What did you notice? (optional)"
                    className="w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-clay"
                  />
                  <button className="rounded-xl bg-clay px-4 py-2 text-xs font-semibold text-white transition hover:brightness-105">
                    I tried it — save reflection
                  </button>
                </form>
                <div className="mt-2 flex items-center gap-3">
                  <form action={releaseExperiment.bind(null, r.id)}>
                    <button className="text-xs text-ink-soft transition hover:text-ink">
                      Let it go
                    </button>
                  </form>
                  <form action={deleteExperiment.bind(null, r.id)}>
                    <button className="text-xs text-ink-soft transition hover:text-clay">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </section>
      ) : null}

      {/* Choose a new experiment */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-dusk">Choose something to try</h2>
        <div className="space-y-2">
          {suggestions.map((s) => {
            const tm = themeMeta(s.theme);
            return (
              <form
                key={s.prompt}
                action={startExperiment}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm"
              >
                <input type="hidden" name="prompt" value={s.prompt} />
                <input type="hidden" name="theme" value={s.theme} />
                <span className="text-sm text-ink">
                  {tm ? `${tm.emoji} ` : ""}
                  {s.prompt}
                </span>
                <button className="shrink-0 rounded-xl border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-dusk transition hover:text-ink">
                  Try this
                </button>
              </form>
            );
          })}
        </div>
        <CustomExperiment faithOn={faithOn} />
      </section>

      {/* Past experiments */}
      {past.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-dusk">Looking back</h2>
          {past.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-line bg-surface-2 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-ink">{r.data.prompt}</p>
                <span className="shrink-0 text-xs font-medium text-ink-soft">
                  {r.data.status === "reflected" ? "Reflected" : "Let go"}
                </span>
              </div>
              {r.data.reflection ? (
                <p className="mt-2 text-sm text-ink-soft">{r.data.reflection}</p>
              ) : null}
              <div className="mt-2 flex items-center gap-3">
                <form action={reactivateExperiment.bind(null, r.id)}>
                  <button className="text-xs text-dusk transition hover:underline">
                    Try again
                  </button>
                </form>
                <form action={deleteExperiment.bind(null, r.id)}>
                  <button className="text-xs text-ink-soft transition hover:text-clay">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      <p className="text-center text-xs text-ink-soft">
        <Link href="/explore" className="text-dusk hover:underline">
          ← Back to Explore
        </Link>
      </p>
    </div>
  );
}
