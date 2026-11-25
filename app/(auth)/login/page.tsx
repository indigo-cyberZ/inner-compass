"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, {
    error: null as string | null,
  });

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-line bg-surface p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div
            aria-hidden
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-clay/15 text-2xl"
          >
            🧭
          </div>
          <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Sign in to your Inner Compass.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition focus:border-clay"
            />
          </div>

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
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/reset" className="text-dusk hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-ink-soft">
        New accounts are invite-only during private development.
      </p>
    </main>
  );
}
