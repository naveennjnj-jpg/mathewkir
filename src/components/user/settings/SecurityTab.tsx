// components/settings/SecurityTab.tsx
import React, { useState, useEffect } from "react";
import { Lock, Shield, Save, Loader2, AlertCircle, CheckCircle, Eye, EyeOff, Clock } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const SecurityTab = () => {
  const { user, updateDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Show/hide password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Two-factor authentication
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Load 2FA status from user data
  useEffect(() => {
    if (user) {
      setTwoFactorAuth((user as any).twoFactorAuth || false);
    }
  }, [user]);

  // Password validation
  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    return errors;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validation
    if (!currentPassword) {
      setError("Please enter your current password");
      setLoading(false);
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from current password");
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0]);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/auth/change-password`,
        {
          currentPassword,
          newPassword,
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
        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || "Failed to update password");
      }
    } catch (err: any) {
      console.error("Password change error:", err);
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    setTwoFactorLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch<ApiResponse>(
        `${API_URL}/api/auth/update-profile`,
        {
          twoFactorAuth: !twoFactorAuth,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const newStatus = !twoFactorAuth;
        setTwoFactorAuth(newStatus);
        
        // Update user context
        if (updateDetails) {
          await updateDetails({ twoFactorAuth: newStatus } as any);
        }
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || "Failed to update two-factor authentication");
      }
    } catch (err: any) {
      console.error("Two-factor error:", err);
      setError(err.response?.data?.message || "Failed to update two-factor authentication");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-5">
        Security Settings
      </h2>

      {/* Success/Error Messages */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl text-sm mb-4">
          <CheckCircle className="w-4 h-4" />
          <span>Security settings updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Password Change */}
        <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#F3EDE6] dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#C85A32]" />
            </div>
            <div>
              <p className="font-medium text-sm text-[#1C1C1C] dark:text-white">Change Password</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Update your password regularly</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-3">
            {/* Current Password */}
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/10 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/10 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Password must contain at least 8 characters, uppercase, lowercase, number, and special character
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/10 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F3EDE6] dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#C85A32]" />
              </div>
              <div>
                <p className="font-medium text-sm text-[#1C1C1C] dark:text-white">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {twoFactorAuth 
                    ? "Two-factor authentication is enabled" 
                    : "Add an extra layer of security"}
                </p>
              </div>
            </div>
            <button
              onClick={handleTwoFactorToggle}
              disabled={twoFactorLoading}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                twoFactorAuth ? 'bg-[#C85A32]' : 'bg-gray-200 dark:bg-gray-600'
              } ${twoFactorLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {twoFactorLoading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin mx-auto" />
              ) : (
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              )}
            </button>
          </div>
          {twoFactorAuth && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-xs text-green-700 dark:text-green-300">
                ✅ Two-factor authentication is enabled. Your account is more secure.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;