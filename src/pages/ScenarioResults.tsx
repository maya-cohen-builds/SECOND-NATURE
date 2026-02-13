import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { ScenarioScore, FailurePoint } from '@/data/scenarioTypes';

export default function ScenarioResults() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: score, isLoading: scoreLoading } = useQuery({
    queryKey: ['score', sessionId],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('scores') as any)
        .select('*')
        .eq('session_id', sessionId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
  });

  const { data: session } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('sessions') as any)
        .select('*, scenarios(*)')
        .eq('id', sessionId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
  });

  const { data: sessionEvents } = useQuery({
    queryKey: ['session-events', sessionId],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('session_events') as any)
        .select('*')
        .eq('session_id', sessionId!)
        .order('timestamp', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!sessionId,
  });

  if (scoreLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-spin text-primary text-2xl">◎</span>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Results not found.</p>
        <button onClick={() => navigate('/modules')} className="text-primary text-sm hover:underline mt-2">← Modules</button>
      </div>
    );
  }

  const breakdown = score.breakdown_json as unknown as ScenarioScore;
  const failures = (score.failure_point_json || []) as unknown as FailurePoint[];
  const scenarioData = (session as any)?.scenarios;
  const totalPct = breakdown.maxScore > 0 ? Math.round((breakdown.totalScore / breakdown.maxScore) * 100) : 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={() => navigate('/modules')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
        ← Back to Modules
      </button>

      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Scenario Results</p>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {scenarioData?.name || 'Scenario'}
        </h1>
      </div>

      {/* Score overview */}
      <div className="p-6 rounded-lg bg-gradient-card border border-border text-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full font-display text-3xl font-bold ${
          score.pass_fail ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
        }`}>
          {totalPct}%
        </div>
        <p className="font-display text-lg font-semibold text-foreground mt-3">
          {score.pass_fail ? 'PASS' : 'FAIL'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {breakdown.passReason}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {breakdown.totalScore} / {breakdown.maxScore} points
        </p>
      </div>

      {/* Phase breakdown */}
      <div className="p-5 rounded-lg bg-card border border-border space-y-3">
        <h3 className="font-display font-semibold text-foreground">Phase Breakdown</h3>
        {breakdown.phaseScores?.map(phase => {
          const phasePct = phase.maxScore > 0 ? Math.round((phase.score / phase.maxScore) * 100) : 0;
          return (
            <div key={phase.phaseId} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{phase.phaseName}</span>
                <span className="text-sm font-display font-semibold text-foreground">{phasePct}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${phasePct >= 70 ? 'bg-success' : phasePct >= 40 ? 'bg-accent' : 'bg-destructive'}`}
                  style={{ width: `${phasePct}%` }}
                />
              </div>
              <div className="space-y-0.5">
                {phase.details?.map((d, i) => (
                  <p key={i} className="text-[10px] text-muted-foreground pl-2">{d}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pattern tag scores */}
      {breakdown.patternTagScores && breakdown.patternTagScores.length > 0 && (
        <div className="p-5 rounded-lg bg-card border border-border space-y-2">
          <h3 className="font-display font-semibold text-foreground">Pattern Tags</h3>
          <div className="flex flex-wrap gap-2">
            {breakdown.patternTagScores.map(tag => (
              <span key={tag.tag} className="px-2 py-1 rounded text-xs bg-secondary text-muted-foreground border border-border">
                {tag.tag}: {tag.maxScore > 0 ? Math.round((tag.score / tag.maxScore) * 100) : 0}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dimension scores */}
      {breakdown.dimensionScores && (
        <div className="p-5 rounded-lg bg-card border border-border space-y-3">
          <h3 className="font-display font-semibold text-foreground">Scoring Dimensions</h3>
          {Object.entries(breakdown.dimensionScores).map(([dim, val]) => (
            <div key={dim} className="flex items-center justify-between">
              <span className="text-sm text-foreground capitalize">{dim.replace('_', ' ')}</span>
              <span className="font-display font-semibold text-sm text-foreground">{val}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Failure points */}
      {failures.length > 0 && (
        <div className="p-5 rounded-lg bg-destructive/5 border border-destructive/20 space-y-3">
          <h3 className="font-display font-semibold text-destructive">Where It Broke</h3>
          {failures.map((fp, i) => (
            <div key={i} className="p-3 rounded bg-card border border-border space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-destructive font-semibold">Phase: {fp.phaseName}</span>
                {fp.eventName && <span className="text-muted-foreground">· Event: {fp.eventName}</span>}
              </div>
              <p className="text-xs text-muted-foreground">Rule: {fp.ruleViolated}</p>
              <p className="text-xs text-foreground">{fp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Action timeline */}
      {sessionEvents && sessionEvents.length > 0 && (
        <div className="p-5 rounded-lg bg-card border border-border space-y-2">
          <h3 className="font-display font-semibold text-foreground">Action Timeline</h3>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {sessionEvents.map(evt => (
              <div key={evt.id} className="flex items-center gap-2 text-[10px]">
                <span className="text-muted-foreground font-mono w-20 shrink-0">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
                <span className={`px-1 rounded ${
                  evt.event_type === 'action' ? 'bg-primary/10 text-primary' :
                  evt.event_type === 'signal' ? 'bg-accent/10 text-accent' :
                  evt.event_type === 'phase_transition' ? 'bg-secondary text-foreground' :
                  'bg-secondary text-muted-foreground'
                }`}>
                  {evt.event_type}
                </span>
                {evt.role && <span className="text-muted-foreground">[{evt.role}]</span>}
                <span className="text-foreground">
                  {(evt.payload_json as any)?.actionLabel || (evt.payload_json as any)?.signal || (evt.payload_json as any)?.fromPhase || ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token rewards */}
      {breakdown.tokenRewards && breakdown.tokenRewards.length > 0 && (
        <div className="p-5 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
          <h3 className="font-display font-semibold text-primary">Token Rewards</h3>
          {breakdown.tokenRewards.map((tr, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{tr.reason}</span>
              <span className="font-display font-semibold text-primary">+{tr.amount}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm border-t border-primary/20 pt-2 mt-1">
            <span className="text-foreground font-semibold">Total</span>
            <span className="font-display font-bold text-primary">
              +{breakdown.tokenRewards.reduce((sum, tr) => sum + tr.amount, 0)}
            </span>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate(`/scenario-run/${(session as any)?.scenario_id}`)}
          className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
        >
          Run Again
        </button>
        <button
          onClick={() => navigate('/modules')}
          className="px-5 py-2.5 rounded-lg bg-secondary border border-border text-muted-foreground font-medium text-sm hover:text-foreground transition-all"
        >
          Back to Modules
        </button>
      </div>
    </div>
  );
}
