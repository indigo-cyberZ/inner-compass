"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CheckInInput = {
  overall_mood: number | null;
  emotions: string[];
  intensity: number | null;
  stress_level: number | null;
  energy_level: number | null;
  note: string | null;
  need: string | null;
};

export async function createCheckIn(
  input: CheckInInput,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("ic_check_ins").insert({
    user_id: user.id,
    overall_mood: input.overall_mood,
    emotions: input.emotions,
    intensity: input.intensity,
    stress_level: input.stress_level,
    energy_level: input.energy_level,
    note: input.note?.trim() || null,
    need: input.need?.trim() || null,
  });

  if (error) {
    return { ok: false, error: "Couldn't save your check-in. Please try again." };
  }
  return { ok: true };
}
