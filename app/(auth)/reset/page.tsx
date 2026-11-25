"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "../login/actions";

export default function ResetPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, {
    message: null as string | null,
    error: null as string | null,
  });

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-line bg-surface p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-ink">Reset your password</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Enter your email and we&apos;ll send a reset link.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition focus:border-clay"
            />
          </div>

          {state.message ? (
            <p
              role="status"
              className="rounded-xl bg-sage/15 px-3 py-2 text-sm text-ink"
            >
              {state.message}
            </p>
          ) : null}
          {state.error ? (
            <p
              role="alert"
              className="rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay"
            >
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-2xl bg-clay px-4 py-3 font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60 ease-gentle"
          >
            {pending ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-dusk hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
