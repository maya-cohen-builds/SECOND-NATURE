import { cn } from '@/lib/utils';

interface FunnelStep {
  step: string;
  label: string;
  count: number;
}

export function FunnelView({ steps }: { steps: FunnelStep[] }) {
  const maxCount = Math.max(...steps.map(s => s.count), 1);

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const width = Math.max((step.count / maxCount) * 100, 8);
        const conversionRate = i > 0 && steps[i - 1].count > 0
          ? Math.round((step.count / steps[i - 1].count) * 100)
          : null;

        return (
          <div key={step.step}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">{step.label}</span>
              <div className="flex items-center gap-2">
                {conversionRate !== null && (
                  <span className="text-[10px] text-muted-foreground">{conversionRate}% →</span>
                )}
                <span className="text-sm font-display font-bold text-primary">{step.count}</span>
              </div>
            </div>
            <div className="h-6 bg-secondary rounded-md overflow-hidden">
              <div
                className="h-full bg-primary/30 rounded-md transition-all duration-500"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
