"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      setMessage("Please use at least 8 characters.");
      return;
    }
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try the reset link again.");
      return;
    }
    setStatus("done");
    setMessage("Password updated.");
    setTimeout(() => router.push("/today"), 900);
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-ink">Set a new password</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink">
            New password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-ink outline-none transition focus:border-clay"
          />
        </div>
        {message ? (
          <p
            className={`rounded-xl px-3 py-2 text-sm ${
              status === "error" ? "bg-clay/10 text-clay" : "bg-sage/15 text-ink"
            }`}
          >
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full rounded-2xl bg-clay px-4 py-3 font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60 ease-gentle"
        >
          {status === "saving" ? "Saving…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
