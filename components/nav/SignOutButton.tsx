import { signOut } from "@/app/(auth)/login/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-xl px-3 py-1.5 text-sm text-ink-soft transition hover:bg-surface-2 hover:text-ink"
      >
        Sign out
      </button>
    </form>
  );
}
