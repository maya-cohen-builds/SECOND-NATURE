import { useState, useEffect } from 'react';
import { getPlayerProfile } from '@/data/gameData';
import { getEventCounts } from '@/lib/eventTracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Lock, Target, TrendingUp, Shield, Brain, Zap, BarChart3, Activity, Crosshair, Users } from 'lucide-react';
import ShareToInstagram from '@/components/ShareToInstagram';

interface SquadMember {
  name: string;
  role: string;
  drillsCompleted: number;
  confidence: number;
  mastery: number;
  consistency: number;
}

const STORAGE_KEY = 'sn-squad-members';
const TOKEN_KEY = 'sn-squad-tokens';

function loadSquadMembers(): SquadMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveSquadMembers(members: SquadMember[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

function loadTokens(): number {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return 0;
}

function saveTokens(tokens: number) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

const ROLES = ['Flex', 'Support', 'Assault', 'Recon', 'Defense', 'Tank', 'Healer'];

const INTELLIGENCE_LEVELS = [
  { level: 1, name: 'Overview', requirement: 'Always available', drillsNeeded: 0, desc: 'Basic squad stats and coordination score.' },
  { level: 2, name: 'Trends', requirement: '3 squad drills', drillsNeeded: 3, desc: 'Skill alignment, role coverage, and activity tracking.' },
  { level: 3, name: 'Coordination Diagnostics', requirement: '5 squad drills', drillsNeeded: 5, desc: 'Execution trends and coordination phase analysis.' },
  { level: 4, name: 'Readiness Modeling', requirement: '10 squad drills', drillsNeeded: 10, desc: 'Cross-role scores and competitive readiness rating.' },
  { level: 5, name: 'Advanced Analytics', requirement: '10 drills + tokens', drillsNeeded: 10, desc: 'Deep coordination breakdowns and squad benchmarking.' },
];

const TOKEN_INSIGHTS = [
  { id: 'breakdown', name: 'Coordination Breakdown Analysis', cost: 5, desc: 'Phase-by-phase coordination scoring across all drills.' },
  { id: 'path', name: 'Suggested Squad Training Path', cost: 8, desc: 'Optimized drill sequence based on squad weaknesses.' },
  { id: 'coaching', name: 'Member-Specific Coaching Flags', cost: 6, desc: 'Individual improvement targets for each squad member.' },
];

function LockedSection({ title, unlockText, icon: Icon }: { title: string; unlockText: string; icon: React.ElementType }) {
  return (
    <div className="p-5 rounded-lg bg-card border border-border opacity-60">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-muted-foreground/50" />
        <h3 className="font-display text-sm font-semibold text-muted-foreground">{title}</h3>
        <Lock className="h-3 w-3 text-muted-foreground/40 ml-auto" />
      </div>
      <p className="text-xs text-muted-foreground/60">{unlockText}</p>
    </div>
  );
}

export default function GroupStats() {
  const profile = getPlayerProfile();
  const counts = getEventCounts();
  const [addedMembers, setAddedMembers] = useState<SquadMember[]>(loadSquadMembers);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Flex');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [tokens, setTokens] = useState(loadTokens);
  const [unlockedInsights, setUnlockedInsights] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('sn-unlocked-insights');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  useEffect(() => { saveSquadMembers(addedMembers); }, [addedMembers]);
  useEffect(() => { saveTokens(tokens); }, [tokens]);
  useEffect(() => { localStorage.setItem('sn-unlocked-insights', JSON.stringify(unlockedInsights)); }, [unlockedInsights]);

  const you: SquadMember = {
    name: 'You',
    role: 'Flex',
    drillsCompleted: profile.completedScenarios,
    confidence: profile.confidence,
    mastery: profile.mastery,
    consistency: Math.round((profile.confidence + profile.mastery) / 2),
  };

  const squad = [you, ...addedMembers];
  const isSolo = squad.length === 1;
  const totalDrills = squad.reduce((s, m) => s + m.drillsCompleted, 0);

  const avgConfidence = Math.round(squad.reduce((s, m) => s + m.confidence, 0) / squad.length);
  const avgMastery = Math.round(squad.reduce((s, m) => s + m.mastery, 0) / squad.length);
  const avgConsistency = Math.round(squad.reduce((s, m) => s + m.consistency, 0) / squad.length);

  const currentLevel = totalDrills >= 10 ? (tokens > 0 || unlockedInsights.length > 0 ? 5 : 4) : totalDrills >= 5 ? 3 : totalDrills >= 3 ? 2 : 1;

  const handleAddMember = () => {
    if (!newName.trim()) return;
    setAddedMembers(prev => [
      ...prev,
      { name: newName.trim(), role: newRole, drillsCompleted: 0, confidence: 0, mastery: 0, consistency: 0 },
    ]);
    setNewName('');
    setNewRole('Flex');
    setModalOpen(false);
  };

  const handleUnlockInsight = (id: string, cost: number) => {
    if (tokens < cost || unlockedInsights.includes(id)) return;
    setTokens(prev => prev - cost);
    setUnlockedInsights(prev => [...prev, id]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Squad Coordination</p>
          <h1 className="font-display text-2xl font-bold text-foreground">Execution Alignment</h1>
          <p className="text-sm text-muted-foreground mt-1">Squad-level coordination patterns, consistency, and execution spread.</p>
        </div>
        <ShareToInstagram
          storyData={{
            username: 'Squad',
            game: 'Cross-Game',
            headline: 'Squad Coordination Score',
            headlineValue: `${Math.round((avgConfidence + avgMastery + avgConsistency) / 3)}%`,
            metrics: [
              { label: 'Members', value: `${squad.length}` },
              { label: 'Confidence', value: `${avgConfidence}%` },
              { label: 'Consistency', value: `${avgConsistency}%` },
            ],
            tier: currentLevel >= 4 ? 'Competitive Ready' : currentLevel >= 3 ? 'Diagnostics Active' : currentLevel >= 2 ? 'Trends Active' : 'Building Baseline',
          }}
        />
      </div>

      {/* Intelligence Level Progression */}
      <div className="p-5 rounded-lg bg-gradient-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-sm font-semibold text-foreground">Squad Intelligence Level</h2>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-display font-semibold text-primary">{tokens} tokens</span>
          </div>
        </div>
        <div className="space-y-2">
          {INTELLIGENCE_LEVELS.map(lvl => {
            const unlocked = currentLevel >= lvl.level;
            return (
              <div key={lvl.level} className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-display font-bold shrink-0 ${
                  unlocked ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {lvl.level}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>{lvl.name}</p>
                  <p className="text-[10px] text-muted-foreground/60">{lvl.desc}</p>
                </div>
                <span className={`text-[10px] shrink-0 ${unlocked ? 'text-primary font-semibold' : 'text-muted-foreground/50'}`}>
                  {unlocked ? 'Unlocked' : lvl.requirement}
                </span>
                {!unlocked && <Lock className="h-3 w-3 text-muted-foreground/40 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Squad Overview (Always Visible) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
          <p className="font-display text-2xl font-bold text-primary">{squad.length}</p>
          <p className="text-xs text-muted-foreground">Squad Members</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
          <p className="font-display text-2xl font-bold text-primary">{totalDrills}</p>
          <p className="text-xs text-muted-foreground">Total Drills</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
          <p className="font-display text-2xl font-bold text-primary">{avgConfidence}%</p>
          <p className="text-xs text-muted-foreground">{isSolo ? 'Confidence' : 'Avg Confidence'}</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
          <p className="font-display text-2xl font-bold text-primary">{avgConsistency}%</p>
          <p className="text-xs text-muted-foreground">{isSolo ? 'Consistency' : 'Avg Consistency'}</p>
        </div>
      </div>

      {/* Member Table (Always Visible) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold text-foreground">Squad Members</h2>
          <Button size="sm" onClick={() => setModalOpen(true)} className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            Add Squad Member
          </Button>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-muted-foreground text-xs">
                <th className="text-left px-4 py-3 font-medium">Player</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-center px-4 py-3 font-medium">Drills</th>
                <th className="text-center px-4 py-3 font-medium">Confidence</th>
                <th className="text-center px-4 py-3 font-medium">Mastery</th>
                <th className="text-center px-4 py-3 font-medium">Consistency</th>
              </tr>
            </thead>
            <tbody>
              {squad.map(m => (
                <tr
                  key={m.name}
                  onClick={() => setSelectedMember(selectedMember === m.name ? null : m.name)}
                  className={`border-t border-border cursor-pointer transition-colors ${
                    selectedMember === m.name ? 'bg-primary/5' : 'hover:bg-secondary/50'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">{m.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.role}</td>
                  <td className="px-4 py-3 text-center text-foreground">{m.drillsCompleted}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={m.confidence >= 60 ? 'text-success' : 'text-muted-foreground'}>{m.confidence}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={m.mastery >= 50 ? 'text-primary' : 'text-muted-foreground'}>{m.mastery}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={m.consistency >= 70 ? 'text-success' : 'text-muted-foreground'}>{m.consistency}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coordination Score (Always Visible) */}
      <div className="p-5 rounded-lg bg-primary/5 border border-primary/20">
        <h3 className="font-display font-semibold text-foreground mb-2">
          {isSolo ? 'Your Coordination Score' : 'Squad Coordination Score'}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {isSolo
            ? 'Coordination metrics evolve as you add squad members and reinforce patterns together.'
            : 'Based on combined execution data across all members.'}
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-display text-xl font-bold text-primary">{avgMastery}%</p>
            <p className="text-xs text-muted-foreground">Skill Alignment</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-primary">{avgConsistency}%</p>
            <p className="text-xs text-muted-foreground">Execution Consistency</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-primary">{Math.round((avgConfidence + avgMastery + avgConsistency) / 3)}%</p>
            <p className="text-xs text-muted-foreground">Overall Readiness</p>
          </div>
        </div>
      </div>

      {/* Level 2: Trends (3 drills) */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Trends & Coverage</h2>
        {totalDrills >= 3 ? (
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold text-foreground">Skill Alignment</h3>
              </div>
              <p className="font-display text-2xl font-bold text-primary">{avgMastery}%</p>
              <p className="text-xs text-muted-foreground mt-1">How closely squad skills overlap across drills.</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold text-foreground">Role Coverage</h3>
              </div>
              <p className="font-display text-2xl font-bold text-primary">{new Set(squad.map(m => m.role)).size}/{ROLES.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Unique roles represented in your squad.</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold text-foreground">Active This Week</h3>
              </div>
              <p className="font-display text-2xl font-bold text-primary">{squad.filter(m => m.drillsCompleted > 0).length}</p>
              <p className="text-xs text-muted-foreground mt-1">Members who have completed at least one drill.</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-3">
            <LockedSection title="Skill Alignment Score" unlockText="Unlocks after 3 squad drills." icon={Target} />
            <LockedSection title="Role Coverage" unlockText="Unlocks after 3 squad drills." icon={Shield} />
            <LockedSection title="Members Active This Week" unlockText="Unlocks after 3 squad drills." icon={Users} />
          </div>
        )}
      </div>

      {/* Level 3: Coordination Diagnostics (5 drills) */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Coordination Diagnostics</h2>
        {totalDrills >= 5 ? (
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold text-foreground">Execution Consistency Trend</h3>
              </div>
              <div className="flex items-end gap-1 h-12 mt-2">
                {Array.from({ length: Math.min(totalDrills, 10) }, (_, i) => {
                  const height = 20 + Math.round(Math.random() * 60 + i * 3);
                  return <div key={i} className="flex-1 bg-primary/30 rounded-t" style={{ height: `${Math.min(height, 100)}%` }} />;
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Consistency trending across recent drills.</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Crosshair className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold text-foreground">Weakest Coordination Phase</h3>
              </div>
              <p className="font-display text-lg font-bold text-foreground mt-2">
                {avgConsistency > avgConfidence ? 'Early Phase' : avgMastery < avgConfidence ? 'Mid Phase' : 'Late Phase'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {avgConsistency > avgConfidence
                  ? 'Coordination breaks down in the opening phase. Focus on initial positioning drills.'
                  : avgMastery < avgConfidence
                  ? 'Mid-drill execution dips. Work on sustained focus under pressure.'
                  : 'Late-phase decisions are weakest. Practice closing sequences.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            <LockedSection title="Execution Consistency Trend" unlockText="Unlocks after 5 squad drills." icon={Activity} />
            <LockedSection title="Weakest Coordination Phase" unlockText="Unlocks after 5 squad drills." icon={Crosshair} />
          </div>
        )}
      </div>

      {/* Level 4: Readiness Modeling (10 drills) */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Readiness Modeling</h2>
        {totalDrills >= 10 ? (
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold text-foreground">Cross-Role Familiarity</h3>
              </div>
              <p className="font-display text-2xl font-bold text-primary">
                {Math.round((new Set(squad.map(m => m.role)).size / ROLES.length) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Percentage of roles practiced across the squad.</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold text-foreground">Squad Readiness Rating</h3>
              </div>
              <p className="font-display text-2xl font-bold text-primary">
                {Math.round((avgConfidence + avgMastery + avgConsistency) / 3) >= 60 ? 'Ready' : 'Developing'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((avgConfidence + avgMastery + avgConsistency) / 3) >= 60
                  ? 'Your squad meets the baseline for competitive play.'
                  : 'Continue training to reach competitive readiness.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            <LockedSection title="Cross-Role Familiarity Score" unlockText="Unlocks after 10 squad drills." icon={TrendingUp} />
            <LockedSection title="Squad Readiness Rating" unlockText="Unlocks after 10 squad drills." icon={BarChart3} />
          </div>
        )}
      </div>

      {/* Level 5: Token-Gated Advanced Insights */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-1">Advanced Insights</h2>
        <p className="text-xs text-muted-foreground mb-3">Spend tokens to unlock deep analysis. Tokens are earned through drills and consistent training.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {TOKEN_INSIGHTS.map(insight => {
            const isUnlocked = unlockedInsights.includes(insight.id);
            const canAfford = tokens >= insight.cost;
            const meetsLevel = totalDrills >= 10;
            return (
              <div key={insight.id} className={`p-4 rounded-lg border ${isUnlocked ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-muted-foreground/50" />
                  {!isUnlocked && <Lock className="h-3 w-3 text-muted-foreground/40 ml-auto" />}
                  {isUnlocked && <span className="text-[10px] text-primary font-semibold ml-auto">Unlocked</span>}
                </div>
                <p className="font-display text-sm font-semibold text-foreground">{insight.name}</p>
                <p className="text-xs text-muted-foreground mt-1 mb-3">{insight.desc}</p>
                {!isUnlocked && (
                  <Button
                    size="sm"
                    variant={meetsLevel && canAfford ? 'default' : 'secondary'}
                    disabled={!meetsLevel || !canAfford}
                    onClick={() => handleUnlockInsight(insight.id, insight.cost)}
                    className="w-full text-xs gap-1"
                  >
                    <Zap className="h-3 w-3" />
                    {!meetsLevel ? 'Requires 10 drills' : `Unlock (${insight.cost} tokens)`}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Token Economy Callout */}
      <div className="p-5 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-semibold text-foreground mb-1">Squad Tokens</h3>
            <p className="text-sm text-muted-foreground mb-3">Earned through training, spent on deep insights. Tokens never gate core stats.</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground mb-1">Earn by</p>
                <p>Completing drills</p>
                <p>Full-squad sessions</p>
                <p>Training streaks</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Spend on</p>
                <p>Coordination breakdowns</p>
                <p>Training path suggestions</p>
                <p>Coaching flags</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Areas */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Focus Areas</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {(isSolo
            ? [
                { area: 'Build Your Squad', desc: 'Add teammates to unlock coordination metrics and shared progress tracking.' },
                { area: 'Session Frequency', desc: 'Consistent solo training builds the foundation for squad readiness.' },
                { area: 'Difficulty Progression', desc: 'Gradually increase drill difficulty as you improve. Staying on easy mode limits growth.' },
                { area: 'Role Familiarity', desc: 'Practice multiple roles to broaden your flexibility and squad value.' },
              ]
            : [
                { area: 'Role Coverage', desc: 'Ensure all critical roles are filled and practiced regularly. Gaps in role coverage lead to predictable weaknesses.' },
                { area: 'Session Frequency', desc: 'Squads that train at least 3 times per week show the fastest coordination improvement.' },
                { area: 'Difficulty Progression', desc: 'Gradually increase drill difficulty as the squad improves. Staying on easy mode limits growth.' },
                { area: 'Cross-Role Familiarity', desc: 'Have members practice outside their main role occasionally. Understanding other positions improves communication.' },
              ]
          ).map(f => (
            <div key={f.area} className="p-4 rounded-lg bg-card border border-border">
              <h3 className="font-display font-semibold text-foreground text-sm mb-1">{f.area}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Squad Member</DialogTitle>
            <DialogDescription>Add a teammate to track coordination and shared progress.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="member-name">Name</Label>
              <Input id="member-name" placeholder="Teammate name" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Invite via link</Label>
              <Input disabled placeholder="Coming soon" className="opacity-50" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember} disabled={!newName.trim()}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
