CREATE TABLE public.early_access_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 email text NOT NULL UNIQUE,
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT normalized_email CHECK (email = lower(trim(email)) AND length(email) <= 254)
);
GRANT ALL ON public.early_access_requests TO service_role;
ALTER TABLE public.early_access_requests ENABLE ROW LEVEL SECURITY;