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

export async function saveIdentityReflection(
  answers: Record<string, string>,
): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("ic_exercise_responses").insert({
    user_id: user.id,
    exercise_slug: "identity-reflection",
    data: { answers },
  });
  if (error) return { ok: false, error: "Couldn't save your reflection." };
  revalidatePath("/explore/discover-who-i-am");
  return { ok: true };
}

export async function deleteIdentityReflection(id: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_exercise_responses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("exercise_slug", "identity-reflection");
  revalidatePath("/explore/discover-who-i-am");
}
