import { useEffect, useState, useMemo } from 'react';
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
import { AreaChart, Area, XAxis, YAxis, BarChart, Bar, Cell } from 'recharts';

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
  let next = TIER_THRESHOLDS[1];
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalDrills >= TIER_THRESHOLDS[i].min) {
      current = TIER_THRESHOLDS[i];
      next = TIER_THRESHOLDS[i + 1] || null;
      break;
    }
  }
  return { current, next };
}

function computeCommitmentScore(events: { type: string; timestamp: number }[]): number {
  const drillEvents = events.filter(e => e.type === 'complete_scenario');
  if (drillEvents.length === 0) return 0;

  // Frequency: drills per week over last 30 days
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const recentDrills = drillEvents.filter(e => e.timestamp > thirtyDaysAgo);
  const frequencyScore = Math.min(recentDrills.length / 12, 1); // 12 drills/month = max

  // Regularity: how many of the last 4 weeks had at least 1 drill
  const weeksActive = new Set<number>();
  recentDrills.forEach(e => {
    const weekNum = Math.floor((now - e.timestamp) / (7 * 24 * 60 * 60 * 1000));
    weeksActive.add(weekNum);
  });
  const regularityScore = Math.min(weeksActive.size / 4, 1);

  // Variety: categories practiced
  const categories = new Set<string>();
  drillEvents.forEach(e => {
    const data = (e as any).data;
    if (data?.category) categories.add(data.category as string);
  });
  const varietyScore = Math.min(categories.size / 4, 1);

  return Math.round((frequencyScore * 0.4 + regularityScore * 0.35 + varietyScore * 0.25) * 100);
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

function computeCategoryDistribution(events: { type: string; data?: Record<string, unknown>; timestamp: number }[]) {
  const completions = events.filter(e => e.type === 'complete_scenario');
  const counts: Record<string, number> = {};
  const allCategories = Object.keys(CATEGORY_LABELS) as ScenarioCategory[];

  allCategories.forEach(c => (counts[c] = 0));
  completions.forEach(e => {
    const cat = e.data?.category as string;
    if (cat && cat in counts) counts[cat]++;
  });

  return allCategories.map(c => ({
    category: c,
    label: CATEGORY_LABELS[c],
    count: counts[c],
  }));
}

const trendChartConfig: ChartConfig = {
  confidence: { label: 'Confidence', color: 'hsl(185 72% 48%)' },
  mastery: { label: 'Mastery', color: 'hsl(160 70% 42%)' },
};

const categoryChartConfig: ChartConfig = {
  count: { label: 'Drills', color: 'hsl(185 72% 48%)' },
};

export default function Analytics() {
  const [events, setEvents] = useState<{ type: string; data?: Record<string, unknown>; timestamp: number }[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>('month');

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const profile = getPlayerProfile();
  const eventCounts = useMemo(() => getEventCounts(), []);

  const totalDrills = eventCounts['complete_scenario'] || 0;
  const totalStarted = eventCounts['start_scenario'] || 0;
  const totalSessions = eventCounts['enter_training_hub'] || 0;
  const skippedSessions = Math.max(0, totalSessions - totalStarted);
  const avgDrillsPerSession = totalSessions > 0 ? (totalDrills / totalSessions).toFixed(1) : '0';

  const { current: currentTier, next: nextTier } = getTier(totalDrills);
  const tierProgress = nextTier
    ? Math.round(((totalDrills - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
    : 100;

  const commitmentScore = useMemo(() => computeCommitmentScore(events), [events]);
  const trendData = useMemo(() => generateTrendData(events, timeframe), [events, timeframe]);
  const categoryDistribution = useMemo(() => computeCategoryDistribution(events), [events]);

  const maxCat = categoryDistribution.reduce((a, b) => (b.count > a.count ? b : a), categoryDistribution[0]);
  const underTrained = categoryDistribution.filter(c => c.count === 0 || (maxCat.count > 0 && c.count < maxCat.count * 0.3));

  // Streak: consecutive days with at least one drill (simplified)
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

  // Direction indicator
  const latestConfidence = trendData[trendData.length - 1]?.confidence || 0;
  const prevConfidence = trendData[Math.max(0, trendData.length - 3)]?.confidence || 0;
  const confidenceDirection = latestConfidence > prevConfidence ? 'improving' : latestConfidence === prevConfidence ? 'stable' : 'declining';

  const latestMastery = trendData[trendData.length - 1]?.mastery || 0;
  const prevMastery = trendData[Math.max(0, trendData.length - 3)]?.mastery || 0;
  const masteryDirection = latestMastery > prevMastery ? 'improving' : latestMastery === prevMastery ? 'stable' : 'declining';

  const directionIcon = (d: string) =>
    d === 'improving' ? '↑' : d === 'declining' ? '↓' : '→';
  const directionColor = (d: string) =>
    d === 'improving' ? 'text-success' : d === 'declining' ? 'text-destructive' : 'text-muted-foreground';

  const timeframes: { key: Timeframe; label: string }[] = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'season', label: 'This Season' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Dashboard</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Your Long-Term Training Progression</h1>
        <p className="text-sm text-muted-foreground mt-1">Consistency, momentum, and growth over time.</p>
      </div>

      {/* Tier Progression */}
      <div className="p-5 rounded-lg bg-gradient-card border border-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Training Tier</p>
            <p className="font-display text-xl font-bold text-foreground">{currentTier.label}</p>
          </div>
          {nextTier && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Next: {nextTier.label}</p>
              <p className="text-xs text-muted-foreground">{nextTier.min - totalDrills} drills to go</p>
            </div>
          )}
        </div>
        <Progress value={tierProgress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          Complete drills consistently to advance tiers. Tier reflects cumulative commitment, not performance.
        </p>
      </div>

      {/* Consistency & Commitment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
          <p className="text-xs text-muted-foreground">Consistency Streak</p>
          <p className="font-display text-3xl font-bold text-primary mt-1">{streak}</p>
          <p className="text-xs text-muted-foreground">{streak === 1 ? 'day' : 'days'} in a row</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
          <p className="text-xs text-muted-foreground">Commitment Score</p>
          <p className="font-display text-3xl font-bold text-primary mt-1">{commitmentScore}</p>
          <p className="text-xs text-muted-foreground">Frequency, regularity, variety</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
          <p className="text-xs text-muted-foreground">Weekly Completion</p>
          <p className="font-display text-3xl font-bold text-primary mt-1">
            {totalStarted > 0 ? Math.round((totalDrills / totalStarted) * 100) : 0}%
          </p>
          <p className="text-xs text-muted-foreground">Drills finished vs started</p>
        </div>
      </div>

      {/* Trend Graphs */}
      <div className="p-5 rounded-lg bg-gradient-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Progression Trends</h2>
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
            <span className="text-xs text-muted-foreground">Confidence</span>
            <span className={`text-xs font-semibold ${directionColor(confidenceDirection)}`}>
              {directionIcon(confidenceDirection)} {confidenceDirection}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Mastery</span>
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

      {/* Training Distribution */}
      <div className="p-5 rounded-lg bg-gradient-card border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Training Distribution</h2>
        <ChartContainer config={categoryChartConfig} className="h-[160px] w-full">
          <BarChart data={categoryDistribution} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {categoryDistribution.map((entry, i) => (
                <Cell
                  key={entry.category}
                  fill={entry.count === 0 ? 'hsl(220 15% 20%)' : 'hsl(185 72% 48% / 0.6)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        {underTrained.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3">
            Under-trained: {underTrained.map(c => c.label).join(', ')}
          </p>
        )}
      </div>

      {/* Session & Habit Summary */}
      <div className="p-5 rounded-lg bg-secondary border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Session & Habit Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-display text-xl font-bold text-foreground">{totalSessions}</p>
            <p className="text-xs text-muted-foreground">Sessions started</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-foreground">{skippedSessions}</p>
            <p className="text-xs text-muted-foreground">Sessions without drills</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-foreground">{avgDrillsPerSession}</p>
            <p className="text-xs text-muted-foreground">Avg drills per session</p>
          </div>
        </div>
      </div>
    </div>
  );
}
