import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '@/services/api';
import { LoginResponse, Nullable, TRegisterRequest, TRegisterResponse, User } from '@/types';

type AuthContextValue = {
  user: Nullable<User>;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (userData: TRegisterRequest) => Promise<TRegisterResponse>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * React context provider that manages authentication state and side effects.
 *
 * Initializes the current user if a token exists in localStorage by calling GET /auth/me.
 * Exposes login and register helpers that call the API, persist the returned token, and set the user,
 * and a logout helper that clears the token and user. Manages a loading flag during async operations.
 *
 * @param children - ReactNode children to render inside the provider.
 * @returns JSX.Element - AuthContext.Provider supplying { user, loading, login, register, logout }.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Nullable<User>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await api.get('/auth/me') as { user: User };
        setUser(data.user);
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await api.post('/auth/login', { email, password }) as LoginResponse;
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: TRegisterRequest) => {
    try {
      setLoading(true);
      const data = await api.post('/auth/register', userData) as TRegisterResponse;
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

