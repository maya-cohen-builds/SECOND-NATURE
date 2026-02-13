// Types for the scenario training system

export interface ScenarioRole {
  name: string;
  description?: string;
}

export interface ScenarioAction {
  id: string;
  label: string;
  role: string;
  timingWindowSeconds: number; // how long the player has to act
  correctChoice?: string; // for decision scoring
  points: number;
}

export interface ScenarioEvent {
  id: string;
  name: string;
  description: string;
  triggerType: 'timed' | 'phase_start' | 'manual';
  triggerDelaySeconds?: number;
  actions: ScenarioAction[];
}

export interface ScenarioPhase {
  id: string;
  name: string;
  objective: string;
  durationSeconds: number;
  events: ScenarioEvent[];
}

export interface ScoringRule {
  id: string;
  dimension: 'timing' | 'decision' | 'coordination' | 'signal_efficiency' | 'stability';
  description: string;
  weight: number; // 0-1
  passThreshold: number; // minimum score 0-100
}

export interface ScenarioScript {
  metadata: {
    version: string;
    description: string;
  };
  initialState: Record<string, unknown>;
  phases: ScenarioPhase[];
  scoringRules: ScoringRule[];
  passThreshold: number; // overall pass score 0-100
  allowedSignals: string[];
}

// Runtime types
export interface SessionEvent {
  id: string;
  timestamp: number; // ms from session start
  eventType: 'action' | 'signal' | 'phase_transition' | 'event_trigger' | 'session_start' | 'session_end';
  role?: string;
  payload: Record<string, unknown>;
}

export interface PhaseScore {
  phaseId: string;
  phaseName: string;
  score: number;
  maxScore: number;
  details: string[];
}

export interface PatternTagScore {
  tag: string;
  score: number;
  maxScore: number;
}

export interface FailurePoint {
  phaseId: string;
  phaseName: string;
  eventId?: string;
  eventName?: string;
  ruleViolated: string;
  description: string;
}

export interface ScenarioScore {
  totalScore: number;
  maxScore: number;
  passFail: boolean;
  passReason: string;
  phaseScores: PhaseScore[];
  patternTagScores: PatternTagScore[];
  failurePoints: FailurePoint[];
  dimensionScores: Record<string, number>;
  tokenRewards: { amount: number; reason: string }[];
}

// DB row types (matching Supabase)
export interface ModuleRow {
  id: string;
  name: string;
  description: string;
  tags: string[];
  game: string;
  difficulty: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScenarioRow {
  id: string;
  module_id: string;
  name: string;
  game_tag: string;
  tier: string;
  pattern_tags: string[];
  squad_size: number;
  roles_required: ScenarioRole[];
  estimated_minutes: number;
  scenario_script_json: ScenarioScript;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
