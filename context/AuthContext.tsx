import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export type AuthScreen = 'login' | 'register';

interface IAuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authScreen: AuthScreen;
  setAuthScreen: (screen: AuthScreen) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const getDisplayName = (metadata: Record<string, any> | undefined, email: string | null) => {
  if (metadata?.full_name) return metadata.full_name as string;
  if (metadata?.name) return metadata.name as string;
  if (email) return email.split('@')[0];
  return 'بازیکن دومینو';
};

const mapSupabaseUserToUser = (supabaseUser: NonNullable<Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user']>>): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    name: getDisplayName(supabaseUser.user_metadata, supabaseUser.email ?? null),
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!isSupabaseConfigured) {
        console.error('Supabase credentials are missing. Authentication is disabled.');
        setIsLoading(false);
        setAuthError('پیکربندی سوبا‌بیس کامل نشده است. مقادیر VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY را تنظیم کنید.');
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data?.session?.user && mounted) {
          setUser(mapSupabaseUserToUser(data.session.user));
        }
      } catch (error) {
        console.error('Failed to restore Supabase session', error);
        if (mounted) {
          setAuthError('مشکلی در بازیابی نشست وجود دارد. لطفاً دوباره وارد شوید.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    init();

    if (!isSupabaseConfigured) {
      return () => {
        mounted = false;
      };
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(mapSupabaseUserToUser(session.user));
        setAuthError(null);
      }
      if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(mapSupabaseUserToUser(session.user));
      }
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) {
      setAuthError('لطفاً ایمیل و رمز عبور را وارد کنید.');
      return;
    }

    if (!isSupabaseConfigured) {
      setAuthError('ورود بدون پیکربندی سوپابیس ممکن نیست.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setAuthError(null);
    } catch (error: any) {
      console.error('Supabase login failed', error);
      setAuthError(error?.message ?? 'ورود ناموفق بود. لطفاً دوباره تلاش کنید.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (!email || !password) {
      setAuthError('ایمیل و رمز عبور لازم است.');
      return;
    }

    if (!isSupabaseConfigured) {
      setAuthError('ثبت‌نام بدون پیکربندی سوپابیس ممکن نیست.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { full_name: name },
        },
      });
      if (error) throw error;
      setAuthScreen('login');
      setAuthError('برای فعال‌سازی حساب ایمیل خود را بررسی کنید.');
    } catch (error: any) {
      console.error('Supabase sign up failed', error);
      setAuthError(error?.message ?? 'ثبت نام ناموفق بود.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setAuthError('ورود گوگل بدون سوپابیس ممکن نیست.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setAuthError(null);
    } catch (error: any) {
      console.error('Supabase Google login failed', error);
      setAuthError(error?.message ?? 'ورود با گوگل انجام نشد.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      console.error('Supabase logout failed', error);
      setAuthError(error?.message ?? 'خروج انجام نشد.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<IAuthContext>(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    authScreen,
    setAuthScreen,
    login,
    register,
    loginWithGoogle,
    logout,
    authError,
  }), [authError, authScreen, isLoading, login, loginWithGoogle, logout, register, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
