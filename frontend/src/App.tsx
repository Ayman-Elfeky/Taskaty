import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Sidebar } from "@/components/Sidebar";
import LoadingSpinner from '@/components/loadingSpinner';
import ProtectedRoute from "./components/protectRoute";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const MyTasks = lazy(() => import("./pages/MyTasks"));
const Projects = lazy(() => import("./pages/Projects"));
const Messages = lazy(() => import("./pages/messages"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LandingPage = lazy(() => import("./pages/landPage"));
const Auth = lazy(() => import("./pages/Auth"));
const VerifyEmail = lazy(() => import("./pages/verifyEmail"));

// Preload function
const preloadComponent = (importFn: () => Promise<any>) => {
  importFn().catch(error => console.error('Error preloading component:', error));
};

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isAuthPage = location.pathname === "/auth";
  const isVerifyPage = location.pathname === "/verify-email";

  // Preload components after initial render
  useEffect(() => {
    // Small delay to ensure main page loads first
    const timer = setTimeout(() => {
      preloadComponent(() => import("./pages/Home"));
      preloadComponent(() => import("./pages/MyTasks"));
      preloadComponent(() => import("./pages/Projects"));
      preloadComponent(() => import("./pages/messages"));
      preloadComponent(() => import("./pages/Settings"));
      preloadComponent(() => import("./pages/NotFound"));
      preloadComponent(() => import("./pages/Auth"));
      preloadComponent(() => import("./pages/verifyEmail"));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {!isLandingPage && !isAuthPage && !isVerifyPage && <Sidebar />}
      <main className={`flex-1 overflow-auto`}>
        <Toaster />
        <Sonner />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myTasks"
              element={
                <ProtectedRoute>
                  <MyTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/*"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
