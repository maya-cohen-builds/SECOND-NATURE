export interface SquadMember {
  id: string;
  name: string;
  avatar?: string;
}

export interface FeedEvent {
  id: string;
  type: 'drill_complete' | 'squad_milestone' | 'milestone_unlocked' | 'confidence_update';
  member?: string;
  text: string;
  metric?: string;
  metricDelta?: string;
  drill?: string;
  game?: string;
  timestamp: number;
}

export interface ProofCard {
  id: string;
  member: string;
  title: string;
  metric: string;
  metricValue: string;
  drill: string;
  game: string;
  timestamp: number;
  signals: { ready: number; clean: number; needsWork: number };
}

export interface TimelineEntry {
  id: string;
  type: 'pattern_stabilized' | 'confidence_dip' | 'consistency_recovered' | 'rep' | 'milestone';
  text: string;
  timestamp: number;
  member?: string;
}

export type CoordinationSignal = 'Run this again' | 'This broke' | 'This felt clean' | 'Review timing';
export type LiveSignal = 'Hold' | 'Reset' | 'Again' | 'Clean' | 'Pause';

export const MOCK_MEMBERS: SquadMember[] = [
  { id: '1', name: 'You' },
  { id: '2', name: 'Marcus' },
  { id: '3', name: 'Juno' },
];

const now = Date.now();
const hour = 3600000;
const day = 86400000;

export const MOCK_FEED: FeedEvent[] = [
  {
    id: 'f1', type: 'drill_complete', member: 'Marcus',
    text: 'Marcus completed Site Execute Rep (Valorant)', metric: 'Consistency', metricDelta: '+6%',
    drill: 'Site Execute', game: 'Valorant', timestamp: now - hour * 2,
  },
  {
    id: 'f2', type: 'squad_milestone',
    text: 'Squad completed 3 reps this week', timestamp: now - hour * 5,
  },
  {
    id: 'f3', type: 'milestone_unlocked',
    text: 'New coordination milestone unlocked: Clean Retake Tier II', timestamp: now - day,
  },
  {
    id: 'f4', type: 'confidence_update',
    text: 'Confidence stabilized across 4 sessions', timestamp: now - day * 2,
  },
  {
    id: 'f5', type: 'drill_complete', member: 'Juno',
    text: 'Juno completed Phase Transition Rep (League of Legends)', metric: 'Execution', metricDelta: '+4%',
    drill: 'Phase Transition', game: 'LoL', timestamp: now - day * 2 - hour * 3,
  },
  {
    id: 'f6', type: 'drill_complete', member: 'You',
    text: 'You completed Role Adherence Rep (CS2)', metric: 'Role Discipline', metricDelta: '+8%',
    drill: 'Role Adherence', game: 'CS2', timestamp: now - day * 3,
  },
];

export const MOCK_PROOF_CARDS: ProofCard[] = [
  {
    id: 'p1', member: 'Marcus', title: 'Site Execute Mastery',
    metric: 'Consistency', metricValue: '82%', drill: 'Site Execute Rep', game: 'Valorant',
    timestamp: now - hour * 2, signals: { ready: 1, clean: 2, needsWork: 0 },
  },
  {
    id: 'p2', member: 'You', title: 'Role Adherence Streak',
    metric: 'Role Discipline', metricValue: '91%', drill: 'Role Adherence Rep', game: 'CS2',
    timestamp: now - day * 3, signals: { ready: 0, clean: 1, needsWork: 0 },
  },
  {
    id: 'p3', member: 'Juno', title: 'Phase Transition Unlocked',
    metric: 'Execution', metricValue: '74%', drill: 'Phase Transition Rep', game: 'LoL',
    timestamp: now - day * 2, signals: { ready: 1, clean: 0, needsWork: 1 },
  },
];

export const MOCK_TIMELINE: TimelineEntry[] = [
  { id: 't1', type: 'rep', text: 'Marcus — Site Execute Rep completed', member: 'Marcus', timestamp: now - hour * 2 },
  { id: 't2', type: 'milestone', text: 'Squad: 3 reps this week', timestamp: now - hour * 5 },
  { id: 't3', type: 'pattern_stabilized', text: 'Clean Retake pattern stabilized', timestamp: now - day },
  { id: 't4', type: 'confidence_dip', text: 'Confidence dip detected — Juno', member: 'Juno', timestamp: now - day - hour * 6 },
  { id: 't5', type: 'consistency_recovered', text: 'Consistency recovered after 2 sessions', timestamp: now - day * 2 },
  { id: 't6', type: 'rep', text: 'You — Role Adherence Rep completed', member: 'You', timestamp: now - day * 3 },
  { id: 't7', type: 'rep', text: 'Juno — Phase Transition Rep completed', member: 'Juno', timestamp: now - day * 2 - hour * 3 },
];
