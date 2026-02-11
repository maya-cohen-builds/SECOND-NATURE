import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-training.jpg';

import terrainMountain from '@/assets/terrain-mountain.png';
import terrainForest from '@/assets/terrain-forest.png';
import terrainCastle from '@/assets/terrain-castle.png';
import terrainDesert from '@/assets/terrain-desert.png';

export default function Overview() {
  const navigate = useNavigate();

  const gameWorlds = [
    {
      image: terrainMountain,
      type: 'MOBA',
      subtitle: 'Lane Control',
      games: ['League of Legends', 'Dota 2', 'Smite'],
      drills: 'Lane control, objective timing, teamfight positioning, rotation sequencing',
    },
    {
      image: terrainForest,
      type: 'MMO Raids',
      subtitle: 'Phase Mastery',
      games: ['World of Warcraft', 'Final Fantasy XIV', 'Guild Wars 2'],
      drills: 'Phase transitions, cooldown rotation, role assignments, call-out practice',
    },
    {
      image: terrainCastle,
      type: 'Tactical Shooters',
      subtitle: 'Site Executes',
      games: ['Valorant', 'Counter-Strike 2', 'Rainbow Six Siege'],
      drills: 'Site executes, retake coordination, utility timing, crossfire setups',
    },
    {
      image: terrainDesert,
      type: 'Team-Based Action',
      subtitle: 'Hero Synergy',
      games: ['Marvel Rivals'],
      drills: 'Ult coordination, objective push timing, role synergy, peel sequencing',
    },
    {
      image: terrainDesert,
      type: 'RTS / Strategy',
      subtitle: 'Map Control',
      games: ['StarCraft II', 'Age of Empires IV', 'Company of Heroes 3'],
      drills: 'Build order execution, unit positioning, economy management, map control',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero */}
      <div className="relative rounded-xl border border-border overflow-hidden">
        <img src={heroImage} alt="Squad coordination on a tactical holographic map" className="w-full h-64 md:h-80 object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Cross-Game Coordination System</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
              Start practicing coordination outside of ranked play.
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-4 max-w-lg">
              Structured reps make executes, rotations, and callouts predictable. Practice until coordination is automatic, not accidental.
            </p>
            <p className="text-xs text-muted-foreground mb-6 max-w-lg">
              A cross-game coordination system built around real competitive mechanics.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/training-hub')}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-all"
              >
                Run Your First Drill
              </button>
              <button
                onClick={() => navigate('/modules')}
                className="px-6 py-2.5 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm hover:bg-muted transition-all"
              >
                View Training Drills
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">How It Works</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Reps build patterns. Patterns build confidence.</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Run Structured Reps', desc: 'Drills built around real coordination patterns. Lane control for LoL. Site executes for Valorant. Raid phases for WoW. Your reps, your system.' },
            { step: '02', title: 'Track Signals', desc: 'Coordination scores, role consistency, and improvement trends for your entire squad. Every rep feeds into your group profile.' },
            { step: '03', title: 'Make It Automatic', desc: 'Confidence follows consistency. Consistency comes from structured reps. No gatekeeping. No ranked penalties. Just evidence of improvement.' },
          ].map(s => (
            <div key={s.step} className="p-5 rounded-lg bg-gradient-card border border-border">
              <p className="font-display font-bold text-2xl mb-1 text-primary">{s.step}</p>
              <h3 className="font-display font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Supported Games — Atmospheric floating terrains */}
      <div className="relative -mx-2 md:-mx-6">
        <div className="px-2 md:px-6">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Supported Games</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">Training systems mapped to how competitive games actually work</h2>
        <p className="text-xs text-muted-foreground mb-8">Systems are abstracted from observable mechanics and team workflows. No client mods, no invasive integrations.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12 px-2 md:px-6">
          {gameWorlds.map((g, i) => (
            <div key={g.type} className="relative">
              <img
                src={g.image}
                alt={`${g.type} terrain`}
                className="w-[140%] max-w-none -ml-[20%] -mt-8 mb-[-2rem] pointer-events-none select-none opacity-60 drop-shadow-[0_8px_40px_hsl(var(--primary)/0.25)]"
                style={{
                  animation: `terrainFloat ${3 + i * 0.5}s ease-in-out infinite`,
                  filter: 'saturate(1.2)',
                  mixBlendMode: 'lighten',
                }}
              />
              <div className="relative z-10">
                <span className="px-2 py-0.5 rounded text-[10px] font-display font-bold uppercase tracking-wider text-primary bg-primary/10">
                  {g.subtitle}
                </span>
                <h3 className="font-display font-bold text-foreground text-sm mt-2">{g.type}</h3>
                <div className="space-y-0.5 mt-1">
                  {g.games.map(name => (
                    <p key={name} className="text-xs text-primary">{name}</p>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">{g.drills}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By the Numbers */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Observable Outcomes</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">What structured reps change</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Fewer Missed Calls', desc: 'Squads that drill regularly make fewer late-game communication errors and react faster to shifting objectives' },
            { label: 'Consistent Executes', desc: 'Role-specific reps reduce fumbled site takes, botched engages, and mistimed cooldowns across the roster' },
            { label: 'Less Tilt Under Pressure', desc: 'Structured practice builds pattern recognition so your squad defaults to coordination, not chaos, when behind' },
          ].map(m => (
            <div key={m.label} className="p-5 rounded-lg bg-gradient-card border border-border">
              <p className="font-display font-semibold text-foreground text-sm">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-2">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-xl bg-primary/5 border border-primary/20 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Run reps. Review signals. Make execution automatic.</h2>
        <p className="text-sm text-muted-foreground mb-5">No credit card. No ranked risk. Confidence comes from evidence.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate('/training-hub')}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-all"
          >
            Train Without Rank Risk
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm hover:bg-muted transition-all"
          >
            Review Plans
          </button>
        </div>
      </div>

      {/* Builder trust anchor */}
      <p className="text-xs text-muted-foreground text-center pb-2">Built by competitive players who wanted improvement to become automatic.</p>
    </div>
  );
}