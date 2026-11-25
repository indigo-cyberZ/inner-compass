import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { IdentityRow } from "@/lib/discovery";
import { IdentityReflection } from "@/components/exercises/IdentityReflection";
import { deleteIdentityReflection } from "./actions";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DiscoverWhoIAmPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ic_exercise_responses")
    .select("id, data, created_at")
    .eq("exercise_slug", "identity-reflection")
    .order("created_at", { ascending: false })
    .limit(20);

  const past = (data ?? []) as IdentityRow[];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/explore" className="text-sm text-dusk hover:underline">
        ← Explore
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-ink">Discover who I am</h1>
        <p className="mt-1 text-sm text-ink-soft">
          A slow, gentle look at your identity — one question at a time. Not a
          test, and never a permanent label.
        </p>
      </div>

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-dusk">Quick overview</h2>
        <p className="mt-1 text-ink">
          We&apos;ll move through a handful of reflections about who you are
          beneath your roles — your interests, needs, strengths, beliefs, and how
          you&apos;ve changed. Answer what you can; &ldquo;I don&apos;t know
          yet&rdquo; is always welcome. Afterward, you can add anything that felt
          true to your <Link href="/discovery" className="text-dusk hover:underline">Discovery Map</Link>.
        </p>
      </section>

      <IdentityReflection />

      {past.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-dusk">Past reflections</h2>
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
                    action={deleteIdentityReflection.bind(null, r.id)}
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
