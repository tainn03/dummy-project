# Protected Routes Implementation

This document explains the comprehensive protected route system implemented in the Task Manager application.

## Overview

The application now has a robust authentication and route protection system that ensures users must be logged in to access protected pages. The system uses multiple layers of protection:

1. **Client-side Route Guards** - Components that check authentication status
2. **Authentication State Management** - Redux-based auth state with localStorage persistence
3. **Custom Hooks** - Reusable hooks for authentication logic
4. **Higher-Order Components** - HOCs for wrapping components with auth protection

## Components

### 1. AuthGuard Component (`src/components/molecules/AuthGuard.tsx`)

The main component that wraps protected content and redirects unauthenticated users.

**Features:**

- Integrates with Redux authentication state
- Automatically restores auth state from localStorage on app load
- Shows loading spinner while checking authentication
- Redirects to login page if user is not authenticated
- Supports custom fallback components

**Usage:**

```tsx
<AuthGuard>
  <ProtectedContent />
</AuthGuard>
```

### 2. withAuth HOC (`src/components/hoc/withAuth.tsx`)

A higher-order component that provides an alternative way to protect components.

**Usage:**

```tsx
const ProtectedComponent = withAuth(MyComponent);
```

### 3. useAuthGuard Hook (`src/hooks/useAuthGuard.ts`)

A custom hook that provides authentication logic and state management.

**Features:**

- Configurable authentication requirements
- Automatic redirects based on auth status
- Loading state management
- User data access

**Usage:**

```tsx
const { isAuthenticated, loading, user, isReady } = useAuthGuard({
  requireAuth: true, // Default: true
  redirectTo: "/login", // Default: "/login"
});
```

## Protected Pages

All sensitive pages are now protected with authentication:

### Currently Protected:

- `/dashboard` - Main dashboard page
- `/tasks/*` - All task-related pages (create, edit, view)
- `/profile` - User profile page

### Public Pages:

- `/` - Home page (redirects based on auth status)
- `/login` - Login page (redirects authenticated users to dashboard)
- `/register` - Registration page (redirects authenticated users to dashboard)

## Authentication Flow

### 1. Initial Load

```
User visits app
    ↓
Check localStorage for token/user
    ↓
If found: Restore auth state in Redux
    ↓
If not found: User remains unauthenticated
```

### 2. Login Process

```
User submits login form
    ↓
API call to authentication service (mock)
    ↓
On success: Store token + user in localStorage
    ↓
Update Redux state with user data
    ↓
Redirect to dashboard
```

### 3. Route Protection

```
User navigates to protected route
    ↓
AuthGuard checks authentication status
    ↓
If authenticated: Render protected content
    ↓
If not authenticated: Redirect to login
```

### 4. Logout Process

```
User clicks logout
    ↓
Clear localStorage (token + user)
    ↓
Reset Redux auth state
    ↓
Redirect to login page
```

## Implementation Details

### Redux Integration

The authentication state is managed by Redux with the following structure:

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

### Async Actions:

- `login` - Authenticates user and stores credentials
- `register` - Registers new user and stores credentials
- `logout` - Clears authentication state
- `checkAuthStatus` - Restores auth state from localStorage

### Middleware (Optional)

A Next.js middleware file (`middleware.ts`) is included for future server-side route protection if needed.

## Testing the Protection

### Test Authentication:

1. Try accessing `/dashboard` without logging in → Should redirect to `/login`
2. Log in with any email + password "password" → Should redirect to `/dashboard`
3. Try accessing `/login` while logged in → Should redirect to `/dashboard`
4. Refresh the page while logged in → Should maintain auth state
5. Clear localStorage and refresh → Should redirect to login

### Login Credentials:

- **Email:** Any valid email address
- **Password:** `password`

## Error Handling

The system includes comprehensive error handling:

- Invalid authentication data is cleared from localStorage
- Network errors are properly handled and displayed
- Loading states prevent race conditions
- TypeScript ensures type safety throughout

## Future Enhancements

Potential improvements for production use:

1. Server-side authentication validation
2. Token refresh mechanism
3. Role-based access control
4. Session timeout handling
5. Remember me functionality
6. Multi-factor authentication

## Files Modified/Created

### New Files:

- `src/components/hoc/withAuth.tsx` - HOC for route protection
- `src/hooks/useAuthGuard.ts` - Custom authentication hook
- `middleware.ts` - Next.js middleware for route protection

### Modified Files:

- `src/components/molecules/AuthGuard.tsx` - Enhanced with Redux integration
- `src/redux/reducers/authReducer.ts` - Added checkAuthStatus action
- `src/app/page.tsx` - Improved redirect logic
- `src/app/login/page.tsx` - Added auth guard for authenticated users
- `src/app/register/page.tsx` - Added auth guard for authenticated users

The protected route system is now fully implemented and provides comprehensive security for the application while maintaining a smooth user experience.
