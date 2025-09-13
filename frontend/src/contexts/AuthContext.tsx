import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  fullName: string;
  householdName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (fullName: string, householdName: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
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

  useEffect(() => {
    // Check if user is logged in on app load
    const savedUser = localStorage.getItem('ecoconnect_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sample credentials validation
    if (email === 'user@example.com' && password === 'password123') {
      const userData: User = {
        id: '1',
        fullName: 'John Doe',
        householdName: 'Green Family',
        email: email
      };
      
      setUser(userData);
      localStorage.setItem('ecoconnect_user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true, message: 'Login successful!' };
    } else {
      setIsLoading(false);
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const signup = async (fullName: string, householdName: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Basic validation
    if (!fullName || !householdName || !email || !password) {
      setIsLoading(false);
      return { success: false, message: 'All fields are required' };
    }
    
    if (password.length < 6) {
      setIsLoading(false);
      return { success: false, message: 'Password must be at least 6 characters' };
    }
    
    // Check if email already exists (in real app, this would be an API call)
    const existingUser = localStorage.getItem('ecoconnect_user');
    if (existingUser && JSON.parse(existingUser).email === email) {
      setIsLoading(false);
      return { success: false, message: 'Email already registered' };
    }
    
    const userData: User = {
      id: Date.now().toString(),
      fullName,
      householdName,
      email
    };
    
    setUser(userData);
    localStorage.setItem('ecoconnect_user', JSON.stringify(userData));
    setIsLoading(false);
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecoconnect_user');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};