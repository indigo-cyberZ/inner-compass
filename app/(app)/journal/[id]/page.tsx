import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { JournalEntry } from "@/lib/journal";
import { Editor } from "@/components/journal/Editor";

export const dynamic = "force-dynamic";

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // RLS guarantees a user can only fetch their own entry.
  const { data } = await supabase
    .from("ic_journal_entries")
    .select("id, title, body, mood, tags, ai_shareable, entry_date, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const entry = data as JournalEntry;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/journal"
        className="inline-flex items-center gap-1 text-sm text-dusk hover:underline"
      >
        ← Back to journal
      </Link>
      <div className="mt-4">
        <Editor entry={entry} />
      </div>
    </div>
  );
}
