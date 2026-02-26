import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-training.jpg';
import { terrainAssets, type TerrainKey } from '@/data/terrainAssets';

/**
 * DO NOT REPLACE ASSETS. Only change if the prompt explicitly requests it.
 * All terrain images are sourced from terrainAssets registry in src/data/terrainAssets.ts.
 */

export default function Overview() {
  const navigate = useNavigate();
  const [showAssetDebug, setShowAssetDebug] = useState(false);

  const gameWorlds: {assetKey: TerrainKey;type: string;subtitle: string;games: string[];drills: string;}[] = [
  {
    assetKey: 'laneControl',
    type: 'MOBA',
    subtitle: 'Lane Control',
    games: ['League of Legends', 'Dota 2', 'Smite'],
    drills: 'Lane control, objective timing, teamfight positioning, rotation sequencing'
  },
  {
    assetKey: 'phaseMastery',
    type: 'MMO Raids',
    subtitle: 'Phase Mastery',
    games: ['World of Warcraft', 'Final Fantasy XIV', 'Guild Wars 2'],
    drills: 'Phase transitions, cooldown rotation, role assignments, call-out practice'
  },
  {
    assetKey: 'siteExecutes',
    type: 'Tactical Shooters',
    subtitle: 'Site Executes',
    games: ['Valorant', 'Counter-Strike 2', 'Rainbow Six Siege'],
    drills: 'Site executes, retake coordination, utility timing, crossfire setups'
  },
  {
    assetKey: 'heroSynergy',
    type: 'Team-Based Action',
    subtitle: 'Hero Synergy',
    games: ['Marvel Rivals'],
    drills: 'Ult coordination, objective push timing, role synergy, peel sequencing'
  },
  {
    assetKey: 'mapControl',
    type: 'RTS / Strategy',
    subtitle: 'Map Control',
    games: ['StarCraft II', 'Age of Empires IV', 'Company of Heroes 3'],
    drills: 'Build order execution, unit positioning, economy management, map control'
  }];


  return (
    <div className="space-y-16">
      {/* Dev-only Asset Debug Panel */}
      {import.meta.env.DEV &&
      <div className="fixed top-16 left-2 z-[200]">
          <button
          onClick={() => setShowAssetDebug((v) => !v)}
          className="px-2 py-1 rounded text-[9px] font-mono bg-secondary border border-border text-muted-foreground hover:text-foreground">

            {showAssetDebug ? 'Hide' : 'Show'} Asset Debug
          </button>
          {showAssetDebug &&
        <div className="mt-1 p-2 rounded bg-card border border-border text-[10px] font-mono space-y-1 max-w-xs">
              {(Object.entries(terrainAssets) as [TerrainKey, string][]).map(([key, url]) =>
          <div key={key} className="flex gap-2">
                  <span className="text-primary font-bold">{key}:</span>
                  <span className="text-muted-foreground truncate">{url || '⚠️ MISSING'}</span>
                </div>
          )}
            </div>
        }
        </div>
      }
      {/* Hero */}
      <div className="relative rounded-xl border border-border overflow-hidden">
        <img src={heroImage} alt="Squad coordination on a tactical holographic map" className="w-full h-64 md:h-80 object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Cross-Game Coordination System</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">Get your squad in sync across any game.</h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-2xl">Run quick reps together, build team chemistry, and watch your coordination click — no matter what you play.</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/training-hub')}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-all">
                Run Your First Drill
              </button>
              <button
                onClick={() => navigate('/modules')}
                className="px-6 py-2.5 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm hover:bg-muted transition-all">
                See How It Works
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">How It Works</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Three steps. No homework. Just play together.</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
          { step: '01', title: 'Run Reps That Feel Like Playing', desc: 'Short, focused scenarios based on real coordination moments. Lane rotations in LoL. Site takes in Valorant. Raid phases in WoW. Pick your game, grab your squad, and go.' },
          { step: '02', title: 'See How You Click Together', desc: 'After each rep, see where your timing lined up and where it didn\'t. No grades, no pressure — just clear signals so you know what to try next.' },
          { step: '03', title: 'Build Chemistry Over Time', desc: 'The more you rep together, the more natural it feels. Coordination stops being something you think about and starts being something you just do.' }].
          map((s) =>
          <div key={s.step} className="p-5 rounded-lg bg-gradient-card border border-border">
              <p className="font-display font-bold text-2xl mb-1 text-primary">{s.step}</p>
              <h3 className="font-display font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cross-Game Differentiator */}
      <div className="p-6 rounded-xl bg-gradient-card border border-border">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Works Across Games</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Your squad plays more than one game. So does Second Nature.</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
          'Timing, callouts, and teamwork patterns carry over between MOBAs, shooters, MMOs, and RTS.',
          'Get better at coordinating once. Use it in every game you play together.',
          'Switching games doesn\'t mean starting over. The patterns travel with you.'].
          map((point, i) =>
          <div key={i} className="flex items-start gap-3">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <p className="text-sm text-muted-foreground">{point}</p>
            </div>
          )}
        </div>
      </div>

      {/* Supported Games — Atmospheric floating terrains */}
      <div className="relative -mx-2 md:-mx-6">
        <div className="px-2 md:px-6">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Supported Games</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">Pick your game. Bring your squad.</h2>
        <p className="text-xs text-muted-foreground mb-8">Every scenario mirrors how teams actually play together in real matches. No mods, no weird installs. Just reps that feel like the game.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-14 px-2 md:px-6">
          {gameWorlds.map((g, i) => <div key={g.type} className="relative">
          {(() => {const resolvedSrc = terrainAssets[g.assetKey];
              if (!resolvedSrc) {
                return (
                  <div className="w-[90%] mx-auto -mt-4 mb-[-1rem] h-32 flex items-center justify-center rounded bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono">
                      Missing asset: {g.assetKey}
                    </div>);
              }
              return (
                <img
                  src={resolvedSrc}
                  alt={`${g.type} terrain`}
                  className="w-[90%] mx-auto -mt-4 mb-[-1rem] pointer-events-none select-none opacity-60 drop-shadow-[0_8px_40px_hsl(var(--primary)/0.25)]"
                  style={{
                    animation: `terrainFloat ${3 + i * 0.5}s ease-in-out infinite`,
                    filter: 'saturate(1.2) contrast(1.4) brightness(1.05)',
                    mixBlendMode: 'lighten'
                  }} />);
            })()}

              <div className="relative z-10">
                <span className="px-2 py-0.5 rounded text-[10px] font-display font-bold uppercase tracking-wider text-primary bg-primary/10">
                  {g.subtitle}
                </span>
                <h3 className="font-display font-bold text-foreground text-sm mt-2">{g.type}</h3>
                <div className="space-y-0.5 mt-1">
                  {g.games.map((name) =>
                <p key={name} className="text-xs text-primary">{name}</p>
                )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">{g.drills}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What Changes */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">What Changes</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Small reps, real results</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
          { label: 'Better Callouts', desc: 'Your squad starts reading the same situations the same way. Fewer missed calls, faster reactions when things shift.' },
          { label: 'Smoother Plays', desc: 'Site takes, engages, and rotations start clicking because everyone knows the pattern — not just the shotcaller.' },
          { label: 'Less Panic, More Flow', desc: 'When your team has repped the moment before, falling behind feels recoverable instead of chaotic.' }].
          map((m) =>
          <div key={m.label} className="p-5 rounded-lg bg-gradient-card border border-border">
              <p className="font-display font-semibold text-foreground text-sm">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-2">{m.desc}</p>
            </div>
          )}
        </div>
      </div>

      {/* Who It's For */}
      <div className="p-6 rounded-xl bg-secondary border border-border">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Who It's For</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-3">Built for squads at every level</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
          { label: 'New to Competitive', desc: 'Just starting to play with a squad? Reps help you learn how teams move together — no prior experience needed.' },
          { label: 'Coming Back to the Game', desc: 'Returning after a break? Get back in sync with your squad faster than grinding ranked and hoping for the best.' },
          { label: 'Squads Leveling Up', desc: 'Already coordinated but want to be sharper? Stack reps on the moments that matter most in your game.' }
          ].map((m) =>
          <div key={m.label} className="p-5 rounded-lg bg-gradient-card border border-border">
              <p className="font-display font-semibold text-foreground text-sm">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-2">{m.desc}</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-xl bg-primary/5 border border-primary/20 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Ready to get your squad in sync?</h2>
        <p className="text-sm text-muted-foreground mb-5">Free to start. No credit card. Just grab your squad and run your first rep.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate('/training-hub')}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-all">
            Run Your First Drill
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm hover:bg-muted transition-all">
            Review Plans
          </button>
        </div>
      </div>

      {/* Builder trust anchor */}
      <p className="text-xs text-muted-foreground text-center pb-2">Built by players who wanted team improvement to feel natural.</p>
    </div>);

}
