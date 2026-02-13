import type { ScenarioScript, ScenarioRole } from './scenarioTypes';

interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  game: string;
  tier: string;
  patternTags: string[];
  squadSize: number;
  roles: ScenarioRole[];
  estimatedMinutes: number;
  script: ScenarioScript;
}

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: 'tpl-site-execute',
    name: 'Site Execute',
    description: 'Coordinated site take with utility timing, entry sequencing, and trade setups.',
    game: 'Valorant',
    tier: 'Intermediate',
    patternTags: ['entry-timing', 'trade-setup', 'utility-coordination'],
    squadSize: 3,
    roles: [
      { name: 'Entry', description: 'First player through the choke' },
      { name: 'Support', description: 'Utility and trade coverage' },
      { name: 'Anchor', description: 'Post-plant positioning' },
    ],
    estimatedMinutes: 5,
    script: {
      metadata: { version: '1.0', description: 'Coordinated site execute drill' },
      initialState: { site: 'A', round: 1 },
      phases: [
        {
          id: 'setup',
          name: 'Pre-Execute Setup',
          objective: 'Position for the take. Confirm utility assignments.',
          durationSeconds: 20,
          events: [
            {
              id: 'util-assign',
              name: 'Utility Assignment',
              description: 'Each player confirms their utility role',
              triggerType: 'phase_start',
              actions: [
                { id: 'confirm-util', label: 'Confirm Utility', role: 'all', timingWindowSeconds: 15, points: 10 },
              ],
            },
          ],
        },
        {
          id: 'contact',
          name: 'Execute',
          objective: 'Flash, smoke, and enter site in sequence.',
          durationSeconds: 15,
          events: [
            {
              id: 'flash-entry',
              name: 'Flash + Entry',
              description: 'Support flashes, Entry pushes',
              triggerType: 'phase_start',
              actions: [
                { id: 'throw-flash', label: 'Throw Flash', role: 'Support', timingWindowSeconds: 5, points: 20 },
                { id: 'push-site', label: 'Push Site', role: 'Entry', timingWindowSeconds: 8, points: 25 },
              ],
            },
            {
              id: 'trade-setup',
              name: 'Trade Setup',
              description: 'Support follows for trade',
              triggerType: 'timed',
              triggerDelaySeconds: 5,
              actions: [
                { id: 'trade-follow', label: 'Follow for Trade', role: 'Support', timingWindowSeconds: 5, points: 20 },
              ],
            },
          ],
        },
        {
          id: 'commit',
          name: 'Post-Plant',
          objective: 'Plant and set up crossfires.',
          durationSeconds: 20,
          events: [
            {
              id: 'plant-spike',
              name: 'Plant',
              description: 'Anchor plants while covered',
              triggerType: 'phase_start',
              actions: [
                { id: 'plant', label: 'Plant', role: 'Anchor', timingWindowSeconds: 10, points: 25 },
                { id: 'cover-plant', label: 'Cover Plant', role: 'Entry', timingWindowSeconds: 10, points: 15 },
              ],
            },
          ],
        },
        {
          id: 'reset',
          name: 'Hold / Reset',
          objective: 'Hold positions or reset for retake defense.',
          durationSeconds: 15,
          events: [
            {
              id: 'hold-position',
              name: 'Position Hold',
              description: 'Maintain crossfire angles',
              triggerType: 'phase_start',
              actions: [
                { id: 'hold', label: 'Hold Position', role: 'all', timingWindowSeconds: 10, points: 15 },
              ],
            },
          ],
        },
      ],
      scoringRules: [
        { id: 'timing', dimension: 'timing', description: 'Actions within timing windows', weight: 0.35, passThreshold: 50 },
        { id: 'decision', dimension: 'decision', description: 'Correct role-specific actions', weight: 0.3, passThreshold: 50 },
        { id: 'coordination', dimension: 'coordination', description: 'Squad signals used effectively', weight: 0.2, passThreshold: 30 },
        { id: 'stability', dimension: 'stability', description: 'Consistent across all phases', weight: 0.15, passThreshold: 40 },
      ],
      passThreshold: 55,
      allowedSignals: ['Hold', 'Reset', 'Again', 'Clean', 'Pause'],
    },
  },
  {
    id: 'tpl-retake',
    name: 'Retake Coordination',
    description: 'Post-plant retake with utility staging and crossfire coordination.',
    game: 'Valorant',
    tier: 'Advanced',
    patternTags: ['retake-timing', 'crossfire', 'utility-staging'],
    squadSize: 2,
    roles: [
      { name: 'Retaker A', description: 'Primary entry for retake' },
      { name: 'Retaker B', description: 'Crossfire support' },
    ],
    estimatedMinutes: 4,
    script: {
      metadata: { version: '1.0', description: 'Retake coordination drill' },
      initialState: { site: 'B', spike_planted: true },
      phases: [
        {
          id: 'staging',
          name: 'Staging',
          objective: 'Gather info and stage utility.',
          durationSeconds: 15,
          events: [
            {
              id: 'gather-info',
              name: 'Info Gathering',
              description: 'Peek for info without committing',
              triggerType: 'phase_start',
              actions: [
                { id: 'peek-info', label: 'Peek for Info', role: 'Retaker A', timingWindowSeconds: 10, points: 15 },
                { id: 'stage-util', label: 'Stage Utility', role: 'Retaker B', timingWindowSeconds: 10, points: 15 },
              ],
            },
          ],
        },
        {
          id: 'contact',
          name: 'Retake Push',
          objective: 'Synchronized entry onto site.',
          durationSeconds: 12,
          events: [
            {
              id: 'sync-push',
              name: 'Synchronized Push',
              description: 'Both retakers push simultaneously',
              triggerType: 'phase_start',
              actions: [
                { id: 'push-a', label: 'Push Site', role: 'Retaker A', timingWindowSeconds: 5, points: 25 },
                { id: 'push-b', label: 'Crossfire Entry', role: 'Retaker B', timingWindowSeconds: 5, points: 25 },
              ],
            },
          ],
        },
        {
          id: 'defuse',
          name: 'Defuse',
          objective: 'Secure site and defuse.',
          durationSeconds: 15,
          events: [
            {
              id: 'secure-defuse',
              name: 'Defuse Sequence',
              description: 'One defuses, one covers',
              triggerType: 'phase_start',
              actions: [
                { id: 'defuse', label: 'Defuse', role: 'Retaker A', timingWindowSeconds: 10, points: 30 },
                { id: 'cover-defuse', label: 'Cover Defuse', role: 'Retaker B', timingWindowSeconds: 10, points: 20 },
              ],
            },
          ],
        },
      ],
      scoringRules: [
        { id: 'timing', dimension: 'timing', description: 'Retake timing precision', weight: 0.4, passThreshold: 55 },
        { id: 'coordination', dimension: 'coordination', description: 'Synchronized entries', weight: 0.35, passThreshold: 40 },
        { id: 'stability', dimension: 'stability', description: 'Consistent execution', weight: 0.25, passThreshold: 40 },
      ],
      passThreshold: 50,
      allowedSignals: ['Hold', 'Reset', 'Again', 'Clean', 'Pause'],
    },
  },
  {
    id: 'tpl-objective-push',
    name: 'Objective Push',
    description: 'Coordinated objective push with role-specific timing windows.',
    game: 'Marvel Rivals',
    tier: 'Intermediate',
    patternTags: ['engage-timing', 'role-synergy', 'objective-focus'],
    squadSize: 3,
    roles: [
      { name: 'Tank', description: 'Initiates the push' },
      { name: 'DPS', description: 'Follow-up damage' },
      { name: 'Support', description: 'Sustain and peel' },
    ],
    estimatedMinutes: 5,
    script: {
      metadata: { version: '1.0', description: 'Objective push timing drill' },
      initialState: { objective: 'payload', distance: 100 },
      phases: [
        {
          id: 'setup',
          name: 'Approach',
          objective: 'Group up and confirm engagement plan.',
          durationSeconds: 15,
          events: [
            {
              id: 'group-up',
              name: 'Group Up',
              description: 'All roles confirm readiness',
              triggerType: 'phase_start',
              actions: [
                { id: 'confirm', label: 'Confirm Ready', role: 'all', timingWindowSeconds: 10, points: 10 },
              ],
            },
          ],
        },
        {
          id: 'engage',
          name: 'Engage',
          objective: 'Tank initiates, DPS follows, Support sustains.',
          durationSeconds: 20,
          events: [
            {
              id: 'initiate',
              name: 'Tank Initiation',
              description: 'Tank engages first',
              triggerType: 'phase_start',
              actions: [
                { id: 'tank-engage', label: 'Initiate', role: 'Tank', timingWindowSeconds: 5, points: 25 },
              ],
            },
            {
              id: 'follow-up',
              name: 'DPS Follow-Up',
              description: 'DPS engages after tank',
              triggerType: 'timed',
              triggerDelaySeconds: 3,
              actions: [
                { id: 'dps-follow', label: 'Follow Up', role: 'DPS', timingWindowSeconds: 5, points: 25 },
                { id: 'support-sustain', label: 'Sustain', role: 'Support', timingWindowSeconds: 8, points: 20 },
              ],
            },
          ],
        },
        {
          id: 'commit',
          name: 'Push',
          objective: 'Push the objective forward.',
          durationSeconds: 20,
          events: [
            {
              id: 'push-obj',
              name: 'Push Objective',
              description: 'All roles push together',
              triggerType: 'phase_start',
              actions: [
                { id: 'push', label: 'Push Objective', role: 'all', timingWindowSeconds: 10, points: 20 },
              ],
            },
          ],
        },
        {
          id: 'reset',
          name: 'Disengage',
          objective: 'Disengage cleanly if needed.',
          durationSeconds: 10,
          events: [
            {
              id: 'disengage',
              name: 'Clean Disengage',
              description: 'Reset positions',
              triggerType: 'phase_start',
              actions: [
                { id: 'disengage-action', label: 'Disengage', role: 'all', timingWindowSeconds: 8, points: 15 },
              ],
            },
          ],
        },
      ],
      scoringRules: [
        { id: 'timing', dimension: 'timing', description: 'Engage timing precision', weight: 0.3, passThreshold: 50 },
        { id: 'decision', dimension: 'decision', description: 'Role-appropriate actions', weight: 0.3, passThreshold: 50 },
        { id: 'coordination', dimension: 'coordination', description: 'Squad coordination', weight: 0.25, passThreshold: 35 },
        { id: 'stability', dimension: 'stability', description: 'Consistency', weight: 0.15, passThreshold: 40 },
      ],
      passThreshold: 50,
      allowedSignals: ['Hold', 'Reset', 'Again', 'Clean', 'Pause'],
    },
  },
];
