import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DemoProvider } from "@/contexts/DemoContext";
import { QAProvider } from "@/contexts/QAContext";
import AppLayout from "@/components/AppLayout";
import Overview from "./pages/Overview";
import TrainingHub from "./pages/TrainingHub";
import Run from "./pages/Run";
import Shop from "./pages/Shop";
import TrainingModules from "./pages/TrainingModules";
import Pricing from "./pages/Pricing";
import PerformanceLab from "./pages/PerformanceLab";
import QAChecklist from "./pages/QAChecklist";
import NotFound from "./pages/NotFound";
import MascotChatbot from "./components/MascotChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DemoProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <QAProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<AppLayout><Overview /></AppLayout>} />
              <Route path="/training-hub" element={<AppLayout><TrainingHub /></AppLayout>} />
              <Route path="/run" element={<AppLayout><Run /></AppLayout>} />
              <Route path="/tools" element={<AppLayout><Shop /></AppLayout>} />
              <Route path="/modules" element={<AppLayout><TrainingModules /></AppLayout>} />
              <Route path="/performance-lab" element={<AppLayout><PerformanceLab /></AppLayout>} />
              <Route path="/pricing" element={<AppLayout><Pricing /></AppLayout>} />
              <Route path="/qa-checklist" element={<AppLayout><QAChecklist /></AppLayout>} />
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
        </BrowserRouter>
      </DemoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
