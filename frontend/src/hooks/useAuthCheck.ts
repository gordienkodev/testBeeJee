import { useEffect } from 'react';
import { getMe } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

export function useAuthCheck() {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  useEffect(() => {
    const check = async () => {
      try {
        const user = await getMe();
        if (user.isAdmin) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch {
        setAuthenticated(false);
      }
    };

    check();
  }, [setAuthenticated]);
}
