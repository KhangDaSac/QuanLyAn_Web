import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext/AuthContext";
import MainLayout from "./component/layout/MainLayout";
import LoginPage from "./page/LoginPage";
import HomePage from "./page/HomePage";
import LegalCaseManager from "./page/LegalCaseManager";
import LegalCaseDetailsPage from "./page/LegalCaseDetailsPage";
import JudgeManager from "./page/OfficerManager";
import RandomAssignment from "./page/RandomAssignment";
import DecisionTypeManager from "./page/DecisionTypeManager";
import DecisionTypeDetailsPage from "./page/DecisionTypeDetailsPage";
import BatchManagement from "./page/BatchManagement";
import ProfilePage from "./page/ProfilePage";
import ProtectedRoute from "./component/auth/ProtectedRoute";
import CaseDataManager from "./page/CaseDataManager";
import AccountManagement from "./page/AccountManagement";
import TermsPrivacyPage from "./page/TermsPrivacyPage";
import NotificationPage from "./page/NotificationPage";
import NotificationDetailPage from "./page/NotificationDetailPage";
import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/legal-case"
          element={
            <ProtectedRoute>
              <MainLayout>
                <LegalCaseManager />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/legal-case-details/:legalCaseId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <LegalCaseDetailsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/legal-case-data"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CaseDataManager />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/decision-type"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DecisionTypeManager />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/decision-types-details/:decisionTypeId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DecisionTypeDetailsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer-management"
          element={
            <ProtectedRoute>
              <MainLayout>
                <JudgeManager />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/random-assignment"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RandomAssignment />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account-management"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AccountManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/batch-management"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BatchManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <MainLayout>
                <NotificationPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications/:notificationId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <NotificationDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/term-policies" element={<TermsPrivacyPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
