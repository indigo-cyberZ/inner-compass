import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <div
        aria-hidden
        className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-clay/15 text-4xl"
      >
        🧭
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-ink">
        Inner Compass
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        A private, warm space to meet yourself where you are — not where you
        think you should be. Journal, reflect, and explore at your own pace.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Link
          href="/login"
          className="rounded-2xl bg-clay px-8 py-3 font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
        >
          Sign in
        </Link>
        <p className="text-sm text-ink-soft">
          Inner Compass is in private development. New accounts are invite-only.
        </p>
      </div>

      <footer className="mt-16 text-xs text-ink-soft">
        <p>
          A personal reflection tool — not therapy, diagnosis, or an emergency
          service.
        </p>
      </footer>
    </main>
  );
}
