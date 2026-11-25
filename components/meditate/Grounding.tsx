"use client";

import Link from "next/link";
import { useState } from "react";
import { GROUNDING_STEPS } from "@/lib/meditation";

export function Grounding() {
  const [step, setStep] = useState(0);
  const total = GROUNDING_STEPS.length;

  if (step >= total) {
    return (
      <section className="rounded-3xl border border-line bg-surface p-8 text-center shadow-sm">
        <div aria-hidden className="mb-2 text-3xl">
          🌿
        </div>
        <h2 className="text-lg font-bold text-ink">You&apos;re here, now.</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Grounding doesn&apos;t erase hard feelings — it just gives you a steadier
          place to stand while they pass.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setStep(0)}
            className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
          >
            Again
          </button>
          <Link
            href="/meditate"
            className="rounded-2xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:text-ink"
          >
            Done
          </Link>
        </div>
      </section>
    );
  }

  const s = GROUNDING_STEPS[step];
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

      <div className="text-center">
        <div aria-hidden className="text-5xl font-bold text-clay/70">
          {s.count}
        </div>
        <p className="mt-2 text-lg font-semibold text-ink">{s.prompt}</p>
      </div>

      <textarea
        rows={2}
        placeholder="Name them to yourself, or jot them here (not saved)…"
        className="mt-4 w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
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
        <button
          type="button"
          onClick={() => setStep((n) => n + 1)}
          className="rounded-2xl bg-clay px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
        >
          {step + 1 === total ? "Finish" : "Next"}
        </button>
      </div>
    </section>
  );
}
