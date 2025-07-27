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
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  profile: any | null;
  role: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  refreshAuth: () => Promise<void>;
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
  const [initialized, setInitialized] = useState(false);
  const { getCurrentUser } = useApi();

  // Helper function to transform backend user data to frontend User interface
  const transformBackendUser = (backendUser: any): User => {
    return {
      id: backendUser.id,
      email: backendUser.email,
      role: backendUser.role,
      created_at: backendUser.created_at,
      phone: backendUser.phone,
      user_metadata: {
        full_name: backendUser.full_name
      },
      app_metadata: {
        role: backendUser.role
      }
    };
  };

  // Unified authentication state management
  const updateAuthState = (newUser: User | null, newSession: Session | null, newProfile: Profile | null = null) => {
    setUser(newUser);
    setSession(newSession);
    setProfile(newProfile);
    
    // Determine role based on user data
    let detectedRole: string | null = null;
    if (newUser) {
      detectedRole = newUser.role || newProfile?.role || null;
      if (!detectedRole && newUser.email && ADMIN_EMAILS.includes(newUser.email)) {
        detectedRole = 'admin';
      }
      

    }
    setRole(detectedRole);
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      (window as any).authStartTime = Date.now();
      
      try {
        // Check for existing JWT token and validate it with the backend
        const token = localStorage.getItem('jwt');
        
        if (token) {
          console.log('🔍 Found JWT token, validating with backend...');
          
          // Check session with backend
          const { data } = await auth.getSession();
          const currentSession = data.session;
          
          if (currentSession?.user) {
            console.log('✅ Valid session found:', currentSession.user.email);
            // Transform backend user data to frontend format
            const frontendUser = transformBackendUser(currentSession.user);
            updateAuthState(frontendUser, currentSession);
          } else {
            console.log('❌ Invalid or expired token, clearing...');
            localStorage.removeItem('jwt');
            updateAuthState(null, null);
          }
        } else {
          console.log('🔍 No JWT token found, user not authenticated');
          updateAuthState(null, null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('jwt');
        updateAuthState(null, null);
      } finally {
        // Add a minimum loading time to prevent flickering
        const minLoadingTime = 500; // 500ms minimum
        const elapsed = Date.now() - (window as any).authStartTime || 0;
        const remaining = Math.max(0, minLoadingTime - elapsed);
        
        setTimeout(() => {
          setLoading(false);
          setInitialized(true);
        }, remaining);
      }
    };
    
    initializeAuth();
  }, []); // Remove getCurrentUser dependency

  // Set up session monitoring (less frequent to avoid conflicts)
  useEffect(() => {
    // Only set up monitoring if user is logged in
    if (!user) return;
    
    const checkSession = async () => {
      try {
        const { data } = await auth.getSession();
        const currentSession = data.session;
        
        // Only update if session has actually changed
        if (!currentSession?.user && user) {
          // User was logged out
          console.log('🔍 User session expired, clearing auth state');
          updateAuthState(null, null);
        } else if (currentSession?.user?.id !== user?.id) {
          // Different user logged in
          const frontendUser = transformBackendUser(currentSession.user);
          updateAuthState(frontendUser, currentSession);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Don't clear state on every error
      }
    };
    
    // Check session every 2 minutes (less frequent)
    const interval = setInterval(checkSession, 120000);
    return () => clearInterval(interval);
  }, [user?.id]); // Remove getCurrentUser dependency

  // Force refresh authentication state (useful for debugging)
  const refreshAuth = async () => {
    try {
      const { data } = await auth.getSession();
      const currentSession = data.session;
      
      if (currentSession?.user) {
        // Transform backend user data to frontend format
        const frontendUser = transformBackendUser(currentSession.user);
        updateAuthState(frontendUser, currentSession);
      } else {
        updateAuthState(null, null);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      updateAuthState(null, null);
    }
  };

  // Global storage event listener for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jwt') {
        console.log('🔄 JWT token changed in another tab:', e.key, e.newValue);
        // Refresh auth state when JWT token changes in another tab
        setTimeout(() => {
          refreshAuth();
        }, 100);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshAuth]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔧 useAuth signIn called for:', email);
      
      const response = await auth.signInWithPassword({ email, password });
      
      if (response.error) {
        console.error('❌ Sign in failed:', response.error.message);
        return { success: false, error: response.error.message };
      }
      
      if (response.data?.token && response.data?.user) {
        console.log('✅ Sign in successful, token and user data received');
        
        // Transform backend user data to match frontend User interface
        const frontendUser = transformBackendUser(response.data.user);
        
        // Create session object from login response
        const session = {
          user: frontendUser,
          access_token: response.data.token
        };
        
        // Update auth state directly with the transformed user data
        updateAuthState(frontendUser, session);
        console.log('✅ Auth state updated with transformed user data:', frontendUser.email);
        
        return { success: true, user: frontendUser };
      } else {
        console.error('❌ No token or user data received from sign in');
        return { success: false, error: 'No authentication data received' };
      }
      
    } catch (error) {
      console.error('❌ Error signing in:', error);
      return { success: false, error: 'Sign in failed' };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      console.log('🔧 useAuth signOut called');
      
      // Call backend logout endpoint to blacklist the token
      console.log('🌐 Calling backend logout endpoint...');
      await auth.signOut({ scope: 'global' });
      console.log('✅ Backend logout completed');
      
      // Clear all authentication state
      updateAuthState(null, null);
      console.log('✅ Auth state cleared');
      
      // Clear JWT token from localStorage
      localStorage.removeItem('jwt');
      console.log('✅ JWT token removed from localStorage');
      
      // Clean up any other auth-related local storage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('jwt') || key.includes('auth')) {
          localStorage.removeItem(key);
        }
      });
      
      // Redirect all users to the index page after signout
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
      
      console.log('✅ Sign out completed successfully');
      
    } catch (error) {
      console.error('❌ Error signing out:', error);
      // Even if API call fails, clear local state
      updateAuthState(null, null);
      localStorage.removeItem('jwt');
      
      // Redirect all users to the index page after signout (even on error)
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
      
      console.log('✅ Sign out completed after error');
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    signIn,
    profile,
    role,
    setUser,
    setRole,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};