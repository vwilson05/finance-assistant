import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  setOpenAIKey: (key: string) => Promise<boolean>;
  hasOpenAIKey: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          
          // Check if user has OpenAI API key
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/user/openai-key`, {
              headers: {
                'Authorization': `Bearer ${authService.getToken()}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setHasOpenAIKey(data.hasApiKey);
            }
          } catch (error) {
            console.error('Error checking OpenAI API key:', error);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      
      // Check if user has OpenAI API key
      try {
        const keyResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/user/openai-key`, {
          headers: {
            'Authorization': `Bearer ${response.token}`
          }
        });
        
        if (keyResponse.ok) {
          const data = await keyResponse.json();
          setHasOpenAIKey(data.hasApiKey);
        }
      } catch (error) {
        console.error('Error checking OpenAI API key:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setHasOpenAIKey(false); // New users won't have an API key yet
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setHasOpenAIKey(false);
  };

  const setOpenAIKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/user/openai-key`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({ openaiApiKey: key })
      });
      
      if (response.ok) {
        setHasOpenAIKey(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error setting OpenAI API key:', error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    setOpenAIKey,
    hasOpenAIKey
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 