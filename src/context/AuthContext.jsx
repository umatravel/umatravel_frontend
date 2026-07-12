import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext({
  user: null,
  session: null,
  token: null,
  loading: true,
  isAdmin: false,
  login: async () => {},
  logout: async () => {},
  getToken: async () => null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial active session
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (mounted) {
        if (error) {
          console.warn('Error fetching initial session:', error.message);
        }
        setSession(initialSession || null);
        setUser(initialSession?.user ?? null);
        setLoading(false);
      }
    });

    // 2. Listen for authentication state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        setSession(currentSession || null);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }, []);

  const getToken = useCallback(async () => {
    if (session?.access_token) return session.access_token;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  }, [session]);

  const token = session?.access_token || null;
  const isAdmin = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        token,
        loading,
        isAdmin,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
