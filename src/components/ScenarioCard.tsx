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
        "w-full text-left rounded-lg border transition-all overflow-hidden",
        selected
          ? "bg-primary/10 border-primary/40 shadow-glow"
          : "bg-gradient-card border-border hover:border-primary/20 hover:bg-card"
      )}
    >
      {/* Drill image */}
      {scenario.image && (
        <div className="w-full aspect-[16/9] overflow-hidden">
          <img
            src={scenario.image}
            alt={scenario.name}
            className="w-full h-full object-cover object-center opacity-70"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-display font-semibold text-foreground">{scenario.name}</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{scenario.description}</p>

        {/* Why this drill exists */}
        <div className="mb-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Why this drill exists</span>
          <p className="text-xs text-muted-foreground mt-0.5">{scenario.whyExists}</p>
        </div>

        {/* Expected improvements */}
        <div className="mb-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Expected improvement</span>
          <ul className="mt-0.5 space-y-0.5">
            {scenario.expectedImprovements.map((imp, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-primary/50 mt-0.5 shrink-0">&#8226;</span>
                {imp}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <span>Complexity: {'●'.repeat(scenario.complexity)}{'○'.repeat(5 - scenario.complexity)}</span>
          <span>Squad: {scenario.recommendedSquadSize}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {scenario.tags.map(tag => (
            <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Feeds into */}
        <div className="mt-3 pt-2 border-t border-border/50">
          <span className="text-[10px] text-muted-foreground/50">Feeds into: <span className="text-muted-foreground/70">{scenario.feedsInto}</span></span>
        </div>
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
      <p className="text-xs text-muted-foreground mt-1">{count} drills</p>
    </button>
  );
}

