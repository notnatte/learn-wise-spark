
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Explore";
import Lessons from "./pages/Listings";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AITutor from "./pages/AITutor";
import Progress from "./pages/Progress";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/explore" element={
              <ProtectedRoute>
                <Layout>
                  <Courses />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/listings" element={
              <ProtectedRoute>
                <Layout>
                  <Lessons />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Layout>
                  <Messages />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/ai-tutor" element={
              <ProtectedRoute>
                <Layout>
                  <AITutor />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <Layout>
                  <Progress />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
