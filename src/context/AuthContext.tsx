// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types/User';
import { dummyUser } from '../dummies/userResponse';

const USE_DUMMY_DATA = false;
const AUTH_API_URL = 'http://localhost:6060/auth';

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, phone: string, firstname: string, lastname: string, is_provider: string, username: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { throw new Error('login not implemented'); },
  logout: () => {},
  register: async () => { throw new Error('register not implemented'); },
  refreshUser: async () => { throw new Error('refreshUser not implemented'); },
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(USE_DUMMY_DATA ? dummyUser : null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshUser();
      } catch (error) {
        setUser(null);
      }
    };
    
    if (!USE_DUMMY_DATA) {
      initializeAuth();
    }
  }, []); 

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      if (USE_DUMMY_DATA) {
        setUser(dummyUser);
      } else {
        const res = await fetch(`${AUTH_API_URL}/login`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        if (!res.ok) throw new Error('Failed login');
        const data = await res.json();
        setUser(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, phone: string, firstname: string, lastname: string, is_provider: string, username: string) => {
    setIsLoading(true);
    console.log('Registering user:', { email, password, phone, firstname, lastname, is_provider, username });

    try {
      if (USE_DUMMY_DATA) {
        setUser(dummyUser);
      } else {
        console.log('Registering user:', { email, password, phone, firstname, lastname, is_provider, username });
        const res = await fetch(`${AUTH_API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, username, phone, firstname, lastname, is_provider: is_provider === 'true' }),
        });
        if (!res.ok) throw new Error('Failed registration');
        const data = await res.json();
        setUser(data);
        }       
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
        console.log('Refreshing user data');
        const response = await fetch(`${AUTH_API_URL}/me`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            setUser(data);
            console.log('User data refreshed:', data);
        } else {
            setUser(null);
        }
    } catch (error) {
        setUser(null);
    }
}

  const logout = async () => {
    await fetch(`${AUTH_API_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
