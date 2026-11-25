"use client";

import { useState } from "react";
import { IMPORTANCE } from "@/lib/values";
import { addValue } from "@/app/(app)/explore/values/actions";

export function ValueComposer() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-2xl border border-dashed border-line bg-surface-2 px-4 py-3 text-sm font-medium text-dusk transition hover:text-ink"
      >
        + Add a value to your map
      </button>
    );
  }

  return (
    <form
      action={async (fd) => {
        await addValue(fd);
        setOpen(false);
      }}
      className="space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-sm"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-ink">
          Value
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="e.g. Honesty, Closeness, Creativity"
          className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
        />
      </div>
      <div>
        <label htmlFor="definition" className="block text-sm font-semibold text-ink">
          What it means to you <span className="text-ink-soft">(optional)</span>
        </label>
        <textarea
          id="definition"
          name="definition"
          rows={2}
          placeholder="In your own words — not a dictionary definition."
          className="mt-1 w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
        />
      </div>
      <div>
        <label htmlFor="importance" className="block text-sm font-semibold text-ink">
          How central is it right now?
        </label>
        <select
          id="importance"
          name="importance"
          defaultValue={3}
          className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
        >
          {IMPORTANCE.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle">
          Add to map
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
