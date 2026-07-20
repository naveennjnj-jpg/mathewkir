// components/settings/PreferencesTab.tsx
import React, { useState, useEffect } from "react";
import { Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface PreferencesData {
  language: string;
  timezone: string;
  theme: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const PreferencesTab = () => {
  const { user, updateDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<PreferencesData>({
    language: "en",
    timezone: "SAST",
    theme: "light",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (user) {
      setPreferences({
        language: (user as any).language || "en",
        timezone: (user as any).timezone || "SAST",
        theme: (user as any).theme || "light",
      });
      setLoading(false);
    }
  }, [user]);

  // Apply theme on load and when it changes
  useEffect(() => {
    applyTheme(preferences.theme);
  }, [preferences.theme]);

  const applyTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThemeChange = (theme: string) => {
    setPreferences((prev) => ({
      ...prev,
      theme,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch<ApiResponse>(
        `${API_URL}/api/auth/update-profile`,
        {
          language: preferences.language,
          timezone: preferences.timezone,
          theme: preferences.theme,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);

        if (updateDetails) {
          await updateDetails({
            language: preferences.language,
            timezone: preferences.timezone,
            theme: preferences.theme,
          } as any);
        }

        applyTheme(preferences.theme);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || "Failed to save preferences");
      }
    } catch (err: any) {
      console.error("Error saving preferences:", err);
      setError(err.response?.data?.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin" />
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 dark:text-gray-200">
      <h2 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-5">
        Preferences
      </h2>

      {/* Success/Error Messages */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl text-sm mb-4">
          <CheckCircle className="w-4 h-4" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Language */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">
            Language
          </label>
          <select
            name="language"
            value={preferences.language}
            onChange={handleChange}
            className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/10 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="en">English</option>
            <option value="af">Afrikaans</option>
            <option value="zu">isiZulu</option>
            <option value="xh">isiXhosa</option>
            <option value="st">Sesotho</option>
            <option value="ts">Xitsonga</option>
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">
            Timezone
          </label>
          <select
            name="timezone"
            value={preferences.timezone}
            onChange={handleChange}
            className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/10 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="Africa/Johannesburg">Africa/Johannesburg</option>
            <option value="Africa/Lagos">Africa/Lagos</option>
            <option value="Africa/Nairobi">Africa/Nairobi</option>
            <option value="Africa/Cairo">Africa/Cairo</option>
            <option value="Africa/Accra">Africa/Accra</option>
            <option value="Europe/London">Europe/London</option>
            <option value="UTC">UTC</option>
          </select>
        </div>

        {/* Theme */}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">
            Theme
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleThemeChange("light")}
              className={`flex-1 p-3 border rounded-xl text-center transition-all bg-white dark:bg-gray-800 ${preferences.theme === "light"
                  ? "border-[#C85A32] dark:border-[#C85A32] ring-2 ring-[#C85A32]/20 dark:ring-[#C85A32]/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
            >
              <div className="w-6 h-6 bg-white border border-gray-300 dark:border-gray-600 rounded-full mx-auto mb-1"></div>
              <p className={`text-xs font-medium ${preferences.theme === "light"
                  ? "text-[#0F2D63] dark:text-[#C85A32]"
                  : "text-gray-400 dark:text-gray-500"
                }`}>
                Light
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange("dark")}
              className={`flex-1 p-3 border rounded-xl text-center transition-all bg-white dark:bg-gray-800 ${preferences.theme === "dark"
                  ? "border-[#C85A32] dark:border-[#C85A32] ring-2 ring-[#C85A32]/20 dark:ring-[#C85A32]/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
            >
              <div className="w-6 h-6 bg-[#0F2D63] dark:bg-gray-300 rounded-full mx-auto mb-1"></div>
              <p className={`text-xs font-medium ${preferences.theme === "dark"
                  ? "text-[#0F2D63] dark:text-[#C85A32]"
                  : "text-gray-400 dark:text-gray-500"
                }`}>
                Dark
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange("system")}
              className={`flex-1 p-3 border rounded-xl text-center transition-all bg-white dark:bg-gray-800 ${preferences.theme === "system"
                  ? "border-[#C85A32] dark:border-[#C85A32] ring-2 ring-[#C85A32]/20 dark:ring-[#C85A32]/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
            >
              <div className="w-6 h-6 bg-gradient-to-r from-gray-100 dark:from-gray-600 to-[#0F2D63] dark:to-gray-300 rounded-full mx-auto mb-1"></div>
              <p className={`text-xs font-medium ${preferences.theme === "system"
                  ? "text-[#0F2D63] dark:text-[#C85A32]"
                  : "text-gray-400 dark:text-gray-500"
                }`}>
                System
              </p>
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#C85A32] dark:hover:bg-[#a8472a]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PreferencesTab;