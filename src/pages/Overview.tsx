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
              Squad drills, performance tracking, and coordination coaching — all without ranked penalties. Get better before the match starts.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/training-hub')}
                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
              >
                Start Training →
              </button>
              <button
                onClick={() => navigate('/performance')}
                className="px-5 py-2.5 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm hover:bg-muted transition-all"
              >
                View Performance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* What / How / Why */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-2">🎯 Practice Without Risk</h3>
          <p className="text-sm text-muted-foreground">
            Run squad drills that mirror real match scenarios — base defense, coordinated pushes, vehicle play, and role execution. No rank on the line.
          </p>
        </div>
        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-2">📊 Track What Matters</h3>
          <p className="text-sm text-muted-foreground">
            See how your squad improves over time. Coordination scores, role consistency, and decision-making efficiency — all tracked session by session.
          </p>
        </div>
        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-2">🤝 Built for Squads</h3>
          <p className="text-sm text-muted-foreground">
            Every drill is designed for 1–6 players. Solo queue or full stack — the system scales difficulty and objectives to your team size and skill level.
          </p>
        </div>
      </div>

      {/* Supported Game Types */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Supported Game Types</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '⚔️', type: 'MOBA', desc: '5v5 lanes, objective control, teamfight coordination, rotations' },
            { icon: '🏰', type: 'MMO Raids', desc: 'Role assignments, phase transitions, cooldown management, call-outs' },
            { icon: '🗺️', type: 'RTS Squads', desc: 'Positioning, economy management, unit composition, map control' },
            { icon: '🎯', type: 'Tactical Shooters', desc: 'Site execution, retakes, utility timing, crossfire setups' },
          ].map(g => (
            <div key={g.type} className="p-4 rounded-lg bg-gradient-card border border-border text-center">
              <div className="text-3xl mb-2">{g.icon}</div>
              <div className="font-display font-bold text-foreground text-sm mb-1">{g.type}</div>
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
            { stat: '15–20%', label: 'Better Win Rate', desc: 'Players who train consistently see measurable improvement' },
            { stat: '3x', label: 'Faster Coordination', desc: 'Squads that drill together execute faster in live play' },
            { stat: '40+', label: 'Training Drills', desc: 'Across defense, attack, vehicle, and role-based scenarios' },
          ].map(m => (
            <div key={m.label} className="p-4 rounded-lg bg-gradient-card border border-border text-center">
              <div className="font-display text-2xl font-bold text-primary mb-1">{m.stat}</div>
              <div className="font-display font-semibold text-foreground text-sm">{m.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
