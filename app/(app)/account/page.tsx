import { createClient } from "@/lib/supabase/server";
import { FaithToggle } from "@/components/account/FaithToggle";
import { DeleteDataForm } from "@/components/account/DeleteDataForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("ic_profiles")
    .select("faith_enabled")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Settings &amp; privacy</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Your journal is yours. Adjust what appears, and take or remove your
          data anytime.
        </p>
      </div>

      {/* Preferences */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-ink">Preferences</h2>
        <FaithToggle initial={profile?.faith_enabled ?? false} />
      </section>

      {/* Export */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="font-semibold text-ink">Export your data</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Download everything Inner Compass holds for you as a JSON file.
        </p>
        <a
          href="/api/export"
          className="mt-4 inline-block rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
        >
          Download my data (JSON)
        </a>
      </section>

      {/* Delete */}
      <section className="rounded-3xl border border-clay/30 bg-clay/5 p-6">
        <h2 className="font-semibold text-ink">Delete my Inner Compass data</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Permanently removes your profile, journal, check-ins, intentions, and
          exercise responses. It can&apos;t be undone — consider exporting first.
        </p>
        <p className="mt-2 rounded-xl bg-surface-2 px-3 py-2 text-xs text-ink-soft">
          Your sign-in itself is shared with another app on this database, so
          your login isn&apos;t removed here — only your Inner Compass content.
        </p>
        <DeleteDataForm />
      </section>
    </div>
  );
}
