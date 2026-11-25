"use client";

import { useActionState } from "react";
import { deleteMyData } from "./actions";

export default function AccountPage() {
  const [state, formAction, pending] = useActionState(deleteMyData, {
    error: null as string | null,
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Privacy &amp; data</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Your journal is yours. Take it with you, or remove it, at any time.
        </p>
      </div>

      {/* Export */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="font-semibold text-ink">Export your data</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Download everything Inner Compass holds for you — your profile and all
          journal entries — as a JSON file.
        </p>
        <a
          href="/api/export"
          className="mt-4 inline-block rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
        >
          Download my data (JSON)
        </a>
      </section>

      {/* Delete */}
      <section className="rounded-3xl border border-clay/30 bg-clay/5 p-6">
        <h2 className="font-semibold text-ink">Delete my Inner Compass data</h2>
        <p className="mt-1 text-sm text-ink-soft">
          This permanently removes your profile and every journal entry. It
          can&apos;t be undone — consider exporting first.
        </p>
        <p className="mt-2 rounded-xl bg-surface-2 px-3 py-2 text-xs text-ink-soft">
          Note: your sign-in itself is shared with another app on this database,
          so your login isn&apos;t removed here — only your Inner Compass
          content. You can sign in again and start fresh.
        </p>

        <form action={formAction} className="mt-4 space-y-3">
          <label htmlFor="confirm" className="block text-sm text-ink">
            Type <span className="font-mono font-semibold">DELETE</span> to
            confirm:
          </label>
          <input
            id="confirm"
            name="confirm"
            autoComplete="off"
            className="w-full max-w-xs rounded-xl border border-line bg-surface px-3 py-2 text-ink outline-none transition focus:border-clay"
          />
          {state.error ? (
            <p role="alert" className="text-sm text-clay">
              {state.error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="rounded-2xl border border-clay bg-surface px-5 py-2.5 text-sm font-semibold text-clay transition hover:bg-clay hover:text-white disabled:opacity-60 ease-gentle"
          >
            {pending ? "Deleting…" : "Permanently delete my data"}
          </button>
        </form>
      </section>
    </div>
  );
}
