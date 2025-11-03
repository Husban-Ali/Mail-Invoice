import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserProfile, updateUserProfile } from '../lib/api';
import { User, Mail, Lock, Save } from 'lucide-react';

const Account = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserProfile();
      setProfile({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
      });
    } catch (err) {
      setError('Failed to load profile');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    try {
      await updateUserProfile(profile);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">{t("account.loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <User size={24} />
            {t("account.title")}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{t("account.subtitle")}</p>
        </div>

        {/* Profile Form */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("account.fullName")}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing ? 'bg-gray-50 text-gray-600' : ''
                }`}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("account.email")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                placeholder="email@example.com"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{t("account.emailNote")}</p>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("account.phone")}
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !isEditing ? 'bg-gray-50 text-gray-600' : ''
              }`}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center gap-2"
              >
                <User size={16} />
                {t("account.editProfile")}
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center gap-2"
                >
                  <Save size={16} />
                  {t("account.saveChanges")}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  {t("account.cancel")}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Lock size={20} />
            {t("account.security")}
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition">
              <div className="font-medium text-gray-800">{t("account.changePassword")}</div>
              <div className="text-sm text-gray-500">{t("account.changePasswordDesc")}</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition">
              <div className="font-medium text-gray-800">{t("account.twoFactor")}</div>
              <div className="text-sm text-gray-500">{t("account.twoFactorDesc")}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
