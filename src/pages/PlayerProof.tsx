export default function PlayerProof() {
  const testimonials = [
    {
      handle: 'Kira "Rotator" Chen',
      primary: 'Valorant',
      secondary: 'League of Legends',
      category: 'Tactical Shooters → MOBA',
      quote: 'I picked this up for Valorant site executes and started noticing cleaner rotation calls in League. The timing patterns just clicked across both games.',
      theme: 'transfer',
    },
    {
      handle: 'Dex',
      primary: 'World of Warcraft',
      secondary: 'Final Fantasy XIV',
      category: 'MMO Raids',
      quote: 'It feels like running scenarios, not grinding. Our raid group stopped fumbling phase transitions after two weeks of reps.',
      theme: 'fun',
    },
    {
      handle: 'nØVA',
      primary: 'Counter-Strike 2',
      secondary: 'Valorant',
      category: 'Tactical Shooters',
      quote: 'Our squad stopped panicking in late rounds because the patterns felt familiar. Retakes went from chaotic to automatic.',
      theme: 'confidence',
    },
    {
      handle: 'Sol',
      primary: 'Marvel Rivals',
      secondary: 'Dota 2',
      category: 'Hero Synergy → MOBA',
      quote: 'Ult coordination used to be a coin flip. Now we sequence without comms half the time. The reps compound faster than you expect.',
      theme: 'squad',
    },
    {
      handle: 'Ashcroft',
      primary: 'StarCraft II',
      secondary: 'Age of Empires IV',
      category: 'RTS / Strategy',
      quote: 'Resource discipline drills hit different when they feel like mini-games. I stopped floating minerals in ranked within a week.',
      theme: 'fun',
    },
  ];

  const themeTag: Record<string, string> = {
    transfer: 'Cross-Game Transfer',
    fun: 'Engagement',
    confidence: 'Pressure Stability',
    squad: 'Squad Execution',
  };

  return (
    <div className="space-y-16">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Player Proof</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
          What players say after the reps click
        </h1>
        <p className="text-muted-foreground text-base max-w-xl">
          Built to feel like playing. Proven to improve execution across games.
        </p>
      </div>

      {/* Testimonials */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div
            key={t.handle}
            className="p-5 rounded-xl bg-gradient-card border border-border flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-display font-bold uppercase tracking-wider text-primary bg-primary/10">
                  {t.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-secondary">
                  {themeTag[t.theme]}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">
                "{t.quote}"
              </p>
            </div>
            <div className="border-t border-border pt-3 mt-auto">
              <p className="font-display font-semibold text-foreground text-sm">{t.handle}</p>
              <p className="text-[11px] text-muted-foreground">
                {t.primary} · {t.secondary}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cross-Game Proof Callout */}
      <div className="p-6 rounded-xl bg-secondary border border-border">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Skills That Carry Over</p>
        <h2 className="font-display text-xl font-bold text-foreground mb-3">
          Coordination patterns repeat across genres
        </h2>
        <div className="space-y-3 max-w-2xl">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Timing, role adherence, and decision flow are not game-specific skills. They are coordination patterns that surface in every competitive format — from MOBA lane rotations to tactical site executes to raid phase transitions.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Players who run reps in one genre consistently report faster recognition when switching to another. The patterns are already familiar. The execution transfers.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Second Nature accelerates this recognition through play — not study — so the crossover happens naturally, not as a separate learning curve.
          </p>
        </div>
      </div>

      {/* Builder trust */}
      <p className="text-xs text-muted-foreground text-center pb-2">
        All testimonials reflect the intended player experience. Real player data will replace these as adoption grows.
      </p>
    </div>
  );
}