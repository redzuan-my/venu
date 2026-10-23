-- Run in the SAME Supabase project as Sendr. Does not modify Sendr tables.
create table if not exists public.venu_user_access (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('super_admin','organiser')),
 active boolean not null default true,
 created_at timestamptz not null default now()
);
alter table public.venu_user_access enable row level security;
-- No anon/authenticated policies: only trusted server-side service key may manage grants.
-- Bootstrap first VENU administrator by replacing the email below and running separately:
-- insert into public.venu_user_access(user_id,role) select id,'super_admin' from auth.users where email='YOUR_ADMIN_EMAIL' on conflict(user_id) do update set role='super_admin',active=true;
