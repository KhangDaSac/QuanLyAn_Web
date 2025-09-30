import { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext'; 
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!context || !context.user) {
      navigate('/login');
    }
  }, [context, navigate]);

  return context;
};