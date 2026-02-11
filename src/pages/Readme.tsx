export default function Readme() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">README</h1>
        <p className="text-sm text-muted-foreground mt-1">Quick start guide for this portfolio demo.</p>
      </div>

      <Section title="How to Run This Demo">
        <ul className="space-y-1">
          <li>• This app runs entirely in the browser — no backend or setup required</li>
          <li>• All data is stored in localStorage and resets with the "Reset Data" button</li>
          <li>• Enable "Demo Mode" (top-right) for a guided walkthrough experience</li>
          <li>• Navigate using the left sidebar or top nav on mobile</li>
        </ul>
      </Section>

      <Section title="60-Second Demo Script">
        <ol className="space-y-2 list-decimal list-inside">
          <li><strong>Overview</strong> — Scan the hero section. Toggle Demo Mode ON. Read the "What / Who / Why" cards.</li>
          <li><strong>Training Hub</strong> — Select "Coordinated Attack" category → "Pincer Strike" scenario → Click "Configure & Run"</li>
          <li><strong>Run</strong> — Set squad size to 4, difficulty to Standard → Click "Run Simulation"</li>
          <li><strong>Results</strong> — Review rating, badges, and progression gains. Read the "Live Game Impact" card.</li>
          <li><strong>Shop</strong> — Scan the fair-play guarantee. Browse upgrades by category. Purchase one to see the flow.</li>
          <li><strong>Experiments</strong> — Review the A/B testing table. Note hypothesis, metric, and guardrail for each test.</li>
          <li><strong>Narrative</strong> — Read the executive-ready one-pager covering problem → positioning → GTM → pricing.</li>
          <li><strong>Analytics</strong> — View event counts and funnel conversion from your demo session.</li>
        </ol>
      </Section>

      <Section title="What This Demonstrates">
        <p>This demo showcases PMM portfolio capabilities across several dimensions:</p>
        <ul className="mt-2 space-y-1">
          <li>• <strong>Feature Strategy:</strong> A well-defined feature loop with clear problem-solution framing</li>
          <li>• <strong>Monetization Design:</strong> Freemium model with explicit "not pay-to-win" guardrails</li>
          <li>• <strong>Experiment Planning:</strong> Structured A/B tests with hypotheses, metrics, guardrails, and durations</li>
          <li>• <strong>GTM Readiness:</strong> Phased launch plan with milestones and competitive event anchoring</li>
          <li>• <strong>Executive Communication:</strong> Clean narrative that communicates value to leadership</li>
          <li>• <strong>Instrumentation Awareness:</strong> Event tracking and funnel analysis built into the demo</li>
          <li>• <strong>UX Sensibility:</strong> Portfolio-grade UI with clear hierarchy and believable product copy</li>
        </ul>
      </Section>

      <Section title="Portfolio Blurb">
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed italic">
            Designed and prototyped Squad Training Grounds — a cooperative progression feature for a mature mobile strategy 
            game experiencing mid-tier player churn. Defined the feature loop, freemium monetization model, and A/B 
            experimentation plan. Built a clickable demo with dynamic simulation, performance ratings, and local analytics 
            to communicate the product vision to leadership. The feature targets 15–20% Day 30–60 retention improvement 
            and 12–18% free-to-paid conversion through convenience and insight upgrades rather than power advantages.
          </p>
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
