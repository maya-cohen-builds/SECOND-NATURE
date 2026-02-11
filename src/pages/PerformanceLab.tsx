import { useState, useEffect, lazy, Suspense } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Results = lazy(() => import('./Results'));
const GroupStats = lazy(() => import('./GroupStats'));
const Analytics = lazy(() => import('./Analytics'));
const Experiments = lazy(() => import('./Experiments'));

const STORAGE_KEY = 'sn-perflab-active-tab';

type TabId = 'diagnostics' | 'results' | 'group-stats' | 'dashboard' | null;

const TABS: { id: TabId; label: string; description: string }[] = [
  { id: 'diagnostics', label: 'Diagnostic Engine', description: 'Current limiting factor and prescribed training' },
  { id: 'results', label: 'Results', description: 'Immediate and recent performance outcomes' },
  { id: 'group-stats', label: 'Group Stats', description: 'Aggregated and comparative squad performance' },
  { id: 'dashboard', label: 'Dashboard', description: 'Long-term analytics and trend tracking' },
];

function getInitialTab(): TabId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'null') return null;
    if (saved && TABS.some((t) => t.id === saved)) return saved as TabId;
  } catch {}
  return 'diagnostics';
}

export default function PerformanceLab() {
  const [activeTab, setActiveTab] = useState<TabId>(getInitialTab);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(activeTab));
    } catch {}
  }, [activeTab]);

  const handleToggle = (id: TabId) => {
    setActiveTab((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Performance Lab</p>
        <h1 className="font-display text-2xl font-bold text-foreground">
          All performance insights in one place
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Diagnostics, results, squad data, and long-term trends — unified.
        </p>
      </div>

      {/* Subtabs */}
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <div key={tab.id} className="rounded-lg border border-border overflow-hidden">
            {/* Tab Header */}
            <button
              onClick={() => handleToggle(tab.id)}
              className={cn(
                'w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors',
                isActive
                  ? 'bg-primary/5 border-b border-primary/20'
                  : 'bg-card hover:bg-muted/50'
              )}
            >
              <div>
                <p
                  className={cn(
                    'font-display font-semibold text-sm',
                    isActive ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {tab.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{tab.description}</p>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform shrink-0 ml-4',
                  isActive && 'rotate-180 text-primary'
                )}
              />
            </button>

            {/* Tab Content — lazy loaded */}
            {isActive && (
              <div className="px-5 py-6 bg-background">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center py-12">
                      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                >
                  {tab.id === 'diagnostics' && <Experiments />}
                  {tab.id === 'results' && <Results />}
                  {tab.id === 'group-stats' && <GroupStats />}
                  {tab.id === 'dashboard' && <Analytics />}
                </Suspense>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
