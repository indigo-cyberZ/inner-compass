"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { IntentionStatus } from "@/lib/intentions";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function createIntention(formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  const { supabase, user } = await requireUser();
  await supabase.from("ic_intentions").insert({ user_id: user.id, body });
  revalidatePath("/intentions");
  revalidatePath("/today");
}

export async function setIntentionStatus(id: string, status: IntentionStatus) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_intentions")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/intentions");
  revalidatePath("/today");
}

export async function saveIntentionReflection(id: string, formData: FormData) {
  const reflection = String(formData.get("reflection") ?? "").trim() || null;
  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_intentions")
    .update({ reflection })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/intentions");
}

export async function deleteIntention(id: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("ic_intentions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/intentions");
  revalidatePath("/today");
}
