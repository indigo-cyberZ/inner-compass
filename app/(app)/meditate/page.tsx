import Link from "next/link";
import { PRACTICES } from "@/lib/meditation";

export default function MeditatePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Meditation &amp; mindfulness</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Short, text-guided practices for calm and present-moment attention.
          Take what helps; stop whenever you like.
        </p>
      </div>

      <ul className="space-y-3">
        {PRACTICES.map((p) => (
          <li key={p.slug}>
            <Link
              href={p.href}
              className="block rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:border-clay-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-ink">{p.title}</h2>
                <span className="shrink-0 rounded-full bg-dusk/10 px-2 py-0.5 text-xs text-dusk">
                  {p.kind}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{p.blurb}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-ink-soft">{p.minutes}</span>
                <span className="text-sm font-medium text-clay">Begin →</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="rounded-2xl bg-surface-2 px-4 py-3 text-xs text-ink-soft">
        These practices can support calm and focus, but they aren&apos;t a
        treatment or cure for any medical or mental-health condition. Some
        techniques suit some people more than others — if breathing exercises
        feel uncomfortable, the eyes-open grounding practice is a gentle
        alternative. If you&apos;re in crisis, please reach out to a professional
        or a crisis line.
      </p>
    </div>
  );
}
