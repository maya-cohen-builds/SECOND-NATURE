import { ReactNode, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDemo } from '@/contexts/DemoContext';
import { useQA } from '@/contexts/QAContext';
import { cn } from '@/lib/utils';
import QAPanel from '@/components/QAPanel';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Bug } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/overview', label: 'Home', icon: '/' },
  { path: '/positioning', label: 'How We\'re Different', icon: '/' },
  { path: '/training-hub', label: 'Training Hub', icon: '/' },
  { path: '/modules', label: 'Modules', icon: '/' },
  { path: '/run', label: 'Drills', icon: '/' },
  { path: '/tools', label: 'Training Tools', icon: '/' },
  { path: '/performance-lab', label: 'Performance Lab', icon: '/' },
  { path: '/pricing', label: 'Pricing', icon: '/' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { resetDemo } = useDemo();
  const { qaMode, toggleQAMode, addQAError } = useQA();
  const [showSettings, setShowSettings] = useState(false);
  const [qaPanelOpen, setQaPanelOpen] = useState(false);

  const allNavItems = qaMode
    ? [...NAV_ITEMS, { path: '/qa-checklist', label: 'QA Checklist', icon: '/' }]
    : NAV_ITEMS;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-primary font-display font-bold text-sm">SN</span>
            </div>
            <div>
              <h1 className="font-display text-base font-bold tracking-wider text-foreground leading-tight">
                Second Nature
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-wide">Cross-Game Coordination System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {qaMode && (
              <button
                onClick={() => setQaPanelOpen(!qaPanelOpen)}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all flex items-center gap-1.5"
              >
                <Bug className="h-3 w-3" />
                QA Panel
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all"
            >
              Settings
            </button>
            <button
              onClick={resetDemo}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-secondary border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-all"
            >
              Reset Data
            </button>
          </div>
        </div>
        {showSettings && (
          <div className="max-w-[1400px] mx-auto px-4 pb-3">
            <div className="p-3 rounded-lg bg-secondary border border-border space-y-3">
              <p className="text-[11px] text-muted-foreground">
                Independent training platform. Not affiliated with any game publisher.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleQAMode}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium border transition-all flex items-center gap-1.5",
                    qaMode
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Bug className="h-3 w-3" />
                  QA Mode: {qaMode ? 'ON' : 'OFF'}
                </button>
                <span className="text-[10px] text-muted-foreground">Toggle QA panel, plan simulator, and checklist</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 flex">
        {/* Side Nav */}
        <nav className="w-48 shrink-0 border-r border-border bg-card/40 hidden md:block">
          <div className="py-4 px-2 space-y-0.5">
            {allNavItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                  item.path === '/qa-checklist' && "text-primary/70"
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden overflow-x-auto border-b border-border bg-card/40">
          <div className="flex px-2 py-2 gap-1">
            {allNavItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1100px] mx-auto px-6 py-8 animate-fade-in">
            <ErrorBoundary onError={(msg) => addQAError(msg, 'error')}>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* QA Panel Drawer */}
      {qaMode && <QAPanel open={qaPanelOpen} onClose={() => setQaPanelOpen(false)} />}
    </div>
  );
}
