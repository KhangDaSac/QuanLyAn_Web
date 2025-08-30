import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext/AuthContext';
import MainLayout from './component/layout/MainLayout';
import LoginPage from './page/LoginPage';
import HomePage from './page/HomePage';
import LegalCaseManager from './page/LegalCaseManager';
import JudgeManager from './page/JudgeManager';
import RandomAssignment from './page/RandomAssignment';
import ProtectedRoute from './component/auth/ProtectedRoute';
import './App.css';

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
          path="/judge"
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;