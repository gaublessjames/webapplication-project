// API client configuration and utilities
export const LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5000';

// Auth utilities
export const auth = {
  // Get current user from localStorage
  getCurrentUser: () => {
    const token = localStorage.getItem('jwt');
    if (!token) return null;
    
    try {
      // In a real app, you might want to decode the JWT token
      // For now, we'll return a basic user object
      return {
        token,
        isAuthenticated: true
      };
    } catch (error) {
      console.error('Error parsing user from token:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('jwt');
    return !!token;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('jwt');
  },

  // Set auth token
  setToken: (token: string) => {
    localStorage.setItem('jwt', token);
  },

  // Remove auth token
  removeToken: () => {
    localStorage.removeItem('jwt');
  }
};

// API request utility function
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('jwt');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${LOCAL_API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}; 