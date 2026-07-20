import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import MockInterviews from "./pages/MockInterviews";
import SkillGapAnalysis from "./pages/SkillGapAnalysis";
import AskAI from "./pages/AskAI";
import CareerInsights from "./pages/CareerInsights";
import Roadmap from "./pages/Roadmap";
import PracticeQuiz from "./pages/PracticeQuiz";
import Settings from "./pages/Settings";
import ProfileSummary from "./pages/ProfileSummary";
import AppLayout from "./components/layout/AppLayout";
import { AuthProvider } from "./contexts/AuthContext";
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Protected Routes (AppLayout handles Sidebar/Header) */}
      <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/resume-analysis" element={<AppLayout><ResumeAnalysis /></AppLayout>} />
      <Route path="/mock-interviews" element={<AppLayout><MockInterviews /></AppLayout>} />
      <Route path="/skill-gap-analysis" element={<AppLayout><SkillGapAnalysis /></AppLayout>} />
      <Route path="/ask-ai" element={<AppLayout><AskAI /></AppLayout>} />
      <Route path="/practice" element={<AppLayout><PracticeQuiz /></AppLayout>} />
      <Route path="/career-insights" element={<AppLayout><CareerInsights /></AppLayout>} />
      <Route path="/roadmaps" element={<AppLayout><Roadmap /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><ProfileSummary /></AppLayout>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
