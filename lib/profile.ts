import type { SupabaseClient, User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  display_name: string | null;
  role: "owner" | "standard";
  explain_level: "concise" | "standard" | "detailed";
  faith_enabled: boolean;
};

/**
 * Ensures the signed-in user has an Inner Compass profile row, creating it
 * lazily on first visit. We create profiles in-app (not via an auth.users
 * trigger) because this database is SHARED with another app and we must not
 * touch its auth triggers.
 *
 * RLS allows a user to insert/select only their own row.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<Profile | null> {
  const { data: existing } = await supabase
    .from("ic_profiles")
    .select("id, display_name, role, explain_level, faith_enabled")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing as Profile;

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ?? null;

  const { data: created } = await supabase
    .from("ic_profiles")
    .insert({ id: user.id, display_name: displayName })
    .select("id, display_name, role, explain_level, faith_enabled")
    .maybeSingle();

  return (created as Profile) ?? null;
}
