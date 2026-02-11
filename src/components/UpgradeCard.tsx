import { Upgrade } from '@/data/types';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  convenience: 'bg-accent/10 text-accent border-accent/20',
  insight: 'bg-info/10 text-info border-info/20',
  coordination: 'bg-success/10 text-success border-success/20',
  access: 'bg-primary/10 text-primary border-primary/20',
};

export function UpgradeCard({ upgrade, onPurchase }: { upgrade: Upgrade; onPurchase: (id: string) => void }) {
  return (
    <div className={cn(
      "p-4 rounded-lg border bg-gradient-card border-border",
      upgrade.purchased && "opacity-60"
    )}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-display font-semibold text-foreground text-sm">{upgrade.name}</h4>
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", CATEGORY_COLORS[upgrade.category])}>
          {upgrade.category}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{upgrade.description}</p>
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-foreground">{upgrade.price} <span className="text-xs text-muted-foreground font-normal">credits</span></span>
        <button
          onClick={() => !upgrade.purchased && onPurchase(upgrade.id)}
          disabled={upgrade.purchased}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            upgrade.purchased
              ? "bg-secondary text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:opacity-90"
          )}
        >
          {upgrade.purchased ? 'Owned' : 'Purchase'}
        </button>
      </div>
    </div>
  );
}
