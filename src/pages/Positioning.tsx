import posMetronome from '@/assets/pos-metronome.png';
import posLattice from '@/assets/pos-lattice.png';
import posPrism from '@/assets/pos-prism.png';
import posLoop from '@/assets/pos-loop.png';

const sections = [
  { asset: posMetronome, title: 'Coordination is a trainable skill', body: 'Most squads improve by playing more. Second Nature improves squads by structuring what they already do. Execution patterns, timing, role adherence, and decision-making under pressure are isolated into repeatable reps that compound over time.' },
  { asset: posLattice, title: 'Cross-game, not game-specific', body: 'The same coordination principles apply across MOBAs, tactical shooters, MMO raids, and RTS. Lane control maps to site executes. Phase transitions map to objective timing. Switching games no longer resets your learning curve.' },
  { asset: posPrism, title: 'Evidence over intuition', body: 'Every rep produces measurable signal. Execution consistency, decision timing, coordination reliability, and patterns under pressure are tracked across sessions. Confidence follows evidence, not hope.' },
  { asset: posLoop, title: 'Reps, not content', body: 'Second Nature is not a guide library, a coaching marketplace, or a VOD review tool. It is a coordination system. You run structured reps. You measure execution quality. You make coordination automatic.' },
];

const motionStyles: React.CSSProperties[] = [
  { animation: 'posMetronome 8s linear infinite' },
  { animation: 'posLattice 11s linear infinite' },
  { animation: 'posPrism 10s linear infinite' },
  { animation: 'posLoop 6s linear infinite' },
];

export default function Positioning() {
  return (
    <div className="space-y-10 max-w-2xl">
      <style>{`
        @keyframes posMetronome {
          0%   { transform: rotate(0deg) scale(1); }
          25%  { transform: rotate(3deg) scale(1.01); }
          50%  { transform: rotate(0deg) scale(1); }
          75%  { transform: rotate(-3deg) scale(0.99); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes posLattice {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes posPrism {
          0%   { transform: translateY(0px) scaleY(1); }
          50%  { transform: translateY(-3px) scaleY(1.02); }
          100% { transform: translateY(0px) scaleY(1); }
        }
        @keyframes posLoop {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Positioning</p>
        <h1 className="font-display text-2xl font-bold text-foreground">How Second Nature Is Different</h1>
      </div>

      <div className="space-y-6">
        {sections.map((s, i) => (
          <div key={s.title} className="p-5 rounded-lg bg-gradient-card border border-border flex gap-6 items-start">
            <img
              src={s.asset}
              alt=""
              className="w-24 h-24 shrink-0 object-contain pointer-events-none select-none opacity-70"
              style={{ mixBlendMode: 'lighten', filter: 'saturate(1.2) contrast(1.4) brightness(1.05)', ...motionStyles[i] }}
            />
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}

        <div className="p-5 rounded-lg bg-secondary border border-border">
          <p className="text-sm text-muted-foreground italic text-center">
            Execution is trained, not discovered.
          </p>
        </div>
      </div>
    </div>
  );
}
