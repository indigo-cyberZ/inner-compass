import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EXERCISES } from "@/lib/exercises";

export const dynamic = "force-dynamic";

function isFaith(category: string) {
  return category.toLowerCase().startsWith("faith");
}

export default async function ExplorePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("ic_profiles")
    .select("faith_enabled")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const faithOn = profile?.faith_enabled ?? false;
  const visible = EXERCISES.filter((e) => faithOn || !isFaith(e.category));
  const hasHiddenFaith = !faithOn && EXERCISES.some((e) => isFaith(e.category));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Explore</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Gentle, guided reflections. Take what&apos;s useful and leave the rest
          — you can do any of these at your own pace.
        </p>
      </div>

      <Link
        href="/discovery"
        className="block rounded-2xl border border-clay-soft bg-clay/5 p-5 transition hover:border-clay"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-ink">🗺️ Your Discovery Map</h2>
            <p className="mt-1 text-sm text-ink-soft">
              A living picture of what you&apos;ve learned about yourself — values,
              needs, strengths, questions you&apos;re still exploring.
            </p>
          </div>
          <span className="shrink-0 text-sm font-medium text-clay">Open →</span>
        </div>
      </Link>

      <Link
        href="/experiments"
        className="block rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:border-clay-soft"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-ink">🌱 Small experiments</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Try one small thing in real life, then reflect on how it went — no
              streaks, no grading.
            </p>
          </div>
          <span className="shrink-0 text-sm font-medium text-clay">Open →</span>
        </div>
      </Link>

      <Link
        href="/meditate"
        className="block rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:border-clay-soft"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-ink">🧘 Meditation &amp; mindfulness</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Guided breathing, 5-4-3-2-1 grounding, and a body scan — short and
              calming.
            </p>
          </div>
          <span className="shrink-0 text-sm font-medium text-clay">Open →</span>
        </div>
      </Link>

      <ul className="space-y-3">
        {visible.map((e) => {
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

      {hasHiddenFaith ? (
        <p className="rounded-2xl border border-dashed border-line p-4 text-center text-sm text-ink-soft">
          Optional faith-centered reflections are available too.{" "}
          <Link href="/account" className="text-dusk hover:underline">
            Turn on Faith &amp; spiritual growth
          </Link>{" "}
          in settings.
        </p>
      ) : null}
    </div>
  );
}
