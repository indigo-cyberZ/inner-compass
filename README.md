# Inner Compass

A private-first emotional wellness and self-discovery web app. Personal use
first, invite-only family testing later, possible public release after review.

**Not** therapy, diagnosis, or an emergency service.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase Auth + Postgres with Row Level Security
- Vercel for hosting
- Anthropic Claude API (later phase; server-side only, consent-gated)

## Milestone 1 (this scaffold)

- App shell with 5 sections (Today / Journal / Explore / Learn / Insights)
- Email + password auth (sign in, sign out, password reset) — **public signup disabled**
- Server-side auth enforcement (middleware + per-layout re-check)
- `profiles`, `feature_flags`, `user_roles` tables with RLS

## Local setup

1. `npm install`
2. Create a **separate** Supabase project (not shared with any other app).
3. Apply `supabase/migrations/0001_init.sql` to it (SQL editor or CLI).
4. Copy `.env.local.example` to `.env.local` and fill in the values.
5. `npm run dev` → http://localhost:3000

## Security notes

- RLS denies by default; policies grant each user access to only their own rows.
- The `service_role` key is server-only and must never be `NEXT_PUBLIC_*`.
- Never commit `.env.local`, secrets, or real journal content.
- Verify access control with two accounts before trusting any new table.

## Roadmap

See the project plan. Stages: Foundation → Journal → Check-ins → Exercises →
Library → AI companion → Insights → Public-readiness review.
