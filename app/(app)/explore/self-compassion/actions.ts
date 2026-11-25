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

export async function saveKindWords(
  phrase: string,
): Promise<{ ok: boolean; error?: string }> {
  const text = phrase.trim();
  if (!text) return { ok: false, error: "Nothing to save yet." };
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("ic_exercise_responses").insert({
    user_id: user.id,
    exercise_slug: "self-compassion",
    data: { phrase: text },
  });
  if (error) return { ok: false, error: "Couldn't save that right now." };
  revalidatePath("/explore/self-compassion");
  return { ok: true };
}

export async function deleteKindWords(id: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_exercise_responses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("exercise_slug", "self-compassion");
  revalidatePath("/explore/self-compassion");
}
