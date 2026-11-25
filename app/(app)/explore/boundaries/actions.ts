"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BoundaryData } from "@/lib/boundaries";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function saveBoundary(
  data: BoundaryData,
): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("ic_exercise_responses").insert({
    user_id: user.id,
    exercise_slug: "boundaries",
    data,
  });
  if (error) return { ok: false, error: "Couldn't save this right now." };
  revalidatePath("/explore/boundaries");
  return { ok: true };
}

export async function deleteBoundary(id: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_exercise_responses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("exercise_slug", "boundaries");
  revalidatePath("/explore/boundaries");
}
