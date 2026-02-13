import { useState } from 'react';
import { toast } from 'sonner';
import type { CoordinationSignal } from '@/data/squadData';

const SIGNALS: CoordinationSignal[] = [
  'Run this again',
  'This broke',
  'This felt clean',
  'Review timing',
];

interface Props {
  context: string; // e.g. drill name or focus area
}

export default function CoordinationSignals({ context }: Props) {
  const [sent, setSent] = useState<string | null>(null);

  const handleSend = (signal: CoordinationSignal) => {
    setSent(signal);
    toast.success(`Signal sent: "${signal}"`);
    setTimeout(() => setSent(null), 3000);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">Coordination Signals</span>
        <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{context}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SIGNALS.map(signal => (
          <button
            key={signal}
            onClick={() => handleSend(signal)}
            disabled={sent === signal}
            className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium border transition-all ${
              sent === signal
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            {signal}
          </button>
        ))}
      </div>
    </div>
  );
}
