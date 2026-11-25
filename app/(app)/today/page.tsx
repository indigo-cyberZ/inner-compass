export default function TodayPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Today</h1>
        <p className="mt-1 text-ink-soft">
          A calm place to begin. Take a breath — there&apos;s nothing you have to
          do here.
        </p>
      </div>

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <p className="text-sm font-medium text-dusk">A gentle question</p>
        <p className="mt-2 text-lg leading-relaxed text-ink">
          What&apos;s one small thing that felt steady today?
        </p>
      </section>

      <section className="rounded-3xl border border-dashed border-line p-6 text-center text-sm text-ink-soft">
        Check-ins, intentions, and a reflection prompt will live here soon.
      </section>
    </div>
  );
}
