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
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">Turn coordination into second nature.</h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-lg">Train execution patterns that hold up under pressure.</p>
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

      {/* The Coordination Loop */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">The Coordination Loop</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Reps build patterns. Patterns build confidence.</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
          { step: '01', title: 'Reinforce Coordination Patterns', desc: 'Drills built around real coordination mechanics. Lane control for LoL. Site executes for Valorant. Raid phases for WoW. Your reps, your system.' },
          { step: '02', title: 'Measure Execution Quality', desc: 'Timing alignment, role adherence, decision latency, and consistency under pressure. Every rep feeds into your squad intelligence profile.' },
          { step: '03', title: 'Make It Automatic', desc: 'Confidence follows repetition. Consistency follows structure. Reps compound until execution is predictable under pressure.' }].
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
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Cross-Game System</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">One coordination system. Endless games.</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
          'The same execution principles apply across MOBAs, shooters, MMOs, and RTS.',
          'Train timing, roles, and decision flow once. Apply everywhere.',
          'Switching games no longer resets your learning curve.'].
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
        <h2 className="font-display text-xl font-bold text-foreground mb-1">Training worlds built from real competitive play</h2>
        <p className="text-xs text-muted-foreground mb-8">Every environment mirrors how teams actually coordinate in live matches.
No mods. No invasive integrations. Run drills that feel like the game.
          </p>
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

      {/* What Changes When Execution Is Systematic */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Observable Outcomes</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">What changes when execution is systematic</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
          { label: 'Fewer Missed Calls', desc: 'Squads that drill regularly make fewer late-game communication errors and react faster to shifting objectives.' },
          { label: 'Consistent Executes', desc: 'Role-specific reps reduce fumbled site takes, botched engages, and mistimed cooldowns across the roster.' },
          { label: 'Less Tilt Under Pressure', desc: 'Pattern reinforcement builds recognition so your squad defaults to coordination, not chaos, when behind.' }].
          map((m) =>
          <div key={m.label} className="p-5 rounded-lg bg-gradient-card border border-border">
              <p className="font-display font-semibold text-foreground text-sm">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-2">{m.desc}</p>
            </div>
          )}
        </div>
      </div>

      {/* Confidence Explainer */}
      <div className="p-6 rounded-xl bg-secondary border border-border">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Trainable Skill</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Confidence is not mindset. It is evidence.</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Confidence follows repetition. Consistency follows structure. Second Nature turns reps into predictable execution under pressure. The more you drill, the less you guess.
        </p>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-xl bg-primary/5 border border-primary/20 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Train execution patterns. Review signals. Make coordination automatic.</h2>
        <p className="text-sm text-muted-foreground mb-5">No credit card. Confidence comes from evidence, not from hoping your squad clicks.</p>
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
      <p className="text-xs text-muted-foreground text-center pb-2">Confidence is evidence.</p>
    </div>);

}