import Link from "next/link";
import { Grounding } from "@/components/meditate/Grounding";

export default function GroundingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/meditate" className="text-sm text-dusk hover:underline">
        ← Meditation
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-ink">5-4-3-2-1 grounding</h1>
        <p className="mt-1 text-sm text-ink-soft">
          A simple way to come back to the present through your senses — no
          breathing focus required. Helpful when things feel overwhelming or far
          away.
        </p>
      </div>
      <Grounding />
    </div>
  );
}
