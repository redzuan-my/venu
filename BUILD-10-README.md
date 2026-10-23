# VENU Build 10 — preview implementation

Shared **Supabase Auth identities** with Sendr; VENU has separate role grants. Existing Sendr tables/code remain untouched.

## Deployment prerequisites
1. Apply `migrations/BUILD-10.sql` to the shared Supabase project.
2. Bootstrap one super admin with the commented SQL, replacing the email.
3. Configure Vercel server-side `SUPABASE_URL` and `SUPABASE_SECRET_KEY` as in existing VENU.
4. Deploy to a **preview** environment first. Never replace production without testing.
5. Sign in at `/login` using the existing Supabase Auth email/password. Access token cookie expires within one hour; sign in again after expiry. This is shared identity, not cross-domain SSO.
6. Open `/users`; grant roles to existing Auth users. New-user invitations remain in Sendr for this build.

## Important limitations / follow-ups
- API endpoints for public registration and feedback remain public by design and need rate limiting/anti-abuse controls.
- Public event GET remains accessible for event landing pages; event writes, speaker writes, media uploads and attendance require VENU sign-in.
- No refresh-token rotation, cross-app seamless login, Microsoft 365 authentication, or email invitations built into VENU yet.
- Existing Sendr authentication is not changed. Never expose SUPABASE_SECRET_KEY to the browser.
- User list shows IDs, not emails, to avoid bulk Auth admin enumeration. Improve later with an authorised server-side lookup.
- Validate every route in preview, particularly public event registration and internal CRUD. The source is not a production-tested release.
