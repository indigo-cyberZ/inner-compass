"use client";

import { useState } from "react";
import { DISCOVERY_CATEGORIES } from "@/lib/discovery";
import { addDiscoveryItem } from "@/app/(app)/discovery/actions";

export function DiscoveryComposer() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-dashed border-line bg-surface-2 px-4 py-3 text-sm font-medium text-dusk transition hover:text-ink"
      >
        + Add something you&apos;ve noticed about yourself
      </button>
    );
  }

  return (
    <form
      action={async (fd) => {
        await addDiscoveryItem(fd);
        setOpen(false);
      }}
      className="space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-sm"
    >
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-ink">
          This is a…
        </label>
        <select
          id="category"
          name="category"
          defaultValue="insights"
          className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
        >
          {DISCOVERY_CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="text" className="block text-sm font-semibold text-ink">
          In your own words
        </label>
        <textarea
          id="text"
          name="text"
          required
          rows={2}
          className="mt-1 w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
        />
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
