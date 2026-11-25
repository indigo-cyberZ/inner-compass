"use client";

import { useState, useTransition } from "react";
import { VALUE_PROMPTS } from "@/lib/values";
import { saveValuesReflection } from "@/app/(app)/explore/values/actions";

export function ValuesReflection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const total = VALUE_PROMPTS.length;
  const atEnd = step >= total;

  if (!atEnd && !finished) {
    const p = VALUE_PROMPTS[step];
    return (
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-dusk">
            Reflection {step + 1} of {total}
          </span>
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full bg-clay transition-all"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <p className="text-lg font-semibold text-ink">{p.question}</p>
        <p className="mt-1 text-sm text-ink-soft">{p.hint}</p>

        <textarea
          value={answers[p.key] ?? ""}
          onChange={(e) =>
            setAnswers((prev) => ({ ...prev, [p.key]: e.target.value }))
          }
          rows={4}
          placeholder="Take your time. 'I don't know yet' is a fine answer."
          className="mt-3 w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
        />

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm text-ink-soft transition hover:text-ink disabled:opacity-40"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="text-sm text-ink-soft transition hover:text-ink"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="rounded-2xl bg-clay px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
            >
              {step + 1 === total ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // End: invite naming values + optional save.
  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
      <div aria-hidden className="mb-2 text-3xl">
        🧭
      </div>
      <h2 className="text-lg font-bold text-ink">What kept showing up?</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Look back over what you wrote. What words or themes repeat — honesty,
        closeness, creativity, freedom, faith, growth? Add the ones that feel
        like <em>yours</em> to your values map below. Only you decide what
        belongs.
      </p>

      {saved ? (
        <p className="mt-4 rounded-xl bg-sage/15 px-3 py-2 text-sm text-ink">
          Reflection saved. You can revisit or add to your map anytime.
        </p>
      ) : (
        <>
          {error ? (
            <p role="alert" className="mt-3 text-sm text-clay">
              {error}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  setError(null);
                  const res = await saveValuesReflection(answers);
                  if (res.ok) setSaved(true);
                  else setError(res.error ?? "Something went wrong.");
                })
              }
              className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60 ease-gentle"
            >
              {pending ? "Saving…" : "Save this reflection (private)"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(0);
                setFinished(false);
              }}
              className="rounded-2xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:text-ink"
            >
              Revisit answers
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            Saving is optional — your reflections stay private to you.
          </p>
        </>
      )}
    </section>
  );
}
