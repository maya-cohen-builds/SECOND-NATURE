import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export type PlanTier = 'free' | 'pro' | 'team';

interface NavAction {
  timestamp: number;
  from: string;
  to: string;
}

interface QAError {
  timestamp: number;
  message: string;
  type: 'error' | 'warning';
}

interface PerfMetrics {
  initialRenderMs: number | null;
  lastRouteChangeMs: number | null;
}

interface QAContextType {
  qaMode: boolean;
  toggleQAMode: () => void;
  planTier: PlanTier;
  setPlanTier: (tier: PlanTier) => void;
  navHistory: NavAction[];
  qaErrors: QAError[];
  addQAError: (message: string, type: 'error' | 'warning') => void;
  clearErrors: () => void;
  perfMetrics: PerfMetrics;
  setPerfMetrics: React.Dispatch<React.SetStateAction<PerfMetrics>>;
}

const QAContext = createContext<QAContextType>({
  qaMode: false,
  toggleQAMode: () => {},
  planTier: 'free',
  setPlanTier: () => {},
  navHistory: [],
  qaErrors: [],
  addQAError: () => {},
  clearErrors: () => {},
  perfMetrics: { initialRenderMs: null, lastRouteChangeMs: null },
  setPerfMetrics: () => {},
});

export function QAProvider({ children }: { children: ReactNode }) {
  const [qaMode, setQaMode] = useState(() => localStorage.getItem('sn-qa-mode') === 'true');
  const [planTier, setPlanTierState] = useState<PlanTier>(() => {
    return (localStorage.getItem('sn-plan-tier') as PlanTier) || 'free';
  });
  const [navHistory, setNavHistory] = useState<NavAction[]>([]);
  const [qaErrors, setQaErrors] = useState<QAError[]>([]);
  const [perfMetrics, setPerfMetrics] = useState<PerfMetrics>({
    initialRenderMs: null,
    lastRouteChangeMs: null,
  });
  const location = useLocation();
  const prevPathRef = React.useRef(location.pathname);

  useEffect(() => {
    localStorage.setItem('sn-qa-mode', String(qaMode));
  }, [qaMode]);

  useEffect(() => {
    localStorage.setItem('sn-plan-tier', planTier);
  }, [planTier]);

  // Track navigation
  useEffect(() => {
    const routeStart = performance.now();
    if (prevPathRef.current !== location.pathname) {
      setNavHistory(prev => [
        { timestamp: Date.now(), from: prevPathRef.current, to: location.pathname },
        ...prev,
      ].slice(0, 10));
      prevPathRef.current = location.pathname;
    }
    // Measure route change time
    requestAnimationFrame(() => {
      const elapsed = Math.round(performance.now() - routeStart);
      setPerfMetrics(prev => ({ ...prev, lastRouteChangeMs: elapsed }));
    });
  }, [location.pathname]);

  // Measure initial render
  useEffect(() => {
    const start = performance.timeOrigin;
    requestAnimationFrame(() => {
      setPerfMetrics(prev => ({ ...prev, initialRenderMs: Math.round(performance.now()) }));
    });
  }, []);

  // Global error listener
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      setQaErrors(prev => [
        { timestamp: Date.now(), message: e.message, type: 'error' as const },
        ...prev,
      ].slice(0, 10));
    };
    const handleUnhandled = (e: PromiseRejectionEvent) => {
      setQaErrors(prev => [
        { timestamp: Date.now(), message: String(e.reason), type: 'error' as const },
        ...prev,
      ].slice(0, 10));
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandled);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandled);
    };
  }, []);

  const toggleQAMode = useCallback(() => setQaMode(prev => !prev), []);
  const setPlanTier = useCallback((tier: PlanTier) => setPlanTierState(tier), []);
  const addQAError = useCallback((message: string, type: 'error' | 'warning') => {
    setQaErrors(prev => [{ timestamp: Date.now(), message, type }, ...prev].slice(0, 10));
  }, []);
  const clearErrors = useCallback(() => setQaErrors([]), []);

  return (
    <QAContext.Provider value={{ qaMode, toggleQAMode, planTier, setPlanTier, navHistory, qaErrors, addQAError, clearErrors, perfMetrics, setPerfMetrics }}>
      {children}
    </QAContext.Provider>
  );
}

export function useQA() {
  return useContext(QAContext);
}

// Plan gating helpers
export function canAccess(feature: string, tier: PlanTier): boolean {
  const FREE_FEATURES = ['basic-drills', 'basic-results', 'basic-dashboard'];
  const PRO_FEATURES = [...FREE_FEATURES, 'advanced-insights', 'deep-results', 'share-export'];
  const TEAM_FEATURES = [...PRO_FEATURES, 'squad-comparisons', 'group-coordination', 'team-recommendations'];

  switch (tier) {
    case 'team': return TEAM_FEATURES.includes(feature);
    case 'pro': return PRO_FEATURES.includes(feature);
    default: return FREE_FEATURES.includes(feature);
  }
}

export function requiredTier(feature: string): PlanTier {
  const PRO_ONLY = ['advanced-insights', 'deep-results', 'share-export'];
  const TEAM_ONLY = ['squad-comparisons', 'group-coordination', 'team-recommendations'];
  if (TEAM_ONLY.includes(feature)) return 'team';
  if (PRO_ONLY.includes(feature)) return 'pro';
  return 'free';
}
