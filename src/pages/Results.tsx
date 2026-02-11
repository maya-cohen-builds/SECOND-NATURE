import { useNavigate } from 'react-router-dom';
import { SimulationResult } from '@/data/types';
import { RatingBadge, BadgePill } from '@/components/BadgePill';
import { getPlayerProfile, savePlayerProfile, SCENARIOS } from '@/data/gameData';
import { useEffect, useState } from 'react';

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('stg-last-result');
    if (stored) {
      const r = JSON.parse(stored) as SimulationResult;
      setResult(r);
      const profile = getPlayerProfile();
      profile.completedScenarios += 1;
      profile.confidence = Math.min(100, profile.confidence + r.confidenceGain);
      profile.mastery = Math.min(100, profile.mastery + r.masteryGain);
      r.badges.forEach(b => {
        if (!profile.badgesEarned.includes(b.id)) profile.badgesEarned.push(b.id);
      });
      savePlayerProfile(profile);
    }
  }, []);

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

  const profile = getPlayerProfile();
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

      {/* Progression */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">Confidence</p>
          <div className="flex items-end gap-2">
            <span className="font-display text-2xl font-bold text-foreground">{profile.confidence}%</span>
            <span className="text-xs text-success font-medium mb-1">+{result.confidenceGain}</span>
          </div>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${profile.confidence}%` }} />
          </div>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">Mastery</p>
          <div className="flex items-end gap-2">
            <span className="font-display text-2xl font-bold text-foreground">{profile.mastery}%</span>
            <span className="text-xs text-success font-medium mb-1">+{result.masteryGain}</span>
          </div>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${profile.mastery}%` }} />
          </div>
        </div>
      </div>

      {/* Takeaway */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <h3 className="font-display font-semibold text-primary mb-2">Key Takeaway</h3>
        <p className="text-sm text-foreground">{result.liveGameImpact}</p>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate('/training-hub')} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm">
          Run Another Drill
        </button>
        <button onClick={() => navigate('/tools')} className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm">
          Training Tools
        </button>
        <button onClick={() => navigate('/performance')} className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm">
          View Dashboard
        </button>
      </div>
    </div>
  );
}
