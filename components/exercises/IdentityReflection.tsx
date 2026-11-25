"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { IDENTITY_STEPS } from "@/lib/discovery";
import { saveIdentityReflection } from "@/app/(app)/explore/discover-who-i-am/actions";

export function IdentityReflection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const total = IDENTITY_STEPS.length;
  const atEnd = step >= total;

  if (saved) {
    return (
      <section className="rounded-3xl border border-line bg-surface p-6 text-center shadow-sm">
        <div aria-hidden className="mb-2 text-3xl">
          🧭
        </div>
        <h2 className="text-lg font-bold text-ink">Reflection saved.</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Who you are isn&apos;t a fixed answer — it&apos;s something you keep
          meeting. Add anything that felt true to your Discovery Map.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href="/discovery"
            className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
          >
            Open my Discovery Map
          </Link>
          <button
            onClick={() => {
              setStep(0);
              setAnswers({});
              setSaved(false);
            }}
            className="rounded-2xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:text-ink"
          >
            Reflect again
          </button>
        </div>
      </section>
    );
  }

  if (atEnd) {
    return (
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">What you noticed</h2>
        <dl className="mt-4 space-y-3">
          {IDENTITY_STEPS.map((s) =>
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
                const res = await saveIdentityReflection(answers);
                if (res.ok) setSaved(true);
                else setError(res.error ?? "Something went wrong.");
              })
            }
            className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60 ease-gentle"
          >
            {pending ? "Saving…" : "Save privately"}
          </button>
          <button
            onClick={() => setStep(0)}
            className="rounded-2xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:text-ink"
          >
            Go back
          </button>
        </div>
      </section>
    );
  }

  const s = IDENTITY_STEPS[step];
  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-dusk">
          {step + 1} of {total}
        </span>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-clay transition-all"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-ink">{s.question}</h3>
      <p className="mt-1 text-ink-soft">{s.prompt}</p>

      <textarea
        value={answers[s.key] ?? ""}
        onChange={(e) =>
          setAnswers((prev) => ({ ...prev, [s.key]: e.target.value }))
        }
        rows={4}
        placeholder="There's no rush, and 'I don't know yet' is a real answer."
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
