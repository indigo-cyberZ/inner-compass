"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

/** Creates a blank draft entry server-side and opens it. */
export async function createEntry() {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("ic_journal_entries")
    .insert({ user_id: user.id })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("Could not create a new entry.");
  }
  redirect(`/journal/${data.id}`);
}

export type SaveResult = { ok: boolean; savedAt?: string; error?: string };

/** Autosave / manual save for an entry. RLS + explicit user_id guard. */
export async function updateEntry(input: {
  id: string;
  title: string;
  body: string;
  mood: string | null;
  tags: string[];
  entry_date: string;
  ai_shareable: boolean;
}): Promise<SaveResult> {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("ic_journal_entries")
    .update({
      title: input.title.trim() || null,
      body: input.body,
      mood: input.mood,
      tags: input.tags,
      entry_date: input.entry_date,
      ai_shareable: input.ai_shareable,
    })
    .eq("id", input.id)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, error: "Couldn't save. Check your connection." };
  }
  return { ok: true, savedAt: new Date().toISOString() };
}

export async function deleteEntry(id: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_journal_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/journal");
  redirect("/journal");
}
