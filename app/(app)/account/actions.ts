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

/**
 * Permanently deletes all of the signed-in user's Inner Compass data.
 * Does NOT delete the shared auth login (that account is shared with another
 * app and cannot be removed from a user session). RLS also scopes these.
 */
export async function deleteMyData(
  _prev: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const confirm = String(formData.get("confirm") ?? "");
  if (confirm !== "DELETE") {
    return { error: 'Please type DELETE (all caps) to confirm.' };
  }

  const { supabase, user } = await requireUser();

  const del1 = await supabase
    .from("ic_journal_entries")
    .delete()
    .eq("user_id", user.id);
  const del2 = await supabase
    .from("ic_exercise_responses")
    .delete()
    .eq("user_id", user.id);
  const del3 = await supabase.from("ic_check_ins").delete().eq("user_id", user.id);
  const del4 = await supabase.from("ic_intentions").delete().eq("user_id", user.id);
  const del5 = await supabase.from("ic_profiles").delete().eq("id", user.id);

  if (del1.error || del2.error || del3.error || del4.error || del5.error) {
    return {
      error:
        "Something went wrong deleting your data. Please try again — nothing is left half-done on retry.",
    };
  }

  await supabase.auth.signOut();
  redirect("/login?deleted=1");
}

/** Toggle the per-account faith features preference (private to each user). */
export async function setFaithEnabled(enabled: boolean): Promise<{ ok: boolean }> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("ic_profiles")
    .update({ faith_enabled: enabled })
    .eq("id", user.id);
  revalidatePath("/account");
  revalidatePath("/explore");
  return { ok: !error };
}
