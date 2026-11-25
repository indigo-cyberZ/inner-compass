import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BoundaryRow } from "@/lib/boundaries";
import { BoundariesExplorer } from "@/components/exercises/BoundariesExplorer";
import { deleteBoundary } from "./actions";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BoundariesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ic_exercise_responses")
    .select("id, data, created_at, updated_at")
    .eq("exercise_slug", "boundaries")
    .order("created_at", { ascending: false })
    .limit(20);

  const past = (data ?? []) as BoundaryRow[];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/explore" className="text-sm text-dusk hover:underline">
        ← Explore
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-ink">Boundaries explorer</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Work through a situation to understand your needs and shape a boundary
          that honors them.
        </p>
      </div>

      {/* Educational intro */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-dusk">Quick overview</h2>
        <p className="mt-1 text-ink">
          A boundary is a limit you set for <em>yourself</em> — what you will or
          won&apos;t do to protect your wellbeing. It&apos;s not a rule you
          impose on someone else.
        </p>

        <details className="group mt-4">
          <summary className="cursor-pointer text-sm font-medium text-dusk">
            Boundary vs. request vs. control
          </summary>
          <ul className="mt-2 space-y-2 text-sm text-ink-soft">
            <li>
              <span className="font-medium text-ink">Boundary</span> — within your
              control: &ldquo;If the yelling continues, I&apos;ll leave the
              room.&rdquo;
            </li>
            <li>
              <span className="font-medium text-ink">Request</span> — asking
              someone to change; they&apos;re free to say no.
            </li>
            <li>
              <span className="font-medium text-ink">Expectation</span> — a hope
              about how others should act; not automatically a boundary.
            </li>
            <li>
              <span className="font-medium text-ink">Compromise</span> — a middle
              ground you both agree to.
            </li>
            <li>
              <span className="font-medium text-ink">Control</span> — trying to
              force someone&apos;s choice. That&apos;s not a boundary.
            </li>
          </ul>
        </details>

        <p className="mt-4 rounded-xl bg-surface-2 px-3 py-2 text-xs text-ink-soft">
          Boundaries depend on context, safety, relationships, and mutual
          agreements. One difficult interaction doesn&apos;t make someone a bad
          person — this is for understanding your own needs, not diagnosing
          others. If you feel unsafe, your safety comes first; please reach out
          to someone you trust or a professional.
        </p>
      </section>

      <BoundariesExplorer />

      {past.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-dusk">Your past reflections</h2>
          <ul className="space-y-3">
            {past.map((r) => {
              const boundary = r.data?.answers?.["boundary"];
              const situation = r.data?.answers?.["situation"];
              return (
                <li
                  key={r.id}
                  className="rounded-2xl border border-line bg-surface p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-ink">
                      {r.data?.area ? `${r.data.area} · ` : ""}
                      {situation?.trim() || "A situation"}
                    </p>
                    <span className="shrink-0 text-xs text-ink-soft">
                      {fmt(r.created_at)}
                    </span>
                  </div>
                  {boundary?.trim() ? (
                    <p className="mt-2 text-sm text-ink-soft">
                      <span className="font-medium text-ink">Boundary:</span>{" "}
                      {boundary}
                    </p>
                  ) : null}
                  <form action={deleteBoundary.bind(null, r.id)} className="mt-2">
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
