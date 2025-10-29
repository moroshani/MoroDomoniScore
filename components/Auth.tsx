import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon, AtSymbolIcon, LockClosedIcon, UserCircleIcon, UsersIcon } from './icons';

export const Auth: React.FC = () => {
    const { authScreen, setAuthScreen, login, register, loginWithGoogle, isLoading } = useAuth();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (authScreen === 'login') {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
        } catch (error) {
            console.error("Authentication failed", error);
        }
    };
    
    const isLogin = authScreen === 'login';

    return (
        <div className="w-full max-w-md mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <UsersIcon className="w-20 h-20 mx-auto text-primary mb-4" />
                <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {isLogin ? 'خوش آمدید' : 'ایجاد حساب'}
                </h1>
                <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mt-2">
                    {isLogin ? 'برای ادامه وارد حساب خود شوید' : 'برای شروع یک حساب جدید بسازید'}
                </p>
            </div>

            <div className="glass-card p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                         <div className="relative">
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary-light dark:text-text-secondary-dark">
                                <UserCircleIcon className="w-5 h-5"/>
                            </span>
                            <input
                                type="text"
                                placeholder="نام کامل"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="form-input pr-10"
                                required
                            />
                        </div>
                    )}
                    <div className="relative">
                         <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary-light dark:text-text-secondary-dark">
                            <AtSymbolIcon className="w-5 h-5"/>
                        </span>
                        <input
                            type="email"
                            placeholder="ایمیل"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="form-input pr-10"
                            required
                        />
                    </div>
                    <div className="relative">
                         <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary-light dark:text-text-secondary-dark">
                            <LockClosedIcon className="w-5 h-5"/>
                        </span>
                        <input
                            type="password"
                            placeholder="رمز عبور"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="form-input pr-10"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full !text-lg" disabled={isLoading}>
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        ) : (isLogin ? 'ورود' : 'ثبت نام')}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-bkg-light dark:bg-slate-800 text-text-secondary-light dark:text-text-secondary-dark rounded-full">
                            یا
                        </span>
                    </div>
                </div>

                <button onClick={loginWithGoogle} className="btn-secondary w-full" disabled={isLoading}>
                    <GoogleIcon className="w-5 h-5 fill-current" />
                    <span>{isLogin ? 'ورود با گوگل' : 'ثبت نام با گوگل'}</span>
                </button>
                
                <p className="mt-6 text-center text-sm">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">
                         {isLogin ? 'حساب کاربری ندارید؟' : 'قبلا ثبت نام کرده‌اید؟'}
                    </span>
                    <button
                        onClick={() => setAuthScreen(isLogin ? 'register' : 'login')}
                        className="font-semibold text-primary hover:underline ml-1"
                    >
                        {isLogin ? 'ثبت نام کنید' : 'وارد شوید'}
                    </button>
                </p>
            </div>
        </div>
    );
};
