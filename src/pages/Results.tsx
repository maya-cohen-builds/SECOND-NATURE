import { useNavigate } from 'react-router-dom';
import { SimulationResult } from '@/data/types';
import { RatingBadge, BadgePill } from '@/components/BadgePill';
import { SCENARIOS } from '@/data/gameData';
import { useEffect, useState } from 'react';
import { getInsights } from '@/lib/trainingService';

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('stg-last-result');
    if (stored) {
      const r = JSON.parse(stored) as SimulationResult;
      setResult(r);
      // Load insights generated after the run was saved
      loadInsights();
    }
  }, []);

  const loadInsights = async () => {
    const data = await getInsights();
    setInsights(data.slice(0, 2));
  };

  if (!result) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">No results yet. Run a drill first.</p>
        <button onClick={() => navigate('/training-hub')} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm">
          Go to Training Hub
        </button>
      </div>
    );
  }

  const scenario = SCENARIOS.find(s => s.id === result.scenarioId);

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-xs uppercase tracking-widest text-primary font-semibold">Post-Drill Report</p>
      <h1 className="font-display text-2xl font-bold text-foreground">Performance Summary</h1>

      {/* Rating */}
      <div className="rounded-lg bg-gradient-card border border-border overflow-hidden text-center">
        {scenario?.image && (
          <div className="w-full aspect-[21/9] overflow-hidden">
            <img src={scenario.image} alt={result.scenarioName} className="w-full h-full object-cover object-center opacity-60" />
          </div>
        )}
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-3">{result.scenarioName} · {result.difficulty} · Squad of {result.squadSize}</p>
          <div className="flex justify-center mb-4">
            <RatingBadge rating={result.rating} size="lg" />
          </div>
          <p className="font-display text-lg font-semibold text-foreground">
            {result.rating === 'S' ? 'Outstanding Execution' : result.rating === 'A' ? 'Strong Performance' : result.rating === 'B' ? 'Solid Run' : 'Room to Improve'}
          </p>
        </div>
      </div>

      {/* Badges */}
      {result.badges.length > 0 && (
        <div className="p-5 rounded-lg bg-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-3">Skill Badges Earned</h3>
          <div className="flex flex-wrap gap-2">
            {result.badges.map(b => (
              <BadgePill key={b.id} badge={b} />
            ))}
          </div>
        </div>
      )}

      {/* Takeaway */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <h3 className="font-display font-semibold text-primary mb-2">Key Takeaway</h3>
        <p className="text-sm text-foreground">{result.liveGameImpact}</p>
      </div>

      {/* Insights from recent sessions */}
      {insights.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-foreground mb-3">What to focus on next</h3>
          <div className="space-y-2">
            {insights.map((insight: any) => (
              <div key={insight.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                <p className="text-xs font-medium text-foreground mb-1">{insight.title}</p>
                <p className="text-[11px] text-muted-foreground">{insight.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate('/training-hub')} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm">
          Run Another Drill
        </button>
        <button onClick={() => navigate('/stats')} className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm">
          View Stats
        </button>
        <button onClick={() => navigate('/tools')} className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm">
          Training Tools
        </button>
      </div>
    </div>
  );
}
