-- Stable mapping between Auth0 subjects and application/database identities.
-- The application user_id remains the legacy Clerk ID when email verification
-- uniquely matches an existing user.
CREATE TABLE IF NOT EXISTS public.auth_identity_links (
  auth0_subject text PRIMARY KEY,
  app_user_id text NOT NULL,
  email text,
  linked_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS auth_identity_links_app_user_id_idx
  ON public.auth_identity_links(app_user_id);

ALTER TABLE public.auth_identity_links ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.auth_identity_links FROM PUBLIC, anon, authenticated;

-- Backfill SQL is application-assisted:
-- 1. Login creates auth_identity_links only after verified-email matching.
-- 2. syncApplicationUser updates games.user_id from its Auth0 subject to app_user_id.
-- 3. Repeat migration/application sync for every linked subject.
