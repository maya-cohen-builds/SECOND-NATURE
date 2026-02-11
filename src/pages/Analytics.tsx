import { useEffect, useState } from 'react';
import { getEventCounts, getFunnelData } from '@/lib/eventTracker';
import { FunnelView } from '@/components/FunnelView';
import { getPlayerProfile } from '@/data/gameData';

export default function Analytics() {
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [funnel, setFunnel] = useState<{ step: string; label: string; count: number }[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setEventCounts(getEventCounts());
    setFunnel(getFunnelData());
  }, []);

  const profile = getPlayerProfile();

  const performanceEvents = [
    { key: 'enter_training_hub', label: 'Training Sessions' },
    { key: 'start_scenario', label: 'Drills Started' },
    { key: 'complete_scenario', label: 'Drills Completed' },
    { key: 'view_shop', label: 'Tools Viewed' },
    { key: 'purchase_upgrade', label: 'Tools Unlocked' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Dashboard</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Your Training History</h1>
        <p className="text-sm text-muted-foreground mt-1">Every drill. Every badge. All in one place.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
          <p className="font-display text-2xl font-bold text-primary">{profile.completedScenarios}</p>
          <p className="text-xs text-muted-foreground">Drills Completed</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
          <p className="font-display text-2xl font-bold text-primary">{profile.badgesEarned.length}</p>
          <p className="text-xs text-muted-foreground">Badges Earned</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
          <p className="font-display text-2xl font-bold text-primary">{profile.confidence}%</p>
          <p className="text-xs text-muted-foreground">Confidence</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
          <p className="font-display text-2xl font-bold text-primary">{profile.mastery}%</p>
          <p className="text-xs text-muted-foreground">Mastery</p>
        </div>
      </div>

      {/* Activity */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Training Activity</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {performanceEvents.map(event => (
            <div key={event.key} className="p-4 rounded-lg bg-gradient-card border border-border">
              <p className="text-xs text-muted-foreground">{event.label}</p>
              <p className="font-display text-2xl font-bold text-primary mt-1">{eventCounts[event.key] || 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Insights Toggle */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 rounded-lg bg-secondary border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
        >
          {showAdvanced ? '▾ Hide' : '▸ Show'} Advanced Insights
        </button>

        {showAdvanced && (
          <div className="mt-4 p-5 rounded-lg bg-card border border-border">
            <h3 className="font-display font-semibold text-foreground mb-3">Training Funnel</h3>
            <FunnelView steps={funnel} />
            <p className="text-xs text-muted-foreground mt-3">
              Hub → Start Drill → Complete Drill → View Tools → Unlock Tool
            </p>
          </div>
        )}
      </div>

      {/* Account Readiness */}
      <div className="p-4 rounded-lg bg-secondary border border-border">
        <h3 className="font-display font-semibold text-foreground mb-2">Account & Squad</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li><strong>Account:</strong> Local session (sign up to save progress across devices)</li>
          <li><strong>Squad:</strong> Create or join a squad to share training history</li>
          <li><strong>Shared History:</strong> Squad members can compare performance and plan drills together</li>
        </ul>
      </div>
    </div>
  );
}
