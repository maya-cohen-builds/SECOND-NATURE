import { ReactNode, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDemo } from '@/contexts/DemoContext';
import { useQA } from '@/contexts/QAContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTwitch } from '@/contexts/TwitchContext';
import { cn } from '@/lib/utils';
import QAPanel from '@/components/QAPanel';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Bug, LogOut, User, Sun, Moon } from 'lucide-react';
import { useDisplayName } from '@/hooks/useDisplayName';
import TwitchConnectModal from '@/components/TwitchConnectModal';

const NAV_ITEMS = [
  { path: '/overview', label: 'Home', icon: '/' },
  { path: '/positioning', label: 'How We\'re Different', icon: '/' },
  { path: '/training-hub', label: 'Training Hub', icon: '/' },
  { path: '/modules', label: 'Modules', icon: '/' },
  { path: '/run', label: 'Drills', icon: '/' },
  { path: '/tools', label: 'Training Tools', icon: '/' },
  { path: '/performance-lab', label: 'Performance Lab', icon: '/' },
  { path: '/squad', label: 'Squad', icon: '/' },
  { path: '/pricing', label: 'Pricing', icon: '/' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { resetDemo } = useDemo();
  const { qaMode, toggleQAMode, addQAError } = useQA();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [qaPanelOpen, setQaPanelOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });
  const { displayName, avatarUrl } = useDisplayName();
  const { twitchConnected, twitchUsername, disconnect: disconnectTwitch } = useTwitch();
  const [twitchModalOpen, setTwitchModalOpen] = useState(false);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  // Apply theme on mount
  useState(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  });

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
            {user ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  {displayName}
                </button>
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
                <button
                  onClick={signOut}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5"
                >
                  <LogOut className="h-3 w-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:brightness-110 transition-all flex items-center gap-1.5"
              >
                Sign In
              </button>
            )}
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
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium border transition-all flex items-center gap-1.5",
                    "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {theme === 'dark' ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <span className="text-[10px] text-muted-foreground">Switch between dark and light themes</span>
              </div>

              {/* Twitch Integration */}
              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 text-[#9146FF]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                  </svg>
                  <span className="text-xs font-medium text-foreground">Twitch</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-semibold">Beta</span>
                </div>
                {twitchConnected ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Connected as <span className="text-foreground font-medium">{twitchUsername}</span></span>
                    <button
                      onClick={disconnectTwitch}
                      className="text-xs text-destructive hover:underline font-medium"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTwitchModalOpen(true)}
                      className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#9146FF]/10 border border-[#9146FF]/30 text-[#9146FF] hover:bg-[#9146FF]/20 transition-all"
                    >
                      Connect Twitch
                    </button>
                    <span className="text-[10px] text-muted-foreground">Stream sessions for performance review</span>
                  </div>
                )}
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
      <TwitchConnectModal open={twitchModalOpen} onClose={() => setTwitchModalOpen(false)} />
    </div>
  );
}
