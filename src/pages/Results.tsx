import { useNavigate } from 'react-router-dom';
import { SimulationResult } from '@/data/types';
import { RatingBadge, BadgePill } from '@/components/BadgePill';
import { useDemo } from '@/contexts/DemoContext';
import { getDemoResult } from '@/lib/simulation';
import { getPlayerProfile, savePlayerProfile } from '@/data/gameData';
import { useEffect, useState } from 'react';

export default function Results() {
  const navigate = useNavigate();
  const { demoMode } = useDemo();
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('stg-last-result');
    if (stored) {
      const r = JSON.parse(stored) as SimulationResult;
      setResult(r);
      // Update player profile
      const profile = getPlayerProfile();
      profile.completedScenarios += 1;
      profile.confidence = Math.min(100, profile.confidence + r.confidenceGain);
      profile.mastery = Math.min(100, profile.mastery + r.masteryGain);
      r.badges.forEach(b => {
        if (!profile.badgesEarned.includes(b.id)) profile.badgesEarned.push(b.id);
      });
      savePlayerProfile(profile);
    } else if (demoMode) {
      setResult(getDemoResult());
    }
  }, []);

  if (!result) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">No simulation results yet.</p>
        <button onClick={() => navigate('/training-hub')} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm">
          Go to Training Hub
        </button>
      </div>
    );
  }

  const profile = getPlayerProfile();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-foreground">Mission Results</h1>

      {/* Rating */}
      <div className="p-6 rounded-lg bg-gradient-card border border-border text-center">
        <p className="text-sm text-muted-foreground mb-3">{result.scenarioName} · {result.difficulty} · Squad of {result.squadSize}</p>
        <div className="flex justify-center mb-4">
          <RatingBadge rating={result.rating} size="lg" />
        </div>
        <p className="font-display text-lg font-semibold text-foreground">
          {result.rating === 'S' ? 'Outstanding Performance' : result.rating === 'A' ? 'Excellent Execution' : result.rating === 'B' ? 'Solid Performance' : 'Room for Improvement'}
        </p>
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

      {/* Live Game Impact */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <h3 className="font-display font-semibold text-primary mb-2">Impact on Live Game</h3>
        <p className="text-sm text-foreground">{result.liveGameImpact}</p>
      </div>

      {/* Shareable Summary (Demo Mode) */}
      {demoMode && (
        <div className="p-5 rounded-lg bg-accent/5 border border-accent/20">
          <h3 className="font-display font-semibold text-accent mb-2">📋 Shareable Summary — Leadership Readout</h3>
          <div className="text-sm text-foreground space-y-1">
            <p><strong>Scenario:</strong> {result.scenarioName} ({result.difficulty})</p>
            <p><strong>Rating:</strong> {result.rating} | <strong>Badges:</strong> {result.badges.map(b => b.name).join(', ') || 'None'}</p>
            <p><strong>Progression:</strong> Confidence +{result.confidenceGain}% · Mastery +{result.masteryGain}%</p>
            <p><strong>Live Impact:</strong> {result.liveGameImpact}</p>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate('/training-hub')} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm">
          Run Another Sim
        </button>
        <button onClick={() => navigate('/shop')} className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm">
          View Upgrades
        </button>
        <button onClick={() => navigate('/experiments')} className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm">
          See Experiments & Metrics
        </button>
      </div>
    </div>
  );
}
