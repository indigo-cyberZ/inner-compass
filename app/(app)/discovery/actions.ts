"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DISCOVERY_CATEGORIES } from "@/lib/discovery";

const VALID = new Set(DISCOVERY_CATEGORIES.map((c) => c.key as string));

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function addDiscoveryItem(formData: FormData) {
  const category = String(formData.get("category") ?? "");
  const text = String(formData.get("text") ?? "").trim();
  if (!text || !VALID.has(category)) return;

  const { supabase, user } = await requireUser();
  await supabase.from("ic_exercise_responses").insert({
    user_id: user.id,
    exercise_slug: "discovery-item",
    data: { category, text, source: "user" },
  });
  revalidatePath("/discovery");
}

export async function updateDiscoveryItem(id: string, formData: FormData) {
  const category = String(formData.get("category") ?? "");
  const text = String(formData.get("text") ?? "").trim();
  if (!text || !VALID.has(category)) return;

  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_exercise_responses")
    .update({ data: { category, text, source: "user" } })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("exercise_slug", "discovery-item");
  revalidatePath("/discovery");
}

export async function deleteDiscoveryItem(id: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_exercise_responses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("exercise_slug", "discovery-item");
  revalidatePath("/discovery");
}
