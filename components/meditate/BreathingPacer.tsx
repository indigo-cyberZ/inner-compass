"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BREATH_PATTERNS, DURATIONS, type BreathPhase } from "@/lib/meditation";

type Status = "setup" | "running" | "paused" | "done";
type Tick = { phaseIndex: number; phaseLeft: number; elapsed: number };

export function BreathingPacer() {
  const [patternKey, setPatternKey] = useState<string>("box");
  const [minutes, setMinutes] = useState<number>(3);
  const [status, setStatus] = useState<Status>("setup");

  const pattern =
    BREATH_PATTERNS.find((p) => p.key === patternKey) ?? BREATH_PATTERNS[0];
  const phases: BreathPhase[] = pattern.phases;
  const totalSeconds = minutes * 60;

  const [tick, setTick] = useState<Tick>({
    phaseIndex: 0,
    phaseLeft: phases[0].secs,
    elapsed: 0,
  });

  const reduce = useRef(false);
  useEffect(() => {
    reduce.current =
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Pure per-second timer.
  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => {
      setTick((t) => {
        const elapsed = t.elapsed + 1;
        let { phaseIndex, phaseLeft } = t;
        phaseLeft -= 1;
        if (phaseLeft <= 0) {
          phaseIndex = (phaseIndex + 1) % phases.length;
          phaseLeft = phases[phaseIndex].secs;
        }
        return { phaseIndex, phaseLeft, elapsed };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status, phases]);

  // Finish when the total time is reached.
  useEffect(() => {
    if (status === "running" && tick.elapsed >= totalSeconds) {
      setStatus("done");
    }
  }, [tick.elapsed, status, totalSeconds]);

  function start() {
    setTick({ phaseIndex: 0, phaseLeft: phases[0].secs, elapsed: 0 });
    setStatus("running");
  }
  function reset() {
    setTick({ phaseIndex: 0, phaseLeft: phases[0].secs, elapsed: 0 });
    setStatus("setup");
  }

  if (status === "setup") {
    return (
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Choose a rhythm</p>
          <div className="space-y-2">
            {BREATH_PATTERNS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPatternKey(p.key)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  patternKey === p.key
                    ? "border-clay bg-clay/10"
                    : "border-line bg-surface hover:border-clay-soft"
                }`}
              >
                <span className="font-medium text-ink">{p.label}</span>
                <span className="ml-2 text-sm text-ink-soft">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-ink">For how long?</p>
          <div className="flex gap-2">
            {DURATIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMinutes(m)}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition ${
                  minutes === m
                    ? "border-clay bg-clay/15 text-clay"
                    : "border-line bg-surface text-ink-soft hover:text-ink"
                }`}
              >
                {m} min
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={start}
          className="mt-6 w-full rounded-2xl bg-clay px-5 py-3 font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
        >
          Begin
        </button>
        <p className="mt-3 text-center text-xs text-ink-soft">
          If holding your breath feels uncomfortable, choose &ldquo;Simple
          calm&rdquo; or just breathe naturally. Stop anytime.
        </p>
      </section>
    );
  }

  if (status === "done") {
    return (
      <section className="rounded-3xl border border-line bg-surface p-8 text-center shadow-sm">
        <div aria-hidden className="mb-2 text-3xl">
          🌙
        </div>
        <h2 className="text-lg font-bold text-ink">That&apos;s it. Well done.</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Notice how you feel now — no need to label it.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={reset}
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

  // running / paused
  const phase = phases[tick.phaseIndex];
  const grow = phase.name === "Breathe in";
  const shrink = phase.name === "Breathe out";
  const remain = Math.max(0, totalSeconds - tick.elapsed);
  const mm = Math.floor(remain / 60);
  const ss = String(remain % 60).padStart(2, "0");

  return (
    <section className="rounded-3xl border border-line bg-surface p-8 text-center shadow-sm">
      <div className="flex h-56 items-center justify-center">
        <div
          className="flex h-40 w-40 items-center justify-center rounded-full bg-clay/15"
          style={
            reduce.current
              ? undefined
              : {
                  transform: `scale(${grow ? 1 : shrink ? 0.55 : 0.78})`,
                  transitionProperty: "transform",
                  transitionTimingFunction: "ease-in-out",
                  transitionDuration:
                    status === "running" ? `${phase.secs}s` : "0s",
                }
          }
        >
          <span className="text-lg font-semibold text-clay">{phase.name}</span>
        </div>
      </div>

      <p className="mt-2 text-sm text-ink-soft">
        {tick.phaseLeft}s · {mm}:{ss} left
      </p>

      <div className="mt-6 flex justify-center gap-2">
        {status === "running" ? (
          <button
            onClick={() => setStatus("paused")}
            className="rounded-2xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:text-ink"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={() => setStatus("running")}
            className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
          >
            Resume
          </button>
        )}
        <button
          onClick={reset}
          className="rounded-2xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:text-ink"
        >
          Stop
        </button>
      </div>
    </section>
  );
}
