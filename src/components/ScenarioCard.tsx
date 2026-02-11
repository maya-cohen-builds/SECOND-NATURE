import { Scenario, CATEGORY_LABELS, CATEGORY_ICONS } from '@/data/types';
import { cn } from '@/lib/utils';

interface ScenarioCardProps {
  scenario: Scenario;
  selected?: boolean;
  onClick?: () => void;
}

export function ScenarioCard({ scenario, selected, onClick }: ScenarioCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all",
        selected
          ? "bg-primary/10 border-primary/40 shadow-glow"
          : "bg-gradient-card border-border hover:border-primary/20 hover:bg-card"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-display font-semibold text-foreground">{scenario.name}</h4>
        <span className="text-xs text-muted-foreground">
          {CATEGORY_ICONS[scenario.category]}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>Complexity: {'●'.repeat(scenario.complexity)}{'○'.repeat(5 - scenario.complexity)}</span>
        <span>Squad: {scenario.recommendedSquadSize}</span>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {scenario.tags.map(tag => (
          <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

export function CategoryCard({ category, icon, count, selected, onClick }: {
  category: string;
  icon: string;
  count: number;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-5 rounded-lg border transition-all text-left",
        selected
          ? "bg-primary/10 border-primary/40 shadow-glow"
          : "bg-gradient-card border-border hover:border-primary/20"
      )}
    >
      <div className="text-sm font-display font-bold text-primary mb-2">[{icon}]</div>
      <h3 className="font-display font-semibold text-foreground">{category}</h3>
      <p className="text-xs text-muted-foreground mt-1">{count} scenarios</p>
    </button>
  );
}
