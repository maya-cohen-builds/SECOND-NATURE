import { MOCK_TIMELINE, type TimelineEntry } from '@/data/squadData';
import { formatDistanceToNow } from 'date-fns';

function TimelineMarker({ type }: { type: TimelineEntry['type'] }) {
  const base = 'w-2.5 h-2.5 rounded-full border-2';
  switch (type) {
    case 'pattern_stabilized':
      return <span className={`${base} bg-primary border-primary/40`} />;
    case 'confidence_dip':
      return <span className={`${base} bg-destructive border-destructive/40`} />;
    case 'consistency_recovered':
      return <span className={`${base} bg-chart-2 border-chart-2/40`} />;
    case 'milestone':
      return <span className={`${base} bg-accent border-accent/40`} />;
    case 'rep':
    default:
      return <span className={`${base} bg-muted-foreground/40 border-muted-foreground/20`} />;
  }
}

const TYPE_LABELS: Record<TimelineEntry['type'], string> = {
  pattern_stabilized: 'Pattern stabilized',
  confidence_dip: 'Confidence dip',
  consistency_recovered: 'Consistency recovered',
  milestone: 'Milestone',
  rep: 'Rep',
};

export default function SquadTimeline() {
  return (
    <section>
      <h2 className="font-display text-lg font-bold text-foreground mb-1">Squad Timeline</h2>
      <p className="text-xs text-muted-foreground mb-4">Longitudinal record of improvement — read-only evidence</p>
      <div className="relative pl-5">
        <div className="absolute left-[4px] top-1 bottom-1 w-px bg-border" />
        <div className="space-y-3">
          {MOCK_TIMELINE.map(entry => (
            <div key={entry.id} className="relative flex items-start gap-3">
              <div className="absolute left-[-17px] top-1.5">
                <TimelineMarker type={entry.type} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">{entry.text}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium">
                    {TYPE_LABELS[entry.type]}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
