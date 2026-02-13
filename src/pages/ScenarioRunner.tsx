import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { computeScore } from '@/lib/scenarioEngine';
import type { ScenarioRow, ScenarioScript, ScenarioPhase, SessionEvent, ScenarioRole } from '@/data/scenarioTypes';

const SIGNALS = ['Hold', 'Reset', 'Again', 'Clean', 'Pause'] as const;

export default function ScenarioRunner() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Pre-run state
  const [mode, setMode] = useState<'solo' | 'squad'>('solo');
  const [selectedRole, setSelectedRole] = useState('');
  const [started, setStarted] = useState(false);

  // Runtime state
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [activeEvents, setActiveEvents] = useState<Set<string>>(new Set());
  const [activeSignal, setActiveSignal] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const eventsRef = useRef<SessionEvent[]>([]);

  const { data: scenario, isLoading } = useQuery({
    queryKey: ['scenario', scenarioId],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('scenarios') as any)
        .select('*')
        .eq('id', scenarioId!)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as ScenarioRow | null;
    },
    enabled: !!scenarioId,
  });

  const script: ScenarioScript | null = scenario?.scenario_script_json || null;
  const roles: ScenarioRole[] = (scenario?.roles_required || []) as ScenarioRole[];
  const currentPhase: ScenarioPhase | null = script?.phases[currentPhaseIdx] || null;

  // Keep ref in sync
  useEffect(() => { eventsRef.current = events; }, [events]);

  // Timer
  useEffect(() => {
    if (!started || finished || !currentPhase) return;

    setPhaseTimeLeft(currentPhase.durationSeconds);
    const interval = setInterval(() => {
      setPhaseTimeLeft(prev => {
        if (prev <= 1) {
          // Advance phase
          if (script && currentPhaseIdx < script.phases.length - 1) {
            const nextIdx = currentPhaseIdx + 1;
            setCurrentPhaseIdx(nextIdx);
            addEvent('phase_transition', { fromPhase: currentPhase.id, toPhase: script.phases[nextIdx].id });
            return script.phases[nextIdx].durationSeconds;
          } else {
            endSession();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = interval;
    return () => clearInterval(interval);
  }, [started, currentPhaseIdx, finished]);

  // Trigger timed events
  useEffect(() => {
    if (!started || finished || !currentPhase) return;

    currentPhase.events.forEach(event => {
      if (event.triggerType === 'timed' && event.triggerDelaySeconds) {
        const timeout = setTimeout(() => {
          setActiveEvents(prev => new Set([...prev, event.id]));
          addEvent('event_trigger', { eventId: event.id, eventName: event.name });
        }, event.triggerDelaySeconds * 1000);
        return () => clearTimeout(timeout);
      } else if (event.triggerType === 'phase_start') {
        setActiveEvents(prev => new Set([...prev, event.id]));
      }
    });
  }, [started, currentPhaseIdx, finished]);

  const addEvent = useCallback((type: SessionEvent['eventType'], payload: Record<string, unknown>, role?: string) => {
    const evt: SessionEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now() - sessionStartTime,
      eventType: type,
      role,
      payload,
    };
    setEvents(prev => [...prev, evt]);
  }, [sessionStartTime]);

  const handleStart = async () => {
    if (!user || !scenario || !script) return;

    // Create session in DB
    const { data: session, error } = await (supabase.from('sessions') as any).insert({
      scenario_id: scenario.id,
      mode,
      host_user_id: user.id,
      status: 'running',
      started_at: new Date().toISOString(),
    }).select('id').single();

    if (error || !session) return;

    // Add participant
    await (supabase.from('session_participants') as any).insert({
      session_id: session.id,
      user_id: user.id,
      role: selectedRole || roles[0]?.name || 'Player',
    });

    localStorage.setItem('sn-active-session', session.id);
    setSessionStartTime(Date.now());
    setStarted(true);
    setCurrentPhaseIdx(0);
    setEvents([{
      id: 'start',
      timestamp: 0,
      eventType: 'session_start',
      payload: { mode, role: selectedRole },
    }]);
  };

  const handleAction = (actionId: string, actionLabel: string) => {
    const responseTimeMs = Date.now() - sessionStartTime;
    addEvent('action', {
      actionId,
      actionLabel,
      phaseId: currentPhase?.id,
      responseTimeMs,
      choice: actionLabel, // simplified: label is the choice
    }, selectedRole);
  };

  const handleSignal = (signal: string) => {
    setActiveSignal(signal);
    addEvent('signal', { signal }, selectedRole);
    setTimeout(() => setActiveSignal(null), 2000);
  };

  const endSession = useCallback(async () => {
    if (finished) return;
    setFinished(true);
    clearInterval(timerRef.current);

    const finalEvents = [...eventsRef.current, {
      id: 'end',
      timestamp: Date.now() - sessionStartTime,
      eventType: 'session_end' as const,
      payload: {},
    }];

    const sessionId = localStorage.getItem('sn-active-session');
    if (!sessionId || !user || !script || !scenario) return;

    // Update session
    await (supabase.from('sessions') as any).update({
      status: 'completed',
      ended_at: new Date().toISOString(),
    }).eq('id', sessionId);

    // Store events
    for (const evt of finalEvents) {
      await (supabase.from('session_events') as any).insert({
        session_id: sessionId,
        event_type: evt.eventType,
        role: evt.role || null,
        payload_json: evt.payload,
        timestamp: new Date(sessionStartTime + evt.timestamp).toISOString(),
      });
    }

    // Compute and store score
    const score = computeScore(script, finalEvents, scenario.pattern_tags || []);
    await (supabase.from('scores') as any).insert({
      session_id: sessionId,
      user_id: user.id,
      total_score: score.totalScore,
      pass_fail: score.passFail,
      breakdown_json: score,
      failure_point_json: score.failurePoints.length > 0 ? score.failurePoints : null,
    });

    // Navigate to results
    navigate(`/scenario-results/${sessionId}`);
  }, [finished, sessionStartTime, user, script, scenario, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-spin text-primary text-2xl">◎</span>
      </div>
    );
  }

  if (!scenario || !script) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Scenario not found.</p>
        <button onClick={() => navigate('/modules')} className="text-primary text-sm hover:underline mt-2">← Modules</button>
      </div>
    );
  }

  // Pre-run lobby
  if (!started) {
    return (
      <div className="space-y-6 max-w-xl">
        <button onClick={() => navigate(-1)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</button>

        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Scenario Run</p>
          <h1 className="font-display text-2xl font-bold text-foreground">{scenario.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{scenario.game_tag} · {scenario.tier} · ~{scenario.estimated_minutes} min</p>
        </div>

        {/* Mode */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <label className="text-sm font-medium text-foreground block mb-3">Mode</label>
          <div className="flex gap-2">
            {(['solo', 'squad'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border capitalize ${
                  mode === m
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {mode === 'squad' && (
            <p className="text-xs text-muted-foreground mt-2">Squad lobby — coming soon. Running as solo with AI-scripted roles.</p>
          )}
        </div>

        {/* Role Selection */}
        {roles.length > 0 && (
          <div className="p-4 rounded-lg bg-card border border-border">
            <label className="text-sm font-medium text-foreground block mb-3">Select Your Role</label>
            <div className="space-y-2">
              {roles.map(role => (
                <button
                  key={role.name}
                  onClick={() => setSelectedRole(role.name)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedRole === role.name
                      ? 'bg-primary/10 border-primary/40'
                      : 'bg-secondary border-border hover:border-primary/20'
                  }`}
                >
                  <p className="font-display font-semibold text-foreground text-sm">{role.name}</p>
                  {role.description && <p className="text-xs text-muted-foreground">{role.description}</p>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phases preview */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <label className="text-sm font-medium text-foreground block mb-3">Phases</label>
          <div className="space-y-1">
            {script.phases.map((phase, i) => (
              <div key={phase.id} className="flex items-center gap-2 text-xs">
                <span className="text-primary font-semibold w-5">{i + 1}</span>
                <span className="text-foreground">{phase.name}</span>
                <span className="text-muted-foreground">({phase.durationSeconds}s)</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={roles.length > 0 && !selectedRole}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          Start Run
        </button>
      </div>
    );
  }

  // Active run
  return (
    <div className="space-y-4">
      {/* Phase header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">
            Phase {currentPhaseIdx + 1} of {script.phases.length}
          </p>
          <h1 className="font-display text-xl font-bold text-foreground">{currentPhase?.name}</h1>
        </div>
        <div className="text-right">
          <span className={`font-display text-3xl font-bold ${phaseTimeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
            {phaseTimeLeft}s
          </span>
        </div>
      </div>

      {/* Objective */}
      <div className="p-4 rounded-lg bg-gradient-card border border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Objective</p>
        <p className="text-sm text-foreground font-medium">{currentPhase?.objective}</p>
      </div>

      {/* Role prompt */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-xs text-primary font-semibold">Your Role: {selectedRole || 'Player'}</p>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {currentPhase?.events
          .filter(e => activeEvents.has(e.id) || e.triggerType === 'phase_start')
          .map(event => (
            <div key={event.id} className="p-4 rounded-lg border border-border bg-card space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{event.name}</p>
              <div className="flex flex-wrap gap-2">
                {event.actions
                  .filter(a => a.role === 'all' || a.role === selectedRole)
                  .map(action => {
                    const done = events.some(e => e.eventType === 'action' && e.payload.actionId === action.id);
                    return (
                      <button
                        key={action.id}
                        onClick={() => !done && handleAction(action.id, action.label)}
                        disabled={done}
                        className={`px-5 py-3 rounded-lg font-display font-semibold text-sm transition-all border ${
                          done
                            ? 'bg-success/10 border-success/30 text-success'
                            : 'bg-primary text-primary-foreground border-primary hover:opacity-90'
                        }`}
                      >
                        {done ? `✓ ${action.label}` : action.label}
                        <span className="ml-2 text-[10px] opacity-70">{action.timingWindowSeconds}s</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>

      {/* Live signals */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Signals</p>
        <div className="flex flex-wrap gap-1.5">
          {SIGNALS.map(signal => (
            <button
              key={signal}
              onClick={() => handleSignal(signal)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                activeSignal === signal
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {signal}
            </button>
          ))}
        </div>
        {activeSignal && (
          <div className="animate-fade-in px-3 py-2 rounded-md bg-primary/5 border border-primary/20 text-xs text-primary font-medium">
            ⚡ {activeSignal}
          </div>
        )}
      </div>

      {/* Session timeline */}
      <div className="p-4 rounded-lg border border-border bg-card max-h-48 overflow-y-auto">
        <p className="text-xs font-medium text-muted-foreground mb-2">Session Log</p>
        <div className="space-y-1">
          {events.slice().reverse().slice(0, 20).map(evt => (
            <div key={evt.id} className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="font-mono">{(evt.timestamp / 1000).toFixed(1)}s</span>
              <span className={`px-1 rounded ${
                evt.eventType === 'action' ? 'bg-primary/10 text-primary' :
                evt.eventType === 'signal' ? 'bg-accent/10 text-accent' :
                'bg-secondary text-muted-foreground'
              }`}>
                {evt.eventType}
              </span>
              <span>{String(evt.payload.actionLabel || evt.payload.signal || evt.payload.fromPhase || '')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* End early */}
      <button
        onClick={endSession}
        className="w-full py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive font-medium text-sm hover:bg-destructive/20 transition-all"
      >
        End Run Early
      </button>
    </div>
  );
}
