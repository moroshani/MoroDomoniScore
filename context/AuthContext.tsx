import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User } from '../types';
import { apiFetch, clearAuthToken, getAuthToken, setAuthToken } from '../lib/api';
import { getMyProfile } from '../lib/account';

export type AuthScreen = 'login' | 'register';

interface IAuthContext {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isOfflineSession: boolean;
    authScreen: AuthScreen;
    setAuthScreen: (screen: AuthScreen) => void;
    login: (identifier: string, password?: string, rememberMe?: boolean) => Promise<void>;
    register: (name: string, username: string, email: string, password?: string, rememberMe?: boolean) => Promise<void>;
    refreshUser: () => Promise<void>;
    syncUser: (nextUser: User) => void;
    logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);
const CACHED_USER_KEY = 'cachedUserProfile';

const readCachedUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(CACHED_USER_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as User;
    } catch {
        return null;
    }
};

const writeCachedUser = (nextUser: User | null) => {
    if (typeof window === 'undefined') return;
    if (!nextUser) {
        localStorage.removeItem(CACHED_USER_KEY);
        return;
    }
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(nextUser));
};

const isLikelyOfflineError = (error: unknown) => {
    const message = String((error as Error)?.message || '').toLowerCase();
    return message.includes('ارتباط با سرور برقرار نشد')
        || message.includes('درخواست بیش از حد طول کشید')
        || message.includes('network')
        || message.includes('failed to fetch');
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOfflineSession, setIsOfflineSession] = useState(false);
    const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

    const syncUser = (nextUser: User) => {
        setUser(nextUser);
        setIsOfflineSession(false);
        writeCachedUser(nextUser);
    };

    const refreshUser = async () => {
        const token = getAuthToken();
        if (!token) {
            setUser(null);
            setIsOfflineSession(false);
            writeCachedUser(null);
            return;
        }
        const profile = await getMyProfile();
        setUser(profile);
        setIsOfflineSession(false);
        writeCachedUser(profile);
    };

    useEffect(() => {
        const checkSession = async () => {
            setIsLoading(true);
            try {
                await refreshUser();
            } catch (error) {
                if (isLikelyOfflineError(error)) {
                    const cachedUser = readCachedUser();
                    if (cachedUser && getAuthToken()) {
                        setUser(cachedUser);
                        setIsOfflineSession(true);
                    } else {
                        setUser(null);
                        setIsOfflineSession(false);
                    }
                } else {
                    setUser(null);
                    setIsOfflineSession(false);
                    clearAuthToken();
                    writeCachedUser(null);
                }
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = async (identifier: string, password?: string, rememberMe = true) => {
        setIsLoading(true);
        try {
            const response = await apiFetch<{
                user: User;
                token: string;
                security?: { suspiciousLogin?: boolean; riskScore?: number };
            }>('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ identifier, password, rememberMe })
            });
            setAuthToken(response.token, rememberMe);
            setUser(response.user);
            setIsOfflineSession(false);
            writeCachedUser(response.user);
            if (response.security?.suspiciousLogin) {
                alert('ورود مشکوک ثبت شد. لطفاً نشست‌ها و امنیت حساب را بررسی کنید.');
            }
        } catch (error) {
            alert((error as Error).message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, username: string, email: string, password?: string, rememberMe = true) => {
        setIsLoading(true);
        try {
            const response = await apiFetch<{ user: User; token: string }>('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, username, email, password, rememberMe })
            });
            setAuthToken(response.token, rememberMe);
            setUser(response.user);
            setIsOfflineSession(false);
            writeCachedUser(response.user);
        } catch (error) {
            alert((error as Error).message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        if (getAuthToken()) {
            void apiFetch<void>('/api/auth/logout', { method: 'POST' }).catch(() => {});
        }
        setUser(null);
        setIsOfflineSession(false);
        clearAuthToken();
        writeCachedUser(null);
        setAuthScreen('login');
    };
    
    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user,
            isLoading,
            isOfflineSession,
            authScreen,
            setAuthScreen,
            login,
            register,
            refreshUser,
            syncUser,
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
