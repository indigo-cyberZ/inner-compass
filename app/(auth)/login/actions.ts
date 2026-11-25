"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Email + password sign-in. Public signup is intentionally NOT implemented:
 * accounts are created manually (invite-only) during private development.
 */
export async function signIn(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately generic — do not reveal whether the email exists.
    return { error: "We couldn't sign you in. Check your details and try again." };
  }

  redirect("/today");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Sends a password reset link. Always reports success to avoid leaking
 * which emails have accounts.
 */
export async function requestPasswordReset(
  _prevState: { message: string | null; error: string | null },
  formData: FormData,
): Promise<{ message: string | null; error: string | null }> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { message: null, error: "Please enter your email." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/account/update-password`,
  });

  return {
    message:
      "If an account exists for that email, a reset link is on its way.",
    error: null,
  };
}
