import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext/AuthContext';
import Layout from './component/layout/Layout';
import LoginPage from './page/LoginPage';
import HomePage from './page/HomePage';
import ProtectedRoute from './component/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
