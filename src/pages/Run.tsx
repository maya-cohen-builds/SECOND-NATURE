import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SCENARIOS } from '@/data/gameData';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/data/types';
import { runSimulation } from '@/lib/simulation';
import { trackEvent } from '@/lib/eventTracker';

export default function Run() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const scenarioId = searchParams.get('scenario') || 'bd-1';
  const playerLevel = parseInt(searchParams.get('level') || '5');
  const scenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];

  const [squadSize, setSquadSize] = useState(scenario.recommendedSquadSize);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Standard' | 'Hard'>('Standard');
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    trackEvent('start_scenario', {
      scenario_type: scenario.category,
      squad_size: squadSize,
      difficulty,
    });

    setTimeout(() => {
      const result = runSimulation({
        scenarioId: scenario.id,
        squadSize,
        difficulty,
        playerLevel,
      });
      localStorage.setItem('stg-last-result', JSON.stringify(result));
      trackEvent('complete_scenario', { rating: result.rating, badges_count: result.badges.length });
      navigate('/results');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Squad Drill</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Configure and Execute</h1>
      </div>

      {/* Scenario Info */}
      <div className="p-5 rounded-lg bg-gradient-card border border-border">
        <div className="flex items-center gap-2 mb-2">
          <span>{CATEGORY_ICONS[scenario.category]}</span>
          <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[scenario.category]}</span>
        </div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">{scenario.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{scenario.briefing}</p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>Complexity: {'●'.repeat(scenario.complexity)}{'○'.repeat(5 - scenario.complexity)}</span>
          <span>Recommended Squad: {scenario.recommendedSquadSize}</span>
          <span>Skill Tier: {playerLevel}</span>
        </div>
      </div>

      {/* Squad Size */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <label className="text-sm font-medium text-foreground block mb-3">Squad Size</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map(size => (
            <button
              key={size}
              onClick={() => setSquadSize(size)}
              className={`w-10 h-10 rounded-lg font-display font-bold text-sm transition-all border ${
                squadSize === size
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {squadSize < scenario.recommendedSquadSize && (
          <p className="text-xs text-accent mt-2">Below recommended squad size. Increased difficulty.</p>
        )}
      </div>

      {/* Difficulty */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <label className="text-sm font-medium text-foreground block mb-3">Difficulty</label>
        <div className="flex gap-2">
          {(['Easy', 'Standard', 'Hard'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                difficulty === diff
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Run Button */}
      <button
        onClick={handleRun}
        disabled={running}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50"
      >
        {running ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">◎</span> Running Drill...
          </span>
        ) : (
          'Run Execution Rep'
        )}
      </button>
    </div>
  );
}
