import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Profile } from '../types';
import { UsersIcon, TrashIcon } from './icons';

export const ProfileManager: React.FC = () => {
    const { profiles, login, createProfile, deleteProfile } = useAuth();
    const [isCreating, setIsCreating] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleCreateProfile = () => {
        if (!newProfileName.trim()) {
            setError('نام پروفایل نمی‌تواند خالی باشد.');
            return;
        }
        createProfile(newProfileName, newPassword);
        setNewProfileName('');
        setNewPassword('');
        setError('');
        setIsCreating(false);
    };

    const handleSelectProfile = (profile: Profile) => {
        if (profile.passwordHash) {
            const password = prompt(`رمز عبور پروفایل '${profile.name}' را وارد کنید:`);
            if (password !== null) {
                login(profile.id, password);
            }
        } else {
            login(profile.id);
        }
    };
    
    const handleDeleteProfile = (e: React.MouseEvent, profileId: string) => {
        e.stopPropagation(); // Prevent profile selection
        if (window.confirm("آیا مطمئن هستید که می‌خواهید این پروفایل و تمام داده‌های آن را حذف کنید؟ این عمل غیرقابل بازگشت است.")) {
            deleteProfile(profileId);
        }
    }

    const createProfileForm = (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">ایجاد پروفایل جدید</h2>
            <div className="glass-card p-8 space-y-4">
                {error && <p className="text-danger text-center">{error}</p>}
                <input
                    type="text"
                    placeholder="نام پروفایل (مثلا: خانواده رضایی)"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="form-input"
                />
                <input
                    type="password"
                    placeholder="رمز عبور (اختیاری)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input"
                />
                <div className="bg-amber-500/20 text-amber-700 dark:text-amber-300 p-3 rounded-xl text-sm" role="alert">
                    <strong>توجه:</strong> این رمز عبور برای امنیت نیست، بلکه برای جلوگیری از دسترسی تصادفی است. داده‌ها همچنان روی این دستگاه ذخیره می‌شوند.
                </div>
                <div className="flex gap-4">
                    <button onClick={handleCreateProfile} className="btn-primary flex-grow">ایجاد</button>
                    <button onClick={() => setIsCreating(false)} className="btn-secondary flex-grow">انصراف</button>
                </div>
            </div>
        </div>
    );

    const profileSelection = (
        <div className="w-full max-w-md mx-auto text-center">
            <UsersIcon className="w-24 h-24 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold mb-2">انتخاب پروفایل</h1>
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-8">برای شروع یک پروفایل را انتخاب کنید یا یک پروفایل جدید بسازید.</p>
            <div className="space-y-4">
                {profiles.map(profile => (
                    <div key={profile.id} className="relative group">
                        <button
                            onClick={() => handleSelectProfile(profile)}
                            className="w-full btn-secondary !justify-start !text-lg !py-4"
                        >
                            {profile.name}
                        </button>
                        <button onClick={(e) => handleDeleteProfile(e, profile.id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-danger dark:hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Delete profile ${profile.name}`}>
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={() => setIsCreating(true)} className="btn-primary mt-8">
                ایجاد پروفایل جدید
            </button>
        </div>
    );

    return isCreating ? createProfileForm : profileSelection;
};
