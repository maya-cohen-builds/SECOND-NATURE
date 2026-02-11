import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-training.jpg';

export default function Overview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative rounded-xl border border-border overflow-hidden">
        <img src={heroImage} alt="Squad coordination on a tactical holographic map" className="w-full h-64 md:h-80 object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
              Train Smarter. Win Together.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              The cross-game training platform for competitive squads. Practice coordination, track group stats, and run custom training modules for your game. Built for beginners and mid-level players ready to close the skill gap.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/training-hub')}
                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
              >
                Start Training
              </button>
              <button
                onClick={() => navigate('/group-stats')}
                className="px-5 py-2.5 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm hover:bg-muted transition-all"
              >
                View Group Stats
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-2">Group Stats Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Track your squad's coordination, role consistency, and improvement over time. Compare individual and group performance session by session.
          </p>
        </div>
        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-2">Custom Training Modules</h3>
          <p className="text-sm text-muted-foreground">
            Build and share drills tailored to your game. Create modules for lane control, raid phases, site executions, or any coordination challenge your squad faces.
          </p>
        </div>
        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-2">No Ranked Penalties</h3>
          <p className="text-sm text-muted-foreground">
            Practice without risking your rank. Run drills that mirror real match scenarios so your squad can improve before the match starts.
          </p>
        </div>
      </div>

      {/* Supported Games */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Supported Games</h2>
        <p className="text-sm text-muted-foreground mb-4">Training modules and stat tracking for the games you already play.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { type: 'MOBA', games: 'League of Legends, Dota 2, Smite', desc: '5v5 lane control, objective timing, teamfight positioning, rotation drills' },
            { type: 'MMO Raids', games: 'World of Warcraft, Final Fantasy XIV, Guild Wars 2', desc: 'Role assignments, phase transitions, cooldown management, call-out practice' },
            { type: 'RTS / Squad Strategy', games: 'StarCraft II, Age of Empires IV, Company of Heroes', desc: 'Unit positioning, economy management, build order execution, map control' },
            { type: 'Tactical Shooters', games: 'Valorant, Counter-Strike 2, Rainbow Six Siege', desc: 'Site executions, retake coordination, utility timing, crossfire setups' },
          ].map(g => (
            <div key={g.type} className="p-4 rounded-lg bg-gradient-card border border-border">
              <div className="font-display font-bold text-foreground text-sm mb-1">{g.type}</div>
              <div className="text-xs text-primary mb-2">{g.games}</div>
              <div className="text-xs text-muted-foreground">{g.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Why Players Train Here</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { stat: '15-20%', label: 'Better Win Rate', desc: 'Players who train consistently see measurable improvement' },
            { stat: '3x', label: 'Faster Coordination', desc: 'Squads that drill together execute faster in live play' },
            { stat: '40+', label: 'Training Modules', desc: 'Across defense, attack, vehicle, and role-based scenarios' },
          ].map(m => (
            <div key={m.label} className="p-4 rounded-lg bg-gradient-card border border-border text-center">
              <div className="font-display text-2xl font-bold text-primary mb-1">{m.stat}</div>
              <div className="font-display font-semibold text-foreground text-sm">{m.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-6 rounded-lg bg-primary/5 border border-primary/20 text-center">
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Ready to close the gap?</h2>
        <p className="text-sm text-muted-foreground mb-4">Start with a free trial. No credit card required.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate('/training-hub')}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
          >
            Start Free Trial
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="px-5 py-2.5 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm hover:bg-muted transition-all"
          >
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
}
