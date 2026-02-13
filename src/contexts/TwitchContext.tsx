import { createContext, useContext, useState, ReactNode } from "react";

interface TwitchState {
  twitchConnected: boolean;
  twitchUsername: string;
  isStreaming: boolean;
  streamTitle: string;
  sessionStreamed: boolean;
  connect: (username: string) => void;
  disconnect: () => void;
  setIsStreaming: (v: boolean) => void;
  setStreamTitle: (v: string) => void;
  markSessionStreamed: () => void;
  resetSessionStreamed: () => void;
}

const TwitchContext = createContext<TwitchState | undefined>(undefined);

export function TwitchProvider({ children }: { children: ReactNode }) {
  const [twitchConnected, setTwitchConnected] = useState(false);
  const [twitchUsername, setTwitchUsername] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [sessionStreamed, setSessionStreamed] = useState(false);

  const connect = (username: string) => {
    setTwitchConnected(true);
    setTwitchUsername(username);
  };

  const disconnect = () => {
    setTwitchConnected(false);
    setTwitchUsername("");
    setIsStreaming(false);
    setStreamTitle("");
  };

  const markSessionStreamed = () => setSessionStreamed(true);
  const resetSessionStreamed = () => setSessionStreamed(false);

  return (
    <TwitchContext.Provider value={{
      twitchConnected, twitchUsername, isStreaming, streamTitle, sessionStreamed,
      connect, disconnect, setIsStreaming, setStreamTitle, markSessionStreamed, resetSessionStreamed,
    }}>
      {children}
    </TwitchContext.Provider>
  );
}

export function useTwitch() {
  const ctx = useContext(TwitchContext);
  if (!ctx) throw new Error("useTwitch must be used within TwitchProvider");
  return ctx;
}
