import { useState, useEffect } from 'react';
import { login as loginRequest, logout as logoutRequest, getMe } from '../api/auth';
import { useAuthStore } from '@/store/authStore';

export function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe();
        if (response.isAdmin) {
          setAuthenticated(true);
          setSuccess(true);
        } else {
          setAuthenticated(false);
          setSuccess(false);
        }
      } catch (err) {
        console.error('checkAuth error:', err);
        setAuthenticated(false);
        setSuccess(false);
      }
    };

    checkAuth();
  }, [setAuthenticated]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      const response = await loginRequest(username, password);
      if (response.success) {
        setAuthenticated(true);
        setSuccess(true);
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
    } finally {
      setAuthenticated(false);
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
