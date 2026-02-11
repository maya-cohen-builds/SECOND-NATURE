import { Scenario, Badge, Upgrade, PlayerProfile } from './types';

export const SCENARIOS: Scenario[] = [
  // Base Defense
  { id: 'bd-1', category: 'base-defense', name: 'Perimeter Hold', description: 'Defend the outer perimeter against a sustained 3-wave assault.', briefing: 'Intel reports a coordinated attack on your forward outpost. Establish defensive positions along the perimeter and hold for three waves. Prioritize shield generator protection and resource node security.', complexity: 2, recommendedSquadSize: 3, tags: ['defensive', 'waves', 'positioning'], whyExists: 'Targets late-game perimeter collapse after wave 2.', expectedImprovements: ['Cleaner defensive rotations under sustained pressure', 'Fewer positional breakdowns during wave transitions'], feedsInto: 'Defensive Stability Rating' },
  { id: 'bd-2', category: 'base-defense', name: 'Core Shield Recovery', description: 'Protect repair crews while shield generators come back online.', briefing: 'Your core shields are offline. Engineers need 4 minutes to restore them. Hostile recon units are inbound. Deploy your squad to create overlapping fire zones around the engineering bay.', complexity: 3, recommendedSquadSize: 4, tags: ['protection', 'timing', 'resource-mgmt'], whyExists: 'Addresses fire-zone gaps during timed recovery windows.', expectedImprovements: ['More consistent coverage during repair phases', 'Reduced resource waste on redundant positioning'], feedsInto: 'Resource Discipline Metric' },
  { id: 'bd-3', category: 'base-defense', name: 'Siege Endurance', description: 'Survive a prolonged siege with limited resources and rotating attackers.', briefing: 'Your outpost is surrounded. Supply lines are cut. You must hold with current resources for 6 cycles. Manage ammunition, rotate defensive positions, and exploit attacker patterns to survive.', complexity: 4, recommendedSquadSize: 5, tags: ['endurance', 'resource-discipline', 'adaptation'], whyExists: 'Exposes resource mismanagement during extended engagements.', expectedImprovements: ['Sustained resource discipline across 6+ cycles', 'Faster pattern recognition in attacker rotations'], feedsInto: 'Resource Discipline Metric' },
  // Coordinated Attack
  { id: 'ca-1', category: 'coordinated-attack', name: 'Pincer Strike', description: 'Execute a synchronized two-pronged assault on a fortified position.', briefing: 'Target is a hardened command post with dual chokepoints. Split your squad into Alpha and Bravo teams. Alpha draws fire from the east approach while Bravo flanks through the canyon. Synchronize the final push.', complexity: 3, recommendedSquadSize: 4, tags: ['flanking', 'synchronization', 'tactical'], whyExists: 'Addresses execute breakdown during split-squad engagements.', expectedImprovements: ['Tighter synchronization windows on converging pushes', 'Reduced hesitation on commit calls'], feedsInto: 'Execute Consistency Index' },
  { id: 'ca-2', category: 'coordinated-attack', name: 'Supply Line Disruption', description: 'Intercept and disable enemy resupply convoys across three checkpoints.', briefing: 'Enemy convoys resupply the frontline every 90 seconds. Your squad must disable three separate checkpoints simultaneously. Timing is everything. If one convoy gets through, the mission fails.', complexity: 3, recommendedSquadSize: 3, tags: ['timing', 'coordination', 'precision'], whyExists: 'Reduces mis-timed cooldown usage during parallel objective windows.', expectedImprovements: ['More consistent cooldown timing across roles', 'Fewer missed intercept windows'], feedsInto: 'Group Coordination Score' },
  { id: 'ca-3', category: 'coordinated-attack', name: 'Command Node Takedown', description: 'Infiltrate and neutralize a heavily guarded strategic command node.', briefing: 'The enemy command node coordinates all regional operations. Your squad must breach outer defenses, disable comms arrays, and neutralize the node core. Each phase requires different squad configurations.', complexity: 5, recommendedSquadSize: 6, tags: ['multi-phase', 'role-switching', 'high-stakes'], whyExists: 'Trains phase-transition discipline across multi-stage operations.', expectedImprovements: ['Smoother role reconfiguration between phases', 'Reduced downtime during squad restructuring'], feedsInto: 'Execute Consistency Index' },
  // Vehicle Mastery
  { id: 'vm-1', category: 'vehicle-mastery', name: 'Recon Sweep', description: 'Navigate light vehicles through hostile terrain to scout enemy positions.', briefing: 'Deploy scout vehicles to map enemy positions across a 4-sector grid. Avoid detection, mark targets, and extract before patrols return. Speed and precision are paramount.', complexity: 2, recommendedSquadSize: 2, tags: ['scouting', 'speed', 'stealth'], whyExists: 'Targets detection-avoidance failures during intel-gathering runs.', expectedImprovements: ['Faster sector coverage with fewer detection events', 'Cleaner extraction timing'], feedsInto: 'Group Coordination Score' },
  { id: 'vm-2', category: 'vehicle-mastery', name: 'Armored Convoy Escort', description: 'Protect a slow-moving transport using assault and support vehicles.', briefing: 'A critical transport must reach the extraction zone through contested territory. Assign vehicles to forward recon, flanking protection, and rear guard. The transport cannot be replaced.', complexity: 3, recommendedSquadSize: 4, tags: ['escort', 'formation', 'vehicle-roles'], whyExists: 'Exposes formation discipline gaps during escort operations.', expectedImprovements: ['More consistent spacing in multi-vehicle formations', 'Faster threat response from flanking positions'], feedsInto: 'Defensive Stability Rating' },
  { id: 'vm-3', category: 'vehicle-mastery', name: 'Aerial Dominance', description: 'Establish air superiority and provide close support for ground operations.', briefing: 'Ground forces are pinned. Your flight wing must neutralize anti-air emplacements, establish air superiority, and provide precision close support. Fuel management is critical.', complexity: 4, recommendedSquadSize: 3, tags: ['air-combat', 'support', 'fuel-mgmt'], whyExists: 'Addresses fuel mismanagement and support timing in air operations.', expectedImprovements: ['Better fuel conservation across sorties', 'More precise close-support timing'], feedsInto: 'Resource Discipline Metric' },
  // Role-Based Objectives
  { id: 'rb-1', category: 'role-based', name: 'Mixed Arms Drill', description: 'Complete objectives that require offense, defense, and support roles working in concert.', briefing: 'Each squad member is assigned a specific role: assault, defense, support, or recon. Objectives require all roles to contribute. No single role can carry the mission.', complexity: 3, recommendedSquadSize: 4, tags: ['roles', 'teamwork', 'balance'], whyExists: 'Trains role handoff under resource pressure.', expectedImprovements: ['Cleaner role transitions during objective shifts', 'Reduced role overlap and coverage gaps'], feedsInto: 'Group Coordination Score' },
  { id: 'rb-2', category: 'role-based', name: 'Specialist Extraction', description: 'Coordinate specialist roles to extract a high-value target from deep territory.', briefing: 'A VIP is stranded behind enemy lines. Your team needs a pathfinder, a medic, a demolitions expert, and overwatch support. Each role has unique abilities critical to extraction success.', complexity: 4, recommendedSquadSize: 4, tags: ['specialist', 'extraction', 'role-clarity'], whyExists: 'Addresses execute breakdown during multi-role engagement.', expectedImprovements: ['More reliable specialist sequencing under pressure', 'Faster target stabilization in contested zones'], feedsInto: 'Execute Consistency Index' },
  { id: 'rb-3', category: 'role-based', name: 'Adaptive Operations', description: 'Roles shift mid-mission as conditions change. Adapt or fail.', briefing: 'This is a dynamic scenario. Roles are assigned at start but will shift as battlefield conditions evolve. Flexibility, communication, and rapid adaptation determine success.', complexity: 5, recommendedSquadSize: 5, tags: ['adaptive', 'dynamic', 'communication'], whyExists: 'Exposes rigidity in role assignment when conditions shift mid-engagement.', expectedImprovements: ['Faster role reassignment under changing conditions', 'Reduced communication breakdowns during transitions'], feedsInto: 'Group Coordination Score' },
];

export const BADGES: Badge[] = [
  { id: 'teamwork', name: 'Teamwork', icon: 'TW', description: 'Demonstrated effective squad coordination throughout the mission.' },
  { id: 'timing', name: 'Perfect Timing', icon: 'PT', description: 'Executed critical actions within optimal timing windows.' },
  { id: 'defense-efficiency', name: 'Defense Efficiency', icon: 'DE', description: 'Maintained defensive integrity with minimal resource expenditure.' },
  { id: 'resource-discipline', name: 'Resource Discipline', icon: 'RD', description: 'Managed limited resources without waste or shortfall.' },
  { id: 'vehicle-proficiency', name: 'Vehicle Proficiency', icon: 'VP', description: 'Operated vehicles with skill and tactical awareness.' },
  { id: 'role-clarity', name: 'Role Clarity', icon: 'RC', description: 'Performed assigned role with focus and effectiveness.' },
  { id: 'coordination', name: 'Coordination', icon: 'CO', description: 'Maintained squad coherence under pressure.' },
  { id: 'consistency', name: 'Consistency', icon: 'CS', description: 'Delivered reliable performance across all mission phases.' },
  { id: 'adaptation', name: 'Rapid Adaptation', icon: 'RA', description: 'Adjusted tactics quickly in response to changing conditions.' },
  { id: 'precision', name: 'Precision Strike', icon: 'PS', description: 'Achieved objectives with surgical accuracy.' },
];

export const UPGRADES: Upgrade[] = [
  { id: 'extra-sessions', name: 'Extended Training Pass', description: 'Unlock 5 additional daily training sessions beyond the free limit.', price: 299, category: 'convenience' },
  { id: 'advanced-sims', name: 'Advanced Simulations', description: 'Access high-complexity scenarios with multi-phase objectives.', price: 499, category: 'access' },
  { id: 'analytics-overlay', name: 'Performance Analytics', description: 'Real-time tactical overlay showing efficiency scores and improvement areas.', price: 399, category: 'insight' },
  { id: 'squad-expand', name: 'Squad Capacity +2', description: 'Expand max squad size from 4 to 6 for larger coordinated operations.', price: 349, category: 'coordination' },
  { id: 'tactical-mods', name: 'Tactical Modifiers', description: 'Apply custom conditions like fog-of-war, limited comms, or resource scarcity.', price: 449, category: 'access' },
  { id: 'replay-system', name: 'Mission Replay', description: 'Review completed scenarios with full tactical replay and annotations.', price: 299, category: 'insight' },
  { id: 'squad-comms', name: 'Enhanced Squad Comms', description: 'Priority coordination tools including waypoints, markers, and role assignments.', price: 249, category: 'coordination' },
  { id: 'early-access', name: 'Early Access Scenarios', description: 'Test unreleased scenarios and new mechanics before general availability.', price: 599, category: 'access' },
  { id: 'badge-tracker', name: 'Badge Progress Tracker', description: 'Detailed badge progress dashboard with milestones and completion predictions.', price: 199, category: 'insight' },
  { id: 'difficulty-tuner', name: 'Difficulty Fine-Tuning', description: 'Granular difficulty controls beyond Easy/Standard/Hard presets.', price: 349, category: 'convenience' },
];

export const DEFAULT_PLAYER: PlayerProfile = {
  level: 5,
  confidence: 42,
  mastery: 35,
  completedScenarios: 0,
  badgesEarned: [],
  purchasedUpgrades: [],
};

export function getPlayerProfile(): PlayerProfile {
  const stored = localStorage.getItem('stg-player');
  if (stored) return JSON.parse(stored);
  return { ...DEFAULT_PLAYER };
}

export function savePlayerProfile(profile: PlayerProfile): void {
  localStorage.setItem('stg-player', JSON.stringify(profile));
}
