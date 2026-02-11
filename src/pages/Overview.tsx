import { useNavigate } from 'react-router-dom';
import { useDemo } from '@/contexts/DemoContext';

export default function Overview() {
  const navigate = useNavigate();
  const { demoMode } = useDemo();

  const demoSteps = [
    { label: 'Visit Training Hub', path: '/training-hub' },
    { label: 'Select a scenario & run simulation', path: '/training-hub' },
    { label: 'View your results', path: '/results' },
    { label: 'Explore the shop', path: '/shop' },
    { label: 'Review experiments & metrics', path: '/experiments' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-hero rounded-xl border border-border p-8 md:p-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            ◈ PMM Portfolio Demo
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Squad Training & Simulation Mode
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            A cooperative, progression-based training system that restores earned progress for mid-tier players through dynamically scaled missions, performance ratings, and a freemium monetization layer.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/training-hub')}
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
            >
              Enter Training Hub →
            </button>
            <button
              onClick={() => navigate('/narrative')}
              className="px-5 py-2.5 rounded-lg bg-secondary border border-border text-foreground font-display font-semibold text-sm hover:bg-muted transition-all"
            >
              Read PMM Narrative
            </button>
          </div>
        </div>
      </div>

      {/* Who / What / Why */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-2">What It Is</h3>
          <p className="text-sm text-muted-foreground">
            Short, repeatable combat simulations covering base defense, coordinated attacks, vehicle mastery, and role-based objectives. Scenarios scale dynamically to player level and squad composition.
          </p>
        </div>
        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-2">Who It's For</h3>
          <p className="text-sm text-muted-foreground">
            Mid-to-late progression players (Levels 4–6) who feel permanently outmatched. Squad leaders who influence group behavior and purchasing decisions. Players who want to improve without repeated competitive losses.
          </p>
        </div>
        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-2">Why It Exists</h3>
          <p className="text-sm text-muted-foreground">
            Progression stalls create churn. Vehicles lose perceived utility. The skill gap between elite and mid-tier players feels insurmountable. Training mode rebuilds confidence and spending motivation.
          </p>
        </div>
      </div>

      {/* Demo Mode Guide */}
      {demoMode && (
        <div className="p-5 rounded-lg bg-primary/5 border border-primary/20">
          <h3 className="font-display font-semibold text-primary mb-3">🎯 Demo Mode — 60-Second Walkthrough</h3>
          <div className="space-y-2">
            {demoSteps.map((step, i) => (
              <button
                key={i}
                onClick={() => navigate(step.path)}
                className="flex items-center gap-3 w-full text-left p-2 rounded-md hover:bg-primary/10 transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground">{step.label}</span>
                <span className="text-xs text-primary ml-auto">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Success Metrics</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Day 30–60 Retention', target: '+15-20%', desc: 'For mid-to-late progression players' },
            { label: 'ARPDAU Lift', target: '+8-12%', desc: 'Training-engaged vs. control cohort' },
            { label: 'Paid Conversion', target: '12-18%', desc: 'Free sessions → paid enhancements' },
          ].map(m => (
            <div key={m.label} className="p-4 rounded-lg bg-gradient-card border border-border text-center">
              <div className="font-display text-2xl font-bold text-primary mb-1">{m.target}</div>
              <div className="font-display font-semibold text-foreground text-sm">{m.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
