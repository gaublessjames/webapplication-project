# Auth Component and useAuth Hook Refactoring Plan

## Auth Component Refactoring

The `Auth.tsx` component currently uses Supabase directly for authentication. We need to refactor it to use the local API instead.

### Current Implementation

```typescript
// Current implementation in Auth.tsx
import { supabase } from "@/integrations/supabase/client";

// Sign in with email/password
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Sign up with email/password
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: redirectUrl,
    data: {
      full_name: fullName,
    }
  }
});

// Sign in with Google
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: redirectUrl,
  }
});

// Check if user is already authenticated
const { data: { session } } = await supabase.auth.getSession();
```

### Refactored Implementation

```typescript
// Refactored implementation in Auth.tsx
import { useApi } from '@/hooks/useApi';

// In component
const { register, login } = useApi();

// Sign in with email/password
const data = await login(email, password);

// Sign up with email/password
const data = await register(email, password, fullName);

// Sign in with Google
// This will need to be implemented in the API
window.location.href = `${LOCAL_API_URL}/auth/google?redirect_to=${encodeURIComponent(redirectUrl)}`;

// Check if user is already authenticated
const { getCurrentUser } = useApi();
const user = await getCurrentUser();
```

### Changes Required

1. Import `useApi` hook instead of Supabase
2. Replace Supabase auth methods with local API methods
3. Update error handling to match the new API response format
4. Update the admin bypass logic to work with the new authentication system
5. Update the demo user creation logic to use the local API

## useAuth Hook Refactoring

The `useAuth.tsx` hook currently uses Supabase for authentication state management. We need to refactor it to use the local API instead.

### Current Implementation

```typescript
// Current implementation in useAuth.tsx
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Set up auth state listener
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }
);

// Check for existing session
supabase.auth.getSession().then(({ data: { session } }) => {
  setSession(session);
  setUser(session?.user ?? null);
  setLoading(false);
});

// Fetch user profile
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', user.id)
  .single();

// Sign out
await supabase.auth.signOut({ scope: 'global' });
```

### Refactored Implementation

```typescript
// Refactored implementation in useAuth.tsx
import { useApi } from '@/hooks/useApi';

// In component
const { getCurrentUser, login, register } = useApi();

// Set up auth state listener
// This will need to be implemented differently, possibly with polling or a custom event system
useEffect(() => {
  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);
      setSession({ user });
    } catch (error) {
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };
  
  checkAuth();
  
  // Set up an interval to check for auth changes
  const interval = setInterval(checkAuth, 5000);
  
  return () => clearInterval(interval);
}, []);

// Fetch user profile
// This would be included in the getCurrentUser response

// Sign out
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
    // Force page reload for clean state
    window.location.href = '/auth';
  } catch (error) {
    console.error('Error signing out:', error);
    // Force redirect even if signOut fails
    window.location.href = '/auth';
  }
};
```

### Changes Required

1. Import `useApi` hook instead of Supabase
2. Replace Supabase auth methods with local API methods
3. Implement a custom auth state listener using polling or a custom event system
4. Update the profile fetching logic to use the local API
5. Update the sign out logic to work with the new authentication system
6. Update the admin bypass logic to work with the new authentication system

## Interface Changes

### User Interface

We need to define a new User interface to replace the Supabase User interface:

```typescript
interface User {
  id: string;
  email: string;
  role?: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}
```

### Session Interface

We need to define a new Session interface to replace the Supabase Session interface:

```typescript
interface Session {
  user: User | null;
  token?: string;
}
```

### Auth Context Interface

We need to update the Auth context interface to match the new authentication system:

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  profile: any | null;
  role: string | null;
}
```

## Implementation Strategy

1. First, create the new API client with authentication methods
2. Update the useAuth hook to use the new API client
3. Update the Auth component to use the new API client
4. Test the authentication flow to ensure it works correctly
5. Update other components that use authentication to use the new API client