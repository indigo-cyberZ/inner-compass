import Link from "next/link";
import { BodyScan } from "@/components/meditate/BodyScan";

export default function BodyScanPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/meditate" className="text-sm text-dusk hover:underline">
        ← Meditation
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-ink">Body scan</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Move your attention slowly through the body, letting each part soften.
          Find a comfortable position, seated or lying down.
        </p>
      </div>
      <BodyScan />
    </div>
  );
}
