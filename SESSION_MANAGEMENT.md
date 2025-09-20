# Session Management System

This document explains how the session management system works in the Music Sample Pack Web application.

## Overview

The session management system ensures that users remain logged in even after refreshing the page or closing/reopening the browser. It also protects cart functionality by redirecting unauthenticated users to the login page.

## Features

### 1. Persistent Login
- User sessions are stored in localStorage
- Sessions persist for 24 hours
- Automatic session refresh every 30 minutes
- Session expiry checking every minute

### 2. Cart Protection
- Unauthenticated users cannot add items to cart
- Clicking "Add to Cart" redirects to login page
- Cart page is protected and requires authentication

### 3. Route Protection
- Cart, payment, and other sensitive pages require authentication
- Automatic redirect to login for protected routes

## How It Works

### Session Storage
- Sessions are stored in localStorage with key `music_sample_pack_session`
- Authentication tokens are stored separately with key `music_sample_pack_token`
- Session data includes user information and timestamp

### Session Validation
- Sessions are valid for 24 hours from creation
- Expired sessions are automatically cleared
- Session timestamps are refreshed during active use

### Authentication Flow
1. User logs in/signs up
2. Session is saved to localStorage
3. User remains logged in across page refreshes
4. Session is automatically refreshed every 30 minutes
5. Expired sessions trigger automatic logout

## Files Modified

### New Files
- `src/services/session.js` - Session management service

### Modified Files
- `src/App.jsx` - Added session checking and protection
- `src/components/AllPacksPage.jsx` - Added authentication check
- `src/components/ProductGrid.jsx` - Added authentication prop
- `src/services/api.js` - Added authentication headers

## Usage

### For Developers
The session service provides these main functions:

```javascript
import { sessionService } from './services/session';

// Save session after login
sessionService.saveSession(userData, token);

// Check if user is authenticated
if (sessionService.isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = sessionService.getCurrentUser();

// Clear session on logout
sessionService.clearSession();
```

### For Users
- Users will stay logged in after refreshing the page
- Sessions automatically expire after 24 hours of inactivity
- Unauthenticated users are redirected to login when trying to use cart features

## Security Considerations

- Sessions are stored in localStorage (client-side)
- Sessions expire after 24 hours
- Authentication tokens are included in API requests
- Protected routes automatically redirect to login

## Testing

To test the session management:

1. Log in to the application
2. Refresh the page - you should remain logged in
3. Close and reopen the browser - you should remain logged in
4. Try to add items to cart without being logged in - should redirect to login
5. Wait for session expiry or manually clear localStorage to test logout

## Troubleshooting

### Common Issues
- **Session not persisting**: Check if localStorage is enabled in the browser
- **Authentication errors**: Verify that tokens are being sent with API requests
- **Redirect loops**: Ensure login page is not protected

### Debug Information
Check the browser console for session-related logs:
- "Session saved successfully"
- "Session retrieved successfully"
- "Session expired, clearing..."
- "No session found"
