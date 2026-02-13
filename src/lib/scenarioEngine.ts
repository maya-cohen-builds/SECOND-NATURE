import type { ScenarioScript, SessionEvent, ScenarioScore, PhaseScore, FailurePoint } from '@/data/scenarioTypes';

/**
 * Compute score from session events against a scenario script.
 * Pure function — no side effects.
 */
export function computeScore(
  script: ScenarioScript,
  events: SessionEvent[],
  patternTags: string[]
): ScenarioScore {
  const phaseScores: PhaseScore[] = [];
  const failurePoints: FailurePoint[] = [];
  const dimensionScores: Record<string, number> = {};

  // Initialize dimension scores
  for (const rule of script.scoringRules) {
    dimensionScores[rule.dimension] = 0;
  }

  let totalScore = 0;
  let maxScore = 0;

  // Score each phase
  for (const phase of script.phases) {
    let phaseScore = 0;
    let phaseMax = 0;
    const details: string[] = [];

    for (const event of phase.events) {
      for (const action of event.actions) {
        phaseMax += action.points;

        // Find matching action event
        const actionEvent = events.find(
          e =>
            e.eventType === 'action' &&
            e.payload.actionId === action.id &&
            e.payload.phaseId === phase.id
        );

        if (actionEvent) {
          // Check timing
          const responseTime = (actionEvent.payload.responseTimeMs as number) || 0;
          const withinWindow = responseTime <= action.timingWindowSeconds * 1000;

          if (withinWindow) {
            // Check correctness
            if (action.correctChoice) {
              if (actionEvent.payload.choice === action.correctChoice) {
                phaseScore += action.points;
                details.push(`✓ ${action.label}: Correct (+${action.points})`);
              } else {
                const partial = Math.round(action.points * 0.3);
                phaseScore += partial;
                details.push(`△ ${action.label}: Wrong choice (+${partial})`);
                failurePoints.push({
                  phaseId: phase.id,
                  phaseName: phase.name,
                  eventId: event.id,
                  eventName: event.name,
                  ruleViolated: 'Decision correctness',
                  description: `Chose "${actionEvent.payload.choice}" instead of "${action.correctChoice}"`,
                });
              }
            } else {
              phaseScore += action.points;
              details.push(`✓ ${action.label}: Executed (+${action.points})`);
            }
          } else {
            const partial = Math.round(action.points * 0.2);
            phaseScore += partial;
            details.push(`⏱ ${action.label}: Late (${Math.round(responseTime / 1000)}s, window: ${action.timingWindowSeconds}s) (+${partial})`);
            failurePoints.push({
              phaseId: phase.id,
              phaseName: phase.name,
              eventId: event.id,
              eventName: event.name,
              ruleViolated: 'Timing accuracy',
              description: `Response ${Math.round(responseTime / 1000)}s exceeded ${action.timingWindowSeconds}s window`,
            });
          }
        } else {
          details.push(`✗ ${action.label}: Missed (0)`);
          failurePoints.push({
            phaseId: phase.id,
            phaseName: phase.name,
            eventId: event.id,
            eventName: event.name,
            ruleViolated: 'Action required',
            description: `Action "${action.label}" was not performed`,
          });
        }
      }
    }

    totalScore += phaseScore;
    maxScore += phaseMax;

    phaseScores.push({
      phaseId: phase.id,
      phaseName: phase.name,
      score: phaseScore,
      maxScore: phaseMax,
      details,
    });
  }

  // Signal efficiency: count signals used vs total events
  const signalEvents = events.filter(e => e.eventType === 'signal');
  const signalEfficiency = signalEvents.length > 0 ? Math.min(100, Math.round((signalEvents.length / Math.max(1, script.phases.length)) * 50)) : 0;

  // Compute dimension scores
  const totalPct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  for (const rule of script.scoringRules) {
    switch (rule.dimension) {
      case 'timing':
        dimensionScores[rule.dimension] = totalPct; // simplified
        break;
      case 'decision':
        dimensionScores[rule.dimension] = totalPct;
        break;
      case 'coordination':
        dimensionScores[rule.dimension] = signalEfficiency;
        break;
      case 'signal_efficiency':
        dimensionScores[rule.dimension] = signalEfficiency;
        break;
      case 'stability':
        // Stability = consistency across phases
        if (phaseScores.length > 1) {
          const pcts = phaseScores.map(p => p.maxScore > 0 ? (p.score / p.maxScore) * 100 : 0);
          const avg = pcts.reduce((a, b) => a + b, 0) / pcts.length;
          const variance = pcts.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / pcts.length;
          dimensionScores[rule.dimension] = Math.max(0, Math.round(100 - Math.sqrt(variance)));
        } else {
          dimensionScores[rule.dimension] = totalPct;
        }
        break;
    }
  }

  const passFail = totalPct >= script.passThreshold;

  // Pattern tag scores (distribute evenly)
  const patternTagScores = patternTags.map(tag => ({
    tag,
    score: totalScore,
    maxScore,
  }));

  // Token rewards
  const tokenRewards: { amount: number; reason: string }[] = [];
  if (passFail) {
    tokenRewards.push({ amount: 10, reason: 'Scenario completed (pass)' });
  } else {
    tokenRewards.push({ amount: 3, reason: 'Scenario attempted' });
  }
  if (totalPct >= 90) {
    tokenRewards.push({ amount: 5, reason: 'Clean execution bonus (90%+)' });
  }
  if (failurePoints.length === 0) {
    tokenRewards.push({ amount: 5, reason: 'Zero failures bonus' });
  }

  return {
    totalScore,
    maxScore,
    passFail,
    passReason: passFail
      ? `Score ${totalPct}% meets ${script.passThreshold}% threshold`
      : `Score ${totalPct}% below ${script.passThreshold}% threshold`,
    phaseScores,
    patternTagScores,
    failurePoints,
    dimensionScores,
    tokenRewards,
  };
}

/**
 * Create a default scenario script template
 */
export function createDefaultScript(): ScenarioScript {
  return {
    metadata: { version: '1.0', description: '' },
    initialState: {},
    phases: [
      {
        id: 'setup',
        name: 'Setup',
        objective: 'Establish positions and confirm roles',
        durationSeconds: 30,
        events: [
          {
            id: 'setup-confirm',
            name: 'Role Confirmation',
            description: 'Each role confirms readiness',
            triggerType: 'phase_start',
            actions: [
              {
                id: 'confirm-ready',
                label: 'Confirm Ready',
                role: 'all',
                timingWindowSeconds: 15,
                points: 10,
              },
            ],
          },
        ],
      },
      {
        id: 'contact',
        name: 'Contact',
        objective: 'Engage the primary objective',
        durationSeconds: 60,
        events: [
          {
            id: 'contact-engage',
            name: 'Initial Engagement',
            description: 'Execute the primary action',
            triggerType: 'phase_start',
            actions: [
              {
                id: 'engage-action',
                label: 'Execute',
                role: 'all',
                timingWindowSeconds: 10,
                points: 25,
              },
            ],
          },
        ],
      },
      {
        id: 'commit',
        name: 'Commit',
        objective: 'Follow through on the engagement',
        durationSeconds: 45,
        events: [
          {
            id: 'commit-follow',
            name: 'Follow Through',
            description: 'Complete the objective',
            triggerType: 'phase_start',
            actions: [
              {
                id: 'follow-action',
                label: 'Commit',
                role: 'all',
                timingWindowSeconds: 10,
                points: 25,
              },
            ],
          },
        ],
      },
      {
        id: 'reset',
        name: 'Reset',
        objective: 'Regroup and prepare for next cycle',
        durationSeconds: 20,
        events: [
          {
            id: 'reset-regroup',
            name: 'Regroup',
            description: 'Reset positions',
            triggerType: 'phase_start',
            actions: [
              {
                id: 'regroup-action',
                label: 'Reset Position',
                role: 'all',
                timingWindowSeconds: 10,
                points: 15,
              },
            ],
          },
        ],
      },
    ],
    scoringRules: [
      { id: 'timing', dimension: 'timing', description: 'Actions within timing windows', weight: 0.3, passThreshold: 50 },
      { id: 'decision', dimension: 'decision', description: 'Correct choices made', weight: 0.3, passThreshold: 50 },
      { id: 'coordination', dimension: 'coordination', description: 'Squad coordination signals', weight: 0.2, passThreshold: 30 },
      { id: 'stability', dimension: 'stability', description: 'Consistent performance across phases', weight: 0.2, passThreshold: 40 },
    ],
    passThreshold: 50,
    allowedSignals: ['Hold', 'Reset', 'Again', 'Clean', 'Pause'],
  };
}

/**
 * Validate a scenario script for completeness
 */
export function validateScript(script: ScenarioScript, roles: string[]): string[] {
  const errors: string[] = [];

  if (script.phases.length === 0) {
    errors.push('At least one phase is required');
  }

  for (const phase of script.phases) {
    if (!phase.name) errors.push(`Phase "${phase.id}" has no name`);
    if (phase.durationSeconds <= 0) errors.push(`Phase "${phase.name}" has invalid duration`);

    for (const event of phase.events) {
      for (const action of event.actions) {
        if (action.timingWindowSeconds <= 0) {
          errors.push(`Action "${action.label}" in "${phase.name}" has impossible timing window`);
        }
        if (action.role !== 'all' && !roles.includes(action.role)) {
          errors.push(`Action "${action.label}" references missing role "${action.role}"`);
        }
      }
    }
  }

  // Check for unreachable phases (simplified: just check order)
  const phaseIds = new Set(script.phases.map(p => p.id));
  if (phaseIds.size !== script.phases.length) {
    errors.push('Duplicate phase IDs detected');
  }

  if (script.scoringRules.length === 0) {
    errors.push('At least one scoring rule is required');
  }

  return errors;
}
