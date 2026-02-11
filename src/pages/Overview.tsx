import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-training.jpg';
import { TerrainCard, TerrainStatCard, TerrainStepCard } from '@/components/TerrainCard';

import terrainMountain from '@/assets/terrain-mountain.png';
import terrainOcean from '@/assets/terrain-ocean.png';
import terrainForest from '@/assets/terrain-forest.png';
import terrainCastle from '@/assets/terrain-castle.png';
import terrainCandy from '@/assets/terrain-candy.png';
import terrainCheese from '@/assets/terrain-cheese.png';
import terrainDystopia from '@/assets/terrain-dystopia.png';
import terrainRainforest from '@/assets/terrain-rainforest.png';
import terrainRio from '@/assets/terrain-rio.png';
import terrainDesert from '@/assets/terrain-desert.png';

export default function Overview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="relative rounded-xl border border-border overflow-hidden">
        <img src={heroImage} alt="Squad coordination on a tactical holographic map" className="w-full h-64 md:h-80 object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Cross-Game Training Platform</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
              Train Smarter. Win Together.
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-lg">
              The squad training companion for competitive players. Practice coordination, track group performance, and run game-specific drills without risking your rank.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/training-hub')}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-all"
              >
                Start Training
              </button>
              <button
                onClick={() => navigate('/modules')}
                className="px-6 py-2.5 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm hover:bg-muted transition-all"
              >
                Browse Modules
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">How It Works</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-6">Pick your game. Run drills. Get better.</h2>
        <div className="grid md:grid-cols-3 gap-5">
          <TerrainStepCard
            image={terrainOcean}
            step="01"
            title="Track Group Stats"
            description="See coordination scores, role consistency, and improvement trends for your entire squad. Every drill feeds into your group profile."
            index={0}
          />
          <TerrainStepCard
            image={terrainCandy}
            step="02"
            title="Run Custom Modules"
            description="Build and share training modules tailored to your game. Lane control for LoL. Site executes for Valorant. Raid phases for WoW. Your drills, your rules."
            index={1}
          />
          <TerrainStepCard
            image={terrainDystopia}
            step="03"
            title="Close the Gap"
            description="Designed for beginners and mid-level players who want to compete but need structured practice. No gatekeeping. No ranked penalties."
            index={2}
          />
        </div>
      </div>

      {/* Supported Games */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Supported Games</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-6">Training modules for the games you play</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          <TerrainCard
            image={terrainMountain}
            title="MOBA"
            subtitle="Lane Control"
            description="League of Legends, Dota 2, Smite"
            detail="Lane control, objective timing, teamfight positioning, rotation sequencing"
            index={0}
          />
          <TerrainCard
            image={terrainForest}
            title="MMO Raids"
            subtitle="Phase Mastery"
            description="World of Warcraft, Final Fantasy XIV, Guild Wars 2"
            detail="Phase transitions, cooldown rotation, role assignments, call-out practice"
            index={1}
          />
          <TerrainCard
            image={terrainCastle}
            title="Tactical Shooters"
            subtitle="Site Executes"
            description="Valorant, Counter-Strike 2, Rainbow Six Siege"
            detail="Site executes, retake coordination, utility timing, crossfire setups"
            index={2}
          />
          <TerrainCard
            image={terrainDesert}
            title="RTS / Strategy"
            subtitle="Map Control"
            description="StarCraft II, Age of Empires IV, Company of Heroes 3"
            detail="Build order execution, unit positioning, economy management, map control"
            index={3}
          />
        </div>
      </div>

      {/* By the Numbers */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">By the Numbers</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-6">Players who train consistently win more</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <TerrainStatCard
            image={terrainRainforest}
            stat="15-20%"
            label="Higher Win Rate"
            description="Squads that run 3+ drills per week see measurable improvement in ranked play"
            index={0}
          />
          <TerrainStatCard
            image={terrainRio}
            stat="3x"
            label="Faster Coordination"
            description="Practiced squads execute callouts and rotations faster than uncoordinated teams"
            index={1}
          />
          <TerrainStatCard
            image={terrainCheese}
            stat="40+"
            label="Training Modules"
            description="Game-specific drills across MOBA, MMO, shooter, and RTS categories"
            index={2}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-xl bg-primary/5 border border-primary/20 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Ready to rank up?</h2>
        <p className="text-sm text-muted-foreground mb-5">Free to start. No credit card. No ranked risk.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate('/training-hub')}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-all"
          >
            Start Free
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm hover:bg-muted transition-all"
          >
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
}
