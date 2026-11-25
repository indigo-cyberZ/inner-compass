"use client";

import { useState } from "react";
import { EXPERIMENT_THEMES } from "@/lib/experiments";
import { startExperiment } from "@/app/(app)/experiments/actions";

export function CustomExperiment({ faithOn }: { faithOn: boolean }) {
  const [open, setOpen] = useState(false);
  const themes = EXPERIMENT_THEMES.filter(
    (t) => faithOn || t.key !== "faith",
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-dashed border-line bg-surface-2 px-4 py-3 text-sm font-medium text-dusk transition hover:text-ink"
      >
        + Write my own experiment
      </button>
    );
  }

  return (
    <form
      action={async (fd) => {
        await startExperiment(fd);
        setOpen(false);
      }}
      className="space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-sm"
    >
      <div>
        <label htmlFor="prompt" className="block text-sm font-semibold text-ink">
          Your small experiment
        </label>
        <textarea
          id="prompt"
          name="prompt"
          required
          rows={2}
          placeholder="Something small and doable in the next day or two."
          className="mt-1 w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
        />
      </div>
      <div>
        <label htmlFor="theme" className="block text-sm font-semibold text-ink">
          Theme <span className="text-ink-soft">(optional)</span>
        </label>
        <select
          id="theme"
          name="theme"
          defaultValue=""
          className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
        >
          <option value="">—</option>
          {themes.map((t) => (
            <option key={t.key} value={t.key}>
              {t.emoji} {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle">
          Start it
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-ink-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
