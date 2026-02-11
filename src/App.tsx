import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Overview from "./pages/Overview";
import TrainingHub from "./pages/TrainingHub";
import Run from "./pages/Run";
import Results from "./pages/Results";
import Shop from "./pages/Shop";
import Stats from "./pages/Stats";
import TrainingModules from "./pages/TrainingModules";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import MascotChatbot from "./components/MascotChatbot";
import MascotComparison from "./components/MascotComparison";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/overview" element={<AppLayout><Overview /></AppLayout>} />
            <Route path="/pricing" element={<AppLayout><Pricing /></AppLayout>} />
            <Route path="/training-hub" element={<ProtectedRoute><AppLayout><TrainingHub /></AppLayout></ProtectedRoute>} />
            <Route path="/run" element={<ProtectedRoute><AppLayout><Run /></AppLayout></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><AppLayout><Results /></AppLayout></ProtectedRoute>} />
            <Route path="/tools" element={<ProtectedRoute><AppLayout><Shop /></AppLayout></ProtectedRoute>} />
            <Route path="/stats" element={<ProtectedRoute><AppLayout><Stats /></AppLayout></ProtectedRoute>} />
            <Route path="/modules" element={<ProtectedRoute><AppLayout><TrainingModules /></AppLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MascotChatbot />
          <MascotComparison />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
