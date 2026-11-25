"use client";

import { useState } from "react";
import { saveNote } from "@/app/(app)/learn/actions";

export function ResourceNote({
  resourceId,
  initial,
}: {
  resourceId: string;
  initial: string;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return initial ? (
      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <p className="text-xs font-medium text-dusk">Your note</p>
        <p className="mt-0.5 text-sm text-ink">{initial}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-1 text-xs text-dusk hover:underline"
        >
          Edit note
        </button>
      </div>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 text-xs font-medium text-dusk hover:underline"
      >
        + Add a private note
      </button>
    );
  }

  return (
    <form
      action={async (fd) => {
        await saveNote(resourceId, fd);
        setOpen(false);
      }}
      className="mt-3 space-y-2"
    >
      <textarea
        name="note"
        defaultValue={initial}
        rows={2}
        placeholder="A private note to yourself about this resource…"
        className="w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-clay"
      />
      <div className="flex items-center gap-2">
        <button className="rounded-lg bg-clay px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-105">
          Save note
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-ink-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
