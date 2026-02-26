import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, ApiError } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  profile?: {
    fullName: string;
  };
  company?: {
    name: string;
  };
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: ApiError | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  clearError: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  pinfl: string;
  passportSeries: string;
  fullName: string;
  birthDate: string;
}

function getInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === 'object' && 'id' in parsed) {
      return parsed as User;
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const router = useRouter();

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(email, password);
      const { user: userData, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      const redirectPath = userData.role.toLowerCase();
      router.push(`/${redirectPath}`);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API errors
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);
      const newUser = response.data.data;
      
      const { passwordHash, ...userWithoutPassword } = newUser;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);

      router.push('/candidate');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
    isAuthenticated,
  };
}
