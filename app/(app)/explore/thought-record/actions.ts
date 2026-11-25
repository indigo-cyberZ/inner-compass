"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ThoughtRecordData } from "@/lib/exercises";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function saveThoughtRecord(
  data: ThoughtRecordData,
): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("ic_exercise_responses").insert({
    user_id: user.id,
    exercise_slug: "thought-record",
    data,
  });
  if (error) {
    return { ok: false, error: "Couldn't save this right now. Please try again." };
  }
  revalidatePath("/explore/thought-record");
  return { ok: true };
}

export async function deleteThoughtRecord(id: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_exercise_responses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/explore/thought-record");
}
