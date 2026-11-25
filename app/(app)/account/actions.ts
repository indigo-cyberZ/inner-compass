"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const del1 = await supabase
    .from("ic_journal_entries")
    .delete()
    .eq("user_id", user.id);
  const del2 = await supabase
    .from("ic_profiles")
    .delete()
    .eq("id", user.id);

  if (del1.error || del2.error) {
    return { error: "Something went wrong deleting your data. Nothing partial is left unhandled — please try again." };
  }

  await supabase.auth.signOut();
  redirect("/login?deleted=1");
}
