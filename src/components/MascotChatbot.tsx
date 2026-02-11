import { useState, useRef, useEffect, Suspense } from 'react';
import SignalNode3D from '@/components/SignalNode3D';

const QUICK_REPLIES = [
  "How do I improve my win rate?",
  "What drill should I run first?",
  "How does group stat tracking work?",
  "What games are supported?",
];

const BOT_RESPONSES: Record<string, string> = {
  "How do I improve my win rate?":
    "Start with the Training Hub. Pick a drill that matches your weakest area, run it with your squad, and check your performance summary after. Consistency beats intensity. Run 3 drills a week minimum.",
  "What drill should I run first?":
    "If you are new, start with a Base Defense drill on Easy. It teaches positioning and cooldown awareness without overwhelming you. Once you hit a B rating, move to Coordinated Attack.",
  "How does group stat tracking work?":
    "Head to Group Stats. You will see coordination scores, role consistency, and improvement trends for your whole squad. Every drill you run together feeds into the group profile.",
  "What games are supported?":
    "We support training modules for MOBAs like League of Legends and Dota 2, MMO raids like WoW and FFXIV, tactical shooters like Valorant and CS2, and RTS titles like StarCraft II and Age of Empires IV.",
};

const DEFAULT_RESPONSE = "Pattern noted. Check the Training Hub for relevant drills, or review your Stats for recent trends.";

interface MascotChatbotProps {
  brandLabel?: string;
  brandColor?: string;
}

export default function MascotChatbot({ brandLabel, brandColor }: MascotChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'bot', text: "Signal active. What do you need?" }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      const response = BOT_RESPONSES[userMsg] || DEFAULT_RESPONSE;
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 400);
  };

  return (
    <>
      {/* Collapsed state — minimal pill */}
      {isCollapsed ? (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed bottom-6 right-6 z-[100] w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          aria-label="Show Signal"
        >
          <span className="font-display font-bold text-xs">SG</span>
        </button>
      ) : (
        <div className="fixed bottom-6 right-6 z-[100] group flex items-end gap-2">
          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(true)}
            className="mb-1 w-6 h-6 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground text-[10px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Collapse Signal"
          >
            ✕
          </button>

          {/* 3D crystalline node — free-floating, no container chrome */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open Signal"
            className="relative cursor-pointer"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            {/* Ambient glow behind the 3D node */}
            <div className="absolute inset-0 rounded-full bg-primary/15 blur-xl scale-150 animate-pulse pointer-events-none" />
            <Suspense fallback={
              <div className="w-20 h-20 rounded-full bg-card/50 border border-primary/20 flex items-center justify-center">
                <span className="font-display font-bold text-xs text-primary">SG</span>
              </div>
            }>
              <SignalNode3D size={80} />
            </Suspense>
            {/* Brand badge */}
            {brandLabel && (
              <span
                className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                style={{
                  backgroundColor: brandColor || 'hsl(var(--accent))',
                  color: 'hsl(var(--accent-foreground))',
                }}
              >
                {brandLabel}
              </span>
            )}
            {/* Status indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-background" />
          </button>
        </div>
      )}

      {/* Interaction Panel */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-[100] w-80 max-h-[480px] flex flex-col rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-secondary/50 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <Suspense fallback={<span className="text-primary font-display font-bold text-xs">SG</span>}>
                <SignalNode3D size={32} />
              </Suspense>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-sm text-foreground">
                Signal
                {brandLabel && (
                  <span
                    className="ml-1.5 px-1 py-0.5 rounded text-[8px] font-bold uppercase"
                    style={{
                      backgroundColor: brandColor || 'hsl(var(--accent))',
                      color: 'hsl(var(--accent-foreground))',
                    }}
                  >
                    {brandLabel}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground">Active. Ready.</div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground text-lg leading-none"
              aria-label="Close Signal"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px] max-h-[300px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary/20 text-foreground rounded-br-sm'
                      : 'bg-secondary text-foreground rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-md bg-secondary/80 border border-border text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-2 border-t border-border flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Query Signal..."
              className="flex-1 bg-secondary/50 border border-border rounded-md px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={() => handleSend(input)}
              className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
