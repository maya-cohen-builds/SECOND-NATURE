import { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

interface TrainingModule {
  id: string;
  name: string;
  game: string;
  category: string;
  description: string;
  drillCount: number;
  difficulty: string;
  createdBy: string;
  isCustom: boolean;
}

const PRESET_MODULES: TrainingModule[] = [
  { id: 'lol-lane', name: 'Lane Control Fundamentals', game: 'League of Legends', category: 'MOBA', description: 'Wave management, trading patterns, and back timing for bot lane duos.', drillCount: 6, difficulty: 'Beginner', createdBy: 'SN Team', isCustom: false },
  { id: 'lol-obj', name: 'Objective Sequencing', game: 'League of Legends', category: 'MOBA', description: 'Dragon and Baron setup, vision control, and team rotation drills.', drillCount: 4, difficulty: 'Intermediate', createdBy: 'SN Team', isCustom: false },
  { id: 'val-site', name: 'Site Execute Package', game: 'Valorant', category: 'Tactical Shooter', description: 'Coordinated site takes with utility timing, entry sequencing, and trade setups.', drillCount: 5, difficulty: 'Intermediate', createdBy: 'SN Team', isCustom: false },
  { id: 'val-retake', name: 'Retake Coordination', game: 'Valorant', category: 'Tactical Shooter', description: 'Post-plant retake positioning, utility usage, and crossfire angles.', drillCount: 4, difficulty: 'Advanced', createdBy: 'SN Team', isCustom: false },
  { id: 'wow-raid', name: 'Raid Phase Transitions', game: 'World of Warcraft', category: 'MMO Raid', description: 'Role-specific responsibilities during boss phase transitions and add management.', drillCount: 5, difficulty: 'Intermediate', createdBy: 'SN Team', isCustom: false },
  { id: 'wow-cd', name: 'Cooldown Rotation Planning', game: 'World of Warcraft', category: 'MMO Raid', description: 'Healer and tank cooldown sequencing for sustained damage phases.', drillCount: 3, difficulty: 'Advanced', createdBy: 'SN Team', isCustom: false },
  { id: 'sc2-macro', name: 'Team Macro Fundamentals', game: 'StarCraft II', category: 'RTS', description: 'Resource management, expansion timing, and production cycles for team games.', drillCount: 4, difficulty: 'Beginner', createdBy: 'SN Team', isCustom: false },
  { id: 'cs2-util', name: 'Utility Coordination', game: 'Counter-Strike 2', category: 'Tactical Shooter', description: 'Synchronized smoke, flash, and molotov lineups for coordinated executes.', drillCount: 6, difficulty: 'Intermediate', createdBy: 'SN Team', isCustom: false },
];

export default function TrainingModules() {
  const [modules, setModules] = useState<TrainingModule[]>(() => {
    const stored = localStorage.getItem('stg-custom-modules');
    const custom: TrainingModule[] = stored ? JSON.parse(stored) : [];
    return [...PRESET_MODULES, ...custom];
  });

  const [filterGame, setFilterGame] = useState<string>('All');
  const [filterTier, setFilterTier] = useState<string>('All');
  const [gameOpen, setGameOpen] = useState<boolean>(() => {
    const stored = sessionStorage.getItem('sn-filter-game-open');
    return stored !== null ? stored === 'true' : true;
  });
  const [tierOpen, setTierOpen] = useState<boolean>(() => {
    const stored = sessionStorage.getItem('sn-filter-tier-open');
    return stored !== null ? stored === 'true' : true;
  });
  const [showCreate, setShowCreate] = useState(false);
  const [newModule, setNewModule] = useState({ name: '', game: '', category: '', description: '', difficulty: 'Beginner' });

  const toggleGame = useCallback(() => {
    setGameOpen(prev => {
      sessionStorage.setItem('sn-filter-game-open', String(!prev));
      return !prev;
    });
  }, []);

  const toggleTier = useCallback(() => {
    setTierOpen(prev => {
      sessionStorage.setItem('sn-filter-tier-open', String(!prev));
      return !prev;
    });
  }, []);

  const games = ['All', ...Array.from(new Set(modules.map(m => m.game)))];
  const tiers = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = modules.filter(m => {
    const matchGame = filterGame === 'All' || m.game === filterGame;
    const matchTier = filterTier === 'All' || m.difficulty === filterTier;
    return matchGame && matchTier;
  });

  const handleCreate = () => {
    if (!newModule.name || !newModule.game || !newModule.description) return;

    const custom: TrainingModule = {
      id: `custom-${Date.now()}`,
      name: newModule.name,
      game: newModule.game,
      category: newModule.category || 'Custom',
      description: newModule.description,
      drillCount: 0,
      difficulty: newModule.difficulty,
      createdBy: 'You',
      isCustom: true,
    };

    const updated = [...modules, custom];
    setModules(updated);

    const customOnly = updated.filter(m => m.isCustom);
    localStorage.setItem('stg-custom-modules', JSON.stringify(customOnly));

    setNewModule({ name: '', game: '', category: '', description: '', difficulty: 'Beginner' });
    setShowCreate(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Module Library</p>
          <h1 className="font-display text-2xl font-bold text-foreground">Training Modules</h1>
          <p className="text-sm text-muted-foreground mt-1">Game-specific drills built by the community. Or build your own.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
        >
          {showCreate ? 'Cancel' : 'Create Module'}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="p-5 rounded-lg bg-card border border-border space-y-3">
          <h3 className="font-display font-semibold text-foreground">New Training Module</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              placeholder="Module name"
              value={newModule.name}
              onChange={e => setNewModule({ ...newModule, name: e.target.value })}
              className="px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              placeholder="Game (e.g. Valorant, League of Legends)"
              value={newModule.game}
              onChange={e => setNewModule({ ...newModule, game: e.target.value })}
              className="px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              placeholder="Category (e.g. Tactical Shooter, MOBA)"
              value={newModule.category}
              onChange={e => setNewModule({ ...newModule, category: e.target.value })}
              className="px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <select
              value={newModule.difficulty}
              onChange={e => setNewModule({ ...newModule, difficulty: e.target.value })}
              className="px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <textarea
            placeholder="Describe what this module covers..."
            value={newModule.description}
            onChange={e => setNewModule({ ...newModule, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
          >
            Save Module
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-2">
        {/* Game filter */}
        <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
          <button
            onClick={toggleGame}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleGame())}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={gameOpen}
            aria-controls="filter-game-panel"
          >
            <span className="uppercase tracking-widest">Game{filterGame !== 'All' ? ` · ${filterGame}` : ''}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${gameOpen ? 'rotate-0' : '-rotate-90'}`} />
          </button>
          <div
            id="filter-game-panel"
            className="grid transition-[grid-template-rows] duration-200 ease-out"
            style={{ gridTemplateRows: gameOpen ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="flex flex-wrap gap-2 px-3 pb-3">
                {games.map(g => (
                  <button
                    key={g}
                    onClick={() => setFilterGame(g)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                      filterGame === g
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skill Tier filter */}
        <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
          <button
            onClick={toggleTier}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleTier())}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={tierOpen}
            aria-controls="filter-tier-panel"
          >
            <span className="uppercase tracking-widest">Skill Tier{filterTier !== 'All' ? ` · ${filterTier}` : ''}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${tierOpen ? 'rotate-0' : '-rotate-90'}`} />
          </button>
          <div
            id="filter-tier-panel"
            className="grid transition-[grid-template-rows] duration-200 ease-out"
            style={{ gridTemplateRows: tierOpen ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="flex flex-wrap gap-2 px-3 pb-3">
                {tiers.map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterTier(t)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                      filterTier === t
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map(mod => (
          <div key={mod.id} className="p-4 rounded-lg bg-gradient-card border border-border">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-display font-semibold text-foreground text-sm">{mod.name}</h4>
                <p className="text-xs text-primary">{mod.game}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                mod.difficulty === 'Beginner' ? 'bg-success/10 text-success border-success/20' :
                mod.difficulty === 'Intermediate' ? 'bg-accent/10 text-accent border-accent/20' :
                'bg-destructive/10 text-destructive border-destructive/20'
              }`}>
                {mod.difficulty}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{mod.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{mod.drillCount > 0 ? `${mod.drillCount} drills` : 'No drills yet'}</span>
              <span>by {mod.createdBy}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No modules found for this filter.
        </div>
      )}
    </div>
  );
}
