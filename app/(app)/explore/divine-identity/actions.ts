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

export async function saveFaithReflection(
  answers: Record<string, string>,
): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("ic_exercise_responses").insert({
    user_id: user.id,
    exercise_slug: "divine-identity",
    data: { answers },
  });
  if (error) return { ok: false, error: "Couldn't save your reflection." };
  revalidatePath("/explore/divine-identity");
  return { ok: true };
}

export async function deleteFaithReflection(id: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_exercise_responses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("exercise_slug", "divine-identity");
  revalidatePath("/explore/divine-identity");
}
