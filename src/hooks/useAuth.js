import { useAuth as useAuthContext } from '../contexts/AuthContext';

/**
 * Custom hook to access authentication context
 * @returns {Object} Authentication context with user, login, logout, etc.
 */
export function useAuth() {
  return useAuthContext();
}

// Also export as default for flexibility
export default useAuth;