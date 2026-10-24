# Shared User Access — VENU implementation

This update adds VENU + Sendr role assignment to the VENU User Access form, reuses existing Supabase Auth accounts, and invites new accounts via Supabase Auth. It does NOT yet implement a matching shared drawer inside Sendr or branded email delivery. Sendr existing role names are `super_admin` (global), `admin` and `member` (per entity). `Marketing` and `Entity Admin` are not distinct database roles in this source snapshot. Existing Sendr super admins can be changed by VENU super admins; verify governance before production.

## Required backend grants
The VENU server-side Supabase secret key must have access to `sendr_super_admins` and `sendr_user_access` for SELECT/INSERT/UPDATE/DELETE. Do not deploy to production without reviewing least privilege and the app-admin trust boundary. Invite email is Supabase default until branded email is configured.

## Validation
Source patched but not live tested against the target Supabase project. The VENU frontend/backend requires a normal build check in the preview environment. This is NOT the final agreed dual-app branded-invitation release.
