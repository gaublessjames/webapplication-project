# Plan for Removing Supabase Implementation from Front-End

## Overview

This document outlines the plan for removing the Supabase implementation from the front-end of the application and replacing it with a local API client. The application already has a local API implementation in place, and the environment variables are already configured to use the local API by default.

## Current State Analysis

### Supabase Usage

Supabase is currently used for:
- Authentication (login, signup, OAuth)
- Database operations (CRUD operations on reservations, customers, profiles)
- Session management

### Components Using Supabase

The following components directly import and use Supabase:
- `Auth.tsx` - Authentication (login, signup, OAuth)
- `useAuth.tsx` - Auth context provider
- `MyReservations.tsx` - Fetching and canceling reservations
- `CancelReservation.tsx` - Canceling reservations
- `Footer.tsx` - Newsletter signup
- `AdminDashboard.tsx` - Admin operations
- `ReservationForm.tsx` - Imports Supabase but uses useApi hook

### Existing Local API Implementation

The application already has:
- A `useApi.ts` hook that implements API calls to a local backend
- Environment variables to switch between Supabase and local API
- The local API is already set as the default in `.env`

## Implementation Plan

### 1. Create API Client Replacement

Create a new `api-client.ts` file in `front-end/src/lib/` that will:
- Provide a similar interface to Supabase
- Implement authentication methods
- Implement database operations
- Handle JWT token management

The API client will include:
- `auth` object with methods like `signUp`, `signInWithPassword`, `signOut`, etc.
- `db` object with methods for CRUD operations
- Helper functions for making API requests

### 2. Implement JWT-based Authentication

The API client will need to:
- Store JWT tokens in localStorage
- Include tokens in API requests
- Handle token expiration and refresh
- Provide methods for login, signup, and logout

### 3. Refactor Components

#### Auth Component
- Replace Supabase auth methods with local API methods
- Update form submission handlers
- Maintain the same user experience

#### useAuth Hook
- Replace Supabase session management with JWT-based session management
- Update auth state change listeners
- Maintain the same context API

#### MyReservations Component
- Replace Supabase queries with local API calls
- Update reservation fetching and cancellation logic

#### CancelReservation Component
- Ensure consistent use of local API for all operations
- Remove fallback to Supabase

#### Footer Component
- Replace Supabase newsletter signup with local API call

#### AdminDashboard Component
- Replace Supabase admin operations with local API calls

### 4. Update Environment Configuration

- Ensure `.env` file is properly configured
- Remove or comment out Supabase-related environment variables
- Update any configuration files

### 5. Testing

- Test authentication flow (signup, login, logout)
- Test reservation creation and management
- Test admin functionality
- Test newsletter signup

## Implementation Details

### API Client Structure

```typescript
// api-client.ts
export const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}) => {
  // Implementation
};

export const auth = {
  signUp: async (credentials) => {
    // Implementation
  },
  signInWithPassword: async (credentials) => {
    // Implementation
  },
  signOut: async () => {
    // Implementation
  },
  getSession: async () => {
    // Implementation
  },
  onAuthStateChange: (callback) => {
    // Implementation
  }
};

export const db = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      // Implementation
    }),
    insert: (data: any) => ({
      // Implementation
    }),
    update: (data: any) => ({
      // Implementation
    }),
    upsert: (data: any, options) => ({
      // Implementation
    })
  })
};
```

### Auth Component Changes

The Auth component will need to be updated to use the local API instead of Supabase:

```typescript
// Before
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// After
const { data, error } = await auth.signInWithPassword({
  email,
  password,
});
```

### useAuth Hook Changes

The useAuth hook will need to be updated to use the local API:

```typescript
// Before
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }
);

// After
const { data: { subscription } } = auth.onAuthStateChange(
  (event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }
);
```

## Conclusion

By following this plan, we will successfully remove the Supabase implementation from the front-end and replace it with a local API client. This will make the application more flexible and easier to maintain, as it will no longer depend on a specific third-party service.