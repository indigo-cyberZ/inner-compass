import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FAITH_DISCLAIMER, type FaithReflectionRow } from "@/lib/faith";
import { DivineIdentityReflection } from "@/components/exercises/DivineIdentityReflection";
import { deleteFaithReflection } from "./actions";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DivineIdentityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("ic_profiles")
    .select("faith_enabled")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  // Faith content only appears for accounts that have opted in.
  if (!profile?.faith_enabled) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/explore" className="text-sm text-dusk hover:underline">
          ← Explore
        </Link>
        <div className="rounded-3xl border border-line bg-surface p-8 text-center shadow-sm">
          <div aria-hidden className="mb-2 text-3xl">
            🕊️
          </div>
          <h1 className="text-xl font-bold text-ink">Faith features are off</h1>
          <p className="mt-2 text-sm text-ink-soft">
            This is an optional, faith-centered reflection. You can turn on Faith
            &amp; spiritual growth anytime in your settings — it&apos;s private
            to your account.
          </p>
          <Link
            href="/account"
            className="mt-5 inline-block rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
          >
            Go to settings
          </Link>
        </div>
      </div>
    );
  }

  const { data } = await supabase
    .from("ic_exercise_responses")
    .select("id, data, created_at")
    .eq("exercise_slug", "divine-identity")
    .order("created_at", { ascending: false })
    .limit(20);

  const past = (data ?? []) as FaithReflectionRow[];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/explore" className="text-sm text-dusk hover:underline">
        ← Explore
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-ink">Divine identity reflection</h1>
        <p className="mt-1 text-sm text-ink-soft">
          A gentle, faith-centered reflection on worth, agency, and growth.
        </p>
      </div>

      <section className="rounded-3xl border border-dusk/20 bg-dusk/5 p-5">
        <p className="text-xs leading-relaxed text-ink-soft">
          <span className="font-semibold text-ink">Please note:</span>{" "}
          {FAITH_DISCLAIMER}
        </p>
        <a
          href="https://www.churchofjesuschrist.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-medium text-dusk hover:underline"
        >
          Open official Church resources →
        </a>
      </section>

      <DivineIdentityReflection />

      {past.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-dusk">Your reflections</h2>
          <ul className="space-y-3">
            {past.map((r) => {
              const first = Object.values(r.data?.answers ?? {}).find((v) =>
                v?.trim(),
              );
              return (
                <li
                  key={r.id}
                  className="rounded-2xl border border-line bg-surface p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-ink-soft">
                      {first ? first.slice(0, 120) : "A reflection"}
                      {first && first.length > 120 ? "…" : ""}
                    </p>
                    <span className="shrink-0 text-xs text-ink-soft">
                      {fmt(r.created_at)}
                    </span>
                  </div>
                  <form
                    action={deleteFaithReflection.bind(null, r.id)}
                    className="mt-2"
                  >
                    <button className="text-xs text-ink-soft transition hover:text-clay">
                      Delete
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
