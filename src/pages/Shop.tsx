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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Training Shop</h1>
        <p className="text-sm text-muted-foreground mt-1">Upgrade your training experience. No pay-to-win — just smarter training.</p>
      </div>

      {/* Not P2W Banner */}
      <div className="p-4 rounded-lg bg-success/5 border border-success/20">
        <p className="text-sm text-foreground">
          <strong className="text-success">Fair play guarantee:</strong> All upgrades provide convenience, insight, or coordination improvements. No upgrade grants a competitive power advantage. Progress is always earned through performance.
        </p>
      </div>

      {/* Free Tier */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <h3 className="font-display font-semibold text-foreground mb-2">Free Tier (Included)</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 3 daily training sessions</li>
          <li>• All standard-difficulty scenarios</li>
          <li>• Basic performance rating & badges</li>
          <li>• Squad sizes up to 4</li>
        </ul>
      </div>

      {/* Upgrades by Category */}
      {categories.map(cat => (
        <div key={cat}>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3 capitalize">{cat}</h2>
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
