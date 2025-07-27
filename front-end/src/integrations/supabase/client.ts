// This file has been updated to remove Supabase dependencies
// It now only provides helper functions for the local API

// Environment switch: 'local' only (Supabase has been removed)
export const BACKEND_MODE = import.meta.env.VITE_BACKEND_MODE || 'local';

// Use Vite proxy in development, environment variable in production
export const LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL || '/api';

// Helper to check if using local API (always true now)
export const isLocalApi = () => true;