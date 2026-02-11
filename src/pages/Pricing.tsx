import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    cta: 'Start Free',
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
      'Badge progress & mission replay',
    ],
    cta: 'Upgrade Now',
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
      'Group stats & coordination scoring',
      'Shared training history',
      'Team management controls',
    ],
    cta: 'Start Group Plan',
    highlight: false,
  },
];

const testimonials = [
  {
    quote: 'Our squad stopped panicking in late rounds. Retakes went from chaotic to automatic.',
    name: 'nØVA',
    role: 'CS2 → Valorant',
  },
  {
    quote: 'Ult coordination used to be a coin flip. Now we sequence without comms half the time.',
    name: 'Sol',
    role: 'Marvel Rivals · Dota 2',
  },
  {
    quote: 'I picked this up for Valorant and started noticing cleaner rotation calls in League.',
    name: 'Kira "Rotator" Chen',
    role: 'Valorant · LoL',
  },
  {
    quote: 'Our raid group stopped fumbling phase transitions after two weeks of reps.',
    name: 'Dex',
    role: 'WoW · FFXIV',
  },
];

const faqs = [
  {
    q: "What's included in the free trial?",
    a: '3 daily sessions, all standard drills, and basic stats. No credit card required.',
  },
  {
    q: 'Who is this pricing best for?',
    a: 'Individual is for solo players who want full analytics and unlimited reps. Group is for squads (up to 6) who train together and want shared coordination data.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no commitments. Changes take effect at the start of your next billing cycle. Your data is saved for 90 days.',
  },
  {
    q: 'Are there sharing or usage limits?',
    a: 'Free trial has a 3-session daily cap. Paid plans have unlimited sessions, story sharing, and full analytics access.',
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-16 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="text-center pt-4">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
          Pricing
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
          Simple, transparent pricing
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          You pay for insight, convenience, and coordination — not competitive advantage. Start free. Level up when ready.
        </p>
      </div>

      {/* ── Billing Toggle ── */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            annual ? 'bg-primary' : 'bg-secondary border border-border'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${
              annual ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>
          Annual{' '}
          <span className="text-xs text-primary font-semibold ml-1">Save 20%</span>
        </span>
      </div>

      {/* ── Plan Cards ── */}
      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.name}
              className={`p-6 rounded-xl border flex flex-col relative ${
                plan.highlight
                  ? 'bg-primary/5 border-primary/40 shadow-glow'
                  : 'bg-gradient-card border-border'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-5">{plan.description}</p>

              <div className="mb-5">
                {price === 0 ? (
                  <span className="font-display text-4xl font-bold text-foreground">Free</span>
                ) : (
                  <>
                    <span className="font-display text-4xl font-bold text-foreground">
                      ${price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      / mo {annual ? '(billed annually)' : ''}
                    </span>
                  </>
                )}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-display font-semibold ${
                  plan.highlight
                    ? ''
                    : 'bg-secondary text-foreground hover:bg-muted border border-border'
                }`}
                variant={plan.highlight ? 'default' : 'secondary'}
              >
                {plan.cta}
              </Button>
            </div>
          );
        })}
      </div>

      {/* ── Testimonials ── */}
      <div className="space-y-5">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold text-center">
          Players training with Second Nature
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-5 rounded-xl bg-gradient-card border border-border"
            >
              <p className="text-sm text-foreground leading-relaxed mb-3">"{t.quote}"</p>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary font-display">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-display font-semibold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Social Proof Strip ── */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 border-t border-b border-border">
        <span className="text-xs text-muted-foreground">
          <span className="font-display font-bold text-foreground text-sm">10K+</span> stories shared
        </span>
        <span className="text-xs text-muted-foreground">
          <span className="font-display font-bold text-foreground text-sm">5</span> game genres covered
        </span>
        <span className="text-xs text-muted-foreground">
          Shared on <span className="font-semibold text-foreground">Instagram</span> · <span className="font-semibold text-foreground">TikTok</span> · <span className="font-semibold text-foreground">Discord</span>
        </span>
      </div>

      {/* ── FAQ ── */}
      <div className="space-y-3 max-w-2xl mx-auto">
        <h2 className="font-display text-lg font-bold text-foreground text-center mb-4">
          Frequently Asked Questions
        </h2>
        {faqs.map((faq, i) => (
          <button
            key={faq.q}
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="w-full text-left p-4 rounded-lg bg-card border border-border transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{faq.q}</p>
              {openFaq === i ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </div>
            {openFaq === i && (
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
            )}
          </button>
        ))}
      </div>

      {/* ── Final CTA ── */}
      <div className="text-center pb-8 space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground">
          Ready to build patterns that stick?
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Start with the free trial. No credit card needed.
        </p>
        <Button size="lg" className="font-display font-semibold px-8">
          Try it free
        </Button>
      </div>
    </div>
  );
}
