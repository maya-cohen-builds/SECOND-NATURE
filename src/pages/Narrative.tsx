export default function Narrative() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
          PMM Portfolio Narrative
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Squad Training & Simulation Mode</h1>
        <p className="text-muted-foreground mt-2">Product Marketing Manager · Feature Launch Narrative</p>
      </div>

      <Section title="Problem">
        <p>
          A mature mobile strategy game is experiencing accelerating churn and declining revenue among its most valuable segment: 
          mid-to-late progression players. These players have invested significant time and money but have hit a progression 
          ceiling. The skill gap between elite and mid-tier feels insurmountable. Vehicles, upgrades, and late-game purchases 
          lose perceived utility, reducing both play motivation and spending confidence.
        </p>
        <p className="mt-2">
          Revenue decline is a downstream symptom of lost progress confidence, not the primary problem. ARPDAU drops most 
          sharply as players reach mid-to-late progression, and spending peaks collapse once advancement feels unrealistic.
        </p>
      </Section>

      <Section title="Insight">
        <p>
          Esports and competitive gaming research consistently shows that retention improves when players feel visible 
          improvement, team contribution, and mastery momentum. The missing piece isn't content — it's a structured, 
          safe environment where players can practice, improve, and see that improvement translate to live performance.
        </p>
        <p className="mt-2">
          Players don't need easier games. They need a path to getting better that doesn't require repeated competitive 
          losses as the learning mechanism.
        </p>
      </Section>

      <Section title="Positioning">
        <p>
          <strong>Squad Training Grounds</strong> is a cooperative training mode that makes late-game progression feel 
          achievable, earned, and worth continued investment. It's positioned as the bridge between "I'm stuck" and 
          "I'm getting better" — a training system that rewards coordination and mastery, not spending.
        </p>
        <p className="mt-2">
          <em>For squad-affiliated players who feel outmatched, Squad Training Grounds is the training mode that 
          rebuilds confidence and squad effectiveness through repeatable, skill-based simulations.</em>
        </p>
      </Section>

      <Section title="GTM Plan">
        <ul className="space-y-2">
          <li><strong>Phase 1 — Closed Beta:</strong> Launch with 50 high-engagement squads. Measure completion rates, session frequency, and qualitative feedback on difficulty scaling and reward perception.</li>
          <li><strong>Phase 2 — Limited Release:</strong> Tie launch to a competitive event when motivation to improve peaks. Enable free training sessions for all; hold paid enhancements for Phase 3.</li>
          <li><strong>Phase 3 — Full Rollout:</strong> Enable monetization layer. Introduce analytics overlays, expanded squad capacity, and advanced simulations. Monitor ARPDAU lift and sentiment guardrails.</li>
          <li><strong>Phase 4 — Expansion:</strong> Add spectator mode, coaching overlays, and branded challenges based on engagement data.</li>
        </ul>
      </Section>

      <Section title="Pricing & Monetization">
        <p>
          The monetization model is built on a "convenience and insight, not power" principle:
        </p>
        <ul className="mt-2 space-y-1">
          <li>• <strong>Free tier:</strong> 3 daily sessions, standard scenarios, squads up to 4</li>
          <li>• <strong>Extended Training Pass (299 credits):</strong> +5 daily sessions</li>
          <li>• <strong>Advanced Simulations (499 credits):</strong> High-complexity multi-phase scenarios</li>
          <li>• <strong>Performance Analytics (399 credits):</strong> Real-time tactical overlay</li>
          <li>• <strong>Squad Expansion (349 credits):</strong> Squads up to 6</li>
          <li>• <strong>Tactical Modifiers (449 credits):</strong> Custom scenario conditions</li>
        </ul>
        <p className="mt-2 text-sm text-muted-foreground">
          Target: 12–18% conversion from free sessions to any paid enhancement within first 30 days.
        </p>
      </Section>

      <Section title="Experiment Design">
        <p>
          Five A/B tests are planned across the first 60 days post-launch, covering retention impact, paid exposure timing, 
          squad size effects, difficulty scaling method, and badge visibility. Each experiment has a defined hypothesis, 
          success metric, guardrail, and duration. Guardrails monitor pay-to-win sentiment and faction imbalance to 
          ensure competitive integrity.
        </p>
      </Section>

      <Section title="Launch Milestones">
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            { phase: 'Prototype', timeline: 'Week 1–2', status: '✅ Complete' },
            { phase: 'Closed Beta', timeline: 'Week 3–5', status: 'Planned' },
            { phase: 'Limited Public Release', timeline: 'Week 6–8', status: 'Planned' },
            { phase: 'Full Rollout + Monetization', timeline: 'Week 9–12', status: 'Planned' },
          ].map(m => (
            <div key={m.phase} className="p-3 rounded-lg bg-gradient-card border border-border">
              <p className="font-display font-semibold text-foreground text-sm">{m.phase}</p>
              <p className="text-xs text-muted-foreground">{m.timeline} · {m.status}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="p-5 rounded-lg bg-gradient-card border border-border">
      <h2 className="font-display text-lg font-bold text-foreground mb-3">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}
