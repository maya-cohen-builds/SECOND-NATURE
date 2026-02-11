import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DemoContextType {
  demoMode: boolean;
  toggleDemoMode: () => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextType>({
  demoMode: false,
  toggleDemoMode: () => {},
  resetDemo: () => {},
});

export function DemoProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoMode] = useState(() => {
    return localStorage.getItem('stg-demo-mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('stg-demo-mode', String(demoMode));
  }, [demoMode]);

  const toggleDemoMode = () => setDemoMode(prev => !prev);

  const resetDemo = () => {
    localStorage.removeItem('stg-player');
    localStorage.removeItem('stg-events');
    localStorage.removeItem('stg-demo-mode');
    localStorage.removeItem('stg-last-result');
    window.location.reload();
  };

  return (
    <DemoContext.Provider value={{ demoMode, toggleDemoMode, resetDemo }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  return useContext(DemoContext);
}
