import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, getEventCounts } from '@/lib/eventTracker';
import { getPlayerProfile } from '@/data/gameData';
import { SCENARIOS } from '@/data/gameData';
import { CATEGORY_LABELS, type ScenarioCategory } from '@/data/types';
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis } from 'recharts';
import { ArrowRight } from 'lucide-react';
import ShareToInstagram from '@/components/ShareToInstagram';
import { useDisplayName } from '@/hooks/useDisplayName';
import FeatureGate from '@/components/FeatureGate';

type Timeframe = 'week' | 'month' | 'season';

const TIER_THRESHOLDS = [
  { label: 'Recruit', min: 0 },
  { label: 'Operator', min: 5 },
  { label: 'Specialist', min: 15 },
  { label: 'Veteran', min: 30 },
  { label: 'Elite', min: 60 },
];

function getTier(totalDrills: number) {
  let current = TIER_THRESHOLDS[0];
  let next: (typeof TIER_THRESHOLDS)[number] | null = TIER_THRESHOLDS[1];
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalDrills >= TIER_THRESHOLDS[i].min) {
      current = TIER_THRESHOLDS[i];
      next = TIER_THRESHOLDS[i + 1] || null;
      break;
    }
  }
  return { current, next };
}

function generateTrendData(events: { type: string; timestamp: number }[], timeframe: Timeframe) {
  const now = Date.now();
  const ranges: { label: string; start: number; end: number }[] = [];

  if (timeframe === 'week') {
    for (let i = 6; i >= 0; i--) {
      const dayStart = now - i * 24 * 60 * 60 * 1000;
      ranges.push({
        label: new Date(dayStart).toLocaleDateString('en', { weekday: 'short' }),
        start: dayStart - 24 * 60 * 60 * 1000,
        end: dayStart,
      });
    }
  } else if (timeframe === 'month') {
    for (let i = 3; i >= 0; i--) {
      const weekEnd = now - i * 7 * 24 * 60 * 60 * 1000;
      ranges.push({
        label: `Week ${4 - i}`,
        start: weekEnd - 7 * 24 * 60 * 60 * 1000,
        end: weekEnd,
      });
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const weekEnd = now - i * 7 * 24 * 60 * 60 * 1000;
      ranges.push({
        label: `W${12 - i}`,
        start: weekEnd - 7 * 24 * 60 * 60 * 1000,
        end: weekEnd,
      });
    }
  }

  const completions = events.filter(e => e.type === 'complete_scenario');
  let runningConfidence = 0;
  let runningMastery = 0;

  return ranges.map(r => {
    const periodDrills = completions.filter(e => e.timestamp >= r.start && e.timestamp < r.end);
    periodDrills.forEach(d => {
      const data = (d as any).data;
      runningConfidence = Math.min(100, runningConfidence + (data?.confidenceGain || 3));
      runningMastery = Math.min(100, runningMastery + (data?.masteryGain || 2));
    });
    return {
      period: r.label,
      confidence: runningConfidence,
      mastery: runningMastery,
      drills: periodDrills.length,
    };
  });
}

const trendChartConfig: ChartConfig = {
  confidence: { label: 'Predictability', color: 'hsl(185 72% 48%)' },
  mastery: { label: 'Execution Quality', color: 'hsl(160 70% 42%)' },
};

// Cross-game pattern transfer mapping
const PATTERN_TRANSFERS = [
  { pattern: 'Lane Control', moba: 'Lane pressure', shooter: 'Site executes', rts: 'Map zone control' },
  { pattern: 'Phase Transitions', moba: 'Objective timing', shooter: 'Round economy', rts: 'Tech transitions' },
  { pattern: 'Resource Discipline', moba: 'Cooldown management', shooter: 'Utility usage', rts: 'Late-game stability' },
  { pattern: 'Role Adherence', moba: 'Position discipline', shooter: 'Entry/support roles', rts: 'Unit specialization' },
];

// System-driven recommendations based on profile state
function getRecommendation(confidence: number, mastery: number, completedScenarios: number): {
  label: string;
  category: ScenarioCategory | null;
  tier: string;
} {
  if (completedScenarios < 2) {
    return { label: 'Establish your coordination baseline', category: 'base-defense', tier: 'beginner' };
  }
  if (mastery < 30) {
    return { label: 'Reinforce timing under pressure', category: 'base-defense', tier: 'intermediate' };
  }
  if (confidence < mastery - 15) {
    return { label: 'Stabilize role execution in chaotic phases', category: 'role-based', tier: 'intermediate' };
  }
  if (mastery > 50 && confidence > 50) {
    return { label: 'Reduce late-phase decision latency', category: 'coordinated-attack', tier: 'advanced' };
  }
  return { label: 'Reinforce coordination patterns across categories', category: 'coordinated-attack', tier: 'intermediate' };
}

export default function Analytics() {
  const [events, setEvents] = useState<{ type: string; data?: Record<string, unknown>; timestamp: number }[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  const displayName = useDisplayName();
  const navigate = useNavigate();

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const profile = getPlayerProfile();
  const eventCounts = useMemo(() => getEventCounts(), []);

  const totalDrills = eventCounts['complete_scenario'] || 0;
  const totalStarted = eventCounts['start_scenario'] || 0;

  const { current: currentTier, next: nextTier } = getTier(totalDrills);
  const tierProgress = nextTier
    ? Math.round(((totalDrills - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
    : 100;

  const trendData = useMemo(() => generateTrendData(events, timeframe), [events, timeframe]);

  // Variance reduction calculation (simplified: lower spread in recent data = better)
  const recentTrend = trendData.slice(-4);
  const confidenceValues = recentTrend.map(t => t.confidence);
  const masteryValues = recentTrend.map(t => t.mastery);
  const calcVariance = (vals: number[]) => {
    if (vals.length < 2) return 0;
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.round(Math.sqrt(vals.reduce((a, v) => a + (v - mean) ** 2, 0) / vals.length));
  };
  const confidenceVariance = calcVariance(confidenceValues);
  const masteryVariance = calcVariance(masteryValues);

  // Direction indicators
  const latestConfidence = trendData[trendData.length - 1]?.confidence || 0;
  const prevConfidence = trendData[Math.max(0, trendData.length - 3)]?.confidence || 0;
  const confidenceDirection = latestConfidence > prevConfidence ? 'stabilizing' : latestConfidence === prevConfidence ? 'stable' : 'variable';

  const latestMastery = trendData[trendData.length - 1]?.mastery || 0;
  const prevMastery = trendData[Math.max(0, trendData.length - 3)]?.mastery || 0;
  const masteryDirection = latestMastery > prevMastery ? 'stabilizing' : latestMastery === prevMastery ? 'stable' : 'variable';

  const directionIcon = (d: string) =>
    d === 'stabilizing' ? '↑' : d === 'variable' ? '↓' : '→';
  const directionColor = (d: string) =>
    d === 'stabilizing' ? 'text-success' : d === 'variable' ? 'text-destructive' : 'text-muted-foreground';

  // Streak
  const streak = useMemo(() => {
    const drillDays = new Set<string>();
    events
      .filter(e => e.type === 'complete_scenario')
      .forEach(e => drillDays.add(new Date(e.timestamp).toDateString()));
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (drillDays.has(d.toDateString())) count++;
      else break;
    }
    return count;
  }, [events]);

  const recommendation = getRecommendation(profile.confidence, profile.mastery, profile.completedScenarios);

  const timeframes: { key: Timeframe; label: string }[] = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'season', label: 'This Season' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Coordination Dashboard</p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            What patterns are you building, and are they becoming automatic?
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Confidence follows evidence. These metrics reflect reliability, not isolated highs.
          </p>
        </div>
        <FeatureGate feature="share-export" inline>
        <ShareToInstagram
          storyData={{
            username: displayName,
            game: 'Cross-Game',
            headline: 'Drills Completed',
            headlineValue: `${totalDrills}`,
            metrics: [
              { label: 'Confidence', value: `${profile.confidence}%` },
              { label: 'Mastery', value: `${profile.mastery}%` },
              { label: 'Streak', value: `${streak}d` },
            ],
            tier: currentTier.label,
          }}
        />
        </FeatureGate>
      </div>

      {/* A. Coordination System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Coordination Pattern Strength</p>
          <p className="font-display text-3xl font-bold text-primary">{profile.mastery}%</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-xs font-semibold ${directionColor(masteryDirection)}`}>
              {directionIcon(masteryDirection)} {masteryDirection}
            </span>
            <span className="text-[10px] text-muted-foreground">variance {masteryVariance}pt</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Stability over time, not peak performance.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Execution Quality</p>
          <p className="font-display text-3xl font-bold text-primary">
            {totalStarted > 0 ? Math.round((totalDrills / totalStarted) * 100) : 0}%
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Completion rate across all initiated reps
          </p>
          <p className="text-[10px] text-muted-foreground mt-2">
            Measures follow-through, not just volume.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Consistency Under Pressure</p>
          <p className="font-display text-3xl font-bold text-primary">{profile.confidence}%</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-xs font-semibold ${directionColor(confidenceDirection)}`}>
              {directionIcon(confidenceDirection)} {confidenceDirection}
            </span>
            <span className="text-[10px] text-muted-foreground">variance {confidenceVariance}pt</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Predictability under pressure, not mindset.
          </p>
        </div>
      </div>

      {/* B. Confidence as Evidence */}
      <div className="p-5 rounded-lg bg-gradient-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Execution Predictability Over Time</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Shrinking variance means patterns are becoming automatic.
            </p>
          </div>
          <div className="flex gap-1">
            {timeframes.map(tf => (
              <button
                key={tf.key}
                onClick={() => setTimeframe(tf.key)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  timeframe === tf.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Predictability</span>
            <span className={`text-xs font-semibold ${directionColor(confidenceDirection)}`}>
              {directionIcon(confidenceDirection)} {confidenceDirection}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Execution Quality</span>
            <span className={`text-xs font-semibold ${directionColor(masteryDirection)}`}>
              {directionIcon(masteryDirection)} {masteryDirection}
            </span>
          </div>
        </div>

        <ChartContainer config={trendChartConfig} className="h-[200px] w-full">
          <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <XAxis dataKey="period" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="confidence"
              stroke="hsl(185 72% 48%)"
              fill="hsl(185 72% 48% / 0.15)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="mastery"
              stroke="hsl(160 70% 42%)"
              fill="hsl(160 70% 42% / 0.15)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Tier + Streak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-5 rounded-lg bg-gradient-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Training Tier</p>
              <p className="font-display text-xl font-bold text-foreground">{currentTier.label}</p>
            </div>
            {nextTier && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Next: {nextTier.label}</p>
                <p className="text-xs text-muted-foreground">{nextTier.min - totalDrills} reps to go</p>
              </div>
            )}
          </div>
          <Progress value={tierProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Tier reflects cumulative reinforcement volume, not peak performance.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-gradient-card border border-border flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Consistency Streak</p>
            <p className="font-display text-3xl font-bold text-primary">{streak}</p>
            <p className="text-xs text-muted-foreground">{streak === 1 ? 'day' : 'consecutive days'} of reinforcement</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Reps</p>
            <p className="font-display text-3xl font-bold text-primary">{totalDrills}</p>
            <p className="text-xs text-muted-foreground">completed</p>
          </div>
        </div>
      </div>

      {/* C. Cross-Game Transfer */}
      <div className="p-5 rounded-lg bg-secondary/30 border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-1">Patterns Applied Across Games</h2>
        <p className="text-xs text-muted-foreground mb-4">
          One coordination system. Many games. The same execution principles transfer.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left py-2 pr-4 font-medium">Coordination Pattern</th>
                <th className="text-left py-2 px-4 font-medium">MOBAs</th>
                <th className="text-left py-2 px-4 font-medium">Shooters</th>
                <th className="text-left py-2 px-4 font-medium">RTS</th>
              </tr>
            </thead>
            <tbody>
              {PATTERN_TRANSFERS.map(row => (
                <tr key={row.pattern} className="border-t border-border">
                  <td className="py-2.5 pr-4 font-display font-semibold text-foreground">{row.pattern}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{row.moba}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{row.shooter}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{row.rts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">
          Switching games no longer resets your learning curve.
        </p>
      </div>

      {/* D. Primary Action: What to Reinforce Next */}
      <div className="p-5 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Reinforce Next</p>
            <p className="font-display text-lg font-semibold text-foreground">{recommendation.label}</p>
            {recommendation.category && (
              <p className="text-xs text-muted-foreground mt-1">
                {CATEGORY_LABELS[recommendation.category]} drills at {recommendation.tier} tier
              </p>
            )}
          </div>
          <button
            onClick={() => {
              const params = new URLSearchParams();
              if (recommendation.category) params.set('category', recommendation.category);
              if (recommendation.tier) params.set('level', recommendation.tier);
              navigate(`/training-hub?${params.toString()}`);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
          >
            Start Reinforcement
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
