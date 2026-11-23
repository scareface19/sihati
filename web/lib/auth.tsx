'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import api from './api';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'PHARMACY';

export interface AuthUser {
  id: number;
  phone: string;
  email?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneOrEmail: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ id: 0, phone: '', role: 'PATIENT', firstName: '', lastName: '' }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('sihati_token');
      const savedUser = localStorage.getItem('sihati_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to load auth state from localStorage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (phoneOrEmail: string, password: string): Promise<AuthUser> => {
    const res = await api.post('/auth/login', { phoneOrEmail, password });
    const { accessToken, user: loggedUser } = res.data;

    setToken(accessToken);
    setUser(loggedUser);
    localStorage.setItem('sihati_token', accessToken);
    localStorage.setItem('sihati_user', JSON.stringify(loggedUser));

    return loggedUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sihati_token');
    localStorage.removeItem('sihati_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Composant de garde de route (Route Guard)
 * Protège les pages contre les accès non authentifiés ou les rôles non autorisés.
 */
export function AuthGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirection vers le tableau de bord approprié selon son rôle
        if (user.role === 'ADMIN') router.push('/admin');
        else if (user.role === 'DOCTOR') router.push('/dashboard');
        else if (user.role === 'PHARMACY') router.push('/pharmacies');
        else router.push('/patients/1');
      }
    }
  }, [isAuthenticated, isLoading, user, router, pathname, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-semibold font-mono">
          Vérification des droits d'accès sécurisés (Loi 18-07)...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-red-50 border border-red-200 rounded-3xl text-center">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-red-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-red-900">Accès Restreint</h2>
        <p className="text-xs text-red-700 mt-2">
          Votre compte ({user.role}) ne dispose pas des privilèges nécessaires pour accéder à cet espace.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
