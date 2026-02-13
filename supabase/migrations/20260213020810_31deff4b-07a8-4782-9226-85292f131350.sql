
-- drill_runs table
CREATE TABLE public.drill_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  drill_id text NOT NULL,
  drill_name text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL,
  rating text NOT NULL,
  squad_size integer NOT NULL DEFAULT 1,
  badges_earned integer NOT NULL DEFAULT 0,
  skill_tier_label text NOT NULL DEFAULT 'unranked',
  metrics_json jsonb DEFAULT '{}'::jsonb,
  notes text,
  source text DEFAULT 'app',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.drill_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own drill_runs" ON public.drill_runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own drill_runs" ON public.drill_runs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own drill_runs" ON public.drill_runs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own drill_runs" ON public.drill_runs FOR DELETE USING (auth.uid() = user_id);

-- tokens_ledger table
CREATE TABLE public.tokens_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  reason text NOT NULL,
  reference_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tokens_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tokens" ON public.tokens_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tokens" ON public.tokens_ledger FOR INSERT WITH CHECK (auth.uid() = user_id);

-- entitlements table
CREATE TABLE public.entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entitlement_key text NOT NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  UNIQUE (user_id, entitlement_key)
);

ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entitlements" ON public.entitlements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own entitlements" ON public.entitlements FOR INSERT WITH CHECK (auth.uid() = user_id);
