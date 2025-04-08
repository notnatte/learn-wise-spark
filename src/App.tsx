
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/courses" element={
            <Layout>
              <div className="min-h-[80vh] flex items-center justify-center">
                <h1 className="text-2xl font-medium text-muted-foreground">Courses page coming soon!</h1>
              </div>
            </Layout>
          } />
          <Route path="/quiz" element={
            <Layout>
              <div className="min-h-[80vh] flex items-center justify-center">
                <h1 className="text-2xl font-medium text-muted-foreground">Quiz page coming soon!</h1>
              </div>
            </Layout>
          } />
          <Route path="/achievements" element={
            <Layout>
              <div className="min-h-[80vh] flex items-center justify-center">
                <h1 className="text-2xl font-medium text-muted-foreground">Achievements page coming soon!</h1>
              </div>
            </Layout>
          } />
          <Route path="/discussions" element={
            <Layout>
              <div className="min-h-[80vh] flex items-center justify-center">
                <h1 className="text-2xl font-medium text-muted-foreground">Discussions page coming soon!</h1>
              </div>
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout>
              <div className="min-h-[80vh] flex items-center justify-center">
                <h1 className="text-2xl font-medium text-muted-foreground">Settings page coming soon!</h1>
              </div>
            </Layout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
