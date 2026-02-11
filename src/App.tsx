import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DemoProvider } from "@/contexts/DemoContext";
import AppLayout from "@/components/AppLayout";
import Overview from "./pages/Overview";
import TrainingHub from "./pages/TrainingHub";
import Run from "./pages/Run";
import Results from "./pages/Results";
import Shop from "./pages/Shop";
import Experiments from "./pages/Experiments";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DemoProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<AppLayout><Overview /></AppLayout>} />
            <Route path="/training-hub" element={<AppLayout><TrainingHub /></AppLayout>} />
            <Route path="/run" element={<AppLayout><Run /></AppLayout>} />
            <Route path="/results" element={<AppLayout><Results /></AppLayout>} />
            <Route path="/tools" element={<AppLayout><Shop /></AppLayout>} />
            <Route path="/insights" element={<AppLayout><Experiments /></AppLayout>} />
            <Route path="/performance" element={<AppLayout><Analytics /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DemoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
