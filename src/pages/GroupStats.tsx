import { useState } from 'react';
import { getPlayerProfile } from '@/data/gameData';
import { getEventCounts } from '@/lib/eventTracker';

interface SquadMember {
  name: string;
  role: string;
  drillsCompleted: number;
  confidence: number;
  mastery: number;
  consistency: number;
}

const MOCK_SQUAD: SquadMember[] = [
  { name: 'You', role: 'Flex', drillsCompleted: 0, confidence: 0, mastery: 0, consistency: 0 },
  { name: 'Kira', role: 'Support', drillsCompleted: 14, confidence: 68, mastery: 55, consistency: 72 },
  { name: 'Marcus', role: 'Assault', drillsCompleted: 21, confidence: 74, mastery: 62, consistency: 65 },
  { name: 'Nova', role: 'Recon', drillsCompleted: 9, confidence: 52, mastery: 48, consistency: 80 },
  { name: 'Jin', role: 'Defense', drillsCompleted: 17, confidence: 61, mastery: 58, consistency: 77 },
];

export default function GroupStats() {
  const profile = getPlayerProfile();
  const counts = getEventCounts();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const squad = MOCK_SQUAD.map(m =>
    m.name === 'You'
      ? { ...m, drillsCompleted: profile.completedScenarios, confidence: profile.confidence, mastery: profile.mastery, consistency: Math.round((profile.confidence + profile.mastery) / 2) }
      : m
  );

  const avgConfidence = Math.round(squad.reduce((s, m) => s + m.confidence, 0) / squad.length);
  const avgMastery = Math.round(squad.reduce((s, m) => s + m.mastery, 0) / squad.length);
  const avgConsistency = Math.round(squad.reduce((s, m) => s + m.consistency, 0) / squad.length);
  const totalDrills = squad.reduce((s, m) => s + m.drillsCompleted, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Group Stats</h1>
        <p className="text-sm text-muted-foreground mt-1">Track how your squad performs and improves together.</p>
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
          <p className="text-xs text-muted-foreground">Avg Confidence</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
          <p className="font-display text-2xl font-bold text-primary">{avgConsistency}%</p>
          <p className="text-xs text-muted-foreground">Avg Consistency</p>
        </div>
      </div>

      {/* Member Table */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Squad Members</h2>
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
        <h3 className="font-display font-semibold text-foreground mb-2">Squad Coordination Score</h3>
        <p className="text-sm text-muted-foreground mb-3">Based on combined training data across all members.</p>
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

      {/* Improvement Areas */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Focus Areas</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { area: 'Role Coverage', desc: 'Ensure all critical roles are filled and practiced regularly. Gaps in role coverage lead to predictable weaknesses.' },
            { area: 'Session Frequency', desc: 'Squads that train at least 3 times per week show the fastest coordination improvement.' },
            { area: 'Difficulty Progression', desc: 'Gradually increase drill difficulty as the squad improves. Staying on easy mode limits growth.' },
            { area: 'Cross-Role Familiarity', desc: 'Have members practice outside their main role occasionally. Understanding other positions improves communication.' },
          ].map(f => (
            <div key={f.area} className="p-4 rounded-lg bg-card border border-border">
              <h3 className="font-display font-semibold text-foreground text-sm mb-1">{f.area}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
