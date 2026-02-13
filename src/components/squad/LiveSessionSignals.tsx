import { useState } from 'react';
import type { LiveSignal } from '@/data/squadData';

const LIVE_SIGNALS: LiveSignal[] = ['Hold', 'Reset', 'Again', 'Clean', 'Pause'];

const SIGNAL_COLORS: Record<LiveSignal, string> = {
  Hold: 'bg-chart-4/10 border-chart-4/30 text-chart-4',
  Reset: 'bg-destructive/10 border-destructive/30 text-destructive',
  Again: 'bg-primary/10 border-primary/30 text-primary',
  Clean: 'bg-chart-2/10 border-chart-2/30 text-chart-2',
  Pause: 'bg-muted-foreground/10 border-muted-foreground/30 text-muted-foreground',
};

export default function LiveSessionSignals() {
  const [activeSignal, setActiveSignal] = useState<LiveSignal | null>(null);

  const handleTap = (signal: LiveSignal) => {
    setActiveSignal(signal);
    setTimeout(() => setActiveSignal(null), 2000);
  };

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-foreground">Live Session Signals</span>
      <div className="flex flex-wrap gap-1.5">
        {LIVE_SIGNALS.map(signal => (
          <button
            key={signal}
            onClick={() => handleTap(signal)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${SIGNAL_COLORS[signal]} hover:brightness-110`}
          >
            {signal}
          </button>
        ))}
      </div>
      {activeSignal && (
        <div className="animate-fade-in px-3 py-2 rounded-md bg-primary/5 border border-primary/20 text-xs text-primary font-medium">
          ⚡ {activeSignal}
        </div>
      )}
    </div>
  );
}
