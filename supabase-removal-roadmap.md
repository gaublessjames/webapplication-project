# Supabase Removal Roadmap

## Overview

This document provides a comprehensive roadmap for removing the Supabase implementation from the front-end of the application and replacing it with a local API client. The application already has a local API implementation in place, and the environment variables are already configured to use the local API by default.

## Current State

The application currently uses Supabase for:
- Authentication (login, signup, OAuth)
- Database operations (CRUD operations on reservations, customers, profiles)
- Session management

The following components directly import and use Supabase:
- `Auth.tsx` - Authentication (login, signup, OAuth)
- `useAuth.tsx` - Auth context provider
- `MyReservations.tsx` - Fetching and canceling reservations
- `CancelReservation.tsx` - Canceling reservations
- `Footer.tsx` - Newsletter signup
- `AdminDashboard.tsx` - Admin operations
- `ReservationForm.tsx` - Imports Supabase but uses useApi hook

The application already has:
- A `useApi.ts` hook that implements API calls to a local backend
- Environment variables to switch between Supabase and local API
- The local API is already set as the default in `.env`

## Implementation Roadmap

### Phase 1: API Client Implementation

1. Create a new `api-client.ts` file in `front-end/src/lib/` that will:
   - Provide a similar interface to Supabase
   - Implement authentication methods
   - Implement database operations
   - Handle JWT token management

2. Implement JWT-based authentication in the API client:
   - Store JWT tokens in localStorage
   - Include tokens in API requests
   - Handle token expiration and refresh
   - Provide methods for login, signup, and logout

3. Update the environment configuration:
   - Ensure `.env` file is properly configured
   - Remove or comment out Supabase-related environment variables
   - Update any configuration files

### Phase 2: Authentication Refactoring

1. Update the `useAuth` hook to use the local API:
   - Replace Supabase session management with JWT-based session management
   - Update auth state change listeners
   - Maintain the same context API

2. Refactor the `Auth` component to use the local API:
   - Replace Supabase auth methods with local API methods
   - Update form submission handlers
   - Maintain the same user experience

### Phase 3: Database Operations Refactoring

1. Refactor the `Footer` component to use the local API:
   - Replace Supabase newsletter signup with local API call

2. Refactor the `CancelReservation` component to use the local API:
   - Ensure consistent use of local API for all operations
   - Remove fallback to Supabase

3. Refactor the `MyReservations` component to use the local API:
   - Replace Supabase queries with local API calls
   - Update reservation fetching and cancellation logic

4. Check and update the `AdminDashboard` component:
   - Replace Supabase admin operations with local API calls

### Phase 4: Testing and Deployment

1. Test the application to ensure it works correctly:
   - Test authentication flow (signup, login, logout)
   - Test reservation creation and management
   - Test admin functionality
   - Test newsletter signup

2. Fix any issues found during testing:
   - Address any bugs or inconsistencies
   - Ensure the application works correctly in all supported environments

3. Deploy the changes to production:
   - Update the production environment configuration
   - Deploy the updated application
   - Monitor for any issues

## Detailed Implementation Plans

For detailed implementation plans, refer to the following documents:

1. [API Client Implementation Plan](api-client-implementation-plan.md)
2. [Auth Refactoring Plan](auth-refactoring-plan.md)
3. [Database Components Refactoring Plan](database-components-refactoring-plan.md)
4. [Testing Plan](testing-plan.md)

## Timeline

The estimated timeline for completing this project is as follows:

1. **Phase 1: API Client Implementation** - 2-3 days
2. **Phase 2: Authentication Refactoring** - 2-3 days
3. **Phase 3: Database Operations Refactoring** - 3-4 days
4. **Phase 4: Testing and Deployment** - 2-3 days

Total estimated time: 9-13 days

## Resources Required

The following resources will be required for this project:

1. **Development Environment**:
   - Local development server
   - Local API server
   - Access to the codebase

2. **Testing Environment**:
   - Testing accounts
   - Testing data
   - Browser testing tools

3. **Personnel**:
   - Front-end developer(s)
   - Back-end developer(s) (for API support)
   - QA tester(s)

## Risks and Mitigation

### Risks

1. **API Compatibility**: The local API may not provide all the functionality that Supabase does.
   - **Mitigation**: Identify any missing functionality early and implement it in the local API.

2. **Authentication Security**: JWT-based authentication needs to be implemented securely.
   - **Mitigation**: Follow best practices for JWT implementation and ensure proper token validation.

3. **Data Migration**: Existing data in Supabase may need to be migrated to the local database.
   - **Mitigation**: Create a data migration plan and test it thoroughly before implementation.

4. **User Experience**: Changes to authentication and database operations may affect the user experience.
   - **Mitigation**: Ensure that the user experience remains consistent and test thoroughly.

## Conclusion

By following this roadmap, we will successfully remove the Supabase implementation from the front-end and replace it with a local API client. This will make the application more flexible and easier to maintain, as it will no longer depend on a specific third-party service.

The detailed implementation plans provide specific guidance for each component that needs to be refactored, and the testing plan ensures that the application works correctly after the changes are made.