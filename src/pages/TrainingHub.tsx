import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCENARIOS } from '@/data/gameData';
import { ScenarioCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/data/types';
import { CategoryCard, ScenarioCard } from '@/components/ScenarioCard';
import { trackEvent } from '@/lib/eventTracker';

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
          <h1 className="font-display text-2xl font-bold text-foreground">Training Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose a training focus and pick a drill to run with your squad.</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 border border-border">
          <span className="text-xs text-muted-foreground">Skill Tier:</span>
          {[4, 5, 6].map(lvl => (
            <button
              key={lvl}
              onClick={() => setPlayerLevel(lvl)}
              className={`w-8 h-8 rounded-md text-sm font-display font-bold transition-all ${
                playerLevel === lvl
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {lvl}
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
            {CATEGORY_ICONS[selectedCategory]} {CATEGORY_LABELS[selectedCategory]} Drills
          </h2>
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
            <span className="text-xs text-muted-foreground ml-2">Tier {playerLevel}</span>
          </div>
          <button
            onClick={handleProceed}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
          >
            Configure & Run →
          </button>
        </div>
      )}
    </div>
  );
}
