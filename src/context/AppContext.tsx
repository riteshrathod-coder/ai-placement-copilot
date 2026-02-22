import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

export type UserRole = 'student' | 'hr' | null;

interface ResumeData {
  name: string;
  email: string;
  skills: string[];
  experience: string;
  scores?: {
    fit: number;
    authenticity: number;
    clarity: number;
    impact: number;
    relevance: number;
  };
}

interface AppContextType {
  user: User | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('userRole');
    return (savedRole as UserRole) || null;
  });
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ user, userRole, setUserRole, resumeData, setResumeData, loading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
