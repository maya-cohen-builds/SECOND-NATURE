import { useEffect } from 'react';
import { trackEvent } from '@/lib/eventTracker';

const EXPERIMENTS = [
  {
    name: 'Training vs. Control Retention',
    hypothesis: 'Players with access to Squad Training retain 15–20% better at Day 30–60 than control.',
    variants: 'A: Training enabled | B: Control (no training)',
    metric: 'Day 30–60 retention rate',
    guardrail: 'Win-rate imbalance between factions < 2%',
    duration: '60 days',
  },
  {
    name: 'Free vs. Paid Exposure',
    hypothesis: 'Exposing paid enhancements early increases conversion without negative sentiment.',
    variants: 'A: Free-only for 7 days | B: Paid visible from Day 1',
    metric: 'Conversion rate to paid enhancements',
    guardrail: 'Pay-to-win sentiment NPS score ≥ baseline',
    duration: '30 days',
  },
  {
    name: 'Squad Size Impact',
    hypothesis: 'Larger squads (5–6) drive higher engagement and ARPDAU than smaller squads (2–3).',
    variants: 'A: Max squad 3 | B: Max squad 6',
    metric: 'ARPDAU and repeat session rate',
    guardrail: 'Session completion rate ≥ 80%',
    duration: '45 days',
  },
  {
    name: 'Difficulty Scaling Method',
    hypothesis: 'Dynamic difficulty scaling improves satisfaction vs. fixed difficulty tiers.',
    variants: 'A: Fixed Easy/Standard/Hard | B: Dynamic per-player scaling',
    metric: 'Training completion rate and satisfaction survey',
    guardrail: 'C-rating rate < 25%',
    duration: '30 days',
  },
  {
    name: 'Badge Visibility',
    hypothesis: 'Showing badges publicly in squad profiles increases repeat training usage.',
    variants: 'A: Badges private | B: Badges visible on squad profile',
    metric: 'Repeat session rate (sessions per user per week)',
    guardrail: 'No increase in negative social sentiment',
    duration: '30 days',
  },
];

export default function Experiments() {
  useEffect(() => {
    trackEvent('view_metrics_page');
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Experiments & Metrics</h1>
        <p className="text-sm text-muted-foreground mt-1">A/B testing plan with hypotheses, metrics, guardrails, and durations.</p>
      </div>

      {/* Success Metrics */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Primary Metric', value: 'Day 30–60 Retention', desc: 'Mid-to-late progression players' },
          { label: 'Revenue Metric', value: 'ARPDAU Lift', desc: 'Training-engaged vs. control' },
          { label: 'Conversion Metric', value: 'Free → Paid', desc: 'Sessions to paid enhancements' },
        ].map(m => (
          <div key={m.label} className="p-4 rounded-lg bg-gradient-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
            <p className="font-display font-bold text-foreground">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Guardrails */}
      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
        <h3 className="font-display font-semibold text-foreground mb-2">🚧 Guardrails</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Pay-to-win perception:</strong> NPS and sentiment tracking must stay ≥ baseline</li>
          <li>• <strong>Faction imbalance:</strong> Win-rate differential between factions must remain &lt; 2%</li>
        </ul>
      </div>

      {/* Experiment Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 font-display font-semibold text-foreground">Experiment</th>
              <th className="text-left py-3 px-3 font-display font-semibold text-foreground">Hypothesis</th>
              <th className="text-left py-3 px-3 font-display font-semibold text-foreground">Variants</th>
              <th className="text-left py-3 px-3 font-display font-semibold text-foreground">Metric</th>
              <th className="text-left py-3 px-3 font-display font-semibold text-foreground">Guardrail</th>
              <th className="text-left py-3 px-3 font-display font-semibold text-foreground">Duration</th>
            </tr>
          </thead>
          <tbody>
            {EXPERIMENTS.map((exp, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-card/50">
                <td className="py-3 px-3 font-medium text-foreground">{exp.name}</td>
                <td className="py-3 px-3 text-muted-foreground">{exp.hypothesis}</td>
                <td className="py-3 px-3 text-muted-foreground text-xs">{exp.variants}</td>
                <td className="py-3 px-3 text-muted-foreground">{exp.metric}</td>
                <td className="py-3 px-3 text-muted-foreground text-xs">{exp.guardrail}</td>
                <td className="py-3 px-3 text-muted-foreground">{exp.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
