import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext/AuthContext";
import MainLayout from "./component/layout/MainLayout";
import LoginPage from "./page/LoginPage";
import HomePage from "./page/HomePage";
import LegalCaseManager from "./page/LegalCaseManager";
import LegalCaseDetailsPage from "./page/LegalCaseDetailsPage";
import JudgeManager from "./page/OfficerManager";
import RandomAssignment from "./page/RandomAssignment";
import TypeOfDecisionManager from "./page/TypeOfDecisionManager";
import ProtectedRoute from "./component/auth/ProtectedRoute";
import CaseDataManager from "./page/CaseDataManager";
import AccountManagement from "./page/AccountManagement";
import TermsPrivacyPage from "./page/TermsPrivacyPage";
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
                <TypeOfDecisionManager />
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
        <Route path="/term-policies" element={<TermsPrivacyPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
