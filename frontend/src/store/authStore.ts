import { create } from 'zustand';
import { login as loginRequest, logout as logoutRequest, getMe } from '../api/auth';

interface AuthState {
    isAuthenticated: boolean;
    error: string | null;
    loading: boolean;

    username: string;
    password: string;
    validationError: string;

    setUsername: (value: string) => void;
    setPassword: (value: string) => void;
    setValidationError: (value: string) => void;
    clearCredentials: () => void;

    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    error: null,
    loading: false,

    username: '',
    password: '',
    validationError: '',

    setUsername: (value) => set({ username: value }),
    setPassword: (value) => set({ password: value }),
    setValidationError: (value) => set({ validationError: value }),
    clearCredentials: () => set({ username: '', password: '', validationError: '' }),

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
            set({
                isAuthenticated: false,
                error: null,
                username: '',
                password: '',
                validationError: '',
            });
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
