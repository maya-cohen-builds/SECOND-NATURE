
-- Modules table
CREATE TABLE public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  game text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'Intermediate',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view modules" ON public.modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own modules" ON public.modules FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own modules" ON public.modules FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own modules" ON public.modules FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Scenarios table
CREATE TABLE public.scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  game_tag text NOT NULL DEFAULT '',
  tier text NOT NULL DEFAULT 'Intermediate',
  pattern_tags text[] NOT NULL DEFAULT '{}',
  squad_size integer NOT NULL DEFAULT 1,
  roles_required jsonb NOT NULL DEFAULT '[]',
  estimated_minutes integer NOT NULL DEFAULT 10,
  scenario_script_json jsonb NOT NULL DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view scenarios" ON public.scenarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own scenarios" ON public.scenarios FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own scenarios" ON public.scenarios FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own scenarios" ON public.scenarios FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Sessions table
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid REFERENCES public.scenarios(id) ON DELETE CASCADE NOT NULL,
  mode text NOT NULL DEFAULT 'solo' CHECK (mode IN ('solo', 'squad')),
  squad_id uuid,
  status text NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby', 'running', 'completed', 'aborted')),
  host_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.sessions FOR SELECT TO authenticated USING (auth.uid() = host_user_id);
CREATE POLICY "Users can insert own sessions" ON public.sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_user_id);
CREATE POLICY "Users can update own sessions" ON public.sessions FOR UPDATE TO authenticated USING (auth.uid() = host_user_id);

-- Session participants
CREATE TABLE public.session_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own participations" ON public.session_participants FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own participations" ON public.session_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Session events
CREATE TABLE public.session_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  event_type text NOT NULL,
  role text,
  payload_json jsonb NOT NULL DEFAULT '{}'
);

ALTER TABLE public.session_events ENABLE ROW LEVEL SECURITY;

-- Allow session host to manage events
CREATE POLICY "Session events viewable by session host" ON public.session_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.host_user_id = auth.uid()));
CREATE POLICY "Session events insertable by session host" ON public.session_events FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.host_user_id = auth.uid()));

-- Scores table
CREATE TABLE public.scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_score integer NOT NULL DEFAULT 0,
  pass_fail boolean NOT NULL DEFAULT false,
  breakdown_json jsonb NOT NULL DEFAULT '{}',
  failure_point_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scores" ON public.scores FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON public.scores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON public.scenarios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
