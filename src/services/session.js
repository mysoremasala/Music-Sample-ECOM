// Session management service
const SESSION_KEY = 'music_sample_pack_session';
const TOKEN_KEY = 'music_sample_pack_token';

export const sessionService = {
  // Save user session
  saveSession(userData, token) {
    try {
      const sessionData = {
        user: userData,
        token: token,
        timestamp: Date.now()
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      localStorage.setItem(TOKEN_KEY, token);
      console.log('Session saved successfully');
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },

  // Get current session
  getSession() {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        // Check if session is still valid (24 hours)
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          console.log('Session retrieved successfully');
          return parsed;
        } else {
          // Session expired, clear it
          console.log('Session expired, clearing...');
          this.clearSession();
          return null;
        }
      }
      console.log('No session found');
      return null;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  },

  // Get current user
  getCurrentUser() {
    const session = this.getSession();
    return session ? session.user : null;
  },

  // Get current token
  getCurrentToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return this.getSession() !== null;
  },

  // Clear session
  clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  },

  // Refresh session timestamp
  refreshSession() {
    try {
      const session = this.getSession();
      if (session) {
        session.timestamp = Date.now();
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  },

  // Check if session is about to expire (within 5 minutes)
  isSessionExpiringSoon() {
    try {
      const session = this.getSession();
      if (session) {
        const timeUntilExpiry = (24 * 60 * 60 * 1000) - (Date.now() - session.timestamp);
        return timeUntilExpiry < 5 * 60 * 1000; // 5 minutes
      }
      return false;
    } catch (error) {
      console.error('Failed to check session expiry:', error);
      return false;
    }
  }
};
