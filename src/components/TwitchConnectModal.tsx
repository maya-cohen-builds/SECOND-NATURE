import { useState } from "react";
import { useTwitch } from "@/contexts/TwitchContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TwitchConnectModal({ open, onClose }: Props) {
  const { connect } = useTwitch();
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<"input" | "connecting" | "done">("input");

  if (!open) return null;

  const handleConnect = () => {
    if (!username.trim()) return;
    setStep("connecting");
    setTimeout(() => {
      connect(username.trim());
      setStep("done");
      setTimeout(onClose, 800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 space-y-4 shadow-lg">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-[#9146FF]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
          </svg>
          <h2 className="font-display text-lg font-bold text-foreground">Connect Twitch</h2>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-semibold">Beta</span>
        </div>

        <p className="text-xs text-muted-foreground">
          Stream sessions to review execution, coordination, and decision-making.
        </p>

        {step === "input" && (
          <>
            <div>
              <label htmlFor="twitch-user" className="block text-xs font-medium text-muted-foreground mb-1.5">
                Twitch Username
              </label>
              <input
                id="twitch-user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                className="block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleConnect}
                disabled={!username.trim()}
                className="flex-1 rounded-md bg-[#9146FF] text-white py-2 text-sm font-display font-semibold hover:brightness-110 transition-all disabled:opacity-50"
              >
                Connect
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md text-sm font-medium bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {step === "connecting" && (
          <div className="flex items-center gap-2 py-4">
            <span className="animate-spin text-[#9146FF]">◎</span>
            <span className="text-sm text-muted-foreground">Connecting to Twitch…</span>
          </div>
        )}

        {step === "done" && (
          <p className="text-sm text-primary py-4">✓ Connected as {username}</p>
        )}
      </div>
    </div>
  );
}
