// pages/treasurer/NotificationsSettings.tsx
import React, { useState } from 'react';
import {
  Bell,
  Mail,
  BellOff,
  Settings,
  Clock,
  AlertCircle,
  Save,
  RefreshCw,
  Loader2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationsSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    reminderFrequency: 'daily',
    emailNotifications: true,
    inAppNotifications: true,
    overdueAlertThreshold: 7
  });

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Notification settings saved successfully');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Notification Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configure how you receive notifications
        </p>
      </div>

      <div className="space-y-6">
        {/* Reminder Frequency */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Reminder Frequency
            </h2>
          </div>
          <select
            value={settings.reminderFrequency}
            onChange={(e) => setSettings({ ...settings, reminderFrequency: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Email Notifications */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-500" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Email Notifications
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
              className="text-2xl"
            >
              {settings.emailNotifications ? (
                <ToggleRight className="w-8 h-8 text-brand-500" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* In-App Notifications */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-brand-500" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  In-App Notifications
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications within the app
                </p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, inAppNotifications: !settings.inAppNotifications })}
              className="text-2xl"
            >
              {settings.inAppNotifications ? (
                <ToggleRight className="w-8 h-8 text-brand-500" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Overdue Alert Threshold */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Overdue Alert Threshold
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={settings.overdueAlertThreshold}
              onChange={(e) => setSettings({ ...settings, overdueAlertThreshold: parseInt(e.target.value) })}
              min="1"
              max="30"
              className="w-24 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">days overdue</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            You'll be alerted when a payment is overdue by this many days
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NotificationsSettings;