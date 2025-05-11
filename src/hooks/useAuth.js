import { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Custom hook to handle authentication redirects
 */
export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Check if there's an auth redirect flag in localStorage
    const authRedirect = localStorage.getItem('auth_redirect');
    
    if (authRedirect === 'true' && location.pathname !== '/login') {
      // Clear the flag
      localStorage.removeItem('auth_redirect');
      
      // Redirect to login with return URL
      navigate('/login', { 
        state: { returnUrl: location.pathname },
        replace: true
      });
    }
  }, [navigate, location.pathname]);
  
  return { isAuthenticated };
};

export default useAuth;