import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { KindWordsRow } from "@/lib/selfcompassion";
import { SelfCompassionBreak } from "@/components/exercises/SelfCompassionBreak";
import { deleteKindWords } from "./actions";

export const dynamic = "force-dynamic";

export default async function SelfCompassionPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ic_exercise_responses")
    .select("id, data, created_at")
    .eq("exercise_slug", "self-compassion")
    .order("created_at", { ascending: false })
    .limit(50);

  const kindWords = (data ?? []) as KindWordsRow[];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/explore" className="text-sm text-dusk hover:underline">
        ← Explore
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-ink">Self-compassion break</h1>
        <p className="mt-1 text-sm text-ink-soft">
          A short pause for a hard moment — about three minutes.
        </p>
      </div>

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-dusk">Quick overview</h2>
        <p className="mt-1 text-ink">
          Self-compassion means treating yourself with the same kindness
          you&apos;d offer a friend who&apos;s struggling. It isn&apos;t
          self-pity or letting yourself off the hook — research links it to
          greater resilience and steadier motivation, not less.
        </p>
        <details className="group mt-4">
          <summary className="cursor-pointer text-sm font-medium text-dusk">
            What we&apos;ll do
          </summary>
          <p className="mt-2 text-sm text-ink-soft">
            Three gentle moves: acknowledge that this is hard, remember
            you&apos;re not alone in struggling, and offer yourself a few kind
            words. You can save those words to return to later.
          </p>
        </details>
      </section>

      <SelfCompassionBreak />

      {kindWords.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-dusk">Your kind words</h2>
          <ul className="space-y-2">
            {kindWords.map((k) => (
              <li
                key={k.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm"
              >
                <p className="text-ink">💛 {k.data.phrase}</p>
                <form action={deleteKindWords.bind(null, k.id)}>
                  <button className="shrink-0 text-xs text-ink-soft transition hover:text-clay">
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
