import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext/AuthContext';
import MainLayout from './component/layout/MainLayout';
import LoginPage from './page/LoginPage';
import HomePage from './page/HomePage';
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
