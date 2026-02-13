import SquadActivityFeed from '@/components/squad/SquadActivityFeed';
import SquadProofCards from '@/components/squad/SquadProofCards';
import SquadTimeline from '@/components/squad/SquadTimeline';
import CoordinationSignals from '@/components/squad/CoordinationSignals';
import LiveSessionSignals from '@/components/squad/LiveSessionSignals';
import { MOCK_MEMBERS } from '@/data/squadData';

export default function Squad() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Squad</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Coordination visibility and execution evidence for your squad
        </p>
        <div className="flex items-center gap-2 mt-3">
          {MOCK_MEMBERS.map(m => (
            <span
              key={m.id}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-secondary border border-border text-muted-foreground"
            >
              {m.name}
            </span>
          ))}
        </div>
      </div>

      {/* Section 1: Activity Feed */}
      <SquadActivityFeed />

      {/* Section 2: Proof Cards */}
      <SquadProofCards />

      {/* Section 3: Timeline */}
      <SquadTimeline />

      {/* Coordination Signals */}
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground mb-1">Coordination Signals</h2>
          <p className="text-xs text-muted-foreground mb-4">Preset signals — no free-form text, auto-archiving</p>
        </div>
        <CoordinationSignals context="Site Execute Rep · Valorant" />
        <LiveSessionSignals />
      </div>

      {/* Voice Room Placeholder */}
      <div className="rounded-lg border border-border bg-card/50 p-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-bold text-foreground">Session Voice</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Coordinate live during reps</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded bg-secondary border border-border text-muted-foreground font-medium">
          Coming soon
        </span>
      </div>
    </div>
  );
}
