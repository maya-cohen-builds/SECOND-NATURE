import { useEffect, useState } from 'react';
import { getEventCounts, getFunnelData } from '@/lib/eventTracker';
import { FunnelView } from '@/components/FunnelView';

export default function Analytics() {
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [funnel, setFunnel] = useState<{ step: string; label: string; count: number }[]>([]);

  useEffect(() => {
    setEventCounts(getEventCounts());
    setFunnel(getFunnelData());
  }, []);

  const allEvents = [
    'enter_training_hub',
    'start_scenario',
    'complete_scenario',
    'view_shop',
    'purchase_upgrade',
    'view_metrics_page',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Local event tracking and funnel visualization. All data stored in localStorage.</p>
      </div>

      {/* Event Counts */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Event Counts</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {allEvents.map(event => (
            <div key={event} className="p-4 rounded-lg bg-gradient-card border border-border">
              <p className="text-xs text-muted-foreground font-mono">{event}</p>
              <p className="font-display text-2xl font-bold text-primary mt-1">{eventCounts[event] || 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Conversion Funnel</h2>
        <div className="p-5 rounded-lg bg-card border border-border">
          <FunnelView steps={funnel} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Funnel: Training Hub → Start Scenario → Complete Scenario → View Shop → Purchase
        </p>
      </div>

      {/* Instructions */}
      <div className="p-4 rounded-lg bg-secondary border border-border">
        <h3 className="font-display font-semibold text-foreground mb-2">How This Works</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Events are logged automatically as you navigate through the app</li>
          <li>• Data persists in localStorage between sessions</li>
          <li>• Use "Reset Data" in the header to clear all tracked events</li>
          <li>• This simulates the instrumentation a real implementation would use</li>
        </ul>
      </div>
    </div>
  );
}
