import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '@/lib/api-client';
import { useApi } from './useApi';

// Define our own User and Session interfaces to replace Supabase ones
interface User {
  id: string;
  email: string | null;
  role?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  phone?: string | null;
}

interface Session {
  user: User | null;
  access_token?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  profile: any | null;
  role: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
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
  children: React.ReactNode;
}

// Profile interface
interface Profile {
  created_at: string;
  full_name: string | null;
  id: string;
  phone: string | null;
  updated_at: string;
  user_id: string;
  role?: string;
}

const ADMIN_EMAILS = [
  "admin@cafefausse.com"
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const { getCurrentUser } = useApi();

  // Local admin bypass
  useEffect(() => {
    setLoading(true);
    if (localStorage.getItem('admin_bypass') === 'true') {
      setUser({
        id: 'admin-bypass',
        email: 'admin@cafefausse.com',
        role: 'admin',
        user_metadata: {},
        app_metadata: {},
      });
      setProfile({
        created_at: '',
        full_name: 'Admin',
        id: 'admin-bypass',
        phone: null,
        updated_at: '',
        user_id: 'admin-bypass',
        role: 'admin',
      });
      setRole('admin');
      setLoading(false);
      return;
    }
    setLoading(false);
  }, []);

  // Check for existing session and set up polling for auth changes
  useEffect(() => {
    if (localStorage.getItem('admin_bypass') === 'true') return; // skip API fetch
    
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data } = await auth.getSession();
        const currentSession = data.session;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setRole(currentSession?.user?.role || null);
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setSession(null);
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    };
    
    // Initial check
    checkSession();
    
    // Set up polling for auth changes (every 30 seconds)
    const interval = setInterval(checkSession, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch user profile when user changes
  useEffect(() => {
    if (localStorage.getItem('admin_bypass') === 'true') return; // skip API fetch
    
    async function fetchProfile() {
      if (user) {
        try {
          const userResponse = await getCurrentUser();
          // Only set role from profile if user.role is missing
          if (userResponse && userResponse.profile) {
            setProfile(userResponse.profile as Profile);
            if (!user.role && userResponse.profile.role) {
              setRole(userResponse.profile.role);
            }
          } else {
            setProfile(null);
            if (!user.role) setRole(null);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
          if (!user.role) setRole(null);
        }
      } else {
        setProfile(null);
        setRole(null);
      }
    }
    
    fetchProfile();
  }, [user, getCurrentUser]);

  // In AuthProvider, after setting user, set role from user.role, user.profile.role, or ADMIN_EMAILS
  useEffect(() => {
    if (user) {
      let detectedRole = user.role || null;
      if (!detectedRole && profile && profile.role) {
        detectedRole = profile.role;
      }
      if (!detectedRole && user.email && ADMIN_EMAILS.includes(user.email)) {
        detectedRole = 'admin';
      }
      setRole(detectedRole);
    } else {
      setRole(null);
    }
    // eslint-disable-next-line
  }, [user, profile]);

  // Sign out function
  const signOut = async () => {
    try {
      localStorage.removeItem('admin_bypass');
      localStorage.removeItem('jwt');
      
      // Clean up any local storage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('jwt') || key.includes('auth')) {
          localStorage.removeItem(key);
        }
      });
      
      // Sign out using our API client
      await auth.signOut({ scope: 'global' });
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      // Force redirect even if signOut fails
      window.location.href = '/auth';
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    profile,
    role,
    setUser,
    setRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};