import { useState } from 'react';

const plans = [
  {
    name: 'Free Trial',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Try the platform with no commitment.',
    features: [
      '3 training sessions per day',
      'All standard drills',
      'Basic performance stats',
      'Solo or duo queue',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Individual',
    monthlyPrice: 9.99,
    annualPrice: 7.99,
    description: 'Full access for solo players looking to level up.',
    features: [
      'Unlimited training sessions',
      'All drill difficulties',
      'Full performance analytics',
      'Custom training modules',
      'Badge progress tracking',
      'Mission replay',
      'Priority support',
    ],
    cta: 'Start Individual Plan',
    highlight: true,
  },
  {
    name: 'Group',
    monthlyPrice: 24.99,
    annualPrice: 19.99,
    description: 'For squads that train together. Up to 6 members.',
    features: [
      'Everything in Individual',
      'Squad size up to 6',
      'Group stats dashboard',
      'Shared training history',
      'Squad coordination scoring',
      'Custom group modules',
      'Role assignment tools',
      'Team management controls',
    ],
    cta: 'Start Group Plan',
    highlight: false,
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Plans</p>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Start Free. Level Up When Ready.</h1>
        <p className="text-sm text-muted-foreground">No credit card required. Cancel anytime. You pay for insight, convenience, and coordination, not competitive advantage.</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-primary' : 'bg-secondary border border-border'}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${annual ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
        <span className={`text-sm font-medium ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>
          Annual <span className="text-xs text-primary font-semibold ml-1">Save 20%</span>
        </span>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(plan => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.name}
              className={`p-6 rounded-lg border flex flex-col ${
                plan.highlight
                  ? 'bg-primary/5 border-primary/40 shadow-glow'
                  : 'bg-gradient-card border-border'
              }`}
            >
              {plan.highlight && (
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-3">Most Popular</span>
              )}
              <h3 className="font-display text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">{plan.description}</p>

              <div className="mb-4">
                {price === 0 ? (
                  <span className="font-display text-3xl font-bold text-foreground">Free</span>
                ) : (
                  <>
                    <span className="font-display text-3xl font-bold text-foreground">${price.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground ml-1">/ mo {annual ? '(billed annually)' : ''}</span>
                  </>
                )}
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 shrink-0">+</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2.5 rounded-lg font-display font-semibold text-sm transition-all ${
                  plan.highlight
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-secondary border border-border text-foreground hover:bg-muted'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="space-y-3 max-w-2xl mx-auto">
        <h2 className="font-display text-lg font-bold text-foreground text-center">Common Questions</h2>
        {[
          { q: 'Can I switch plans later?', a: 'Yes. Upgrade, downgrade, or cancel anytime. Changes take effect at the start of your next billing cycle.' },
          { q: 'Does the free trial require a credit card?', a: 'No. Sign up and start training immediately. No payment info needed.' },
          { q: 'What happens to my data if I cancel?', a: 'Your training history and stats are saved for 90 days after cancellation. You can export your data at any time.' },
          { q: 'How does the Group plan work?', a: 'The Group plan covers up to 6 members. The plan owner manages the roster. All members get full Individual features plus shared group stats and coordination tools.' },
        ].map(faq => (
          <div key={faq.q} className="p-4 rounded-lg bg-card border border-border">
            <p className="text-sm font-medium text-foreground">{faq.q}</p>
            <p className="text-xs text-muted-foreground mt-1">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
