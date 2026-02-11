import { useNavigate } from 'react-router-dom';
import { SimulationResult } from '@/data/types';
import { RatingBadge, BadgePill } from '@/components/BadgePill';
import { getPlayerProfile, savePlayerProfile } from '@/data/gameData';
import { useEffect, useState } from 'react';
import { Lock, Target, Brain, Shield, Users, ChevronRight, Zap, TrendingUp, Award, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MILESTONES = [
  { drills: 1, label: 'Basic stats unlock', icon: Target },
  { drills: 3, label: 'First personalized insight', icon: Brain },
  { drills: 5, label: 'Trend analysis', icon: TrendingUp },
  { drills: 10, label: 'Advanced recommendations', icon: Award },
];

const LOCKED_STATS = [
  { label: 'Execution Consistency', icon: Target },
  { label: 'Objective Timing', icon: Zap },
  { label: 'Role Discipline', icon: Shield },
  { label: 'Coordination Confidence', icon: Users },
];

const PREVIEW_INSIGHTS = [
  'You tend to overcommit during objective transitions.',
  'Your role coverage improves when drills are run twice per week.',
  'Coordination breakdowns often happen under time pressure.',
];

const COACH_PROMPTS = [
  { label: 'Recommended next drill', desc: 'Personalized drill selection based on your weakest metric.' },
  { label: 'What to focus on this week', desc: 'Weekly priorities derived from recent performance trends.' },
  { label: 'Common mistakes at your level', desc: 'Pattern analysis of frequent errors at your skill tier.' },
];

function LockedPreviewDashboard() {
  const navigate = useNavigate();
  const profile = getPlayerProfile();
  const completedDrills = profile.completedScenarios;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Performance Dashboard</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Results</h1>
        <p className="text-sm text-muted-foreground mt-1">Your performance dashboard builds as you train.</p>
      </div>

      {/* Progress Meter */}
      <div className="p-5 rounded-lg bg-gradient-card border border-border">
        <h2 className="font-display text-sm font-semibold text-foreground mb-4">Progression Milestones</h2>
        <div className="space-y-3">
          {MILESTONES.map((m, i) => {
            const unlocked = completedDrills >= m.drills;
            return (
              <div key={m.drills} className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${unlocked ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                  {unlocked ? <m.icon className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>{m.label}</p>
                </div>
                <span className={`text-xs font-display font-semibold shrink-0 ${unlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                  {m.drills} {m.drills === 1 ? 'drill' : 'drills'}
                </span>
              </div>
            );
          })}
        </div>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{completedDrills} / 10 drills completed</span>
            <span>{Math.min(100, Math.round((completedDrills / 10) * 100))}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (completedDrills / 10) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* A. Locked Performance Overview */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Performance Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LOCKED_STATS.map(s => (
            <div key={s.label} className="p-4 rounded-lg bg-card border border-border text-center relative">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-muted-foreground/50" />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-muted-foreground/30 select-none">--%</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Lock className="h-3 w-3 text-muted-foreground/50" />
                <span className="text-[10px] text-muted-foreground/60">Unlock after your first drill</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* B. Personalized Insights Preview */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-1">Personalized Insights</h2>
        <p className="text-xs text-muted-foreground mb-3">Personalized insights unlock as you train.</p>
        <div className="space-y-2">
          {PREVIEW_INSIGHTS.map((text, i) => (
            <div key={i} className="p-4 rounded-lg bg-card border border-border flex items-start gap-3 opacity-60">
              <Brain className="h-4 w-4 text-muted-foreground/50 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground italic">"{text}"</p>
              </div>
              <Lock className="h-3.5 w-3.5 text-muted-foreground/40 ml-auto shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      </div>

      {/* C. Coach Tips & Recommendations */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-1">Coach Recommendations</h2>
        <p className="text-xs text-muted-foreground mb-3">Run drills to unlock coach recommendations.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {COACH_PROMPTS.map(c => (
            <div key={c.label} className="p-4 rounded-lg bg-card border border-border opacity-60">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground/50" />
                <Lock className="h-3 w-3 text-muted-foreground/40" />
              </div>
              <p className="font-display text-sm font-semibold text-muted-foreground">{c.label}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Token System Preview */}
      <div className="p-5 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-semibold text-foreground mb-1">Training Tokens</h3>
            <p className="text-sm text-muted-foreground mb-3">Earn tokens by completing drills and training consistently. Spend them to unlock deeper insights, advanced breakdowns, and early coach analysis.</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground mb-1">Earn by</p>
                <p>Completing drills</p>
                <p>Training consistently</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Spend on</p>
                <p>Deeper insights</p>
                <p>Advanced breakdowns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-4">
        <Button onClick={() => navigate('/training-hub')} size="lg" className="gap-2 font-display font-semibold">
          Run Your First Drill
          <ChevronRight className="h-4 w-4" />
        </Button>
        <p className="text-xs text-muted-foreground mt-3">Your performance dashboard builds as you train.</p>
      </div>
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('stg-last-result');
    if (stored) {
      const r = JSON.parse(stored) as SimulationResult;
      setResult(r);
      const profile = getPlayerProfile();
      profile.completedScenarios += 1;
      profile.confidence = Math.min(100, profile.confidence + r.confidenceGain);
      profile.mastery = Math.min(100, profile.mastery + r.masteryGain);
      r.badges.forEach(b => {
        if (!profile.badgesEarned.includes(b.id)) profile.badgesEarned.push(b.id);
      });
      savePlayerProfile(profile);
    }
  }, []);

  if (!result) {
    return <LockedPreviewDashboard />;
  }

  const profile = getPlayerProfile();

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-xs uppercase tracking-widest text-primary font-semibold">Post-Drill Report</p>
      <h1 className="font-display text-2xl font-bold text-foreground">Performance Summary</h1>

      {/* Rating */}
      <div className="p-6 rounded-lg bg-gradient-card border border-border text-center">
        <p className="text-sm text-muted-foreground mb-3">{result.scenarioName} · {result.difficulty} · Squad of {result.squadSize}</p>
        <div className="flex justify-center mb-4">
          <RatingBadge rating={result.rating} size="lg" />
        </div>
        <p className="font-display text-lg font-semibold text-foreground">
          {result.rating === 'S' ? 'Outstanding Execution' : result.rating === 'A' ? 'Strong Performance' : result.rating === 'B' ? 'Solid Run' : 'Room to Improve'}
        </p>
      </div>

      {/* Badges */}
      {result.badges.length > 0 && (
        <div className="p-5 rounded-lg bg-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-3">Skill Badges Earned</h3>
          <div className="flex flex-wrap gap-2">
            {result.badges.map(b => (
              <BadgePill key={b.id} badge={b} />
            ))}
          </div>
        </div>
      )}

      {/* Progression */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">Confidence</p>
          <div className="flex items-end gap-2">
            <span className="font-display text-2xl font-bold text-foreground">{profile.confidence}%</span>
            <span className="text-xs text-success font-medium mb-1">+{result.confidenceGain}</span>
          </div>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${profile.confidence}%` }} />
          </div>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">Mastery</p>
          <div className="flex items-end gap-2">
            <span className="font-display text-2xl font-bold text-foreground">{profile.mastery}%</span>
            <span className="text-xs text-success font-medium mb-1">+{result.masteryGain}</span>
          </div>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${profile.mastery}%` }} />
          </div>
        </div>
      </div>

      {/* Takeaway */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <h3 className="font-display font-semibold text-primary mb-2">Key Takeaway</h3>
        <p className="text-sm text-foreground">{result.liveGameImpact}</p>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate('/training-hub')} className="font-display font-semibold">
          Run Another Drill
        </Button>
        <Button variant="secondary" onClick={() => navigate('/tools')} className="font-display font-semibold">
          Training Tools
        </Button>
        <Button variant="secondary" onClick={() => navigate('/performance')} className="font-display font-semibold">
          View Dashboard
        </Button>
      </div>
    </div>
  );
}