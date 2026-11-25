import { createClient } from "@/lib/supabase/server";
import { type Intention, STATUS_META } from "@/lib/intentions";
import { IntentionComposer } from "@/components/intentions/IntentionComposer";
import {
  setIntentionStatus,
  deleteIntention,
  saveIntentionReflection,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function IntentionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ic_intentions")
    .select("id, body, status, reflection, created_at, updated_at")
    .order("created_at", { ascending: false });

  const items = (data ?? []) as Intention[];
  const active = items.filter((i) => i.status === "active");
  const past = items.filter((i) => i.status !== "active");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Intentions</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Small, kind commitments to yourself. There&apos;s no streak to keep and
          nothing to get perfect — you can revisit, change, or let any of these
          go.
        </p>
      </div>

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <IntentionComposer />
      </section>

      {active.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-dusk">Active</h2>
          <ul className="space-y-3">
            {active.map((i) => (
              <li
                key={i.id}
                className="rounded-2xl border border-line bg-surface p-4 shadow-sm"
              >
                <p className="text-ink">{i.body}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={setIntentionStatus.bind(null, i.id, "completed")}>
                    <button className="rounded-xl border border-sage/40 bg-sage/10 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-sage/20">
                      I lived into this
                    </button>
                  </form>
                  <form action={setIntentionStatus.bind(null, i.id, "released")}>
                    <button className="rounded-xl border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:text-ink">
                      Let it go
                    </button>
                  </form>
                  <form action={deleteIntention.bind(null, i.id)}>
                    <button className="rounded-xl px-3 py-1.5 text-xs text-ink-soft transition hover:text-clay">
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-ink-soft">
          No active intentions right now. Setting one above is a gentle place to
          start.
        </p>
      )}

      {past.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-dusk">
            Revisited &amp; reflected
          </h2>
          <ul className="space-y-3">
            {past.map((i) => {
              const meta = STATUS_META[i.status];
              return (
                <li
                  key={i.id}
                  className="rounded-2xl border border-line bg-surface-2 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-ink">{i.body}</p>
                    <span className={`shrink-0 text-xs font-medium ${meta.tone}`}>
                      {meta.label}
                    </span>
                  </div>

                  <form
                    action={saveIntentionReflection.bind(null, i.id)}
                    className="mt-3 space-y-2"
                  >
                    <textarea
                      name="reflection"
                      defaultValue={i.reflection ?? ""}
                      rows={2}
                      placeholder="What did you notice or learn? (optional)"
                      className="w-full resize-y rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-clay"
                    />
                    <button className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:text-ink">
                      Save reflection
                    </button>
                  </form>
                  <form
                    action={setIntentionStatus.bind(null, i.id, "active")}
                    className="mt-2"
                  >
                    <button className="rounded-xl px-1 py-1 text-xs text-dusk transition hover:underline">
                      Make active again
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
