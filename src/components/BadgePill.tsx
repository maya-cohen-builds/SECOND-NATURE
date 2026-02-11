import { Badge } from '@/data/types';
import { cn } from '@/lib/utils';

export function BadgePill({ badge, size = 'md' }: { badge: Badge; size?: 'sm' | 'md' }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary",
      size === 'sm' ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
    )}>
      <span>{badge.icon}</span>
      <span className="font-medium">{badge.name}</span>
    </div>
  );
}

export function RatingBadge({ rating, size = 'md' }: { rating: string; size?: 'sm' | 'md' | 'lg' }) {
  const colorMap: Record<string, string> = {
    S: 'bg-primary/20 text-primary border-primary/40',
    A: 'bg-success/20 text-success border-success/40',
    B: 'bg-accent/20 text-accent border-accent/40',
    C: 'bg-destructive/20 text-destructive border-destructive/40',
  };
  const sizeMap = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-xl',
    lg: 'w-20 h-20 text-4xl',
  };

  return (
    <div className={cn(
      "rounded-lg border-2 flex items-center justify-center font-display font-bold",
      colorMap[rating] || colorMap.C,
      sizeMap[size]
    )}>
      {rating}
    </div>
  );
}
