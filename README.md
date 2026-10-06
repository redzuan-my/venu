# VENU Build 3 — Real Backend Foundation

This build replaces fake local event saving with the real Supabase-backed foundation.

## Working in Build 3
- Create event -> saves to Supabase `events`
- Draft / Publish status
- Desktop + mobile hero uploads -> `venu-media`
- Create reusable speaker + photo upload
- Link selected speakers to event
- Saved Events list reads from Supabase
- Saved Event Workspace reads the real event
- Public `/e/[slug]` page renders the saved event
- `/e/[slug]/thank-you` renders the event-specific Thank You Page
- Thank-you email configuration is stored (delivery comes in later email build)

## Required Vercel environment variables
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` (can remain; not used for privileged server operations yet)
- `SUPABASE_SECRET_KEY` — REQUIRED for Build 3 server-side database/storage operations
- `NEXT_PUBLIC_APP_URL` (optional for now)
- `NEXT_PUBLIC_EVENT_URL` (optional for now)

Never prefix `SUPABASE_SECRET_KEY` with `NEXT_PUBLIC_`.

## Test
Create a fresh event. Upload both heroes, create a speaker, save/publish. You should land in that event's Workspace. Then open the Landing Page and Thank You Page.
