// pages/AdminSettings/AdminSettings.tsx
import React, { useState } from 'react';
import {
  Settings,
  Save,
  Shield,
  Bell,
  Mail,
  Globe,
  Database,
  Users,
  Lock,
  Key,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Upload,
  Trash2,
  Plus,
  X,
  User,
  Building2,
  Clock,
  FileText
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => { if (window.innerWidth < 1024) setIsSidebarOpen(false); };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* Branding */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Branding</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Platform Name
            </label>
            <input
              type="text"
              defaultValue="BRT150 Demo Day"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Platform Logo
            </label>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <img src="/images/logo/logo-icon.svg" alt="Logo" className="h-8 w-8" />
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400">
                <Upload className="w-4 h-4" />
                Upload New
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Settings */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Platform Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Default Language
            </label>
            <select className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Time Zone
            </label>
            <select className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90">
              <option value="UTC">UTC</option>
              <option value="EST">EST (UTC-5)</option>
              <option value="CST">CST (UTC-6)</option>
              <option value="MST">MST (UTC-7)</option>
              <option value="PST">PST (UTC-8)</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="maintenance" defaultChecked className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
            <label htmlFor="maintenance" className="text-sm text-gray-700 dark:text-gray-400">
              Enable Maintenance Mode
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Two-Factor Authentication</h3>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-white/90">Enable 2FA</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Session Management</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white/90">Current Session</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chrome on Windows • IP: 192.168.1.100</p>
              </div>
            </div>
            <span className="text-xs font-medium text-green-600 dark:text-green-400">Active</span>
          </div>
          <button className="text-sm text-red-500 hover:text-red-600 font-medium">
            Terminate All Other Sessions
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">New Tenant Registration</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when a new tenant registers</p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-500 transition-colors">
            <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform"></span>
          </button>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">System Alerts</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Critical system notifications and alerts</p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-500 transition-colors">
            <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform"></span>
          </button>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">Security Events</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Failed login attempts and security breaches</p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors dark:bg-gray-700">
            <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition-transform"></span>
          </button>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">Financial Reports</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Weekly and monthly financial summaries</p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-500 transition-colors">
            <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform"></span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">SMTP Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              SMTP Host
            </label>
            <input
              type="text"
              defaultValue="smtp.gmail.com"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              SMTP Port
            </label>
            <input
              type="text"
              defaultValue="587"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              SMTP Username
            </label>
            <input
              type="text"
              defaultValue="admin@brt150.com"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              SMTP Password
            </label>
            <input
              type="password"
              value="••••••••"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              From Email Address
            </label>
            <input
              type="email"
              defaultValue="noreply@brt150.com"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
            />
          </div>
          <button className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600">
            <RefreshCw className="w-4 h-4" />
            Test SMTP Connection
          </button>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Database Management</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Database Size</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white/90">2.4 GB</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Backup</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white/90">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Backup Now
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400">
              <Upload className="w-4 h-4" />
              Restore Backup
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
        <div className="space-y-3">
          <div className="rounded-lg border border-red-200 dark:border-red-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">Clear All Data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">This will permanently delete all data</p>
              </div>
              <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors">
                <Trash2 className="w-4 h-4 inline mr-2" />
                Clear Data
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-red-200 dark:border-red-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">Delete All Accounts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete all user accounts</p>
              </div>
              <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Delete Accounts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">User Management Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Default User Role
            </label>
            <select className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Maximum Login Attempts
            </label>
            <input
              type="number"
              defaultValue="5"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              defaultValue="60"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
            />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
            <label className="text-sm text-gray-700 dark:text-gray-400">
              Require email verification for new users
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
            <label className="text-sm text-gray-700 dark:text-gray-400">
              Allow users to register without invitation
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationsSettings();
      case 'email': return renderEmailSettings();
      case 'database': return renderDatabaseSettings();
      case 'users': return renderUsersSettings();
      default: return renderGeneralSettings();
    }
  };

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
                  Configure system-wide settings and preferences
                </p>
              </div>
              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
                    <CheckCircle className="w-4 h-4" />
                    Settings saved successfully!
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
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
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;