import { MOCK_FEED, type FeedEvent } from '@/data/squadData';
import { formatDistanceToNow } from 'date-fns';

function FeedIcon({ type }: { type: FeedEvent['type'] }) {
  switch (type) {
    case 'drill_complete':
      return <span className="w-2 h-2 rounded-full bg-primary inline-block" />;
    case 'squad_milestone':
      return <span className="w-2 h-2 rounded-full bg-accent inline-block" />;
    case 'milestone_unlocked':
      return <span className="w-2 h-2 rounded-full bg-chart-4 inline-block" />;
    case 'confidence_update':
      return <span className="w-2 h-2 rounded-full bg-chart-2 inline-block" />;
  }
}

export default function SquadActivityFeed() {
  return (
    <section>
      <h2 className="font-display text-lg font-bold text-foreground mb-1">Squad Activity</h2>
      <p className="text-xs text-muted-foreground mb-4">System-generated coordination evidence</p>
      <div className="space-y-2">
        {MOCK_FEED.map(event => (
          <div
            key={event.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border"
          >
            <div className="mt-1.5">
              <FeedIcon type={event.type} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-snug">{event.text}</p>
              <div className="flex items-center gap-2 mt-1">
                {event.metricDelta && (
                  <span className="text-xs font-mono font-semibold text-primary">{event.metricDelta}</span>
                )}
                {event.metric && (
                  <span className="text-[10px] text-muted-foreground">{event.metric}</span>
                )}
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
              {formatDistanceToNow(event.timestamp, { addSuffix: true })}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
