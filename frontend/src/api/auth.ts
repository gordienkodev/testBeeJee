import type { ApiError, LoginResponse, LogoutResponse, MeResponse } from './types';

const API_URL = import.meta.env.VITE_API_URL;

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data: ApiError = await res.json();
    throw new Error(data.error || 'Login failed');
  }

  return res.json();
}

export async function logout(): Promise<LogoutResponse> {
  const res = await fetch(`${API_URL}/api/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    const data: ApiError = await res.json();
    throw new Error(data.error || 'Logout failed');
  }

  return res.json();
}

export async function getMe(): Promise<MeResponse> {
  const res = await fetch(`${API_URL}/api/me`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const data: ApiError = await res.json();
    throw new Error(data.error || 'Failed to get user info');
  }

  return res.json();
}
