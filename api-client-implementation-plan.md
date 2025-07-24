# API Client Implementation and Environment Configuration Plan

This document outlines the plan for implementing the API client and configuring the environment to remove Supabase dependencies.

## API Client Implementation

The API client will be a replacement for the Supabase client, providing similar functionality but using the local API instead. It will be implemented in `front-end/src/lib/api-client.ts`.

### Structure

The API client will have the following structure:

```typescript
// Generic API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>>;

// Auth API
export const auth = {
  signUp: async (credentials: { email: string; password: string; options?: { data?: any } }) => Promise<ApiResponse>,
  signInWithPassword: async (credentials: { email: string; password: string }) => Promise<ApiResponse>,
  signInWithOAuth: async ({ provider, options }: { provider: string; options?: any }) => Promise<ApiResponse>,
  getSession: async () => Promise<ApiResponse>,
  signOut: async ({ scope = 'local' }: { scope?: 'local' | 'global' } = {}) => Promise<ApiResponse>,
  onAuthStateChange: (callback: (event: string, session: any) => void) => { data: { subscription: { unsubscribe: () => void } } },
};

// Database API
export const db = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => Promise<ApiResponse>,
        get: () => Promise<ApiResponse>,
      }),
      get: () => Promise<ApiResponse>,
      order: (column: string, { ascending = true } = {}) => ({
        get: () => Promise<ApiResponse>,
      }),
    }),
    insert: (data: any) => ({
      execute: () => Promise<ApiResponse>,
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        execute: () => Promise<ApiResponse>,
      }),
    }),
    upsert: (data: any, { onConflict }: { onConflict?: string } = {}) => ({
      execute: () => Promise<ApiResponse>,
    }),
  }),
};

// Export the LOCAL_API_URL for use in other files
export { LOCAL_API_URL };

// Create a client object that mimics the Supabase client
export const apiClient = {
  auth,
  from: db.from,
};
```

### Implementation Details

#### API Request Function

```typescript
// Types to match Supabase response structure
export interface ApiResponse<T = any> {
  data: T | null;
  error: Error | null;
}

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      return { data: null, error: new Error(errorJson.message || errorJson.error || 'API Error') };
    } catch {
      return { data: null, error: new Error(errorText || 'API Error') };
    }
  }

  try {
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

// Generic API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    // If we're not using the local API, return an error
    if (!isLocalApi()) {
      return { 
        data: null, 
        error: new Error('API client is configured to use Supabase, not local API') 
      };
    }

    // Ensure the endpoint starts with a slash
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Get the JWT token from localStorage if it exists
    const token = localStorage.getItem('jwt');
    
    // Set up headers
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    
    // Add authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Make the request
    const response = await fetch(`${LOCAL_API_URL}${normalizedEndpoint}`, {
      ...options,
      headers,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    return { data: null, error: error as Error };
  }
};
```

#### Auth API Implementation

```typescript
// Auth API
export const auth = {
  // Sign up with email and password
  signUp: async (credentials: { email: string; password: string; options?: { data?: any } }) => {
    const { email, password, options } = credentials;
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: options?.data?.full_name || '',
      }),
    });
  },

  // Sign in with email and password
  signInWithPassword: async (credentials: { email: string; password: string }) => {
    const { email, password } = credentials;
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      localStorage.setItem('jwt', response.data.token);
    }

    return response;
  },

  // Sign in with OAuth (redirects to provider)
  signInWithOAuth: async ({ provider, options }: { provider: string; options?: any }) => {
    // For OAuth, we'll need to redirect to the backend endpoint that handles OAuth
    const redirectUrl = options?.redirectTo || window.location.origin;
    window.location.href = `${LOCAL_API_URL}/auth/${provider}?redirect_to=${encodeURIComponent(redirectUrl)}`;
    return { data: null, error: null };
  },

  // Get the current session
  getSession: async () => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return { data: { session: null }, error: null };
    }

    const response = await apiRequest('/auth/user');
    if (response.error) {
      localStorage.removeItem('jwt');
      return { data: { session: null }, error: response.error };
    }

    return {
      data: {
        session: {
          user: response.data,
          access_token: token,
        },
      },
      error: null,
    };
  },

  // Sign out
  signOut: async ({ scope = 'local' }: { scope?: 'local' | 'global' } = {}) => {
    try {
      // Remove JWT token
      localStorage.removeItem('jwt');
      
      // If scope is global, also call the backend to invalidate the token
      if (scope === 'global') {
        await apiRequest('/auth/logout', { method: 'POST' });
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // Set up auth state change listener
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    // This is a simplified version that doesn't actually listen for changes
    // In a real implementation, you might use WebSockets or polling
    
    // Immediately check the current session
    const checkSession = async () => {
      const { data } = await auth.getSession();
      callback('INITIAL', data.session);
    };
    
    checkSession();
    
    // Return a fake subscription object
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  },
};
```

#### Database API Implementation

```typescript
// Database API
export const db = {
  // Create a query builder for a table
  from: (table: string) => ({
    // Select data from the table
    select: (columns: string = '*') => ({
      // Add a filter
      eq: (column: string, value: any) => ({
        // Execute the query and return a single result
        async single() {
          return apiRequest(`/${table}/single?column=${column}&value=${encodeURIComponent(value)}&select=${columns}`);
        },
        // Execute the query and return multiple results
        async get() {
          return apiRequest(`/${table}?column=${column}&value=${encodeURIComponent(value)}&select=${columns}`);
        },
      }),
      // Execute the query without filters
      async get() {
        return apiRequest(`/${table}?select=${columns}`);
      },
      // Order the results
      order: (column: string, { ascending = true } = {}) => ({
        // Execute the query
        async get() {
          return apiRequest(`/${table}?select=${columns}&order=${column}&ascending=${ascending}`);
        },
      }),
    }),
    // Insert data into the table
    insert: (data: any) => ({
      async execute() {
        return apiRequest(`/${table}`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
    }),
    // Update data in the table
    update: (data: any) => ({
      // Add a filter
      eq: (column: string, value: any) => ({
        // Execute the query
        async execute() {
          return apiRequest(`/${table}/${value}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          });
        },
      }),
    }),
    // Upsert data in the table
    upsert: (data: any, { onConflict }: { onConflict?: string } = {}) => ({
      async execute() {
        return apiRequest(`/${table}/upsert`, {
          method: 'POST',
          body: JSON.stringify({ data, onConflict }),
        });
      },
    }),
  }),
};
```

## Environment Configuration

The application already has environment variables configured to use the local API by default. We need to ensure that these variables are properly set and that any Supabase-related variables are removed or commented out.

### Current Environment Configuration

```
VITE_BACKEND_MODE=local
VITE_LOCAL_API_URL=http://localhost:5000/api
# VITE_BACKEND_MODE=supabase
```

### Updated Environment Configuration

We'll keep the current configuration, but we'll add a comment to explain that Supabase is no longer used:

```
# Backend mode: 'local' only (Supabase has been removed)
VITE_BACKEND_MODE=local
VITE_LOCAL_API_URL=http://localhost:5000/api
```

### Client Configuration

We'll update the client configuration in `front-end/src/integrations/supabase/client.ts` to remove Supabase-related code and keep only the helper functions:

```typescript
// This file has been updated to remove Supabase dependencies
// It now only provides helper functions for the local API

// Environment switch: 'local' only (Supabase has been removed)
export const BACKEND_MODE = import.meta.env.VITE_BACKEND_MODE || 'local';

export const LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5000/api';

// Helper to check if using local API (always true now)
export const isLocalApi = () => true;
```

## Implementation Strategy

1. First, create the API client with the necessary functionality
2. Update the environment configuration
3. Update the client configuration
4. Test the API client to ensure it works correctly
5. Refactor the components to use the new API client