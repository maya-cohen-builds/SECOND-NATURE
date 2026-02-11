import { useEffect, useMemo } from 'react';
import { trackEvent, getEventCounts } from '@/lib/eventTracker';
import { getPlayerProfile } from '@/data/gameData';
import { SCENARIOS } from '@/data/gameData';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight, Target, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface Diagnosis {
  limitingFactor: string;
  why: string;
  triggerSignal: string;
  tradeoff: string;
  expectedImpact: string;
  prescribedDrills: { id: string; name: string; difficulty: string; reason: string }[];
  avoidDrills: { name: string; reason: string }[];
  cadence: string;
  squadSize?: number;
}

function computeDiagnosis(
  completedScenarios: number,
  confidence: number,
  mastery: number,
  badgeCount: number,
  completedCount: number,
  startedCount: number
): Diagnosis {
  const completionRate = startedCount > 0 ? completedCount / startedCount : 0;
  const hasBreadth = badgeCount >= 3;
  const hasDepth = mastery > 50;
  const hasConfidence = confidence > 50;

  // Determine primary bottleneck through causal analysis
  if (completedScenarios < 2) {
    return {
      limitingFactor: 'Insufficient Training Volume',
      why: 'Without enough completed drills, there is no reliable signal to diagnose performance gaps. Early sessions establish your baseline across coordination, timing, and role execution.',
      triggerSignal: `${completedScenarios} drill${completedScenarios === 1 ? '' : 's'} completed — minimum 3 needed for pattern detection.`,
      tradeoff: 'Volume is improving but no patterns have emerged yet.',
      expectedImpact: 'Completing 3+ drills will unlock your first diagnostic insight and begin surfacing your actual limiting factor.',
      prescribedDrills: [
        { id: 'bd-1', name: 'Perimeter Hold', difficulty: 'Standard', reason: 'Low complexity, establishes defensive baseline' },
        { id: 'ca-1', name: 'Pincer Strike', difficulty: 'Standard', reason: 'Tests basic coordination without overwhelming' },
      ],
      avoidDrills: [
        { name: 'High-complexity drills (4–5)', reason: 'Premature difficulty masks actual skill gaps' },
      ],
      cadence: 'Complete 2–3 drills this session to establish baseline.',
    };
  }

  if (!hasConfidence && !hasDepth) {
    return {
      limitingFactor: 'Execution Consistency Under Pressure',
      why: `Your squad performs adequately in early drill phases but shows significant variance in later stages. Both confidence (${confidence}%) and mastery (${mastery}%) are below the threshold where reliable execution begins. This caps overall readiness regardless of drill volume.`,
      triggerSignal: `Confidence at ${confidence}% and mastery at ${mastery}% — both below the 50% stability threshold after ${completedScenarios} drills.`,
      tradeoff: 'Drill volume is building but execution quality is not converting into reliable skill gains. More reps without focus will plateau.',
      expectedImpact: 'Improving execution consistency is projected to unlock higher coordination efficiency and reduce late-drill breakdowns by ~30%.',
      prescribedDrills: [
        { id: 'bd-2', name: 'Core Shield Recovery', difficulty: 'Standard', reason: 'Forces sustained focus under time pressure — directly trains consistency' },
        { id: 'rb-1', name: 'Mixed Arms Drill', difficulty: 'Standard', reason: 'Requires all roles to execute reliably — exposes weak links' },
      ],
      avoidDrills: [
        { name: 'Siege Endurance', reason: 'Too punishing at current consistency level — will reinforce failure patterns' },
        { name: 'Adaptive Operations', reason: 'Role-switching demands stable execution as prerequisite' },
      ],
      cadence: '2–3 focused sessions this week. Repeat the same drill twice before switching.',
      squadSize: 3,
    };
  }

  if (hasDepth && !hasConfidence) {
    return {
      limitingFactor: 'Decision-Making Under Uncertainty',
      why: `Your mechanical execution is solid (mastery at ${mastery}%) but decision confidence lags at ${confidence}%. This pattern suggests you can execute correctly when told what to do, but struggle to read situations independently. In competitive play, this creates hesitation at critical moments.`,
      triggerSignal: `Mastery-confidence gap of ${mastery - confidence} points — mechanical skill outpaces situational judgment.`,
      tradeoff: 'Mastery is strong and improving. But without confidence, your squad will default to safe plays and miss aggressive windows.',
      expectedImpact: 'Closing the confidence gap is projected to improve coordination timing by 20–25% and unlock readiness for competitive scenarios.',
      prescribedDrills: [
        { id: 'ca-2', name: 'Supply Line Disruption', difficulty: 'Hard', reason: 'Tight timing windows force fast decision-making — no room for hesitation' },
        { id: 'vm-1', name: 'Recon Sweep', difficulty: 'Hard', reason: 'Solo-style pressure builds individual decision confidence' },
      ],
      avoidDrills: [
        { name: 'Perimeter Hold', reason: 'Too passive — reinforces waiting rather than deciding' },
      ],
      cadence: '3 sessions this week at Hard difficulty. Accept lower ratings to build decision speed.',
      squadSize: 2,
    };
  }

  if (hasConfidence && !hasDepth) {
    return {
      limitingFactor: 'Mechanical Precision Deficit',
      why: `You make good decisions quickly (confidence at ${confidence}%) but execution breaks down under complexity (mastery at ${mastery}%). Your squad reads situations well but fumbles the response. This is the most fixable bottleneck — it responds directly to deliberate repetition.`,
      triggerSignal: `Confidence-mastery gap of ${confidence - mastery} points — judgment outpaces mechanical skill.`,
      tradeoff: 'Decision-making is a strength. But poor execution wastes good reads and erodes squad trust over time.',
      expectedImpact: 'Improving mastery to match confidence would directly increase drill ratings by 1–2 grades and unlock advanced coordination drills.',
      prescribedDrills: [
        { id: 'bd-3', name: 'Siege Endurance', difficulty: 'Standard', reason: 'Extended duration forces mechanical consistency over time' },
        { id: 'rb-2', name: 'Specialist Extraction', difficulty: 'Standard', reason: 'Role-specific mechanics under controlled pressure' },
      ],
      avoidDrills: [
        { name: 'Command Node Takedown', reason: 'Multi-phase complexity will overwhelm current mechanical ceiling' },
      ],
      cadence: '2 sessions this week. Focus on completing drills fully rather than speed.',
      squadSize: 4,
    };
  }

  if (!hasBreadth) {
    return {
      limitingFactor: 'Narrow Role Coverage',
      why: `Your core metrics are solid but you've only earned ${badgeCount} badge${badgeCount === 1 ? '' : 's'}. This indicates training is concentrated in familiar drill types. Competitive readiness requires cross-role familiarity — your squad can't adapt if everyone trains the same way.`,
      triggerSignal: `${badgeCount} badges across ${completedScenarios} drills — below the 3-badge threshold for role diversity.`,
      tradeoff: 'Depth in your primary role is strong. But lack of breadth creates predictable squad patterns that opponents exploit.',
      expectedImpact: 'Diversifying across 2–3 new drill categories is projected to improve squad adaptability and unlock cross-role coordination bonuses.',
      prescribedDrills: [
        { id: 'vm-2', name: 'Armored Convoy Escort', difficulty: 'Standard', reason: 'Vehicle drills build a completely different skill axis' },
        { id: 'ca-3', name: 'Command Node Takedown', difficulty: 'Standard', reason: 'Multi-phase drills expose you to role-switching under pressure' },
      ],
      avoidDrills: [
        { name: 'Repeating your highest-rated drill', reason: 'Diminishing returns — you need new stimulus, not more comfort reps' },
      ],
      cadence: '2 sessions in unfamiliar categories this week. Accept lower initial ratings.',
      squadSize: 4,
    };
  }

  // High performer — focus on optimization
  return {
    limitingFactor: 'Late-Stage Coordination Optimization',
    why: `Your fundamentals are strong across the board. The remaining growth edge is in late-drill coordination — the final 10% where squads either clutch or collapse. At this level, improvement comes from refining timing between squad members rather than individual skill.`,
    triggerSignal: `Confidence ${confidence}%, mastery ${mastery}%, ${badgeCount} badges — all above baseline thresholds.`,
    tradeoff: 'Individual metrics are saturating. Further gains require squad-level optimization that solo drilling cannot address.',
    expectedImpact: 'Refining late-stage coordination is the difference between A-rated and S-rated completions in competitive scenarios.',
    prescribedDrills: [
      { id: 'rb-3', name: 'Adaptive Operations', difficulty: 'Hard', reason: 'Dynamic role-switching stress-tests coordination at the highest level' },
      { id: 'ca-3', name: 'Command Node Takedown', difficulty: 'Hard', reason: 'Multi-phase assault requires peak squad synchronization' },
    ],
    avoidDrills: [
      { name: 'Low-complexity drills (1–2)', reason: 'No longer challenging enough to produce measurable coordination gains' },
    ],
    cadence: '2 sessions at Hard difficulty. Focus on squad timing, not individual performance.',
    squadSize: 5,
  };
}

function getResolvedFactors(
  completedScenarios: number,
  confidence: number,
  mastery: number,
  badgeCount: number
): string[] {
  const resolved: string[] = [];
  if (completedScenarios >= 3) resolved.push('Insufficient Training Volume');
  if (confidence >= 50 && mastery >= 50) resolved.push('Execution Consistency Under Pressure');
  if (confidence >= 50) resolved.push('Decision-Making Under Uncertainty');
  if (mastery >= 50) resolved.push('Mechanical Precision Deficit');
  if (badgeCount >= 3) resolved.push('Narrow Role Coverage');
  return resolved;
}

export default function Experiments() {
  useEffect(() => {
    trackEvent('view_metrics_page');
  }, []);

  const profile = getPlayerProfile();
  const counts = getEventCounts();
  const completedCount = counts['complete_scenario'] || 0;
  const startedCount = counts['start_scenario'] || 0;

  const diagnosis = useMemo(() =>
    computeDiagnosis(
      profile.completedScenarios,
      profile.confidence,
      profile.mastery,
      profile.badgesEarned.length,
      completedCount,
      startedCount
    ), [profile, completedCount, startedCount]
  );

  const resolvedFactors = useMemo(() =>
    getResolvedFactors(
      profile.completedScenarios,
      profile.confidence,
      profile.mastery,
      profile.badgesEarned.length
    ).filter(f => f !== diagnosis.limitingFactor),
    [profile, diagnosis]
  );

  const focusDrillsRemaining = Math.max(0, 3 - (profile.completedScenarios % 3));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Performance Lab</p>
        <h1 className="font-display text-2xl font-bold text-foreground">What should you focus on next?</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Diagnostic analysis based on your training history. No raw stats — only actionable direction.
        </p>
      </div>

      {/* Current Limiting Factor */}
      <div className="p-5 rounded-lg bg-card border border-primary/30">
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-0.5 p-2 rounded-md bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Current Limiting Factor</p>
            <h2 className="font-display text-lg font-bold text-foreground">{diagnosis.limitingFactor}</h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{diagnosis.why}</p>
        
        <div className="space-y-3">
          <div className="p-3 rounded-md bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Trigger Signal</p>
            <p className="text-sm text-foreground">{diagnosis.triggerSignal}</p>
          </div>
          <div className="p-3 rounded-md bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Tradeoff</p>
            <p className="text-sm text-foreground">{diagnosis.tradeoff}</p>
          </div>
          <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
            <p className="text-xs text-primary mb-1 font-medium">Expected Impact If Improved</p>
            <p className="text-sm text-foreground">{diagnosis.expectedImpact}</p>
          </div>
        </div>
      </div>

      {/* Prescribed Training Plan */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Prescribed Training Plan</h2>
        <div className="space-y-3">
          {/* Run Next */}
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2 flex items-center gap-1.5">
              <ArrowRight className="h-3 w-3" /> Run Next
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {diagnosis.prescribedDrills.map(drill => (
                <Link
                  key={drill.id}
                  to="/training"
                  className="p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-semibold text-foreground text-sm">{drill.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{drill.difficulty}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{drill.reason}</p>
                  <p className="text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Go to Training Hub →
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Avoid For Now */}
          <div>
            <p className="text-xs uppercase tracking-widest text-destructive/80 font-semibold mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3" /> Avoid For Now
            </p>
            <div className="space-y-2">
              {diagnosis.avoidDrills.map(drill => (
                <div key={drill.name} className="p-3 rounded-lg bg-secondary/30 border border-border">
                  <p className="text-sm text-foreground font-medium">{drill.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{drill.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cadence & Squad Size */}
          <div className="flex flex-wrap gap-3">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border flex-1 min-w-[200px]">
              <p className="text-xs text-muted-foreground mb-1">Suggested Cadence</p>
              <p className="text-sm text-foreground font-medium">{diagnosis.cadence}</p>
            </div>
            {diagnosis.squadSize && (
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Squad Size</p>
                <p className="text-sm text-foreground font-medium">{diagnosis.squadSize} members</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* This Week's Focus */}
      <div className="p-5 rounded-lg bg-secondary/30 border border-border">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-2 rounded-md bg-accent/10">
            <Clock className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-foreground mb-1">This Week's Focus</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Stick with <span className="text-foreground font-medium">{diagnosis.limitingFactor}</span> for
              your next {focusDrillsRemaining > 0 ? focusDrillsRemaining : 3} drill{focusDrillsRemaining === 1 ? '' : 's'} before re-evaluating.
            </p>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < (3 - focusDrillsRemaining) ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {focusDrillsRemaining === 0
                ? 'Focus block complete. Diagnosis will update after next drill.'
                : `${3 - focusDrillsRemaining}/3 focus drills completed`}
            </p>
          </div>
        </div>
      </div>

      {/* Resolved Factors */}
      {resolvedFactors.length > 0 && (
        <div>
          <h2 className="font-display text-sm font-semibold text-muted-foreground mb-2">Resolved</h2>
          <div className="space-y-1.5">
            {resolvedFactors.map(factor => (
              <div key={factor} className="flex items-center gap-2 p-2.5 rounded-md bg-secondary/20 border border-border">
                <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
                <span className="text-xs text-muted-foreground line-through">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {profile.completedScenarios < 3 && (
        <div className="text-center pt-2">
          <Link
            to="/training"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Start Prescribed Drill <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-muted-foreground mt-2">
            Your diagnosis sharpens after every completed drill.
          </p>
        </div>
      )}
    </div>
  );
}
