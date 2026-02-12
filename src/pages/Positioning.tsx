import { Suspense, useState, useCallback } from 'react';
import posMetronome from '@/assets/pos-metronome.png';
import posLattice from '@/assets/pos-lattice.png';
import posPrism from '@/assets/pos-prism.png';
import posLoop from '@/assets/pos-loop.png';
import LatticeSpinner from '@/components/LatticeSpinner';

const sections = [
  { asset: posMetronome, title: 'Coordination is a trainable skill', body: 'Most squads improve by playing more. Second Nature improves squads by structuring what they already do. Execution patterns, timing, role adherence, and decision-making under pressure are isolated into repeatable reps that compound over time.' },
  { asset: posLattice, title: 'Cross-game, not game-specific', body: 'The same coordination principles apply across MOBAs, tactical shooters, MMO raids, and RTS. Lane control maps to site executes. Phase transitions map to objective timing. Switching games no longer resets your learning curve.' },
  { asset: posPrism, title: 'Evidence over intuition', body: 'Every rep produces measurable signal. Execution consistency, decision timing, coordination reliability, and patterns under pressure are tracked across sessions. Confidence follows evidence, not hope.' },
  { asset: posLoop, title: 'Reps, not content', body: 'Second Nature is not a guide library, a coaching marketplace, or a VOD review tool. It is a coordination system. You run structured reps. You measure execution quality. You make coordination automatic.' },
];

// CSS filter chains calibrated from cyan source to target hex:
// Metronome → Green #1FAE6A: shift cyan -40° toward green, boost sat
// Prism → Purple #6B4EFF: shift cyan +100° toward violet, high sat
// Loop → Red #C63B3B: shift cyan +175° toward red
const filterByIndex: Record<number, string> = {
  0: 'saturate(1.8) contrast(1.3) brightness(1.15) hue-rotate(-40deg)',
  2: 'saturate(2.2) contrast(1.3) brightness(1.15) hue-rotate(100deg)',
  3: 'saturate(1.6) contrast(1.3) brightness(1.15) hue-rotate(175deg)',
};

const animationNames = ['posMetronome 8s linear infinite', '', 'posPrism 10s linear infinite', 'posLoop 16s linear infinite'];

export default function Positioning() {
  const [active, setActive] = useState<number | null>(null);

  const engage = useCallback((i: number) => setActive(i), []);
  const disengage = useCallback(() => setActive(null), []);

  return (
    <div className="space-y-10 max-w-2xl">
      <style>{`
        @keyframes posMetronome {
          0%   { transform: rotate(0deg) scale(1); }
          25%  { transform: rotate(8deg) scale(1.03); }
          50%  { transform: rotate(0deg) scale(1); }
          75%  { transform: rotate(-8deg) scale(0.97); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes posPrism {
          0%   { transform: translateY(0px) rotateY(0deg); }
          25%  { transform: translateY(-6px) rotateY(3deg); }
          50%  { transform: translateY(0px) rotateY(0deg); }
          75%  { transform: translateY(4px) rotateY(-3deg); }
          100% { transform: translateY(0px) rotateY(0deg); }
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
        {sections.map((s, i) => {
          const isActive = active === i;
          return (
            <div
              key={s.title}
              className="p-5 rounded-lg bg-gradient-card border border-border flex gap-6 items-start cursor-default select-none"
              onMouseEnter={() => engage(i)}
              onMouseLeave={disengage}
              onClick={() => setActive(prev => prev === i ? null : i)}
            >
              {i === 1 ? (
                <Suspense fallback={<div className="w-24 h-24 shrink-0" />}>
                  <LatticeSpinner active={isActive} />
                </Suspense>
              ) : (
                <img
                  src={s.asset}
                  alt=""
                  className="w-24 h-24 shrink-0 object-contain pointer-events-none select-none transition-opacity duration-700"
                  style={{
                    mixBlendMode: 'lighten',
                    filter: filterByIndex[i],
                    opacity: isActive ? 0.75 : 0.55,
                    animation: isActive ? animationNames[i] : 'none',
                  }}
                />
              )}
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </div>
          );
        })}

        <div className="p-5 rounded-lg bg-secondary border border-border">
          <p className="text-sm text-muted-foreground italic text-center">
            Execution is trained, not discovered.
          </p>
        </div>
      </div>
    </div>
  );
}
