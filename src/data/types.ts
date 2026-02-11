export type ScenarioCategory = 'base-defense' | 'coordinated-attack' | 'vehicle-mastery' | 'role-based';

export interface Scenario {
  id: string;
  category: ScenarioCategory;
  name: string;
  description: string;
  briefing: string;
  complexity: number; // 1-5
  recommendedSquadSize: number;
  tags: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'convenience' | 'insight' | 'coordination' | 'access';
  purchased?: boolean;
}

export interface PlayerProfile {
  level: number;
  confidence: number; // 0-100
  mastery: number; // 0-100
  completedScenarios: number;
  badgesEarned: string[];
  purchasedUpgrades: string[];
}

export interface SimulationResult {
  scenarioId: string;
  scenarioName: string;
  category: ScenarioCategory;
  rating: 'S' | 'A' | 'B' | 'C';
  badges: Badge[];
  confidenceGain: number;
  masteryGain: number;
  squadSize: number;
  difficulty: string;
  liveGameImpact: string;
  timestamp: number;
}

export interface TrackingEvent {
  type: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

export const CATEGORY_LABELS: Record<ScenarioCategory, string> = {
  'base-defense': 'Base Defense',
  'coordinated-attack': 'Coordinated Attack',
  'vehicle-mastery': 'Vehicle Mastery',
  'role-based': 'Role-Based Objectives',
};

export const CATEGORY_ICONS: Record<ScenarioCategory, string> = {
  'base-defense': 'BD',
  'coordinated-attack': 'CA',
  'vehicle-mastery': 'VM',
  'role-based': 'RB',
};
