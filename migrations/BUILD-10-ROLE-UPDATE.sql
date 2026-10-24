-- Run once in the same Supabase project before deploying this update.
ALTER TABLE public.venu_user_access DROP CONSTRAINT IF EXISTS venu_user_access_role_check;
ALTER TABLE public.venu_user_access ADD CONSTRAINT venu_user_access_role_check CHECK (role IN ('super_admin','organiser','contributor'));
