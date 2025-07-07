import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useAuthCheck() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
}