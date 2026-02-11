import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-training.jpg';

export default function Overview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
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

      {/* How It Works - Mobalytics outcome style */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">How It Works</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Pick your game. Run drills. Get better.</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-gradient-card border border-border">
            <p className="font-display font-bold text-foreground text-2xl mb-1 text-primary">01</p>
            <h3 className="font-display font-semibold text-foreground mb-2">Track Group Stats</h3>
            <p className="text-sm text-muted-foreground">
              See coordination scores, role consistency, and improvement trends for your entire squad. Every drill feeds into your group profile.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-gradient-card border border-border">
            <p className="font-display font-bold text-foreground text-2xl mb-1 text-primary">02</p>
            <h3 className="font-display font-semibold text-foreground mb-2">Run Custom Modules</h3>
            <p className="text-sm text-muted-foreground">
              Build and share training modules tailored to your game. Lane control for LoL. Site executes for Valorant. Raid phases for WoW. Your drills, your rules.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-gradient-card border border-border">
            <p className="font-display font-bold text-foreground text-2xl mb-1 text-primary">03</p>
            <h3 className="font-display font-semibold text-foreground mb-2">Close the Gap</h3>
            <p className="text-sm text-muted-foreground">
              Designed for beginners and mid-level players who want to compete but need structured practice. No gatekeeping. No ranked penalties.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Games - Riot-style game cards */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Supported Games</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Training modules for the games you play</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              type: 'MOBA',
              games: ['League of Legends', 'Dota 2', 'Smite'],
              drills: 'Lane control, objective timing, teamfight positioning, rotation sequencing',
            },
            {
              type: 'MMO Raids',
              games: ['World of Warcraft', 'Final Fantasy XIV', 'Guild Wars 2'],
              drills: 'Phase transitions, cooldown rotation, role assignments, call-out practice',
            },
            {
              type: 'Tactical Shooters',
              games: ['Valorant', 'Counter-Strike 2', 'Rainbow Six Siege'],
              drills: 'Site executes, retake coordination, utility timing, crossfire setups',
            },
            {
              type: 'RTS / Strategy',
              games: ['StarCraft II', 'Age of Empires IV', 'Company of Heroes 3'],
              drills: 'Build order execution, unit positioning, economy management, map control',
            },
          ].map(g => (
            <div key={g.type} className="p-4 rounded-lg bg-gradient-card border border-border group hover:border-primary/30 transition-colors">
              <div className="font-display font-bold text-foreground text-sm mb-2">{g.type}</div>
              <div className="space-y-0.5 mb-3">
                {g.games.map(name => (
                  <p key={name} className="text-xs text-primary">{name}</p>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{g.drills}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof - Mobalytics number style */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">By the Numbers</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Players who train consistently win more</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { stat: '15-20%', label: 'Higher Win Rate', desc: 'Squads that run 3+ drills per week see measurable improvement in ranked play' },
            { stat: '3x', label: 'Faster Coordination', desc: 'Practiced squads execute callouts and rotations faster than uncoordinated teams' },
            { stat: '40+', label: 'Training Modules', desc: 'Game-specific drills across MOBA, MMO, shooter, and RTS categories' },
          ].map(m => (
            <div key={m.label} className="p-5 rounded-lg bg-gradient-card border border-border text-center">
              <p className="font-display text-3xl font-bold text-primary mb-1">{m.stat}</p>
              <p className="font-display font-semibold text-foreground text-sm">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-2">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA - Riot "Play For Free" style */}
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
