import { TrackingEvent } from '@/data/types';

const STORAGE_KEY = 'stg-events';

export function trackEvent(type: string, data?: Record<string, unknown>): void {
  const events = getEvents();
  events.push({ type, data, timestamp: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function getEvents(): TrackingEvent[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return [];
}

export function getEventCounts(): Record<string, number> {
  const events = getEvents();
  const counts: Record<string, number> = {};
  events.forEach(e => {
    counts[e.type] = (counts[e.type] || 0) + 1;
  });
  return counts;
}

export function getFunnelData(): { step: string; count: number; label: string }[] {
  const counts = getEventCounts();
  const steps = [
    { step: 'enter_training_hub', label: 'Training Hub' },
    { step: 'start_scenario', label: 'Start Scenario' },
    { step: 'complete_scenario', label: 'Complete Scenario' },
    { step: 'view_shop', label: 'View Shop' },
    { step: 'purchase_upgrade', label: 'Purchase' },
  ];
  return steps.map(s => ({ ...s, count: counts[s.step] || 0 }));
}

export function clearEvents(): void {
  localStorage.removeItem(STORAGE_KEY);
}
