"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { type JournalEntry, MOODS } from "@/lib/journal";
import { updateEntry, deleteEntry, type SaveResult } from "@/app/(app)/journal/actions";

type Status = "saved" | "saving" | "unsaved" | "error";

function parseTags(input: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input.split(",")) {
    const t = raw.trim().replace(/^#/, "");
    if (t && !seen.has(t.toLowerCase())) {
      seen.add(t.toLowerCase());
      out.push(t);
    }
  }
  return out;
}

export function Editor({ entry }: { entry: JournalEntry }) {
  const [title, setTitle] = useState(entry.title ?? "");
  const [body, setBody] = useState(entry.body ?? "");
  const [mood, setMood] = useState<string | null>(entry.mood);
  const [tagsInput, setTagsInput] = useState(entry.tags.join(", "));
  const [entryDate, setEntryDate] = useState(entry.entry_date);
  const [aiShareable, setAiShareable] = useState(entry.ai_shareable);

  const [status, setStatus] = useState<Status>("saved");
  const [isDeleting, startDelete] = useTransition();

  const snapshot = useCallback(
    () =>
      JSON.stringify({
        title: title.trim(),
        body,
        mood,
        tags: parseTags(tagsInput),
        entryDate,
        aiShareable,
      }),
    [title, body, mood, tagsInput, entryDate, aiShareable],
  );

  const lastSaved = useRef<string>(snapshot());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saving = useRef(false);

  const save = useCallback(async () => {
    if (saving.current) return;
    const atSave = snapshot();
    saving.current = true;
    setStatus("saving");
    let result: SaveResult;
    try {
      result = await updateEntry({
        id: entry.id,
        title,
        body,
        mood,
        tags: parseTags(tagsInput),
        entry_date: entryDate,
        ai_shareable: aiShareable,
      });
    } catch {
      result = { ok: false, error: "Save failed." };
    }
    saving.current = false;
    if (result.ok) {
      lastSaved.current = atSave;
      // If nothing changed while saving, we're clean; otherwise still dirty.
      setStatus(snapshot() === lastSaved.current ? "saved" : "unsaved");
    } else {
      setStatus("error");
    }
  }, [entry.id, title, body, mood, tagsInput, entryDate, aiShareable, snapshot]);

  // Debounced autosave whenever the content differs from the last saved state.
  useEffect(() => {
    if (snapshot() === lastSaved.current) {
      return;
    }
    setStatus("unsaved");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void save();
    }, 1400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [snapshot, save]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (snapshot() !== lastSaved.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [snapshot]);

  function handleDelete() {
    if (
      !window.confirm(
        "Delete this entry permanently? This can't be undone.",
      )
    ) {
      return;
    }
    startDelete(() => {
      void deleteEntry(entry.id);
    });
  }

  const statusText: Record<Status, string> = {
    saved: "All changes saved",
    saving: "Saving…",
    unsaved: "Unsaved changes…",
    error: "Couldn't save — retrying when you continue",
  };
  const statusColor: Record<Status, string> = {
    saved: "text-sage",
    saving: "text-ink-soft",
    unsaved: "text-dusk",
    error: "text-clay",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <input
          type="date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          aria-label="Entry date"
          className="rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink-soft outline-none focus:border-clay"
        />
        <span
          role="status"
          aria-live="polite"
          className={`text-xs ${statusColor[status]}`}
        >
          {statusText[status]}
        </span>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        aria-label="Title"
        className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-lg font-semibold text-ink outline-none transition focus:border-clay"
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write freely. There's no right way to do this."
        aria-label="Entry"
        rows={14}
        className="w-full resize-y rounded-2xl border border-line bg-surface px-4 py-3 leading-relaxed text-ink outline-none transition focus:border-clay"
      />

      <div>
        <p className="mb-1.5 text-sm font-medium text-ink">
          How did this moment feel? <span className="text-ink-soft">(optional)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => {
            const active = mood === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(active ? null : m.value)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  active
                    ? "border-clay bg-clay/15 text-clay"
                    : "border-line bg-surface text-ink-soft hover:text-ink"
                }`}
              >
                {m.emoji} {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="mb-1.5 block text-sm font-medium text-ink">
          Tags <span className="text-ink-soft">(comma-separated, optional)</span>
        </label>
        <input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g. gratitude, work, family"
          className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
        />
      </div>

      <div className="rounded-2xl border border-line bg-surface-2 p-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={aiShareable}
            onChange={(e) => setAiShareable(e.target.checked)}
            className="mt-1 h-4 w-4 accent-clay"
          />
          <span className="text-sm text-ink-soft">
            <span className="font-medium text-ink">
              Allow this entry to be shared with the AI companion
            </span>
            <br />
            Off by default. Nothing is ever sent to any AI unless you turn this
            on — and the AI companion isn&apos;t built yet, so nothing leaves
            your account today.
          </span>
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => void save()}
          disabled={status === "saving"}
          className="rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60 ease-gentle"
        >
          Save now
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-xl px-3 py-2 text-sm text-ink-soft transition hover:bg-clay/10 hover:text-clay disabled:opacity-60"
        >
          {isDeleting ? "Deleting…" : "Delete entry"}
        </button>
      </div>
    </div>
  );
}
