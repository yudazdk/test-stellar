import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '@/services/api';
import { LoginResponse, Nullable, TRegisterResponse, User } from '@/types';

type AuthContextValue = {
  user: Nullable<User>;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (userData: User) => Promise<TRegisterResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
        const data: any = await api.get('/auth/me');
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
    const data = await api.post('/auth/login', { email, password }) as LoginResponse;
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setLoading(false);
    return data;
  };

  const register = async (userData: User) => {
    const data = await api.post('/auth/register', userData) as TRegisterResponse;
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setLoading(false);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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

