"use client";

import { useState } from "react";
import { DISCOVERY_CATEGORIES, type DiscoveryItem } from "@/lib/discovery";
import {
  updateDiscoveryItem,
  deleteDiscoveryItem,
} from "@/app/(app)/discovery/actions";

export function DiscoveryItemCard({ item }: { item: DiscoveryItem }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="rounded-2xl border border-clay-soft bg-surface p-3 shadow-sm">
        <form
          action={async (fd) => {
            await updateDiscoveryItem(item.id, fd);
            setEditing(false);
          }}
          className="space-y-2"
        >
          <select
            name="category"
            defaultValue={item.data.category}
            className="w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink outline-none focus:border-clay"
          >
            {DISCOVERY_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
          <textarea
            name="text"
            defaultValue={item.data.text}
            rows={2}
            required
            className="w-full resize-y rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink outline-none focus:border-clay"
          />
          <div className="flex items-center gap-2">
            <button className="rounded-lg bg-clay px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-105">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-xs text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="group flex items-start justify-between gap-2 rounded-2xl border border-line bg-surface p-3 shadow-sm">
      <p className="text-sm text-ink">{item.data.text}</p>
      <div className="flex shrink-0 items-center gap-2 opacity-70 transition group-hover:opacity-100">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-dusk hover:underline"
        >
          Edit
        </button>
        <form action={deleteDiscoveryItem.bind(null, item.id)}>
          <button className="text-xs text-ink-soft transition hover:text-clay">
            Remove
          </button>
        </form>
      </div>
    </li>
  );
}
