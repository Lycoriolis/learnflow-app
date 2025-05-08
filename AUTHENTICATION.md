# Authentication System

This project uses Firebase Authentication for user management. The authentication system provides the following features:

- User registration with email/password
- Email/password login
- Google OAuth login
- Password reset
- Authentication state persistence
- Route protection based on authentication status

## Configuration

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Email/Password and Google authentication providers in the Firebase console
3. Copy your Firebase config from the Firebase Console (Project Settings > General > Your Apps)
4. Create a `.env` file based on the `.env.example` template and add your Firebase configuration

## Authentication Flow

1. The authentication system initializes in the root layout component
2. Authentication state is observed via Firebase's `onAuthStateChanged` listener
3. User data and authentication status are stored in Svelte stores
4. Authentication-required pages check the authentication status and redirect if needed

## Authentication Components

- `Login.svelte`: Email/password and Google sign-in
- `Register.svelte`: New user registration 
- `ResetPassword.svelte`: Password recovery via email

## Protected Routes

Routes can be protected by checking the authentication status. Example:

```svelte
<script>
  import { isAuthenticated } from '$lib/stores/authStore.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    // Redirect to login if not authenticated
    if (!$isAuthenticated) {
      goto('/login');
    }
  });
</script>
```

## User Roles

Currently, admin role is determined by a specific email address:

```typescript
const ADMIN_EMAIL = 'admin@example.com';
$: isAdmin = $isAuthenticated && $user?.email === ADMIN_EMAIL;
```

For production, consider implementing a more robust role management system with Firebase custom claims or Firestore.

## User Profile Persistence
- Upon successful sign-in, a Firestore document is created or loaded under `users/{uid}`.
- Profiles include `email`, `displayName`, `createdAt`, and custom `preferences` (e.g. enrollments, settings).
- The application maintains a Svelte store `userProfile` that reflects this document in real time.
- Configuration: ensure Firestore credentials are defined in `.env` with `VITE_FIREBASE_*` variables.

## Admin Configuration
- Admin users are controlled via environment variable `VITE_ADMIN_EMAILS` (comma-separated).
- The app checks `user.email` against this list to grant admin privileges.