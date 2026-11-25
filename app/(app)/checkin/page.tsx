"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { MOOD_SCALE, EMOTIONS } from "@/lib/checkin";
import { Scale } from "@/components/checkin/Scale";
import { createCheckIn } from "./actions";

export default function CheckInPage() {
  const [mood, setMood] = useState<number | null>(null);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [need, setNeed] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function toggleEmotion(e: string) {
    setEmotions((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e],
    );
  }

  function submit() {
    setError(null);
    start(async () => {
      const res = await createCheckIn({
        overall_mood: mood,
        emotions,
        intensity,
        stress_level: stress,
        energy_level: energy,
        note: note || null,
        need: need || null,
      });
      if (res.ok) setSaved(true);
      else setError(res.error ?? "Something went wrong.");
    });
  }

  if (saved) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-line bg-surface p-8 text-center shadow-sm">
          <div aria-hidden className="mb-3 text-4xl">
            🌿
          </div>
          <h1 className="text-xl font-bold text-ink">Thanks for checking in.</h1>
          <p className="mt-1 text-sm text-ink-soft">
            However you&apos;re feeling is okay. Here are a few gentle options —
            or none at all.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Link
              href="/journal"
              className="rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm font-medium text-ink transition hover:border-clay-soft"
            >
              📓 Write about it
            </Link>
            <Link
              href="/intentions"
              className="rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm font-medium text-ink transition hover:border-clay-soft"
            >
              🌱 Set a gentle intention
            </Link>
            <Link
              href="/insights"
              className="rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm font-medium text-ink transition hover:border-clay-soft"
            >
              📈 See your check-in history
            </Link>
            <Link
              href="/today"
              className="rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm font-medium text-ink transition hover:border-clay-soft"
            >
              ☀️ Back to Today
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">How are you, really?</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Share as much or as little as you like. Nothing here is required.
        </p>
      </div>

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <p className="mb-2 text-sm font-medium text-ink">
          Overall, how does today feel?
        </p>
        <div className="flex flex-wrap gap-2">
          {MOOD_SCALE.map((m) => {
            const active = mood === m.value;
            return (
              <button
                key={m.value}
                type="button"
                aria-pressed={active}
                onClick={() => setMood(active ? null : m.value)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  active
                    ? "border-clay bg-clay/15 text-clay"
                    : "border-line bg-surface text-ink-soft hover:text-ink"
                }`}
              >
                {m.emoji} {m.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <p className="mb-2 text-sm font-medium text-ink">
          Any emotions present? <span className="text-ink-soft">(optional)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((e) => {
            const active = emotions.includes(e);
            return (
              <button
                key={e}
                type="button"
                aria-pressed={active}
                onClick={() => toggleEmotion(e)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  active
                    ? "border-sage bg-sage/15 text-ink"
                    : "border-line bg-surface text-ink-soft hover:text-ink"
                }`}
              >
                {e}
              </button>
            );
          })}
        </div>
      </section>

      {!showMore ? (
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="text-sm font-medium text-dusk hover:underline"
        >
          + Add more detail (optional)
        </button>
      ) : (
        <section className="space-y-5 rounded-3xl border border-line bg-surface p-6 shadow-sm">
          {emotions.length > 0 ? (
            <Scale
              label="How strong are those feelings?"
              lowLabel="Gentle"
              highLabel="Intense"
              value={intensity}
              onChange={setIntensity}
            />
          ) : null}
          <Scale
            label="Stress level"
            lowLabel="Low"
            highLabel="High"
            value={stress}
            onChange={setStress}
          />
          <Scale
            label="Energy level"
            lowLabel="Depleted"
            highLabel="Energized"
            value={energy}
            onChange={setEnergy}
          />
          <div>
            <label htmlFor="note" className="mb-1 block text-sm font-medium text-ink">
              What&apos;s influencing how you feel?
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
            />
          </div>
          <div>
            <label htmlFor="need" className="mb-1 block text-sm font-medium text-ink">
              What do you feel you need right now?
            </label>
            <textarea
              id="need"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              rows={2}
              className="w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
            />
          </div>
        </section>
      )}

      {error ? (
        <p role="alert" className="rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="rounded-2xl bg-clay px-6 py-3 font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60 ease-gentle"
        >
          {pending ? "Saving…" : "Save check-in"}
        </button>
        <Link href="/today" className="text-sm text-ink-soft hover:text-ink">
          Skip for now
        </Link>
      </div>
    </div>
  );
}
