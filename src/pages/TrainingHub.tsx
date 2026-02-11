import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCENARIOS } from '@/data/gameData';
import { ScenarioCategory, CATEGORY_LABELS, CATEGORY_ICONS, TIER_LABELS } from '@/data/types';
import { CategoryCard, ScenarioCard } from '@/components/ScenarioCard';
import { trackEvent } from '@/lib/eventTracker';

const TIERS = [4, 5, 6] as const;

function getRecommendation(category: ScenarioCategory, tier: number): string {
  const label = TIER_LABELS[tier] || 'Steady';
  const recommendations: Record<ScenarioCategory, Record<number, string>> = {
    'base-defense': {
      4: `${label} squads building defensive fundamentals. Focus on positioning and wave timing.`,
      5: `${label} squads stabilizing late-game perimeter discipline under sustained pressure.`,
      6: `${label} squads refining resource discipline under sustained siege conditions.`,
    },
    'coordinated-attack': {
      4: `${label} squads developing basic synchronization across split-squad operations.`,
      5: `${label} squads tightening execute timing and commit-call consistency.`,
      6: `${label} squads refining phase-transition discipline in multi-stage strikes.`,
    },
    'vehicle-mastery': {
      4: `${label} squads building vehicle handling and formation basics.`,
      5: `${label} squads closing formation gaps during vehicle operations.`,
      6: `${label} squads optimizing fuel management and close-support timing.`,
    },
    'role-based': {
      4: `${label} squads learning role boundaries and handoff sequences.`,
      5: `${label} squads resolving role-overlap issues during objective shifts.`,
      6: `${label} squads training rapid role reassignment under dynamic conditions.`,
    },
  };
  return recommendations[category][tier] || `Drills calibrated for ${label} squads in this category.`;
}

export default function TrainingHub() {
  const [selectedCategory, setSelectedCategory] = useState<ScenarioCategory | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [playerLevel, setPlayerLevel] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('enter_training_hub');
  }, []);

  const categories: ScenarioCategory[] = ['base-defense', 'coordinated-attack', 'vehicle-mastery', 'role-based'];
  const filteredScenarios = selectedCategory
    ? SCENARIOS.filter(s => s.category === selectedCategory)
    : [];

  const handleProceed = () => {
    if (selectedScenario) {
      navigate(`/run?scenario=${selectedScenario}&level=${playerLevel}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Training Hub</p>
          <h1 className="font-display text-2xl font-bold text-foreground">Choose Your Drill</h1>
        </div>
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 border border-border">
          <span className="text-xs text-muted-foreground">You are:</span>
          {TIERS.map(lvl => (
            <button
              key={lvl}
              onClick={() => setPlayerLevel(lvl)}
              className={`px-3 h-8 rounded-md text-xs font-display font-bold transition-all whitespace-nowrap ${
                playerLevel === lvl
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {TIER_LABELS[lvl]}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map(cat => (
          <CategoryCard
            key={cat}
            category={CATEGORY_LABELS[cat]}
            icon={CATEGORY_ICONS[cat]}
            count={SCENARIOS.filter(s => s.category === cat).length}
            selected={selectedCategory === cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedScenario(null);
            }}
          />
        ))}
      </div>

      {/* Scenarios */}
      {selectedCategory && (
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">
            {CATEGORY_LABELS[selectedCategory]} Drills
          </h2>

          {/* Recommendation banner */}
          <div className="mb-3 px-3 py-2 rounded-md bg-secondary/50 border border-border/50">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Recommended for your squad</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              {getRecommendation(selectedCategory, playerLevel)}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {filteredScenarios.map(s => (
              <ScenarioCard
                key={s.id}
                scenario={s}
                selected={selectedScenario === s.id}
                onClick={() => setSelectedScenario(s.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Proceed */}
      {selectedScenario && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div>
            <span className="text-sm font-medium text-foreground">
              Ready: {SCENARIOS.find(s => s.id === selectedScenario)?.name}
            </span>
            <span className="text-xs text-muted-foreground ml-2">{TIER_LABELS[playerLevel]}</span>
          </div>
          <button
            onClick={handleProceed}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
          >
            Configure and Run
          </button>
        </div>
      )}
    </div>
  );
}
