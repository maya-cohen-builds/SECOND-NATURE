import { useState, useEffect } from 'react';
import { getPlayerProfile } from '@/data/gameData';
import { getEventCounts } from '@/lib/eventTracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';

interface SquadMember {
  name: string;
  role: string;
  drillsCompleted: number;
  confidence: number;
  mastery: number;
  consistency: number;
}

const STORAGE_KEY = 'sn-squad-members';

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

const ROLES = ['Flex', 'Support', 'Assault', 'Recon', 'Defense', 'Tank', 'Healer'];

export default function GroupStats() {
  const profile = getPlayerProfile();
  const counts = getEventCounts();
  const [addedMembers, setAddedMembers] = useState<SquadMember[]>(loadSquadMembers);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Flex');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  useEffect(() => {
    saveSquadMembers(addedMembers);
  }, [addedMembers]);

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

  const avgConfidence = Math.round(squad.reduce((s, m) => s + m.confidence, 0) / squad.length);
  const avgMastery = Math.round(squad.reduce((s, m) => s + m.mastery, 0) / squad.length);
  const avgConsistency = Math.round(squad.reduce((s, m) => s + m.consistency, 0) / squad.length);
  const totalDrills = squad.reduce((s, m) => s + m.drillsCompleted, 0);

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

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Squad Analytics</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Group Stats</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isSolo ? 'Train solo now. Sync your squad later.' : 'See how your squad stacks up. Every drill builds your team profile.'}
        </p>
      </div>

      {/* Squad Overview */}
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

      {/* Member Table */}
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

      {/* Coordination Score */}
      <div className="p-5 rounded-lg bg-primary/5 border border-primary/20">
        <h3 className="font-display font-semibold text-foreground mb-2">
          {isSolo ? 'Your Performance Score' : 'Squad Coordination Score'}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {isSolo
            ? 'Your coordination score will evolve as you add squad members and train together.'
            : 'Based on combined training data across all members.'}
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
