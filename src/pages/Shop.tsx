import { useState, useEffect } from 'react';
import { UPGRADES, getPlayerProfile, savePlayerProfile } from '@/data/gameData';
import { Upgrade } from '@/data/types';
import { UpgradeCard } from '@/components/UpgradeCard';
import { trackEvent } from '@/lib/eventTracker';

export default function Shop() {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);

  useEffect(() => {
    trackEvent('view_shop');
    const profile = getPlayerProfile();
    setUpgrades(UPGRADES.map(u => ({
      ...u,
      purchased: profile.purchasedUpgrades.includes(u.id),
    })));
  }, []);

  const handlePurchase = (id: string) => {
    const profile = getPlayerProfile();
    profile.purchasedUpgrades.push(id);
    savePlayerProfile(profile);
    trackEvent('purchase_upgrade', { upgrade_type: id });
    setUpgrades(prev => prev.map(u => u.id === id ? { ...u, purchased: true } : u));
  };

  const categories = ['convenience', 'insight', 'coordination', 'access'] as const;
  const categoryLabels: Record<string, string> = {
    convenience: 'Convenience',
    insight: 'Coaching & Analytics',
    coordination: 'Squad Coordination',
    access: 'Advanced Access',
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Training Tools</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Upgrade Your Training</h1>
        <p className="text-sm text-muted-foreground mt-1">Better insights. Better coordination. No competitive advantage.</p>
      </div>

      {/* Fair Play */}
      <div className="p-4 rounded-lg bg-success/5 border border-success/20">
        <p className="text-sm text-foreground">
          <strong className="text-success">Fair play guarantee:</strong> All tools provide convenience, coaching, or coordination improvements. No tool grants a competitive power advantage. Progress is always earned through performance.
        </p>
      </div>

      {/* Free Tier */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <h3 className="font-display font-semibold text-foreground mb-2">Free Tier (Always Included)</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 3 daily training sessions</li>
          <li>• All standard-difficulty drills</li>
          <li>• Basic performance rating & badges</li>
          <li>• Squad sizes up to 4</li>
        </ul>
      </div>

      {/* Upgrades by Category */}
      {categories.map(cat => (
        <div key={cat}>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">{categoryLabels[cat]}</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {upgrades.filter(u => u.category === cat).map(u => (
              <UpgradeCard key={u.id} upgrade={u} onPurchase={handlePurchase} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
