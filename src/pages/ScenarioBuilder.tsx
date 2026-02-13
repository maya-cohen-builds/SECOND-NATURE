import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { createDefaultScript, validateScript } from '@/lib/scenarioEngine';
import { SCENARIO_TEMPLATES } from '@/data/scenarioTemplates';
import type { ScenarioRole, ScenarioScript, ScenarioPhase, ScenarioEvent, ScenarioAction } from '@/data/scenarioTypes';
import { toast } from 'sonner';

export default function ScenarioBuilder() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [gameTag, setGameTag] = useState('');
  const [tier, setTier] = useState('Intermediate');
  const [patternTags, setPatternTags] = useState('');
  const [squadSize, setSquadSize] = useState(1);
  const [roles, setRoles] = useState<ScenarioRole[]>([{ name: '', description: '' }]);
  const [estimatedMinutes, setEstimatedMinutes] = useState(10);
  const [script, setScript] = useState<ScenarioScript>(createDefaultScript());
  const [saving, setSaving] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const [activeTab, setActiveTab] = useState<'basics' | 'phases' | 'scoring'>('basics');

  const applyTemplate = (templateId: string) => {
    const tpl = SCENARIO_TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;
    setName(tpl.name);
    setGameTag(tpl.game);
    setTier(tpl.tier);
    setPatternTags(tpl.patternTags.join(', '));
    setSquadSize(tpl.squadSize);
    setRoles(tpl.roles);
    setEstimatedMinutes(tpl.estimatedMinutes);
    setScript(tpl.script);
    setShowTemplates(false);
  };

  const handleSave = async () => {
    if (!user || !moduleId) return;

    const roleNames = roles.filter(r => r.name).map(r => r.name);
    const errors = validateScript(script, roleNames);
    if (errors.length > 0) {
      toast.error(`Validation errors: ${errors.join('; ')}`);
      return;
    }
    if (!name.trim()) {
      toast.error('Scenario name is required');
      return;
    }

    setSaving(true);
    const { error } = await (supabase.from('scenarios') as any).insert({
      module_id: moduleId,
      name: name.trim(),
      game_tag: gameTag,
      tier,
      pattern_tags: patternTags.split(',').map(t => t.trim()).filter(Boolean),
      squad_size: squadSize,
      roles_required: roles.filter(r => r.name),
      estimated_minutes: estimatedMinutes,
      scenario_script_json: script,
      created_by: user.id,
    });
    setSaving(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Scenario created');
      navigate(`/module/${moduleId}`);
    }
  };

  // Phase editing helpers
  const updatePhase = (idx: number, updates: Partial<ScenarioPhase>) => {
    const phases = [...script.phases];
    phases[idx] = { ...phases[idx], ...updates };
    setScript({ ...script, phases });
  };

  const addPhase = () => {
    const id = `phase-${Date.now()}`;
    setScript({
      ...script,
      phases: [...script.phases, {
        id,
        name: '',
        objective: '',
        durationSeconds: 30,
        events: [{
          id: `evt-${Date.now()}`,
          name: 'Event',
          description: '',
          triggerType: 'phase_start',
          actions: [{
            id: `act-${Date.now()}`,
            label: '',
            role: 'all',
            timingWindowSeconds: 10,
            points: 10,
          }],
        }],
      }],
    });
  };

  const removePhase = (idx: number) => {
    if (script.phases.length <= 1) return;
    setScript({ ...script, phases: script.phases.filter((_, i) => i !== idx) });
  };

  const addEventToPhase = (phaseIdx: number) => {
    const phases = [...script.phases];
    phases[phaseIdx] = {
      ...phases[phaseIdx],
      events: [...phases[phaseIdx].events, {
        id: `evt-${Date.now()}`,
        name: '',
        description: '',
        triggerType: 'phase_start' as const,
        actions: [{
          id: `act-${Date.now()}`,
          label: '',
          role: 'all',
          timingWindowSeconds: 10,
          points: 10,
        }],
      }],
    };
    setScript({ ...script, phases });
  };

  const updateEvent = (phaseIdx: number, eventIdx: number, updates: Partial<ScenarioEvent>) => {
    const phases = [...script.phases];
    const events = [...phases[phaseIdx].events];
    events[eventIdx] = { ...events[eventIdx], ...updates };
    phases[phaseIdx] = { ...phases[phaseIdx], events };
    setScript({ ...script, phases });
  };

  const addActionToEvent = (phaseIdx: number, eventIdx: number) => {
    const phases = [...script.phases];
    const events = [...phases[phaseIdx].events];
    events[eventIdx] = {
      ...events[eventIdx],
      actions: [...events[eventIdx].actions, {
        id: `act-${Date.now()}`,
        label: '',
        role: 'all',
        timingWindowSeconds: 10,
        points: 10,
      }],
    };
    phases[phaseIdx] = { ...phases[phaseIdx], events };
    setScript({ ...script, phases });
  };

  const updateAction = (phaseIdx: number, eventIdx: number, actionIdx: number, updates: Partial<ScenarioAction>) => {
    const phases = [...script.phases];
    const events = [...phases[phaseIdx].events];
    const actions = [...events[eventIdx].actions];
    actions[actionIdx] = { ...actions[actionIdx], ...updates };
    events[eventIdx] = { ...events[eventIdx], actions };
    phases[phaseIdx] = { ...phases[phaseIdx], events };
    setScript({ ...script, phases });
  };

  const inputClass = "px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1 block";

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate(`/module/${moduleId}`)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
        ← Back to Module
      </button>

      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Scenario Builder</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Create Scenario</h1>
      </div>

      {/* Templates */}
      {showTemplates && (
        <div className="p-4 rounded-lg bg-card border border-border space-y-3">
          <h3 className="font-display font-semibold text-foreground text-sm">Start from Template</h3>
          <div className="grid sm:grid-cols-3 gap-2">
            {SCENARIO_TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => applyTemplate(tpl.id)}
                className="p-3 rounded-lg bg-secondary border border-border hover:border-primary/30 text-left transition-all"
              >
                <p className="font-display font-semibold text-foreground text-sm">{tpl.name}</p>
                <p className="text-[10px] text-primary">{tpl.game} · {tpl.tier}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{tpl.description}</p>
              </button>
            ))}
          </div>
          <button onClick={() => setShowTemplates(false)} className="text-xs text-muted-foreground hover:text-foreground">
            Start from scratch →
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(['basics', 'phases', 'scoring'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'basics' ? 'Basics' : tab === 'phases' ? 'Phases & Events' : 'Scoring'}
          </button>
        ))}
      </div>

      {/* Basics Tab */}
      {activeTab === 'basics' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Scenario Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Site Execute A" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Game Tag</label>
              <input value={gameTag} onChange={e => setGameTag(e.target.value)} placeholder="e.g. Valorant" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tier</label>
              <select value={tier} onChange={e => setTier(e.target.value)} className={inputClass}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Squad Size</label>
              <input type="number" min={1} max={6} value={squadSize} onChange={e => setSquadSize(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Estimated Minutes</label>
              <input type="number" min={1} value={estimatedMinutes} onChange={e => setEstimatedMinutes(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Pattern Tags (comma-separated)</label>
              <input value={patternTags} onChange={e => setPatternTags(e.target.value)} placeholder="entry-timing, trade-setup" className={inputClass} />
            </div>
          </div>

          {/* Roles */}
          <div>
            <label className={labelClass}>Roles Required</label>
            <div className="space-y-2">
              {roles.map((role, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={role.name}
                    onChange={e => {
                      const r = [...roles];
                      r[i] = { ...r[i], name: e.target.value };
                      setRoles(r);
                    }}
                    placeholder="Role name"
                    className={inputClass}
                  />
                  <input
                    value={role.description || ''}
                    onChange={e => {
                      const r = [...roles];
                      r[i] = { ...r[i], description: e.target.value };
                      setRoles(r);
                    }}
                    placeholder="Description (optional)"
                    className={inputClass}
                  />
                  {roles.length > 1 && (
                    <button onClick={() => setRoles(roles.filter((_, j) => j !== i))} className="text-destructive text-xs shrink-0">✕</button>
                  )}
                </div>
              ))}
              <button onClick={() => setRoles([...roles, { name: '', description: '' }])} className="text-xs text-primary hover:underline">
                + Add Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phases Tab */}
      {activeTab === 'phases' && (
        <div className="space-y-4">
          {script.phases.map((phase, pi) => (
            <div key={phase.id} className="p-4 rounded-lg border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary uppercase">Phase {pi + 1}</span>
                {script.phases.length > 1 && (
                  <button onClick={() => removePhase(pi)} className="text-xs text-destructive hover:underline">Remove</button>
                )}
              </div>
              <div className="grid sm:grid-cols-3 gap-2">
                <input value={phase.name} onChange={e => updatePhase(pi, { name: e.target.value })} placeholder="Phase name" className={inputClass} />
                <input value={phase.objective} onChange={e => updatePhase(pi, { objective: e.target.value })} placeholder="Objective" className={inputClass} />
                <input type="number" min={5} value={phase.durationSeconds} onChange={e => updatePhase(pi, { durationSeconds: Number(e.target.value) })} className={inputClass} />
              </div>

              {/* Events */}
              {phase.events.map((event, ei) => (
                <div key={event.id} className="ml-4 p-3 rounded border border-border/50 bg-secondary/30 space-y-2">
                  <div className="grid sm:grid-cols-3 gap-2">
                    <input value={event.name} onChange={e => updateEvent(pi, ei, { name: e.target.value })} placeholder="Event name" className={inputClass} />
                    <select
                      value={event.triggerType}
                      onChange={e => updateEvent(pi, ei, { triggerType: e.target.value as 'timed' | 'phase_start' | 'manual' })}
                      className={inputClass}
                    >
                      <option value="phase_start">Phase Start</option>
                      <option value="timed">Timed Delay</option>
                      <option value="manual">Manual</option>
                    </select>
                    {event.triggerType === 'timed' && (
                      <input
                        type="number"
                        min={1}
                        value={event.triggerDelaySeconds || 0}
                        onChange={e => updateEvent(pi, ei, { triggerDelaySeconds: Number(e.target.value) })}
                        placeholder="Delay (s)"
                        className={inputClass}
                      />
                    )}
                  </div>

                  {/* Actions */}
                  {event.actions.map((action, ai) => (
                    <div key={action.id} className="ml-4 flex flex-wrap gap-2 items-center">
                      <input value={action.label} onChange={e => updateAction(pi, ei, ai, { label: e.target.value })} placeholder="Action label" className={`${inputClass} max-w-[150px]`} />
                      <input value={action.role} onChange={e => updateAction(pi, ei, ai, { role: e.target.value })} placeholder="Role" className={`${inputClass} max-w-[100px]`} />
                      <input type="number" min={1} value={action.timingWindowSeconds} onChange={e => updateAction(pi, ei, ai, { timingWindowSeconds: Number(e.target.value) })} className={`${inputClass} max-w-[70px]`} />
                      <span className="text-[10px] text-muted-foreground">sec</span>
                      <input type="number" min={0} value={action.points} onChange={e => updateAction(pi, ei, ai, { points: Number(e.target.value) })} className={`${inputClass} max-w-[60px]`} />
                      <span className="text-[10px] text-muted-foreground">pts</span>
                    </div>
                  ))}
                  <button onClick={() => addActionToEvent(pi, ei)} className="text-[10px] text-primary hover:underline ml-4">
                    + Action
                  </button>
                </div>
              ))}
              <button onClick={() => addEventToPhase(pi)} className="text-xs text-primary hover:underline ml-4">
                + Event
              </button>
            </div>
          ))}
          <button onClick={addPhase} className="text-sm text-primary hover:underline font-medium">
            + Add Phase
          </button>
        </div>
      )}

      {/* Scoring Tab */}
      {activeTab === 'scoring' && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Pass Threshold (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={script.passThreshold}
              onChange={e => setScript({ ...script, passThreshold: Number(e.target.value) })}
              className={`${inputClass} max-w-[120px]`}
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Scoring Rules</label>
            {script.scoringRules.map((rule, i) => (
              <div key={rule.id} className="flex flex-wrap gap-2 items-center p-2 rounded bg-secondary/30 border border-border/50">
                <span className="text-xs font-medium text-foreground capitalize w-28">{rule.dimension}</span>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={rule.weight}
                  onChange={e => {
                    const rules = [...script.scoringRules];
                    rules[i] = { ...rules[i], weight: Number(e.target.value) };
                    setScript({ ...script, scoringRules: rules });
                  }}
                  className={`${inputClass} max-w-[80px]`}
                />
                <span className="text-[10px] text-muted-foreground">weight</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={rule.passThreshold}
                  onChange={e => {
                    const rules = [...script.scoringRules];
                    rules[i] = { ...rules[i], passThreshold: Number(e.target.value) };
                    setScript({ ...script, scoringRules: rules });
                  }}
                  className={`${inputClass} max-w-[80px]`}
                />
                <span className="text-[10px] text-muted-foreground">min %</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Scenario'}
        </button>
        <button
          onClick={() => navigate(`/module/${moduleId}`)}
          className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-muted-foreground text-sm hover:text-foreground transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
