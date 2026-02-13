import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DemoProvider } from "@/contexts/DemoContext";
import { TwitchProvider } from "@/contexts/TwitchContext";
import { QAProvider } from "@/contexts/QAContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Auth from "./pages/Auth";
import Overview from "./pages/Overview";
import Positioning from "./pages/Positioning";
import TrainingHub from "./pages/TrainingHub";
import Run from "./pages/Run";
import Shop from "./pages/Shop";
import TrainingModules from "./pages/TrainingModules";
import Pricing from "./pages/Pricing";
import PerformanceLab from "./pages/PerformanceLab";
import QAChecklist from "./pages/QAChecklist";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Squad from "./pages/Squad";
import MascotChatbot from "./components/MascotChatbot";

const queryClient = new QueryClient();

const Protected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DemoProvider>
        <TwitchProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <QAProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/overview" replace />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/overview" element={<Protected><Overview /></Protected>} />
                <Route path="/squad" element={<Protected><Squad /></Protected>} />
                <Route path="/positioning" element={<Protected><Positioning /></Protected>} />
                <Route path="/training-hub" element={<Protected><TrainingHub /></Protected>} />
                <Route path="/run" element={<Protected><Run /></Protected>} />
                <Route path="/tools" element={<Protected><Shop /></Protected>} />
                <Route path="/modules" element={<Protected><TrainingModules /></Protected>} />
                <Route path="/performance-lab" element={<Protected><PerformanceLab /></Protected>} />
                <Route path="/pricing" element={<Protected><Pricing /></Protected>} />
                <Route path="/profile" element={<Protected><Profile /></Protected>} />
                <Route path="/qa-checklist" element={<Protected><QAChecklist /></Protected>} />
                {/* Redirects for old routes */}
                <Route path="/results" element={<Navigate to="/performance-lab" replace />} />
                <Route path="/group-stats" element={<Navigate to="/performance-lab" replace />} />
                <Route path="/performance" element={<Navigate to="/performance-lab" replace />} />
                <Route path="/insights" element={<Navigate to="/performance-lab" replace />} />
                <Route path="/player-proof" element={<Navigate to="/pricing" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MascotChatbot />
            </QAProvider>
          </AuthProvider>
        </BrowserRouter>
        </TwitchProvider>
      </DemoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
