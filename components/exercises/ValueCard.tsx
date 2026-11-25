"use client";

import { useState } from "react";
import { type ValueRow, IMPORTANCE, importanceLabel } from "@/lib/values";
import { updateValue, deleteValue } from "@/app/(app)/explore/values/actions";

export function ValueCard({ value }: { value: ValueRow }) {
  const [editing, setEditing] = useState(false);
  const v = value.data;

  if (editing) {
    return (
      <li className="rounded-2xl border border-clay-soft bg-surface p-4 shadow-sm">
        <form
          action={async (fd) => {
            await updateValue(value.id, fd);
            setEditing(false);
          }}
          className="space-y-3"
        >
          <input
            name="name"
            defaultValue={v.name}
            required
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 font-semibold text-ink outline-none transition focus:border-clay"
          />
          <textarea
            name="definition"
            defaultValue={v.definition}
            rows={2}
            placeholder="What it means to you"
            className="w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-clay"
          />
          <select
            name="importance"
            defaultValue={v.importance}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-clay"
          >
            {IMPORTANCE.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button className="rounded-xl bg-clay px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">{v.name}</h3>
          {v.definition ? (
            <p className="mt-0.5 text-sm text-ink-soft">{v.definition}</p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full bg-clay/10 px-2 py-0.5 text-xs text-clay">
          {importanceLabel(v.importance)}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-medium text-dusk hover:underline"
        >
          Edit
        </button>
        <form action={deleteValue.bind(null, value.id)}>
          <button className="text-xs text-ink-soft transition hover:text-clay">
            Remove
          </button>
        </form>
      </div>
    </li>
  );
}
