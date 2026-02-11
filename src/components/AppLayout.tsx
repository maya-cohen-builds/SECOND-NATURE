import { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/overview', label: 'Overview', requiresAuth: false },
  { path: '/training-hub', label: 'Training Hub', requiresAuth: true },
  { path: '/modules', label: 'Modules', requiresAuth: true },
  { path: '/run', label: 'Run Drill', requiresAuth: true },
  { path: '/results', label: 'Results', requiresAuth: true },
  { path: '/stats', label: 'Stats', requiresAuth: true },
  { path: '/tools', label: 'Training Tools', requiresAuth: true },
  { path: '/pricing', label: 'Pricing', requiresAuth: false },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const visibleNav = NAV_ITEMS.filter(item => !item.requiresAuth || user);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

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
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary border border-border hover:border-primary/30 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-display font-bold text-[10px]">
                      {(profile?.display_name || user.email)?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-foreground max-w-[120px] truncate">
                    {profile?.display_name || user.email?.split('@')[0]}
                  </span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 p-2 rounded-lg bg-card border border-border shadow-lg z-50">
                    <p className="px-2 py-1 text-[10px] text-muted-foreground truncate">{user.email}</p>
                    <button
                      onClick={() => { navigate('/stats'); setShowUserMenu(false); }}
                      className="w-full text-left px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-secondary transition-all"
                    >
                      Your Stats
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-2 py-1.5 rounded-md text-xs text-destructive hover:bg-destructive/10 transition-all"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Side Nav */}
        <nav className="w-48 shrink-0 border-r border-border bg-card/40 hidden md:block">
          <div className="py-4 px-2 space-y-0.5">
            {visibleNav.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
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
            {visibleNav.map(item => (
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
        <main className="flex-1 overflow-auto bg-grid-motif">
          <div className="max-w-[1100px] mx-auto px-6 py-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
