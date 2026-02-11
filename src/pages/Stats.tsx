import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTrainingRuns, getInsights, getRunStats } from '@/lib/trainingService';
import { RatingBadge } from '@/components/BadgePill';
import { format } from 'date-fns';

type TimeRange = 'week' | 'month' | 'all';

export default function Stats() {
  const { profile } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [runs, setRuns] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    const [runsData, insightsData, statsData] = await Promise.all([
      getTrainingRuns(timeRange),
      getInsights(),
      getRunStats(timeRange),
    ]);
    setRuns(runsData);
    setInsights(insightsData);
    setStats(statsData);
    setLoading(false);
  };

  // Milestones
  const milestones = [
    { label: 'First drill completed', achieved: runs.length >= 1 },
    { label: '5 drills completed', achieved: runs.length >= 5 },
    { label: '10 drills completed', achieved: runs.length >= 10 },
    { label: 'First S rating', achieved: runs.some(r => r.rating === 'S') },
    { label: '3 S ratings', achieved: runs.filter(r => r.rating === 'S').length >= 3 },
    { label: 'Hard difficulty completed', achieved: runs.some(r => r.difficulty === 'Hard') },
    { label: 'All categories trained', achieved: new Set(runs.map(r => r.category)).size >= 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Your Stats</p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {profile?.display_name ? `${profile.display_name}'s Dashboard` : 'Training Dashboard'}
          </h1>
        </div>
        <div className="flex gap-1 bg-secondary rounded-lg p-1 border border-border">
          {(['week', 'month', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range === 'week' ? '7 days' : range === 'month' ? '30 days' : 'All time'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-4 rounded-lg bg-gradient-card border border-border h-20 animate-pulse" />
          ))}
        </div>
      ) : stats && stats.totalRuns > 0 ? (
        <>
          {/* Summary Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
              <p className="font-display text-2xl font-bold text-primary">{stats.totalRuns}</p>
              <p className="text-xs text-muted-foreground">Runs</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
              <p className="font-display text-2xl font-bold text-primary">{stats.avgRating}</p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
              <p className="font-display text-2xl font-bold text-primary">{stats.totalBadges}</p>
              <p className="text-xs text-muted-foreground">Badges Earned</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-card border border-border text-center">
              <p className="font-display text-2xl font-bold text-primary">
                {stats.bestMetric ? `${stats.bestMetric.value}%` : '-'}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.bestMetric ? stats.bestMetric.name : 'Best Metric'}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="p-5 rounded-lg bg-card border border-border">
            <h3 className="font-display font-semibold text-foreground mb-3">Rating Distribution</h3>
            <div className="flex gap-3">
              {(['S', 'A', 'B', 'C'] as const).map(r => {
                const count = stats.ratingDistribution[r] || 0;
                const pct = stats.totalRuns > 0 ? (count / stats.totalRuns) * 100 : 0;
                return (
                  <div key={r} className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <RatingBadge rating={r} size="sm" />
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: r === 'S' ? 'hsl(var(--primary))' : r === 'A' ? 'hsl(var(--success))' : r === 'B' ? 'hsl(var(--accent))' : 'hsl(var(--destructive))',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metrics */}
          {stats.bestMetric && stats.worstMetric && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                <p className="text-xs text-muted-foreground mb-1">Strongest</p>
                <p className="font-display font-bold text-foreground">{stats.bestMetric.name}</p>
                <p className="font-display text-xl font-bold text-success">{stats.bestMetric.value}%</p>
              </div>
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <p className="text-xs text-muted-foreground mb-1">Needs Work</p>
                <p className="font-display font-bold text-foreground">{stats.worstMetric.name}</p>
                <p className="font-display text-xl font-bold text-accent">{stats.worstMetric.value}%</p>
              </div>
            </div>
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Insights from your last sessions</h2>
              <div className="space-y-3">
                {insights.map((insight: any) => (
                  <div key={insight.id} className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display font-semibold text-foreground text-sm">{insight.title}</h3>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {format(new Date(insight.created_at), 'MMM d')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{insight.explanation}</p>
                    <div className="p-2.5 rounded-md bg-secondary/50 border border-border">
                      <p className="text-xs text-foreground">
                        <span className="text-primary font-medium">Next focus:</span> {insight.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestones */}
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">Milestones</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {milestones.map(m => (
                <div
                  key={m.label}
                  className={`p-3 rounded-lg border text-center text-xs ${
                    m.achieved
                      ? 'bg-success/5 border-success/20 text-foreground'
                      : 'bg-secondary/30 border-border text-muted-foreground'
                  }`}
                >
                  <span className="block text-base mb-1">{m.achieved ? '✓' : '○'}</span>
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          {/* Drill History */}
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">Drill History</h2>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary text-muted-foreground text-xs">
                    <th className="text-left px-4 py-3 font-medium">Drill</th>
                    <th className="text-center px-4 py-3 font-medium">Rating</th>
                    <th className="text-center px-4 py-3 font-medium">Badges</th>
                    <th className="text-center px-4 py-3 font-medium">Squad</th>
                    <th className="text-center px-4 py-3 font-medium">Difficulty</th>
                    <th className="text-right px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.slice(0, 20).map((run: any) => (
                    <tr key={run.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{run.drill_name}</p>
                        <p className="text-[10px] text-muted-foreground">{run.category}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <RatingBadge rating={run.rating} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-center text-foreground">{run.badges_earned}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{run.squad_size}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{run.difficulty}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground text-xs">
                        {format(new Date(run.created_at), 'MMM d, HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <span className="font-display font-bold text-2xl text-primary">0</span>
          </div>
          <h2 className="font-display text-lg font-bold text-foreground mb-2">No training data yet</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Complete your first drill to start building your training profile.
          </p>
          <a
            href="/training-hub"
            className="inline-block px-5 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all"
          >
            Run Your First Drill
          </a>
        </div>
      )}
    </div>
  );
}
