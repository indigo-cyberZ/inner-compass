"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { BOUNDARY_STEPS, BOUNDARY_AREAS } from "@/lib/boundaries";
import { saveBoundary } from "@/app/(app)/explore/boundaries/actions";

export function BoundariesExplorer() {
  const [area, setArea] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const total = BOUNDARY_STEPS.length;
  const atEnd = step >= total;

  if (saved) {
    const boundary = answers["boundary"]?.trim();
    const communication = answers["communication"]?.trim();
    return (
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <div aria-hidden className="mb-2 text-3xl">
          🪴
        </div>
        <h2 className="text-lg font-bold text-ink">Saved. That took courage.</h2>
        {boundary ? (
          <div className="mt-4 rounded-2xl bg-sage/10 p-4">
            <p className="text-xs font-medium text-dusk">Your boundary</p>
            <p className="mt-1 text-ink">{boundary}</p>
          </div>
        ) : null}
        {communication ? (
          <div className="mt-3 rounded-2xl bg-surface-2 p-4">
            <p className="text-xs font-medium text-dusk">How you might say it</p>
            <p className="mt-1 text-ink">{communication}</p>
          </div>
        ) : null}
        <p className="mt-4 text-sm text-ink-soft">
          A reasonable boundary can hold even if the other person is disappointed
          or disagrees. Disagreement alone isn&apos;t a reason to abandon it —
          though you can always revisit it with new information.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setArea(null);
              setAnswers({});
              setStep(0);
              setReviewing(false);
              setSaved(false);
            }}
            className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
          >
            Explore another
          </button>
          <Link
            href="/explore"
            className="rounded-2xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:text-ink"
          >
            Back to Explore
          </Link>
        </div>
      </section>
    );
  }

  if (atEnd || reviewing) {
    return (
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Your reflection so far</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Nothing here is fixed — save it privately, or go back and adjust.
        </p>
        <dl className="mt-4 space-y-3">
          {area ? (
            <div>
              <dt className="text-xs font-medium text-dusk">Area</dt>
              <dd className="text-ink">{area}</dd>
            </div>
          ) : null}
          {BOUNDARY_STEPS.map((s) =>
            answers[s.key]?.trim() ? (
              <div key={s.key}>
                <dt className="text-xs font-medium text-dusk">{s.question}</dt>
                <dd className="whitespace-pre-wrap text-ink">{answers[s.key]}</dd>
              </div>
            ) : null,
          )}
        </dl>
        {error ? (
          <p role="alert" className="mt-3 text-sm text-clay">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            disabled={pending}
            onClick={() =>
              start(async () => {
                setError(null);
                const res = await saveBoundary({ area, answers });
                if (res.ok) setSaved(true);
                else setError(res.error ?? "Something went wrong.");
              })
            }
            className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60 ease-gentle"
          >
            {pending ? "Saving…" : "Save privately"}
          </button>
          <button
            onClick={() => {
              setReviewing(false);
              setStep(0);
            }}
            className="rounded-2xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:text-ink"
          >
            Go back and edit
          </button>
        </div>
      </section>
    );
  }

  const s = BOUNDARY_STEPS[step];
  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-dusk">
          Step {step + 1} of {total}
        </span>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-clay transition-all"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {step === 0 ? (
        <div className="mb-4">
          <p className="mb-1.5 text-sm font-medium text-ink">
            Which area is this about? <span className="text-ink-soft">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {BOUNDARY_AREAS.map((a) => {
              const active = area === a;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArea(active ? null : a)}
                  className={`rounded-full border px-2.5 py-1 text-xs transition ${
                    active
                      ? "border-clay bg-clay/15 text-clay"
                      : "border-line bg-surface text-ink-soft hover:text-ink"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <p className="text-lg font-semibold text-ink">{s.question}</p>
      <p className="mt-1 text-sm text-ink-soft">{s.hint}</p>

      <textarea
        value={answers[s.key] ?? ""}
        onChange={(e) =>
          setAnswers((prev) => ({ ...prev, [s.key]: e.target.value }))
        }
        rows={4}
        placeholder="Write as much or as little as you like."
        className="mt-3 w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
      />

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((n) => Math.max(0, n - 1))}
          disabled={step === 0}
          className="text-sm text-ink-soft transition hover:text-ink disabled:opacity-40"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep((n) => n + 1)}
            className="text-sm text-ink-soft transition hover:text-ink"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => setStep((n) => n + 1)}
            className="rounded-2xl bg-clay px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
          >
            {step + 1 === total ? "Review" : "Next"}
          </button>
        </div>
      </div>
    </section>
  );
}
