"use client";

import { useActionState } from "react";
import { deleteMyData } from "@/app/(app)/account/actions";

export function DeleteDataForm() {
  const [state, formAction, pending] = useActionState(deleteMyData, {
    error: null as string | null,
  });

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <label htmlFor="confirm" className="block text-sm text-ink">
        Type <span className="font-mono font-semibold">DELETE</span> to confirm:
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
  );
}
