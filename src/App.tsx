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
import ModuleDetail from "./pages/ModuleDetail";
import ScenarioBuilder from "./pages/ScenarioBuilder";
import ScenarioRunner from "./pages/ScenarioRunner";
import ScenarioResults from "./pages/ScenarioResults";
import Pricing from "./pages/Pricing";
import PerformanceLab from "./pages/PerformanceLab";
import QAChecklist from "./pages/QAChecklist";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Squad from "./pages/Squad";
import MascotChatbot from "./components/MascotChatbot";

const queryClient = new QueryClient();

const Page = ({ children }: { children: React.ReactNode }) => (
  <AppLayout>{children}</AppLayout>
);

const AuthGated = ({ children }: { children: React.ReactNode }) => (
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
                {/* Public pages — no auth required */}
                <Route path="/overview" element={<Page><Overview /></Page>} />
                <Route path="/positioning" element={<Page><Positioning /></Page>} />
                <Route path="/training-hub" element={<Page><TrainingHub /></Page>} />
                <Route path="/run" element={<Page><Run /></Page>} />
                <Route path="/tools" element={<Page><Shop /></Page>} />
                <Route path="/modules" element={<Page><TrainingModules /></Page>} />
                <Route path="/module/:moduleId" element={<Page><ModuleDetail /></Page>} />
                <Route path="/pricing" element={<Page><Pricing /></Page>} />
                {/* Auth-gated pages */}
                <Route path="/squad" element={<Page><Squad /></Page>} />
                <Route path="/scenario-builder/:moduleId" element={<AuthGated><ScenarioBuilder /></AuthGated>} />
                <Route path="/scenario-run/:scenarioId" element={<AuthGated><ScenarioRunner /></AuthGated>} />
                <Route path="/scenario-results/:sessionId" element={<AuthGated><ScenarioResults /></AuthGated>} />
                <Route path="/performance-lab" element={<Page><PerformanceLab /></Page>} />
                <Route path="/profile" element={<AuthGated><Profile /></AuthGated>} />
                <Route path="/qa-checklist" element={<AuthGated><QAChecklist /></AuthGated>} />
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
