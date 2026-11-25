import Link from "next/link";
import { EXERCISES } from "@/lib/exercises";

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Explore</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Gentle, guided reflections. Take what&apos;s useful and leave the rest
          — you can do any of these at your own pace.
        </p>
      </div>

      <ul className="space-y-3">
        {EXERCISES.map((e) => {
          const card = (
            <div
              className={`rounded-2xl border p-5 shadow-sm transition ${
                e.available
                  ? "border-line bg-surface hover:border-clay-soft"
                  : "border-dashed border-line bg-surface-2"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-ink">{e.title}</h2>
                <span className="shrink-0 rounded-full bg-dusk/10 px-2 py-0.5 text-xs text-dusk">
                  {e.category}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{e.blurb}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-ink-soft">{e.minutes}</span>
                {e.available ? (
                  <span className="text-sm font-medium text-clay">Start →</span>
                ) : (
                  <span className="text-xs text-ink-soft">Coming soon</span>
                )}
              </div>
            </div>
          );

          return (
            <li key={e.slug}>
              {e.available && e.href ? (
                <Link href={e.href} className="block">
                  {card}
                </Link>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
