import axios from 'axios';
import { supabase } from './supabase.js';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = rawBaseUrl.split(',')[0].trim();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to automatically attach Supabase JWT token for all protected requests
api.interceptors.request.use(
  async (config) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.warn('Unable to get Supabase session token for API request:', err.message);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected API error occurred',
      status: error.response?.status,
      errors: error.response?.data?.errors || null,
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  }
);

export default api;
