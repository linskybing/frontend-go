import React, { useState, useEffect } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import ProfileForm, { FormState } from '../components/ProfileForm';
import StatusMessage from '../components/StatusMessage';
import ThemeSettings from '../components/ThemeSettings';

interface UserProfile {
  user_id?: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
}

type FormStatusType = 'idle' | 'loading' | 'success' | 'error';

const ProfileSettingsPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<FormState>({
    username: '',
    name: '',
    email: '',
    phone: '',
    department: '',
  });
  const [statusType, setStatusType] = useState<FormStatusType>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        const profile: UserProfile = {
          user_id: parsed.user_id || parsed.id,
          username: parsed.username || '',
          name: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          department: parsed.department || '',
        };
        setUserProfile(profile);
        setFormData({
          username: profile.username,
          name: profile.name,
          email: profile.email,
          phone: profile.phone || '',
          department: profile.department || '',
        });

        const uid = profile.user_id;
        const settingsKey = `userSettings_${uid}`;
        const settings = localStorage.getItem(settingsKey);
        if (settings) {
          const parsed2 = JSON.parse(settings);
          setCurrentTheme(parsed2.theme || 'light');
        }
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setStatusType('idle');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatusType('error');
      setStatusMessage('Invalid email format');
      return;
    }

    setStatusType('loading');
    setStatusMessage('');

    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        const updated = {
          ...parsed,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
        };
        localStorage.setItem('userData', JSON.stringify(updated));
        setUserProfile(updated);
        setIsEditing(false);
        setStatusType('success');
        setStatusMessage('Profile updated successfully');
        setTimeout(() => {
          setStatusType('idle');
        }, 3000);
      }
    } catch {
      setStatusType('error');
      setStatusMessage('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        username: userProfile.username,
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone || '',
        department: userProfile.department || '',
      });
    }
    setIsEditing(false);
    setStatusType('idle');
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 dark:border-accent-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile & Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {userProfile && (
                <>
                  <ProfileHeader
                    name={formData.name}
                    username={formData.username}
                    email={formData.email}
                    isEditing={isEditing}
                    onEditClick={() => setIsEditing(true)}
                  />
                  <StatusMessage type={statusType} message={statusMessage} />
                  <ProfileForm
                    formData={formData}
                    isEditing={isEditing}
                    isLoading={statusType === 'loading'}
                    onInputChange={handleInputChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </>
              )}
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Appearance
              </h3>
              <ThemeSettings
                currentTheme={currentTheme}
                onThemeChange={(theme) => setCurrentTheme(theme)}
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Tip
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Keep your profile information up to date for the best experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
