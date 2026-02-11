import { Badge, SimulationResult, ScenarioCategory } from '@/data/types';
import { BADGES, SCENARIOS } from '@/data/gameData';

interface SimInput {
  scenarioId: string;
  squadSize: number;
  difficulty: 'Easy' | 'Standard' | 'Hard';
  playerLevel: number;
}

export function runSimulation(input: SimInput): SimulationResult {
  const scenario = SCENARIOS.find(s => s.id === input.scenarioId)!;
  
  // Calculate performance score based on inputs
  const levelFactor = input.playerLevel / 6;
  const squadFactor = Math.min(input.squadSize / scenario.recommendedSquadSize, 1.2);
  const difficultyPenalty = input.difficulty === 'Easy' ? 0 : input.difficulty === 'Standard' ? 0.15 : 0.35;
  const complexityPenalty = scenario.complexity * 0.05;
  
  let score = (levelFactor * 0.4 + squadFactor * 0.3 + Math.random() * 0.3) - difficultyPenalty - complexityPenalty;
  score = Math.max(0.1, Math.min(1, score));

  // Determine rating
  let rating: 'S' | 'A' | 'B' | 'C';
  if (score >= 0.85) rating = 'S';
  else if (score >= 0.65) rating = 'A';
  else if (score >= 0.45) rating = 'B';
  else rating = 'C';

  // Award badges based on scenario tags and performance
  const badgeCount = rating === 'S' ? 3 : rating === 'A' ? 2 : rating === 'B' ? 1 : 0;
  const relevantBadges = getRelevantBadges(scenario.category, scenario.tags);
  const earned = relevantBadges.slice(0, badgeCount);

  // Calculate progression gains (not raw stats)
  const confidenceGain = Math.round(score * 12 * (input.difficulty === 'Hard' ? 1.5 : input.difficulty === 'Standard' ? 1.2 : 1));
  const masteryGain = Math.round(score * 8 * (1 + scenario.complexity * 0.1));

  const impacts = generateImpact(scenario.category, rating, input.squadSize);

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    category: scenario.category,
    rating,
    badges: earned,
    confidenceGain,
    masteryGain,
    squadSize: input.squadSize,
    difficulty: input.difficulty,
    liveGameImpact: impacts,
    timestamp: Date.now(),
  };
}

function getRelevantBadges(category: ScenarioCategory, tags: string[]): Badge[] {
  const priorityMap: Record<string, string[]> = {
    'base-defense': ['defense-efficiency', 'resource-discipline', 'consistency', 'teamwork'],
    'coordinated-attack': ['timing', 'coordination', 'precision', 'teamwork'],
    'vehicle-mastery': ['vehicle-proficiency', 'adaptation', 'precision', 'consistency'],
    'role-based': ['role-clarity', 'teamwork', 'coordination', 'adaptation'],
  };
  const priorityIds = priorityMap[category] || [];
  return priorityIds.map(id => BADGES.find(b => b.id === id)!).filter(Boolean);
}

function generateImpact(category: ScenarioCategory, rating: string, squadSize: number): string {
  const impacts: Record<string, string[]> = {
    'base-defense': [
      'Improved defensive positioning awareness translates to 8-12% fewer base breaches in live matches.',
      'Shield management patterns practiced here reduce repair costs by an estimated 15% in sustained engagements.',
      'Wave defense timing transfers directly to live siege scenarios, improving survival rates.',
    ],
    'coordinated-attack': [
      'Flanking coordination practiced here improves live squad attack success rate by 10-18%.',
      'Supply line disruption timing translates to better resource denial in competitive play.',
      'Multi-phase assault patterns build adaptability that reduces wasted offensive actions.',
    ],
    'vehicle-mastery': [
      'Vehicle handling skills reduce operational losses by 12-20% in live vehicle engagements.',
      'Escort formation discipline improves convoy survival rates in contested zones.',
      'Air-ground coordination patterns enhance combined arms effectiveness.',
    ],
    'role-based': [
      'Role clarity improvements reduce friendly-fire incidents and mission objective confusion by 15%.',
      'Specialist coordination skills transfer to any squad configuration in live play.',
      'Adaptive role-switching builds tactical flexibility that improves under-pressure performance.',
    ],
  };
  const categoryImpacts = impacts[category] || impacts['base-defense'];
  return categoryImpacts[Math.floor(Math.random() * categoryImpacts.length)];
}

export function getDemoResult(): SimulationResult {
  return {
    scenarioId: 'ca-1',
    scenarioName: 'Harren Canyon',
    category: 'coordinated-attack',
    rating: 'S',
    badges: [BADGES[1], BADGES[6], BADGES[9]],
    confidenceGain: 15,
    masteryGain: 10,
    squadSize: 4,
    difficulty: 'Standard',
    liveGameImpact: 'Flanking coordination practiced here improves live squad attack success rate by 10-18%.',
    timestamp: Date.now(),
  };
}
