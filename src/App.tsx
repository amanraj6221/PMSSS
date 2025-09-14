// C:\Users\Aman Raj\PMSSS\src\App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 👇 Context
import { ApplicationProvider } from "@/contexts/ApplicationContext";

// 👇 Pages (User)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import UserDashboard from "./pages/UserDashboard";
import RecommendScheme from "./pages/RecommendScheme";
import SchemeDetails from "./pages/SchemeDetails";
import SchemeApplication from "./pages/SchemeApplication";
import ApplicationHistory from "./pages/ApplicationHistory";
import ProfileSettings from "./pages/ProfileSettings";

// 👇 Layouts
import UserLayout from "./layouts/UserLayout";
import SagLayout from "./layouts/SagLayout";

// 👇 Utils
import ProtectedRoute from "./utils/ProtectedRoute";
import SagProtectedRoute from "./utils/SagProtectedRoute"; // ✅ NEW

// 👇 SAG Bureau Pages
import SagRegister from "./pages/sag/SagRegister";
import SagLogin from "./pages/sag/SagLogin";
import SagDashboard from "./pages/sag/SagDashboard";
import SagApplications from "./pages/sag/SagApplications"; // ✅ ADD THIS
import SagApplicationDetail from "./pages/sag/SagApplicationDetail";
import SagApproved from "./pages/sag/SagApproved"; // ✅ NEW

// 👇 Finance Bureau Pages
import FinanceRegister from "./pages/finance/FinanceRegister";
import FinanceLogin from "./pages/finance/FinanceLogin";
import FinanceDashboard from "./pages/finance/FinanceDashboard";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ApplicationProvider>
          <BrowserRouter>
            <Routes>
              {/* ---------------- USER FLOW ---------------- */}
              {/* Public Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<UserRegister />} />
              <Route path="/login" element={<UserLogin />} />

              {/* ✅ Protected Dashboard with nested routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserLayout />
                  </ProtectedRoute>
                }
              >
                {/* Default Dashboard */}
                <Route index element={<UserDashboard />} />
                <Route path="recommend" element={<RecommendScheme />} />
                <Route path="history" element={<ApplicationHistory />} />
                <Route path="profile" element={<ProfileSettings />} />
              </Route>

              {/* ✅ Scheme Details Page (outside dashboard) */}
              <Route path="/scheme/:id" element={<SchemeDetails />} />
              <Route path="/apply/:id" element={<SchemeApplication />} />

              {/* ---------------- SAG BUREAU FLOW ---------------- */}
              <Route path="/sag/register" element={<SagRegister />} />
              <Route path="/sag/login" element={<SagLogin />} />

              {/* ✅ Protected SAG Dashboard with nested routes */}
              <Route
                path="/sag"
                element={
                  <SagProtectedRoute>
                    <SagLayout />
                  </SagProtectedRoute>
                }
              >
                <Route path="dashboard" element={<SagDashboard />} />
                <Route path="applications" element={<SagApplications />} /> {/* ✅ FIXED */}
                <Route path="application/:id" element={<SagApplicationDetail />} />
                <Route path="approved" element={<SagApproved />} />
              </Route>

              {/* ---------------- FINANCE BUREAU FLOW ---------------- */}
              <Route path="/register/finance" element={<FinanceRegister />} />
              <Route path="/login/finance" element={<FinanceLogin />} />
              <Route path="/dashboard/finance" element={<FinanceDashboard />} />

              {/* ---------------- FALLBACK ---------------- */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ApplicationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
