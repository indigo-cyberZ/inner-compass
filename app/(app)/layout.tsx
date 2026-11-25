import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/profile";
import { BottomNav, SideNav } from "@/components/nav/BottomNav";
import { SignOutButton } from "@/components/nav/SignOutButton";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth gate. Middleware already redirects, but we re-check here
  // so protected data never renders for an unauthenticated request.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ensure the user's profile exists (created lazily — no auth.users trigger,
  // since this database is shared with another app). RLS scopes it to them.
  const profile = await ensureProfile(supabase, user);
  const name = profile?.display_name ?? null;

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl">
      <SideNav />
      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-surface/80 px-4 py-3 backdrop-blur">
          <span className="text-sm text-ink-soft">
            {name ? `Hi, ${name}` : "Welcome"}
          </span>
          <SignOutButton />
        </header>
        <main className="flex-1 px-4 py-6">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
