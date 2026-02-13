import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { ScenarioRow, ScenarioRole } from '@/data/scenarioTypes';

export default function ModuleDetail() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: mod, isLoading: modLoading } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('modules') as any)
        .select('*')
        .eq('id', moduleId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!moduleId,
  });

  const { data: scenarios, isLoading: scenLoading } = useQuery({
    queryKey: ['scenarios', moduleId],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('scenarios') as any)
        .select('*')
        .eq('module_id', moduleId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as ScenarioRow[];
    },
    enabled: !!moduleId,
  });

  if (modLoading || scenLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-spin text-primary text-2xl">◎</span>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="text-muted-foreground">Module not found.</p>
        <button onClick={() => navigate('/modules')} className="text-primary text-sm hover:underline">
          ← Back to Modules
        </button>
      </div>
    );
  }

  const handleRun = (scenarioId: string) => {
    navigate(`/scenario-run/${scenarioId}`);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/modules')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
        ← Back to Modules
      </button>

      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Module</p>
        <h1 className="font-display text-2xl font-bold text-foreground">{mod.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{mod.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {(mod.tags as string[] || []).map((tag: string) => (
            <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground border border-border">
              {tag}
            </span>
          ))}
          <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20">
            {mod.game}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] border ${
            mod.difficulty === 'Beginner' ? 'bg-success/10 text-success border-success/20' :
            mod.difficulty === 'Intermediate' ? 'bg-accent/10 text-accent border-accent/20' :
            'bg-destructive/10 text-destructive border-destructive/20'
          }`}>
            {mod.difficulty}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Scenarios ({scenarios?.length || 0})
        </h2>
        {user && mod.created_by === user.id && (
          <button
            onClick={() => navigate(`/scenario-builder/${moduleId}`)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
          >
            Add Scenario
          </button>
        )}
      </div>

      {(!scenarios || scenarios.length === 0) ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground text-sm">No scenarios in this module yet.</p>
          {user && mod.created_by === user.id && (
            <button
              onClick={() => navigate(`/scenario-builder/${moduleId}`)}
              className="mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
            >
              Create First Scenario
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {scenarios.map(scenario => {
            const roles = (scenario.roles_required || []) as ScenarioRole[];
            return (
              <div key={scenario.id} className="p-4 rounded-lg bg-gradient-card border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-semibold text-foreground">{scenario.name}</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20">
                        {scenario.game_tag}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] border ${
                        scenario.tier === 'Beginner' ? 'bg-success/10 text-success border-success/20' :
                        scenario.tier === 'Intermediate' ? 'bg-accent/10 text-accent border-accent/20' :
                        'bg-destructive/10 text-destructive border-destructive/20'
                      }`}>
                        {scenario.tier}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(scenario.pattern_tags || []).map((tag: string) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>~{scenario.estimated_minutes} min</span>
                      <span>Squad: {scenario.squad_size}</span>
                      <span>Roles: {roles.map(r => r.name).join(', ') || 'Any'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRun(scenario.id)}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all shrink-0"
                  >
                    Run
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
