import { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext'; 
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  useEffect(() => {
    if (!context || !context.user) {
      navigate('/login');
    }
  }, [context, navigate]);

  return context;
};