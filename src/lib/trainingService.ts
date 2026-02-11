import { supabase } from '@/integrations/supabase/client';
import { SimulationResult } from '@/data/types';
import { TIER_LABELS } from '@/data/types';
import { generateInsights } from './insightsEngine';

export async function saveTrainingRun(result: SimulationResult, playerLevel: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Compute metrics from simulation
  const score = result.rating === 'S' ? 0.9 : result.rating === 'A' ? 0.72 : result.rating === 'B' ? 0.52 : 0.3;
  const squadFactor = Math.min(result.squadSize / 4, 1.2);
  const diffFactor = result.difficulty === 'Hard' ? 0.85 : result.difficulty === 'Standard' ? 1 : 1.15;

  const metrics = {
    execute_consistency: Math.round((score * 80 + Math.random() * 20) * diffFactor),
    defensive_stability: Math.round((score * 75 + Math.random() * 25) * (result.category === 'base-defense' ? 1.1 : 0.9)),
    coordination_score: Math.round((score * 70 + Math.random() * 30) * squadFactor),
    confidence_gain: result.confidenceGain,
    mastery_gain: result.masteryGain,
  };

  await supabase.from('training_runs').insert({
    user_id: user.id,
    drill_id: result.scenarioId,
    drill_name: result.scenarioName,
    category: result.category,
    skill_tier_label: TIER_LABELS[playerLevel] || 'Steady',
    squad_size: result.squadSize,
    difficulty: result.difficulty,
    rating: result.rating,
    badges_earned: result.badges.length,
    metrics_json: metrics,
  });

  // Generate and save insights based on recent runs
  await generateAndSaveInsights(user.id);
}

export async function generateAndSaveInsights(userId: string) {
  const { data: recentRuns } = await supabase
    .from('training_runs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!recentRuns || recentRuns.length < 2) return;

  const typedRuns = recentRuns.map(r => ({
    drill_id: r.drill_id,
    drill_name: r.drill_name,
    category: r.category,
    rating: r.rating,
    badges_earned: r.badges_earned,
    squad_size: r.squad_size,
    difficulty: r.difficulty,
    metrics_json: (r.metrics_json as Record<string, number>) || {},
    created_at: r.created_at,
  }));

  const newInsights = generateInsights(typedRuns);
  if (newInsights.length === 0) return;

  // Delete old insights and insert new ones
  await supabase.from('insights').delete().eq('user_id', userId);
  
  const insightRows = newInsights.map(i => ({
    user_id: userId,
    insight_type: i.insight_type,
    title: i.title,
    explanation: i.explanation,
    recommendation: i.recommendation,
    evidence_json: JSON.parse(JSON.stringify(i.evidence_json)),
  }));

  await supabase.from('insights').insert(insightRows);
}

export async function getTrainingRuns(timeRange: 'week' | 'month' | 'all' = 'all') {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('training_runs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (timeRange === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    query = query.gte('created_at', weekAgo.toISOString());
  } else if (timeRange === 'month') {
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    query = query.gte('created_at', monthAgo.toISOString());
  }

  const { data } = await query.limit(100);
  return data || [];
}

export async function getInsights() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('insights')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return data || [];
}

export async function getRunStats(timeRange: 'week' | 'month' | 'all' = 'all') {
  const runs = await getTrainingRuns(timeRange);
  if (runs.length === 0) {
    return {
      totalRuns: 0,
      avgRating: '-',
      totalBadges: 0,
      bestMetric: null,
      worstMetric: null,
      ratingDistribution: { S: 0, A: 0, B: 0, C: 0 },
    };
  }

  const ratingMap: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };
  const avgRatingNum = runs.reduce((s, r) => s + (ratingMap[r.rating] || 1), 0) / runs.length;
  const avgRatingLabel = avgRatingNum >= 3.5 ? 'S' : avgRatingNum >= 2.5 ? 'A' : avgRatingNum >= 1.5 ? 'B' : 'C';

  const totalBadges = runs.reduce((s, r) => s + r.badges_earned, 0);

  const metrics = ['execute_consistency', 'defensive_stability', 'coordination_score'] as const;
  const metricAvgs = metrics.map(m => {
    const vals = runs.map(r => (r.metrics_json as Record<string, number>)?.[m] ?? 0).filter(v => v > 0);
    return { metric: m, avg: vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0 };
  }).filter(m => m.avg > 0);

  const metricLabels: Record<string, string> = {
    execute_consistency: 'Execute Consistency',
    defensive_stability: 'Defensive Stability',
    coordination_score: 'Coordination',
  };

  const best = metricAvgs.length > 0 ? metricAvgs.reduce((a, b) => a.avg > b.avg ? a : b) : null;
  const worst = metricAvgs.length > 0 ? metricAvgs.reduce((a, b) => a.avg < b.avg ? a : b) : null;

  const dist = { S: 0, A: 0, B: 0, C: 0 };
  runs.forEach(r => { if (r.rating in dist) dist[r.rating as keyof typeof dist]++; });

  return {
    totalRuns: runs.length,
    avgRating: avgRatingLabel,
    totalBadges,
    bestMetric: best ? { name: metricLabels[best.metric], value: Math.round(best.avg) } : null,
    worstMetric: worst ? { name: metricLabels[worst.metric], value: Math.round(worst.avg) } : null,
    ratingDistribution: dist,
  };
}
