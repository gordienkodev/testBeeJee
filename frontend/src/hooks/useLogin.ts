import { useState, useEffect } from 'react';
import { login as loginRequest, logout as logoutRequest, getMe } from '../api/auth';

export function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe();
        if (response.isAdmin) {
          setIsAuthenticated(true);
          setSuccess(true);
        }
      } catch (err) {
        console.error('checkAuth error:', err);
        setIsAuthenticated(false);
        setSuccess(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      const response = await loginRequest(username, password);
      if (response.success) {
        setSuccess(true);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
      setIsAuthenticated(false);
      setSuccess(false);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setIsAuthenticated(false);
      setSuccess(false);
      setError(null);
    }
  };

  return {
    login,
    logout,
    error,
    success,
    loading,
    isAuthenticated,
  };
}
