import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Exports everything Inner Compass holds for the signed-in user as a JSON
 * download. RLS + explicit user_id scoping guarantee it's only their data.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const [{ data: profile }, { data: entries }] = await Promise.all([
    supabase.from("ic_profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("ic_journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  const payload = {
    app: "Inner Compass",
    exported_at: new Date().toISOString(),
    account: { id: user.id, email: user.email ?? null },
    profile: profile ?? null,
    journal_entries: entries ?? [],
  };

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="inner-compass-export-${date}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
