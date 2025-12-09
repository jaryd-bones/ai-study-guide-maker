import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Auth/LoginPage/LoginPage.jsx";
import RegisterPage from "../pages/Auth/RegisterPage/RegisterPage.jsx";
import DashboardPage from "../pages/DashboardPage/DashboardPage.jsx";
import StudyGuideDetailPage from "../pages/StudyGuideDetailPage/StudyGuideDetailPage.jsx";
import StudySessionPage from "../pages/StudySessionPage/StudySessionPage.jsx";
import NewStudyGuidePage from "../pages/NewStudyGuidePage/NewStudyGuidePage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/study-guides/new"
        element={
          <ProtectedRoute>
            <NewStudyGuidePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/study-guides/:id"
        element={
          <ProtectedRoute>
            <StudyGuideDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/study-guides/:id/study"
        element={
          <ProtectedRoute>
            <StudySessionPage />
          </ProtectedRoute>
        } 
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter