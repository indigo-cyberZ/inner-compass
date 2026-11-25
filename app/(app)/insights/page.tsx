import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  type CheckIn,
  moodScaleMeta,
  formatDateTime,
  MOOD_SCALE,
} from "@/lib/checkin";
import type { Intention } from "@/lib/intentions";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const supabase = await createClient();

  const [{ data: checkInRows }, { data: intentionRows }] = await Promise.all([
    supabase
      .from("ic_check_ins")
      .select("id, overall_mood, emotions, intensity, stress_level, energy_level, note, need, created_at")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase.from("ic_intentions").select("id, status"),
  ]);

  const checkIns = (checkInRows ?? []) as CheckIn[];
  const intentions = (intentionRows ?? []) as Pick<Intention, "id" | "status">[];

  const counts = {
    active: intentions.filter((i) => i.status === "active").length,
    completed: intentions.filter((i) => i.status === "completed").length,
    released: intentions.filter((i) => i.status === "released").length,
  };

  // Mood trend: oldest → newest, only check-ins that recorded a mood.
  const moodSeries = [...checkIns]
    .reverse()
    .filter((c) => c.overall_mood != null)
    .slice(-14);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Insights</h1>
        <p className="mt-1 text-sm text-ink-soft">
          A gentle look back — patterns to notice with curiosity, never a score
          or a diagnosis.
        </p>
      </div>

      {/* Mood trend */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="font-semibold text-ink">Mood over recent check-ins</h2>
        {moodSeries.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">
            Once you record a few check-ins, a simple trend will appear here.
          </p>
        ) : (
          <>
            <div className="mt-4 flex items-end gap-1.5" aria-hidden>
              {moodSeries.map((c) => {
                const m = c.overall_mood ?? 0;
                return (
                  <div
                    key={c.id}
                    className="flex-1 rounded-t bg-clay/70"
                    style={{ height: `${(m / 5) * 72 + 8}px` }}
                    title={`${moodScaleMeta(m)?.label ?? ""} — ${formatDateTime(c.created_at)}`}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-xs text-ink-soft">
              <span>Older</span>
              <span>Recent</span>
            </div>
            <p className="mt-3 text-xs text-ink-soft">
              Scale: 1 ({MOOD_SCALE[0].label}) → 5 ({MOOD_SCALE[4].label}). Ups and
              downs are part of being human.
            </p>
          </>
        )}
      </section>

      {/* Intentions summary */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-ink">Intentions</h2>
          <Link href="/intentions" className="text-sm text-dusk hover:underline">
            Manage
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-surface-2 p-3">
            <div className="text-2xl font-bold text-ink">{counts.active}</div>
            <div className="text-xs text-ink-soft">Active</div>
          </div>
          <div className="rounded-2xl bg-surface-2 p-3">
            <div className="text-2xl font-bold text-ink">{counts.completed}</div>
            <div className="text-xs text-ink-soft">Lived into</div>
          </div>
          <div className="rounded-2xl bg-surface-2 p-3">
            <div className="text-2xl font-bold text-ink">{counts.released}</div>
            <div className="text-xs text-ink-soft">Let go</div>
          </div>
        </div>
      </section>

      {/* Check-in history */}
      <section>
        <h2 className="mb-3 font-semibold text-ink">Recent check-ins</h2>
        {checkIns.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-ink-soft">
            No check-ins yet.{" "}
            <Link href="/checkin" className="text-dusk hover:underline">
              Start one
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-3">
            {checkIns.map((c) => {
              const m = moodScaleMeta(c.overall_mood);
              return (
                <li
                  key={c.id}
                  className="rounded-2xl border border-line bg-surface p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-ink">
                      {m ? `${m.emoji} ${m.label}` : "Checked in"}
                    </span>
                    <span className="text-xs text-ink-soft">
                      {formatDateTime(c.created_at)}
                    </span>
                  </div>
                  {c.emotions.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.emotions.map((e) => (
                        <span
                          key={e}
                          className="rounded-full bg-sage/15 px-2 py-0.5 text-xs text-ink-soft"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {c.note ? (
                    <p className="mt-2 text-sm text-ink-soft">{c.note}</p>
                  ) : null}
                  {c.need ? (
                    <p className="mt-1 text-sm text-ink-soft">
                      <span className="font-medium text-ink">Needs:</span> {c.need}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
