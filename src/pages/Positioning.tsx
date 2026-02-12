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

export default function Positioning() {
  return (
    <div className="space-y-10 max-w-2xl">
      <style>{`
        .pos-asset-wrap {
          perspective: 600px;
          perspective-origin: 50% 50%;
        }
        @keyframes posMetronome {
          0%   { transform: rotateY(0deg) rotateX(2deg); }
          25%  { transform: rotateY(8deg) rotateX(-1deg); }
          50%  { transform: rotateY(0deg) rotateX(-2deg); }
          75%  { transform: rotateY(-8deg) rotateX(1deg); }
          100% { transform: rotateY(0deg) rotateX(2deg); }
        }
        @keyframes posLattice {
          0%   { transform: rotateY(0deg) rotateX(5deg); }
          50%  { transform: rotateY(180deg) rotateX(-5deg); }
          100% { transform: rotateY(360deg) rotateX(5deg); }
        }
        @keyframes posPrism {
          0%   { transform: rotateY(0deg) rotateX(3deg); }
          33%  { transform: rotateY(12deg) rotateX(-2deg); }
          66%  { transform: rotateY(-12deg) rotateX(-2deg); }
          100% { transform: rotateY(0deg) rotateX(3deg); }
        }
        @keyframes posLoop {
          0%   { transform: rotateY(0deg) rotateX(8deg); }
          50%  { transform: rotateY(180deg) rotateX(-8deg); }
          100% { transform: rotateY(360deg) rotateX(8deg); }
        }
      `}</style>

      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Positioning</p>
        <h1 className="font-display text-2xl font-bold text-foreground">How Second Nature Is Different</h1>
      </div>

      <div className="space-y-6">
        {sections.map((s, i) => {
          const anims = [
            'posMetronome 8s linear infinite',
            'posLattice 11s linear infinite',
            'posPrism 10s linear infinite',
            'posLoop 6s linear infinite',
          ];
          return (
            <div key={s.title} className="p-5 rounded-lg bg-gradient-card border border-border flex gap-6 items-start">
              <div className="pos-asset-wrap w-24 h-24 shrink-0">
                <img
                  src={s.asset}
                  alt=""
                  className="w-full h-full object-contain pointer-events-none select-none opacity-70"
                  style={{
                    mixBlendMode: 'lighten',
                    filter: 'saturate(1.2) contrast(1.4) brightness(1.05)',
                    animation: anims[i],
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'visible',
                  }}
                />
              </div>
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