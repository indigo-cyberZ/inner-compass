"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { ThoughtRecordData } from "@/lib/exercises";
import { saveThoughtRecord } from "@/app/(app)/explore/thought-record/actions";

function Field({
  label,
  hint,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink">{label}</label>
      <p className="mb-1.5 text-xs text-ink-soft">{hint}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
      />
    </div>
  );
}

function Intensity({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-ink">{label}</label>
        <span className="text-sm font-medium text-clay">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-clay"
        aria-label={label}
      />
      <div className="flex justify-between text-xs text-ink-soft">
        <span>Barely</span>
        <span>Completely</span>
      </div>
    </div>
  );
}

const EMPTY: ThoughtRecordData = {
  situation: "",
  thoughts: "",
  emotion: "",
  intensityBefore: 50,
  evidenceFor: "",
  evidenceAgainst: "",
  balancedThought: "",
  intensityAfter: 50,
};

export function ThoughtRecord() {
  const [d, setD] = useState<ThoughtRecordData>(EMPTY);
  const [done, setDone] = useState<ThoughtRecordData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const set = <K extends keyof ThoughtRecordData>(
    key: K,
    v: ThoughtRecordData[K],
  ) => setD((prev) => ({ ...prev, [key]: v }));

  const canSave = d.situation.trim() !== "" || d.thoughts.trim() !== "";

  function save() {
    setError(null);
    start(async () => {
      const res = await saveThoughtRecord(d);
      if (res.ok) setDone(d);
      else setError(res.error ?? "Something went wrong.");
    });
  }

  if (done) {
    const shift = done.intensityBefore - done.intensityAfter;
    return (
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <div aria-hidden className="mb-2 text-3xl">
          🌤️
        </div>
        <h2 className="text-lg font-bold text-ink">Saved — nicely done.</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Noticing a thought and looking at it honestly is real work.
        </p>

        {done.balancedThought.trim() ? (
          <div className="mt-4 rounded-2xl bg-sage/10 p-4">
            <p className="text-xs font-medium text-dusk">
              Your more balanced perspective
            </p>
            <p className="mt-1 text-ink">{done.balancedThought}</p>
          </div>
        ) : null}

        {done.emotion.trim() ? (
          <p className="mt-4 text-sm text-ink-soft">
            {done.emotion}: {done.intensityBefore} → {done.intensityAfter}
            {shift > 0
              ? ` (eased by ${shift})`
              : shift < 0
                ? " (a bit stronger — that's okay too)"
                : " (unchanged — and that's okay)"}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setD(EMPTY);
              setDone(null);
            }}
            className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
          >
            Do another
          </button>
          <Link
            href="/explore"
            className="rounded-2xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:text-ink"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-5 rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <Field
          label="1. What happened?"
          hint="The situation, briefly — where you were, who was there, what was going on."
          value={d.situation}
          onChange={(v) => set("situation", v)}
        />
        <Field
          label="2. What went through your mind?"
          hint="The automatic thoughts — the words or images, just as they came."
          value={d.thoughts}
          onChange={(v) => set("thoughts", v)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-ink">
              3. What did you feel?
            </label>
            <p className="mb-1.5 text-xs text-ink-soft">One main emotion is fine.</p>
            <input
              value={d.emotion}
              onChange={(e) => set("emotion", e.target.value)}
              placeholder="e.g. anxious, sad, ashamed"
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
            />
          </div>
          <Intensity
            label="How strong?"
            value={d.intensityBefore}
            onChange={(v) => set("intensityBefore", v)}
          />
        </div>
      </section>

      <section className="space-y-5 rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <Field
          label="4. What supports this thought?"
          hint="Facts that seem to back it up — not feelings, but what you'd point to."
          value={d.evidenceFor}
          onChange={(v) => set("evidenceFor", v)}
        />
        <Field
          label="5. What doesn't fit this thought?"
          hint="Facts that complicate it, times it wasn't true, what you'd tell a friend."
          value={d.evidenceAgainst}
          onChange={(v) => set("evidenceAgainst", v)}
        />
        <Field
          label="6. A more balanced way to see it"
          hint="Not forced positivity — something truer and kinder that holds both sides."
          value={d.balancedThought}
          onChange={(v) => set("balancedThought", v)}
        />
        <Intensity
          label="Now, how strong is the feeling?"
          value={d.intensityAfter}
          onChange={(v) => set("intensityAfter", v)}
        />
      </section>

      {error ? (
        <p role="alert" className="rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={pending || !canSave}
          className="rounded-2xl bg-clay px-6 py-3 font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-50 ease-gentle"
        >
          {pending ? "Saving…" : "Save thought record"}
        </button>
        <Link href="/explore" className="text-sm text-ink-soft hover:text-ink">
          Cancel
        </Link>
      </div>
    </div>
  );
}
