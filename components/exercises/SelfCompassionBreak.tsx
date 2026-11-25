"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { SC_STEPS, KIND_PHRASES } from "@/lib/selfcompassion";
import { saveKindWords } from "@/app/(app)/explore/self-compassion/actions";

export function SelfCompassionBreak() {
  const [step, setStep] = useState(0);
  const [phrase, setPhrase] = useState("");
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  const total = SC_STEPS.length;
  const s = SC_STEPS[step];
  const isLast = step === total - 1;

  if (done) {
    return (
      <section className="rounded-3xl border border-line bg-surface p-6 text-center shadow-sm">
        <div aria-hidden className="mb-2 text-3xl">
          💛
        </div>
        <h2 className="text-lg font-bold text-ink">
          That was a kind thing to do for yourself.
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          You can come back to this anytime you need a softer moment.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              setStep(0);
              setPhrase("");
              setSavedNote(null);
              setDone(false);
            }}
            className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
          >
            Again
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

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-dusk">
          {s.title}
        </span>
        <div className="flex gap-1">
          {SC_STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full ${
                i <= step ? "bg-clay" : "bg-surface-2"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-lg leading-relaxed text-ink">{s.body}</p>

      {isLast ? (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {KIND_PHRASES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPhrase(p)}
                className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs text-ink-soft transition hover:text-ink"
              >
                {p}
              </button>
            ))}
          </div>
          <textarea
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            rows={3}
            placeholder="Write kind words to yourself…"
            className="w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
          />
          {savedNote ? (
            <p className="rounded-xl bg-sage/15 px-3 py-2 text-sm text-ink">
              {savedNote}
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="text-sm text-clay">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            disabled={pending || !phrase.trim()}
            onClick={() =>
              start(async () => {
                setError(null);
                const res = await saveKindWords(phrase);
                if (res.ok)
                  setSavedNote("Saved to your kind words below. 💛");
                else setError(res.error ?? "Something went wrong.");
              })
            }
            className="rounded-xl border border-clay bg-surface px-4 py-2 text-sm font-semibold text-clay transition hover:bg-clay hover:text-white disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save these words (optional)"}
          </button>
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between">
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
          onClick={() => (isLast ? setDone(true) : setStep((n) => n + 1))}
          className="rounded-2xl bg-clay px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
        >
          {isLast ? "Finish" : "Continue"}
        </button>
      </div>
    </section>
  );
}
