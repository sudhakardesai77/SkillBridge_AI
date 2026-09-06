import { Routes, Route } from "react-router-dom";

import CodingTracker from "../pages/CodingTracker";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Resume from "../pages/Resume";
import ATS from "../pages/ATS";
import Eligibility from "../pages/Eligibility";
import SkillGap from "../pages/SkillGap";
import Roadmap from "../pages/Roadmap";
import Companies from "../pages/Companies";
import Profile from "../pages/Profile";
import MockInterview from "../pages/MockInterview";
import InterviewSession from "../pages/InterviewSession";

import ProtectedRoute from "../components/common/ProtectedRoute";

import CompanyDetails from "../pages/CompanyDetails";
import InterviewHistory from "../pages/InterviewHistory";
import Jobs from "../pages/Jobs";
import SavedJobs from "../pages/SavedJobs";
import RecruiterDashboard from "../pages/RecruiterDashboard";
import MyApplications from "../pages/MyApplications";

import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import AdminJobs from "../pages/AdminJobs";
import AdminApplications from "../pages/AdminApplications";
import AdminAnalytics from "../pages/AdminAnalytics";

import PostJob from "../pages/PostJob";
import MyJobs from "../pages/MyJobs";


function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ================= STUDENT ROUTES ================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ats"
        element={
          <ProtectedRoute>
            <ATS />
          </ProtectedRoute>
        }
      />

      <Route
        path="/eligibility"
        element={
          <ProtectedRoute>
            <Eligibility />
          </ProtectedRoute>
        }
      />

      <Route
        path="/coding-tracker"
        element={
          <ProtectedRoute>
            <CodingTracker />
          </ProtectedRoute>
        }
      />

      <Route
        path="/skill-gap"
        element={
          <ProtectedRoute>
            <SkillGap />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <Roadmap />
          </ProtectedRoute>
        }
      />

      <Route
        path="/companies"
        element={
          <ProtectedRoute>
            <Companies />
          </ProtectedRoute>
        }
      />

      <Route
        path="/companies/:companyName"
        element={
          <ProtectedRoute>
            <CompanyDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mock-interview"
        element={
          <ProtectedRoute>
            <MockInterview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/session"
        element={
          <ProtectedRoute>
            <InterviewSession />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview-history"
        element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-applications"
        element={
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        }
      />


      {/* ================= RECRUITER ROUTES ================= */}

      <Route
        path="/recruiter-dashboard"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/post-job"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <PostJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/my-jobs"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <MyJobs />
          </ProtectedRoute>
        }
      />


      {/* ================= ADMIN ROUTES ================= */}

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAnalytics />
          </ProtectedRoute>
        }
      />


      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
            404 - Page Not Found
          </div>
        }
      />

    </Routes>
  );
}

export default AppRoutes;