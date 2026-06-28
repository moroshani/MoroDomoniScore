import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { changeMyPassword, updateMyProfile } from '../lib/account';
import { EyeIcon, EyeSlashIcon } from '../components/icons';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, syncUser } = useAuth();
  const { pushToast } = useToast();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setUsername(user.username || '');
    setEmail(user.email || '');
  }, [user]);

  if (!user) {
    return null;
  }

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingProfile(true);
    try {
      const updated = await updateMyProfile({ name, username, email });
      syncUser(updated);
      pushToast('اطلاعات حساب بروزرسانی شد.', 'success');
    } catch (error) {
      pushToast((error as Error).message, 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingPassword(true);
    try {
      await changeMyPassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      pushToast('رمز عبور با موفقیت تغییر کرد.', 'success');
    } catch (error) {
      pushToast((error as Error).message, 'error');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-fade-in">
      <header className="glass-card p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark">پروفایل</h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            فقط اطلاعات ضروری حساب در این نسخه پایدار نگه داشته شده است.
          </p>
        </div>
        <button onClick={() => navigate('/')} className="btn-secondary !w-auto !px-4 !py-2 !text-xs sm:!text-sm">بازگشت</button>
      </header>

      <section className="glass-card p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">اطلاعات حساب</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">نام</label>
              <input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} className="form-input" required />
            </div>
            <div>
              <label htmlFor="profile-username" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">نام کاربری</label>
              <input id="profile-username" value={username} onChange={(event) => setUsername(event.target.value)} className="form-input" required />
            </div>
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">ایمیل</label>
            <input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="form-input" required />
          </div>
          <button type="submit" disabled={isSavingProfile} className="btn-primary !w-auto !px-5 !py-2">
            {isSavingProfile ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </form>
      </section>

      <section className="glass-card p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">تغییر رمز عبور</h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="current-password" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">رمز فعلی</label>
              <input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="form-input pl-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((value) => !value)}
                className="absolute left-3 top-[2.35rem] text-text-secondary-light dark:text-text-secondary-dark"
              >
                {showCurrentPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="new-password" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">رمز جدید</label>
              <input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="form-input pl-12"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((value) => !value)}
                className="absolute left-3 top-[2.35rem] text-text-secondary-light dark:text-text-secondary-dark"
              >
                {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={isSavingPassword} className="btn-primary !w-auto !px-5 !py-2">
            {isSavingPassword ? 'در حال تغییر...' : 'تغییر رمز عبور'}
          </button>
        </form>
      </section>
    </div>
  );
};
