"use client";

import { useState } from "react";
import { INTENTION_EXAMPLES } from "@/lib/intentions";
import { createIntention } from "@/app/(app)/intentions/actions";

export function IntentionComposer() {
  const [body, setBody] = useState("");

  return (
    <form
      action={async (fd) => {
        await createIntention(fd);
        setBody("");
      }}
      className="space-y-3"
    >
      <textarea
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        placeholder="A gentle intention for yourself…"
        aria-label="New intention"
        className="w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
      />
      <div className="flex flex-wrap gap-1.5">
        {INTENTION_EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setBody(ex)}
            className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs text-ink-soft transition hover:text-ink"
          >
            {ex}
          </button>
        ))}
      </div>
      <button
        type="submit"
        disabled={!body.trim()}
        className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-50 ease-gentle"
      >
        Set this intention
      </button>
    </form>
  );
}
