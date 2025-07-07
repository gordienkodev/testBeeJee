import { create } from 'zustand';
import { login as loginRequest, logout as logoutRequest, getMe } from '../api/auth';

interface AuthState {
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  error: null,
  loading: false,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await loginRequest(username, password);
      if (response.success) {
        set({ isAuthenticated: true, loading: false });
        return true;
      } else {
        set({ error: 'Неверные данные', loading: false });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await logoutRequest();
    } finally {
      set({ isAuthenticated: false, error: null });
    }
  },

  checkAuth: async () => {
    try {
      const response = await getMe();
      const isAuth = response.isAdmin === true;
      set({ isAuthenticated: isAuth, error: null });
      return isAuth;
    } catch {
      set({ isAuthenticated: false, error: null });
      return false;
    }
  },
}));
