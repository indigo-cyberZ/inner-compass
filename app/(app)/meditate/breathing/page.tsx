import Link from "next/link";
import { BreathingPacer } from "@/components/meditate/BreathingPacer";

export default function BreathingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/meditate" className="text-sm text-dusk hover:underline">
        ← Meditation
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-ink">Guided breathing</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Let the circle guide your pace — breathe in as it grows, out as it
          shrinks. If it ever feels off, just breathe naturally.
        </p>
      </div>
      <BreathingPacer />
    </div>
  );
}
