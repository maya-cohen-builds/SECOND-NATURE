import { useEffect } from 'react';
import { trackEvent } from '@/lib/eventTracker';
import { getPlayerProfile } from '@/data/gameData';
import { getEventCounts } from '@/lib/eventTracker';

export default function Experiments() {
  useEffect(() => {
    trackEvent('view_metrics_page');
  }, []);

  const profile = getPlayerProfile();
  const counts = getEventCounts();

  const insights = [
    {
      label: 'Drills Completed',
      value: profile.completedScenarios,
      trend: profile.completedScenarios > 3 ? 'Consistent training habit' : 'Keep running drills to build consistency',
    },
    {
      label: 'Confidence Score',
      value: `${profile.confidence}%`,
      trend: profile.confidence > 60 ? 'Above average. Strong decision-making.' : 'Still building. More reps will help.',
    },
    {
      label: 'Mastery Score',
      value: `${profile.mastery}%`,
      trend: profile.mastery > 50 ? 'Solid mechanical foundation' : 'Focus on harder drills to push mastery',
    },
    {
      label: 'Badges Earned',
      value: profile.badgesEarned.length,
      trend: profile.badgesEarned.length > 5 ? 'Well-rounded skill set' : 'Try different drill types for more badges',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Performance Lab</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Identify. Improve. Repeat.</h1>
        <p className="text-sm text-muted-foreground mt-1">Your strengths, your weaknesses, your next focus area.</p>
      </div>

      {/* Player Stats */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {insights.map(i => (
          <div key={i.label} className="p-4 rounded-lg bg-gradient-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">{i.label}</p>
            <p className="font-display text-2xl font-bold text-primary">{i.value}</p>
            <p className="text-xs text-muted-foreground mt-2">{i.trend}</p>
          </div>
        ))}
      </div>

      {/* Focus Areas */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Recommended Focus</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { area: 'Coordination Efficiency', desc: 'How well your squad executes synchronized actions. Improve by running coordinated attack drills with full squads.' },
            { area: 'Role Execution Stability', desc: 'Consistency of role performance across sessions. Try role-based drills to build reliability under pressure.' },
            { area: 'Decision Speed', desc: 'Time from situation recognition to correct action. Practice harder difficulty levels to sharpen reactions.' },
            { area: 'Squad Consistency', desc: 'Performance variance between squad members. Run mixed-arms drills to balance team skill distribution.' },
          ].map(f => (
            <div key={f.area} className="p-4 rounded-lg bg-card border border-border">
              <h3 className="font-display font-semibold text-foreground text-sm mb-1">{f.area}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Squad Readiness */}
      <div className="p-5 rounded-lg bg-primary/5 border border-primary/20">
        <h3 className="font-display font-semibold text-foreground mb-2">Squad Readiness Assessment</h3>
        <p className="text-sm text-muted-foreground mb-3">Based on your recent training data:</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-display text-xl font-bold text-primary">{Math.min(100, profile.confidence + profile.mastery)}%</p>
            <p className="text-xs text-muted-foreground">Overall Readiness</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-foreground">{counts['start_scenario'] || 0}</p>
            <p className="text-xs text-muted-foreground">Sessions Logged</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-foreground">{counts['complete_scenario'] || 0}</p>
            <p className="text-xs text-muted-foreground">Sessions Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
