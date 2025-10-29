import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User } from '../types';

// This enum defines the two possible screens for an unauthenticated user.
export type AuthScreen = 'login' | 'register';

interface IAuthContext {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    authScreen: AuthScreen;
    setAuthScreen: (screen: AuthScreen) => void;
    login: (email: string, password?: string) => Promise<void>;
    register: (name: string, email: string, password?: string) => Promise<void>;
    loginWithGoogle: () => void;
    logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

// --- MOCK API FUNCTIONS ---
// In a real application, you would replace these with `fetch` calls to your backend API.

const fakeApiCall = (delay = 1000) => new Promise(resolve => setTimeout(resolve, delay));

const mockLogin = async (email: string, password?: string): Promise<User> => {
    await fakeApiCall();
    console.log(`Attempting login with email: ${email}`);
    // Basic validation for demonstration. A real backend would handle this.
    if (!email || !password) {
        throw new Error("ایمیل و رمز عبور لازم است.");
    }
    if (password === 'password123') {
        return { id: 'user-123', name: 'کاربر تستی', email: email };
    }
    throw new Error("نام کاربری یا رمز عبور نامعتبر است.");
};

const mockRegister = async (name: string, email: string, password?: string): Promise<User> => {
    await fakeApiCall();
    console.log(`Attempting registration for: ${name} <${email}>`);
    if (!name || !email || !password) {
        throw new Error("نام، ایمیل و رمز عبور لازم است.");
    }
    // Simulate successful registration
    return { id: `user-${Date.now()}`, name, email };
};

// --- AUTH PROVIDER ---

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

    useEffect(() => {
        // This effect simulates checking for an existing session on app load.
        // In a real app, you might validate a token with a `GET /api/auth/me` endpoint.
        const checkSession = async () => {
            setIsLoading(true);
            try {
                // Simulate checking a stored token
                const token = sessionStorage.getItem('authToken');
                if (token) {
                    await fakeApiCall(500); // Simulate network latency
                    // In a real app, you would decode the token or send it to the backend for validation
                    setUser({ id: 'user-123', name: 'کاربر تستی', email: 'test@example.com' });
                }
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = async (email: string, password?: string) => {
        setIsLoading(true);
        try {
            const loggedInUser = await mockLogin(email, password);
            setUser(loggedInUser);
            sessionStorage.setItem('authToken', 'fake-jwt-token'); // Simulate session persistence
        } catch (error) {
            alert((error as Error).message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password?: string) => {
        setIsLoading(true);
        try {
            const registeredUser = await mockRegister(name, email, password);
            setUser(registeredUser);
            sessionStorage.setItem('authToken', 'fake-jwt-token'); // Simulate session persistence
        } catch (error) {
            alert((error as Error).message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    
    const loginWithGoogle = () => {
        // In a real application, this would redirect to your backend's Google auth route.
        // e.g., window.location.href = '/api/auth/google';
        alert("منطق ورود با گوگل در اینجا پیاده‌سازی می‌شود. این کار باعث هدایت به بک‌اند شما می‌شود.");
        // For demonstration, we'll just log in a mock user after a delay.
        setIsLoading(true);
        setTimeout(() => {
            const googleUser = { id: 'google-user-456', name: 'کاربر گوگل', email: 'google.user@example.com' };
            setUser(googleUser);
            sessionStorage.setItem('authToken', 'fake-google-jwt-token');
            setIsLoading(false);
        }, 1500);
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('authToken');
        setAuthScreen('login'); // Reset to login screen after logout
    };
    
    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user,
            isLoading,
            authScreen,
            setAuthScreen,
            login,
            register,
            loginWithGoogle,
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
