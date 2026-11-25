import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Intention } from "@/lib/intentions";
import { type CheckIn, moodScaleMeta } from "@/lib/checkin";

export const dynamic = "force-dynamic";

const REFLECTIONS = [
  "What's one small thing that felt steady today?",
  "What are you carrying right now that you could set down for a moment?",
  "When did you feel most like yourself this week?",
  "What would feeling cared for look like today?",
  "What's something you're quietly proud of lately?",
  "What do you need a little more of right now?",
  "What's a thought you've been believing — is it fully true?",
];

export default async function TodayPage() {
  const supabase = await createClient();

  const [{ data: intentionRows }, { data: checkInRows }] = await Promise.all([
    supabase
      .from("ic_intentions")
      .select("id, body, status, reflection, created_at, updated_at")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("ic_check_ins")
      .select("id, overall_mood, emotions, intensity, stress_level, energy_level, note, need, created_at")
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const intentions = (intentionRows ?? []) as Intention[];
  const lastCheckIn = (checkInRows ?? [])[0] as CheckIn | undefined;

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const reflection = REFLECTIONS[dayOfYear % REFLECTIONS.length];

  const checkedInToday =
    lastCheckIn &&
    new Date(lastCheckIn.created_at).toDateString() === new Date().toDateString();
  const lastMood = moodScaleMeta(lastCheckIn?.overall_mood ?? null);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Today</h1>
        <p className="mt-1 text-ink-soft">
          A calm place to begin. There&apos;s nothing you have to do here.
        </p>
      </div>

      {/* Check-in */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-dusk">Check in</p>
            <p className="mt-1 text-ink">
              {checkedInToday
                ? `You checked in today${lastMood ? ` — feeling ${lastMood.label.toLowerCase()} ${lastMood.emoji}` : ""}.`
                : "How are you, really? A quick check-in takes a minute."}
            </p>
          </div>
        </div>
        <Link
          href="/checkin"
          className="mt-4 inline-block rounded-2xl bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 ease-gentle"
        >
          {checkedInToday ? "Check in again" : "Start a check-in"}
        </Link>
      </section>

      {/* Reflection question */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <p className="text-sm font-medium text-dusk">A gentle question</p>
        <p className="mt-2 text-lg leading-relaxed text-ink">{reflection}</p>
        <Link
          href="/journal"
          className="mt-3 inline-block text-sm font-medium text-dusk hover:underline"
        >
          Write about it →
        </Link>
      </section>

      {/* Intentions */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-dusk">
            {intentions.length > 0 ? "Your intention" : "Intentions"}
          </p>
          <Link href="/intentions" className="text-sm text-dusk hover:underline">
            {intentions.length > 0 ? "Manage" : "Set one"}
          </Link>
        </div>
        {intentions.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {intentions.map((i) => (
              <li key={i.id} className="text-ink">
                🌱 {i.body}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-ink-soft">
            No active intention yet — a small, kind commitment to yourself can be
            a gentle anchor.
          </p>
        )}
      </section>
    </div>
  );
}
