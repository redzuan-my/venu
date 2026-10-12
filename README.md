# VENU Build 8 — Functional Frontend Test Build

This build applies the reviewed UI repairs and wires the core participant lifecycle for testing.

## Core test path
1. Open an event workspace.
2. Open the public Landing Page.
3. Submit the Registration form.
4. Confirm redirect to the event Thank You Page.
5. Return to Workspace → Attendance and confirm the registrant appears.
6. Mark the registrant Arrived.
7. Open the public Feedback form and submit feedback.
8. Return to Workspace → Analytics and confirm the response is reflected after refresh.

## Repairs included
- Event Readiness forced back to a vertical checklist.
- Landing Page live preview widened.
- Registration admin preview now renders the registration form itself rather than the whole landing page.
- Feedback admin layout changed to question setup + large participant preview.
- Feedback full preview uses a proper button treatment.
- Registration close datetime keeps Malaysia local-time handling from the prior fix.
- Speaker library reads real Supabase speakers; Add/Edit speaker is now wired.
- Public landing page renders speakers attached to the event.
- Registration submission persists to Supabase.
- Attendance reads registrations and Mark Arrived persists to Supabase.
- Feedback submission persists to Supabase and feeds Analytics.
- Registration Confirmation email editor persists its existing event email fields and has a live preview.
- Templates now have working V1 preview modals across Registration, Feedback and Email tabs.

## Intentionally not faked
- Actual outbound email delivery is not claimed as working: no SMTP/email provider is configured in this codebase.
- Event Reminder and Post-Event Thank You sending are visibly marked Coming next rather than presented as working controls.
- User authentication/invitations remain a shell until the core lifecycle test is stable.

## Existing Vercel environment variables
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
