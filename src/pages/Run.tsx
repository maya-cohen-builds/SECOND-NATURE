import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SCENARIOS } from '@/data/gameData';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/data/types';
import { runSimulation } from '@/lib/simulation';
import { trackEvent } from '@/lib/eventTracker';
import { useTwitch } from '@/contexts/TwitchContext';
import { toast } from '@/hooks/use-toast';

export default function Run() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    twitchConnected, isStreaming, setIsStreaming,
    streamTitle, setStreamTitle, sessionStreamed,
    markSessionStreamed, resetSessionStreamed,
  } = useTwitch();

  const scenarioId = searchParams.get('scenario') || 'bd-1';
  const playerLevel = parseInt(searchParams.get('level') || '5');
  const scenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];

  const [squadSize, setSquadSize] = useState(scenario.recommendedSquadSize);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Standard' | 'Hard'>('Standard');
  const [running, setRunning] = useState(false);
  const [streamToggle, setStreamToggle] = useState(false);

  // Set default stream title when toggle is enabled
  const handleStreamToggle = (enabled: boolean) => {
    setStreamToggle(enabled);
    if (enabled && !streamTitle) {
      setStreamTitle(`Training coordination in Second Nature – ${CATEGORY_LABELS[scenario.category]}`);
    }
  };

  const handleRun = () => {
    setRunning(true);
    if (streamToggle) setIsStreaming(true);
    resetSessionStreamed();

    trackEvent('start_scenario', {
      scenario_type: scenario.category,
      squad_size: squadSize,
      difficulty,
    });

    setTimeout(() => {
      const result = runSimulation({
        scenarioId: scenario.id,
        squadSize,
        difficulty,
        playerLevel,
      });
      localStorage.setItem('stg-last-result', JSON.stringify(result));
      trackEvent('complete_scenario', { rating: result.rating, badges_count: result.badges.length });

      setRunning(false);
      if (streamToggle) {
        setIsStreaming(false);
        markSessionStreamed();
      } else {
        navigate('/results');
      }
    }, 1500);
  };

  const handleCopyStreamLink = () => {
    navigator.clipboard.writeText('https://twitch.tv/placeholder-vod-link');
    toast({ title: "Link copied", description: "Placeholder stream link copied to clipboard." });
  };

  // Post-session streamed confirmation
  if (sessionStreamed) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Session Complete</p>
          <h1 className="font-display text-2xl font-bold text-foreground">Session streamed to Twitch</h1>
        </div>

        <div className="p-5 rounded-lg bg-card border border-border space-y-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-[#9146FF]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
            </svg>
            <span className="text-sm text-foreground font-medium">Your training session was streamed for review.</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Stream title: <span className="text-foreground">{streamTitle}</span>
          </p>
          <div className="flex gap-2">
            <a
              href="https://twitch.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md text-sm font-medium bg-[#9146FF]/10 border border-[#9146FF]/30 text-[#9146FF] hover:bg-[#9146FF]/20 transition-all"
            >
              View on Twitch
            </a>
            <button
              onClick={handleCopyStreamLink}
              className="px-4 py-2 rounded-md text-sm font-medium bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all"
            >
              Share stream link
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { resetSessionStreamed(); navigate('/results'); }}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:brightness-110 transition-all"
          >
            View Results
          </button>
          <button
            onClick={() => { resetSessionStreamed(); }}
            className="px-5 py-2.5 rounded-lg bg-secondary border border-border text-muted-foreground font-medium text-sm hover:text-foreground transition-all"
          >
            Run Another Drill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Squad Drill</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Configure and Execute</h1>
      </div>

      {/* Scenario Info */}
      <div className="p-5 rounded-lg bg-gradient-card border border-border">
        <div className="flex items-center gap-2 mb-2">
          <span>{CATEGORY_ICONS[scenario.category]}</span>
          <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[scenario.category]}</span>
        </div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">{scenario.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{scenario.briefing}</p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>Complexity: {'●'.repeat(scenario.complexity)}{'○'.repeat(5 - scenario.complexity)}</span>
          <span>Recommended Squad: {scenario.recommendedSquadSize}</span>
          <span>Skill Tier: {playerLevel}</span>
        </div>
      </div>

      {/* Squad Size */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <label className="text-sm font-medium text-foreground block mb-3">Squad Size</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map(size => (
            <button
              key={size}
              onClick={() => setSquadSize(size)}
              className={`w-10 h-10 rounded-lg font-display font-bold text-sm transition-all border ${
                squadSize === size
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {squadSize < scenario.recommendedSquadSize && (
          <p className="text-xs text-accent mt-2">Below recommended squad size. Increased difficulty.</p>
        )}
      </div>

      {/* Difficulty */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <label className="text-sm font-medium text-foreground block mb-3">Difficulty</label>
        <div className="flex gap-2">
          {(['Easy', 'Standard', 'Hard'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                difficulty === diff
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Stream Toggle - only when Twitch connected */}
      {twitchConnected && (
        <div className="p-4 rounded-lg bg-card border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-[#9146FF]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
              </svg>
              <span className="text-sm font-medium text-foreground">Stream this session</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-semibold">Beta</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={streamToggle}
              onClick={() => handleStreamToggle(!streamToggle)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                streamToggle ? 'bg-[#9146FF]' : 'bg-muted'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                  streamToggle ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {streamToggle && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Stream title</label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">
            Stream sessions to review execution, coordination, and decision-making.
          </p>
        </div>
      )}

      {/* Run Button */}
      <button
        onClick={handleRun}
        disabled={running}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50"
      >
        {running ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">◎</span>
            Running Drill...
            {isStreaming && (
              <span className="ml-2 flex items-center gap-1 text-sm font-normal opacity-80">
                <svg className="h-3.5 w-3.5 text-[#9146FF]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                </svg>
                Streaming to Twitch
              </span>
            )}
          </span>
        ) : (
          'Run Execution Rep'
        )}
      </button>
    </div>
  );
}
