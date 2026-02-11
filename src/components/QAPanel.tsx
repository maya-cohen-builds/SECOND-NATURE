import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQA, PlanTier } from '@/contexts/QAContext';
import { getPlayerProfile } from '@/data/gameData';
import { X, Bug, Monitor, Tablet, Smartphone, Gauge, RotateCcw, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VIEWPORTS = [
  { label: 'Desktop', icon: Monitor, width: 1280 },
  { label: 'Tablet', icon: Tablet, width: 768 },
  { label: 'Mobile', icon: Smartphone, width: 375 },
];

export default function QAPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const { navHistory, qaErrors, clearErrors, planTier, setPlanTier, perfMetrics } = useQA();
  const profile = getPlayerProfile();

  const handleStateReset = () => {
    localStorage.removeItem('stg-player');
    localStorage.removeItem('stg-events');
    localStorage.removeItem('stg-last-result');
    localStorage.removeItem('sn-squad-members');
    localStorage.removeItem('sn-squad-tokens');
    localStorage.removeItem('sn-unlocked-insights');
    localStorage.removeItem('sn-advanced-share-unlocked');
    localStorage.removeItem('sn-perflab-active-tab');
    window.location.reload();
  };

  const handleSeedDemo = () => {
    const demoProfile = {
      level: 5,
      confidence: 62,
      mastery: 55,
      completedScenarios: 8,
      badgesEarned: ['teamwork', 'timing', 'coordination'],
      purchasedUpgrades: [],
    };
    localStorage.setItem('stg-player', JSON.stringify(demoProfile));
    // Seed events
    const now = Date.now();
    const events = Array.from({ length: 8 }, (_, i) => ({
      type: 'complete_scenario',
      data: { rating: ['A', 'B', 'A', 'S', 'B', 'A', 'B', 'A'][i], confidenceGain: 5 + i, masteryGain: 3 + i },
      timestamp: now - (8 - i) * 86400000,
    }));
    events.forEach(e => {
      const existing = JSON.parse(localStorage.getItem('stg-events') || '[]');
      existing.push(e);
      localStorage.setItem('stg-events', JSON.stringify(existing));
    });
    // Seed a last result
    localStorage.setItem('stg-last-result', JSON.stringify({
      scenarioId: 'ca-1',
      scenarioName: 'Pincer Strike',
      category: 'coordinated-attack',
      rating: 'A',
      badges: [{ id: 'teamwork', name: 'Teamwork', icon: 'TW', description: 'Squad coordination' }],
      confidenceGain: 8,
      masteryGain: 6,
      squadSize: 4,
      difficulty: 'Standard',
      liveGameImpact: 'Strong transfer to coordinated pushes.',
      timestamp: now,
    }));
    // Seed squad members
    localStorage.setItem('sn-squad-members', JSON.stringify([
      { name: 'Kira', role: 'Support', drillsCompleted: 5, confidence: 55, mastery: 48, consistency: 52 },
      { name: 'Dex', role: 'Assault', drillsCompleted: 6, confidence: 60, mastery: 52, consistency: 56 },
    ]));
    localStorage.setItem('sn-squad-tokens', '12');
    window.location.reload();
  };

  if (!open) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border z-[100] overflow-y-auto shadow-xl animate-slide-in-right">
      <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-primary" />
          <span className="font-display font-bold text-sm text-foreground">QA Panel</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-5 text-xs">
        {/* Current Route */}
        <div>
          <p className="text-muted-foreground font-medium mb-1">Current Route</p>
          <code className="text-primary bg-primary/10 px-2 py-1 rounded text-xs">{location.pathname}</code>
        </div>

        {/* Plan Tier Simulator */}
        <div>
          <p className="text-muted-foreground font-medium mb-1">
            Plan Tier Simulator
            <span className="text-[10px] text-accent ml-1">(Prototype gating until billing is connected)</span>
          </p>
          <div className="flex gap-1">
            {(['free', 'pro', 'team'] as PlanTier[]).map(tier => (
              <button
                key={tier}
                onClick={() => setPlanTier(tier)}
                className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${
                  planTier === tier
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Nav History */}
        <div>
          <p className="text-muted-foreground font-medium mb-1">Navigation History</p>
          {navHistory.length === 0 ? (
            <p className="text-muted-foreground/60 italic">No navigation yet</p>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {navHistory.map((n, i) => (
                <div key={i} className="flex gap-2 text-[10px]">
                  <span className="text-muted-foreground shrink-0">{new Date(n.timestamp).toLocaleTimeString()}</span>
                  <span className="text-foreground">{n.from} → {n.to}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* App State Snapshot */}
        <div>
          <p className="text-muted-foreground font-medium mb-1">App State Snapshot</p>
          <div className="space-y-0.5 text-[10px] bg-secondary/50 p-2 rounded">
            <p><span className="text-muted-foreground">Completed Drills:</span> <span className="text-foreground">{profile.completedScenarios}</span></p>
            <p><span className="text-muted-foreground">Confidence:</span> <span className="text-foreground">{profile.confidence}%</span></p>
            <p><span className="text-muted-foreground">Mastery:</span> <span className="text-foreground">{profile.mastery}%</span></p>
            <p><span className="text-muted-foreground">Badges:</span> <span className="text-foreground">{profile.badgesEarned.length}</span></p>
            <p><span className="text-muted-foreground">Plan Tier:</span> <span className="text-primary capitalize">{planTier}</span></p>
            <p><span className="text-muted-foreground">Logged In:</span> <span className="text-foreground">No (prototype)</span></p>
          </div>
        </div>

        {/* Errors */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-muted-foreground font-medium">Errors / Warnings</p>
            {qaErrors.length > 0 && (
              <button onClick={clearErrors} className="text-[10px] text-primary hover:underline">Clear</button>
            )}
          </div>
          {qaErrors.length === 0 ? (
            <p className="text-muted-foreground/60 italic">No errors captured</p>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {qaErrors.map((e, i) => (
                <div key={i} className={`text-[10px] p-1.5 rounded ${e.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'}`}>
                  <span className="text-muted-foreground mr-1">{new Date(e.timestamp).toLocaleTimeString()}</span>
                  {e.message.slice(0, 100)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Perf Readout */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Gauge className="h-3 w-3 text-primary" />
            <p className="text-muted-foreground font-medium">Performance</p>
          </div>
          <div className="space-y-0.5 text-[10px]">
            <p>Initial render: <span className="text-foreground">{perfMetrics.initialRenderMs ?? '—'}ms</span></p>
            <p>Last route change: <span className="text-foreground">{perfMetrics.lastRouteChangeMs ?? '—'}ms</span></p>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div>
          <p className="text-muted-foreground font-medium mb-1">Viewport Preview</p>
          <div className="flex gap-1">
            {VIEWPORTS.map(v => (
              <button
                key={v.label}
                onClick={() => {
                  const main = document.querySelector('main');
                  if (main) {
                    (main as HTMLElement).style.maxWidth = `${v.width}px`;
                    (main as HTMLElement).style.margin = '0 auto';
                  }
                }}
                className="flex items-center gap-1 px-2 py-1.5 rounded text-[10px] font-medium bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <v.icon className="h-3 w-3" />
                {v.label}
              </button>
            ))}
            <button
              onClick={() => {
                const main = document.querySelector('main');
                if (main) {
                  (main as HTMLElement).style.maxWidth = '';
                  (main as HTMLElement).style.margin = '';
                }
              }}
              className="px-2 py-1.5 rounded text-[10px] font-medium bg-secondary text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-border">
          <Button size="sm" variant="secondary" onClick={handleStateReset} className="w-full gap-1.5 text-xs">
            <RotateCcw className="h-3 w-3" />
            State Reset
          </Button>
          <Button size="sm" variant="secondary" onClick={handleSeedDemo} className="w-full gap-1.5 text-xs">
            <Database className="h-3 w-3" />
            Seed Demo Data
          </Button>
        </div>
      </div>
    </div>
  );
}
