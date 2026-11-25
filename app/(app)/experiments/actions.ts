"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ExperimentData } from "@/lib/experiments";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function startExperiment(formData: FormData) {
  const prompt = String(formData.get("prompt") ?? "").trim();
  if (!prompt) return;
  const theme = String(formData.get("theme") ?? "").trim() || undefined;

  const { supabase, user } = await requireUser();
  await supabase.from("ic_exercise_responses").insert({
    user_id: user.id,
    exercise_slug: "experiment",
    data: { prompt, theme, status: "active" } satisfies ExperimentData,
  });
  revalidatePath("/experiments");
}

async function mergeData(id: string, patch: Partial<ExperimentData>) {
  const { supabase, user } = await requireUser();
  const { data: row } = await supabase
    .from("ic_exercise_responses")
    .select("data")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("exercise_slug", "experiment")
    .maybeSingle();
  if (!row) return;
  const next = { ...(row.data as ExperimentData), ...patch };
  await supabase
    .from("ic_exercise_responses")
    .update({ data: next })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("exercise_slug", "experiment");
  revalidatePath("/experiments");
}

export async function reflectOnExperiment(id: string, formData: FormData) {
  const reflection = String(formData.get("reflection") ?? "").trim() || undefined;
  await mergeData(id, { status: "reflected", reflection });
}

export async function releaseExperiment(id: string) {
  await mergeData(id, { status: "released" });
}

export async function reactivateExperiment(id: string) {
  await mergeData(id, { status: "active" });
}

export async function deleteExperiment(id: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_exercise_responses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("exercise_slug", "experiment");
  revalidatePath("/experiments");
}
