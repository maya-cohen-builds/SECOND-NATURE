import { SCENARIOS } from '@/data/gameData';

interface RunData {
  drill_id: string;
  drill_name: string;
  category: string;
  rating: string;
  badges_earned: number;
  squad_size: number;
  difficulty: string;
  metrics_json: {
    execute_consistency?: number;
    defensive_stability?: number;
    coordination_score?: number;
    confidence_gain?: number;
    mastery_gain?: number;
  };
  created_at: string;
}

interface GeneratedInsight {
  insight_type: string;
  title: string;
  explanation: string;
  recommendation: string;
  evidence_json: Record<string, unknown>;
}

const RATING_VALUE: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function trend(nums: number[]): 'up' | 'down' | 'flat' {
  if (nums.length < 3) return 'flat';
  const firstHalf = avg(nums.slice(0, Math.floor(nums.length / 2)));
  const secondHalf = avg(nums.slice(Math.floor(nums.length / 2)));
  const diff = secondHalf - firstHalf;
  if (diff > 0.15) return 'up';
  if (diff < -0.15) return 'down';
  return 'flat';
}

export function generateInsights(runs: RunData[]): GeneratedInsight[] {
  if (runs.length < 2) return [];

  const insights: GeneratedInsight[] = [];
  const recentRuns = runs.slice(0, 10);

  const ratings = recentRuns.map(r => RATING_VALUE[r.rating] || 1);
  const badges = recentRuns.map(r => r.badges_earned);
  const execConsistency = recentRuns.map(r => r.metrics_json?.execute_consistency ?? 0).filter(v => v > 0);
  const defStability = recentRuns.map(r => r.metrics_json?.defensive_stability ?? 0).filter(v => v > 0);
  const coordScore = recentRuns.map(r => r.metrics_json?.coordination_score ?? 0).filter(v => v > 0);
  const avgRating = avg(ratings);
  const avgBadges = avg(badges);
  const ratingTrend = trend(ratings);
  const badgeTrend = trend(badges);
  const execTrend = trend(execConsistency);
  const defTrend = trend(defStability);

  const bigSquadRuns = recentRuns.filter(r => r.squad_size >= 4);
  const avgExecBigSquad = bigSquadRuns.length > 0
    ? avg(bigSquadRuns.map(r => r.metrics_json?.execute_consistency ?? 0))
    : null;

  // Rule 1: Execute consistency trending down under multi-role pressure
  if (execTrend === 'down' && bigSquadRuns.length >= 2 && avgExecBigSquad !== null && avgExecBigSquad < 65) {
    const roleDrill = SCENARIOS.find(s => s.category === 'role-based');
    insights.push({
      insight_type: 'execute_pressure',
      title: 'Your executes break under multi-role pressure',
      explanation: `Over your last ${recentRuns.length} runs, execute consistency dropped from ${Math.round(execConsistency[execConsistency.length - 1] ?? 0)}% to ${Math.round(execConsistency[0] ?? 0)}%. This is most visible in squad sizes of 4+.`,
      recommendation: `Run ${roleDrill?.name || 'a Role Dynamics drill'} 3 times on Standard difficulty. Focus on call timing and role handoff sequencing.`,
      evidence_json: {
        metric: 'execute_consistency',
        trend: 'down',
        recent_values: execConsistency.slice(0, 5),
        big_squad_avg: Math.round(avgExecBigSquad),
      },
    });
  }

  // Rule 2: Defensive stability low with few badges
  if (defStability.length > 0 && avg(defStability) < 55 && avgBadges <= 1) {
    const defDrill = SCENARIOS.find(s => s.category === 'base-defense' && s.complexity >= 3);
    insights.push({
      insight_type: 'defensive_collapse',
      title: "You're surviving early waves but collapsing late",
      explanation: `Your defensive stability averages ${Math.round(avg(defStability))}% across recent runs, and you're earning ${avgBadges.toFixed(1)} badges on average. This pattern indicates late-game defensive breakdowns.`,
      recommendation: `Run ${defDrill?.name || 'a Defensive Operations drill'} on Hard. Focus on rotation cadence and resource discipline during waves 3+.`,
      evidence_json: {
        metric: 'defensive_stability',
        avg_value: Math.round(avg(defStability)),
        avg_badges: Math.round(avgBadges * 10) / 10,
        runs_analyzed: recentRuns.length,
      },
    });
  }

  // Rule 3: Badges rising but rating flat
  if (badgeTrend === 'up' && (ratingTrend === 'flat' || ratingTrend === 'down') && recentRuns.length >= 4) {
    insights.push({
      insight_type: 'coordination_limiter',
      title: "You're improving mechanically, but coordination is the limiter",
      explanation: `Badge earnings are trending up (avg ${avgBadges.toFixed(1)}), but your rating stays at ${avgRating.toFixed(1)}/4. Individual skills are growing faster than team execution.`,
      recommendation: 'Switch to squad drills with 4-5 members. Your individual mechanics are ahead of your coordination—close the gap with team reps.',
      evidence_json: {
        badge_trend: 'up',
        rating_trend: ratingTrend,
        avg_rating: Math.round(avgRating * 10) / 10,
        avg_badges: Math.round(avgBadges * 10) / 10,
      },
    });
  }

  // Rule 4: Consistency across categories
  const categories = [...new Set(recentRuns.map(r => r.category))];
  if (categories.length >= 2) {
    const catPerf = categories.map(cat => {
      const catRuns = recentRuns.filter(r => r.category === cat);
      return { cat, avg: avg(catRuns.map(r => RATING_VALUE[r.rating] || 1)), count: catRuns.length };
    });
    const weakest = catPerf.reduce((a, b) => a.avg < b.avg ? a : b);
    const strongest = catPerf.reduce((a, b) => a.avg > b.avg ? a : b);
    if (strongest.avg - weakest.avg > 0.8 && weakest.count >= 2) {
      const weakDrill = SCENARIOS.find(s => s.category === weakest.cat);
      insights.push({
        insight_type: 'category_gap',
        title: `${weakest.cat.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} is dragging your overall rating`,
        explanation: `Your ${strongest.cat.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} rating averages ${strongest.avg.toFixed(1)}/4, but ${weakest.cat.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} is at ${weakest.avg.toFixed(1)}/4 across ${weakest.count} runs.`,
        recommendation: `Run 3 ${weakDrill?.name || weakest.cat} drills this week to close the gap. Start on Standard difficulty.`,
        evidence_json: {
          category_performance: catPerf.map(c => ({ category: c.cat, avg_rating: Math.round(c.avg * 10) / 10, runs: c.count })),
        },
      });
    }
  }

  // Rule 5: Rating improving consistently
  if (ratingTrend === 'up' && recentRuns.length >= 5) {
    insights.push({
      insight_type: 'positive_momentum',
      title: 'Your ratings are climbing — keep pushing',
      explanation: `Over your last ${recentRuns.length} runs, your average rating has been trending upward. Current average: ${avgRating.toFixed(1)}/4.`,
      recommendation: avgRating >= 3 
        ? 'You\'re ready to increase difficulty. Try Hard mode on your strongest category to push toward S ratings.'
        : 'Keep running drills at your current difficulty. You\'re building consistent patterns.',
      evidence_json: {
        rating_trend: 'up',
        avg_rating: Math.round(avgRating * 10) / 10,
        recent_ratings: ratings.slice(0, 5).map(r => ['C', 'B', 'A', 'S'][r - 1] || 'C'),
      },
    });
  }

  // Rule 6: Coordination score low
  if (coordScore.length >= 3 && avg(coordScore) < 50) {
    const coordDrill = SCENARIOS.find(s => s.category === 'coordinated-attack' && s.complexity <= 3);
    insights.push({
      insight_type: 'low_coordination',
      title: 'Squad coordination needs work',
      explanation: `Your coordination score averages ${Math.round(avg(coordScore))}% over recent runs. This impacts group timing and objective sequencing.`,
      recommendation: `Run ${coordDrill?.name || 'a Strike Coordination drill'} with a full squad. Focus on timing callouts and synchronized pushes.`,
      evidence_json: {
        metric: 'coordination_score',
        avg_value: Math.round(avg(coordScore)),
        values: coordScore.slice(0, 5),
      },
    });
  }

  return insights.slice(0, 3);
}
