import { useState, useCallback } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQA } from '@/contexts/QAContext';

interface CheckItem {
  id: string;
  label: string;
  category: string;
}

const CHECKS: CheckItem[] = [
  { id: 'nav-all', label: 'Navigation works across all pages', category: 'Navigation' },
  { id: 'empty-states', label: 'Empty states present on all major pages', category: 'States' },
  { id: 'error-boundary', label: 'Error boundary catches and displays errors', category: 'States' },
  { id: 'responsive', label: 'Responsive preview works (Desktop/Tablet/Mobile)', category: 'Layout' },
  { id: 'nav-mobile', label: 'Nav collapses on mobile into horizontal scroll', category: 'Layout' },
  { id: 'cta-visible', label: 'CTAs remain visible on all viewports', category: 'Layout' },
  { id: 'plan-gating', label: 'Plan gating works and updates instantly', category: 'Gating' },
  { id: 'lock-icons', label: 'Locked features show lock icon + tooltip', category: 'Gating' },
  { id: 'upgrade-route', label: 'Clicking locked feature routes to Pricing', category: 'Gating' },
  { id: 'share-export', label: 'Share card export works and downloads correctly', category: 'Sharing' },
  { id: 'share-1080', label: 'Downloaded image is 1080x1920', category: 'Sharing' },
  { id: 'share-all-pages', label: 'Share card works from Results, GroupStats, PerfLab, Dashboard', category: 'Sharing' },
  { id: 'images-no-cls', label: 'Images reserve height/width (no layout shift)', category: 'Performance' },
];

export default function QAChecklist() {
  const { addQAError } = useQA();
  const [results, setResults] = useState<Record<string, 'pass' | 'fail' | null>>(() => {
    try {
      const saved = localStorage.getItem('sn-qa-checklist');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const toggle = useCallback((id: string, value: 'pass' | 'fail') => {
    setResults(prev => {
      const next = { ...prev, [id]: prev[id] === value ? null : value };
      localStorage.setItem('sn-qa-checklist', JSON.stringify(next));
      return next;
    });
  }, []);

  const triggerTestError = () => {
    try {
      throw new Error('QA Test Error: This is a deliberate test error triggered from the QA Checklist.');
    } catch (e: any) {
      addQAError(e.message, 'error');
    }
  };

  const categories = [...new Set(CHECKS.map(c => c.category))];
  const passCount = Object.values(results).filter(v => v === 'pass').length;
  const failCount = Object.values(results).filter(v => v === 'fail').length;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">QA Checklist</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Validation Checklist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pass/fail toggles for all acceptance criteria. Prototype-only — no backend persistence.
        </p>
      </div>

      {/* Summary */}
      <div className="flex gap-3">
        <div className="px-4 py-2 rounded-lg bg-success/10 border border-success/20 text-sm">
          <span className="font-display font-bold text-success">{passCount}</span>
          <span className="text-muted-foreground ml-1">passed</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
          <span className="font-display font-bold text-destructive">{failCount}</span>
          <span className="text-muted-foreground ml-1">failed</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-secondary border border-border text-sm">
          <span className="font-display font-bold text-foreground">{CHECKS.length - passCount - failCount}</span>
          <span className="text-muted-foreground ml-1">untested</span>
        </div>
      </div>

      {/* Checks by category */}
      {categories.map(cat => (
        <div key={cat}>
          <h2 className="font-display text-sm font-semibold text-foreground mb-2">{cat}</h2>
          <div className="space-y-1">
            {CHECKS.filter(c => c.category === cat).map(check => (
              <div key={check.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                <button
                  onClick={() => toggle(check.id, 'pass')}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                    results[check.id] === 'pass'
                      ? 'bg-success text-success-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-success/20'
                  }`}
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggle(check.id, 'fail')}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                    results[check.id] === 'fail'
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-destructive/20'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="text-sm text-foreground">{check.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Trigger Test Error */}
      <div className="p-4 rounded-lg bg-secondary border border-border">
        <p className="text-sm text-foreground font-medium mb-2">Trigger Test Error</p>
        <p className="text-xs text-muted-foreground mb-3">
          Click below to trigger a test error. Check the QA Panel to confirm it appears.
        </p>
        <Button size="sm" variant="destructive" onClick={triggerTestError} className="gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" />
          Trigger test error
        </Button>
      </div>
    </div>
  );
}
