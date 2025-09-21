// This file centralizes all API calls from your frontend to your backend.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * A helper function to handle API requests.
 * @param {string} endpoint - The API endpoint to call (e.g., '/api/login').
 * @param {object} options - Configuration for the fetch request (method, body, etc.).
 * @returns {Promise<any>} - The JSON response from the backend.
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Throw an error with the specific message from the backend if it exists.
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error; // Re-throw the error so the component can catch and display it.
  }
};

// This object exports all the specific API functions your app needs.
export const api = {
  /**
   * Logs in a user by sending their Firebase ID token to the backend for verification.
   * @param {object} tokenData - An object containing the idToken: { idToken: '...' }
   * @returns {Promise<any>} - The user profile data from your backend.
   */
  login: (tokenData) => request('/api/login', { method: 'POST', body: tokenData }),
  
  /**
   * Signs up a new user.
   * @param {object} userData - { email, password, firstName, lastName }
   * @returns {Promise<any>} - The newly created user's data.
   */
  signup: (userData) => request('/api/signup', { method: 'POST', body: userData }),
};

