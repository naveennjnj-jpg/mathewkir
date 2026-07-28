// pages/admin/AdminSettings/AdminSettings.tsx
import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Shield,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
  Upload,
  User,
  Globe,
  Clock
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PlatformSettings {
  id: string;
  platform_name: string;
  platform_logo: string | null;
  default_language: string;
  timezone: string;
  updated_at: string;
  updated_by: string | null;
}

const TreasurerSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    platform_name: '',
    platform_logo: '',
    default_language: 'en',
    timezone: 'UTC'
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Language options
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'hi', label: 'Hindi' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ar', label: 'Arabic' }
  ];

  // Timezone options
  const timezoneOptions = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'EST', label: 'EST (Eastern Standard Time)' },
    { value: 'CST', label: 'CST (Central Standard Time)' },
    { value: 'MST', label: 'MST (Mountain Standard Time)' },
    { value: 'PST', label: 'PST (Pacific Standard Time)' },
    { value: 'IST', label: 'IST (India Standard Time)' },
    { value: 'GMT', label: 'GMT (Greenwich Mean Time)' },
    { value: 'CET', label: 'CET (Central European Time)' },
    { value: 'EET', label: 'EET (Eastern European Time)' },
    { value: 'JST', label: 'JST (Japan Standard Time)' },
    { value: 'AEST', label: 'AEST (Australian Eastern Standard Time)' }
  ];

  // Tabs configuration
  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.get(`${API_URL}/api/settings/platform`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response.data.success) {
        const data = response.data.data;
        setSettings(data);
        setFormData({
          platform_name: data.platform_name || '',
          platform_logo: data.platform_logo || '',
          default_language: data.default_language || 'en',
          timezone: data.timezone || 'UTC'
        });
if (data.platform_logo) {
  setLogoPreview(`${import.meta.env.VITE_API_URL}${data.platform_logo}`);
}
      } else {
        setError(response.data.message || 'Failed to fetch settings');
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setError(error.response?.data?.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  // Save general settings
// Save general settings
const handleSaveGeneralSettings = async () => {
  try {
    setSaving(true);
    setError(null);

    const tenantSubdomain = localStorage.getItem("tenantSubdomain") || "";

    // Existing logo
    let platformLogo = formData.platform_logo;

    // Upload new logo if selected
    if (logoFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("profileImage", logoFile);

      const uploadResponse = await axios.post(
        `${API_URL}/api/update-profile-pic`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.data.success) {
        platformLogo = uploadResponse.data.data.imageUrl;
      }
    }

    // Save platform settings
    const response = await axios.put(
      `${API_URL}/api/settings/platform`,
      {
        ...formData,
        platform_logo: platformLogo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-Subdomain": tenantSubdomain,
        },
      }
    );

if (response.data.success) {
  toast.success("Settings saved successfully!");

  setTimeout(() => {
    window.location.reload();
  }, 1000); // Refresh after 1 second so the toast is visible
}else {
      const message = response.data.message || "Failed to save settings";
      setError(message);
      toast.error(message);
    }
  } catch (error: any) {
    console.error("Error saving settings:", error);

    const message =
      error.response?.data?.message || "Failed to save settings";

    setError(message);
    toast.error(message);
  } finally {
    setSaving(false);
  }
};

  // Change password
  const handleChangePassword = async () => {
    try {
      // Validation
      if (!passwordData.currentPassword) {
        setPasswordError('Current password is required');
        return;
      }
      if (!passwordData.newPassword) {
        setPasswordError('New password is required');
        return;
      }
      if (passwordData.newPassword.length < 8) {
        setPasswordError('New password must be at least 8 characters');
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }

      setPasswordError(null);
      setChangingPassword(true);
      setPasswordSuccess(false);

      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.post(
        `${API_URL}/api/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        setPasswordSuccess(true);
        toast.success('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(response.data.message || 'Failed to change password');
        toast.error(response.data.message || 'Failed to change password');
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      const message = error.response?.data?.message || 'Failed to change password';
      setPasswordError(message);
      toast.error(message);
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo file must be less than 2MB');
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData({ ...formData, platform_logo: '' });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <main>
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Configure system settings and security preferences
                </p>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="ml-auto text-sm text-red-600 dark:text-red-400 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
              <nav className="-mb-px flex space-x-6 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'border-brand-500 text-brand-500'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Branding */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Branding
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          value={formData.platform_name}
                          onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                          placeholder="Enter platform name"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          Platform Logo
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                            {logoPreview ? (
                              <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-2xl font-bold text-gray-400">?</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                              <Upload className="w-4 h-4" />
                              Upload
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                                onChange={handleLogoUpload}
                                className="hidden"
                              />
                            </label>
                            {(logoFile || logoPreview) && (
                              <button
                                onClick={handleRemoveLogo}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">PNG or SVG, max 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Platform Settings */}
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Platform Settings
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          Default Language
                        </label>
                        <select
                          value={formData.default_language}
                          onChange={(e) => setFormData({ ...formData, default_language: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                        >
                          {languageOptions.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                              {lang.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          Time Zone
                        </label>
                        <select
                          value={formData.timezone}
                          onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                        >
                          {timezoneOptions.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Save Button - Inside General Tab */}
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex items-center gap-3">
                    {saveSuccess && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        Settings saved!
                      </span>
                    )}

                    <button
                      onClick={handleSaveGeneralSettings}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  {/* Change Password */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      Change Password
                    </h3>
                    <div className="space-y-4 max-w-lg">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                            placeholder="Enter new password (min 8 characters)"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {passwordError && (
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span>{passwordError}</span>
                        </div>
                      )}

                      {passwordSuccess && (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Password changed successfully!</span>
                        </div>
                      )}

                      {/* Save Button - Inside Security Tab */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={handleChangePassword}
                          disabled={changingPassword}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
                        >
                          {changingPassword ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Changing...
                            </>
                          ) : (
                            <>
                              <Key className="w-4 h-4" />
                              Change Password
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TreasurerSettings;