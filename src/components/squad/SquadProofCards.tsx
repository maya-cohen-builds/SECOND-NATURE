import { useState } from 'react';
import { MOCK_PROOF_CARDS, type ProofCard } from '@/data/squadData';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

type SignalKey = 'ready' | 'clean' | 'needsWork';

const SIGNAL_LABELS: Record<SignalKey, string> = {
  ready: 'Ready',
  clean: 'Clean',
  needsWork: 'Needs work',
};

const SIGNAL_STYLES: Record<SignalKey, string> = {
  ready: 'bg-primary/10 border-primary/30 text-primary',
  clean: 'bg-chart-2/10 border-chart-2/30 text-chart-2',
  needsWork: 'bg-destructive/10 border-destructive/30 text-destructive',
};

export default function SquadProofCards() {
  const [cards, setCards] = useState(MOCK_PROOF_CARDS);

  const handleSignal = (cardId: string, signal: SignalKey) => {
    setCards(prev =>
      prev.map(c =>
        c.id === cardId
          ? { ...c, signals: { ...c.signals, [signal]: c.signals[signal] + 1 } }
          : c
      )
    );
  };

  const handleShare = (card: ProofCard) => {
    const url = `${window.location.origin}/squad?proof=${card.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Proof card link copied');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <section>
      <h2 className="font-display text-lg font-bold text-foreground mb-1">Shareable Proof</h2>
      <p className="text-xs text-muted-foreground mb-4">Evidence of improvement — stat-forward, shareable</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(card => (
          <div
            key={card.id}
            className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{card.member}</span>
              <span className="text-[10px] text-muted-foreground">
                {formatDistanceToNow(card.timestamp, { addSuffix: true })}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-foreground">{card.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{card.drill} · {card.game}</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-primary">{card.metricValue}</span>
              <span className="text-xs text-muted-foreground">{card.metric}</span>
            </div>

            {/* Signals */}
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(SIGNAL_LABELS) as SignalKey[]).map(key => (
                <button
                  key={key}
                  onClick={() => handleSignal(card.id, key)}
                  className={`px-2 py-1 rounded text-[10px] font-medium border transition-all hover:brightness-110 ${SIGNAL_STYLES[key]}`}
                >
                  {SIGNAL_LABELS[key]} {card.signals[key] > 0 && `· ${card.signals[key]}`}
                </button>
              ))}
            </div>

            {/* Share */}
            <button
              onClick={() => handleShare(card)}
              className="mt-auto px-3 py-1.5 rounded-md text-xs font-medium bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all self-start"
            >
              Share
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
