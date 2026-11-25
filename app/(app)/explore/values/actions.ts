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

function clampImportance(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 1 && n <= 5 ? Math.round(n) : 3;
}

export async function addValue(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const definition = String(formData.get("definition") ?? "").trim();
  const importance = clampImportance(formData.get("importance"));

  const { supabase, user } = await requireUser();
  await supabase.from("ic_exercise_responses").insert({
    user_id: user.id,
    exercise_slug: "value",
    data: { name, definition, importance },
  });
  revalidatePath("/explore/values");
}

export async function updateValue(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const definition = String(formData.get("definition") ?? "").trim();
  const importance = clampImportance(formData.get("importance"));

  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_exercise_responses")
    .update({ data: { name, definition, importance } })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("exercise_slug", "value");
  revalidatePath("/explore/values");
}

export async function deleteValue(id: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_exercise_responses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("exercise_slug", "value");
  revalidatePath("/explore/values");
}

export async function saveValuesReflection(
  answers: Record<string, string>,
): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("ic_exercise_responses").insert({
    user_id: user.id,
    exercise_slug: "values-reflection",
    data: { answers },
  });
  if (error) return { ok: false, error: "Couldn't save your reflection." };
  revalidatePath("/explore/values");
  return { ok: true };
}
