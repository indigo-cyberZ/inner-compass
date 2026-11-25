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

export async function toggleBookmark(resourceId: string) {
  const { supabase, user } = await requireUser();
  const { data: existing } = await supabase
    .from("ic_resource_bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("resource_id", resourceId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("ic_resource_bookmarks")
      .delete()
      .eq("id", existing.id)
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("ic_resource_bookmarks")
      .insert({ user_id: user.id, resource_id: resourceId });
  }
  revalidatePath("/learn");
}

export async function saveNote(resourceId: string, formData: FormData) {
  const note = String(formData.get("note") ?? "").trim();
  const { supabase, user } = await requireUser();

  if (!note) {
    await supabase
      .from("ic_resource_notes")
      .delete()
      .eq("user_id", user.id)
      .eq("resource_id", resourceId);
  } else {
    await supabase
      .from("ic_resource_notes")
      .upsert(
        { user_id: user.id, resource_id: resourceId, note },
        { onConflict: "user_id,resource_id" },
      );
  }
  revalidatePath("/learn");
}
