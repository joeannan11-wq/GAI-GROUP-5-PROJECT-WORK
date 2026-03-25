import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CreateExam from "./pages/CreateExam";
import ExamList from "./pages/ExamList";
import Results from "./pages/Results";
import Remarking from "./pages/Remarking";
import SettingsPage from "./pages/Settings";
import StudentExamAccess from "./pages/StudentExamAccess";
import TakeExam from "./pages/TakeExam";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!session) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function TeacherRoute({ children }: { children: React.ReactNode }) {
  const { role, loading } = useUserRole();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (role === "student") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function RoleDashboard() {
  const { role, loading } = useUserRole();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  return role === "student" ? <StudentDashboard /> : <Dashboard />;
}

function AuthRoute() {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (session) return <Navigate to="/" replace />;
  return <Auth />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthRoute />} />
            <Route path="/exam-access" element={<StudentExamAccess />} />
            <Route path="/" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
            <Route path="/create-exam" element={<ProtectedRoute><TeacherRoute><CreateExam /></TeacherRoute></ProtectedRoute>} />
            <Route path="/exams" element={<ProtectedRoute><TeacherRoute><ExamList /></TeacherRoute></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><TeacherRoute><Results /></TeacherRoute></ProtectedRoute>} />
            <Route path="/remarking" element={<ProtectedRoute><TeacherRoute><Remarking /></TeacherRoute></ProtectedRoute>} />
            <Route path="/take-exam/:examId" element={<ProtectedRoute><TakeExam /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
