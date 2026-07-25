// pages/auth/ResetPassword.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowLeft, Shield, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Logo from "@/assets/home/logo.png";

interface TenantData {
  name: string;
  logo: string;
  subdomain: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [tenantLoading, setTenantLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Detect tenant from subdomain
  useEffect(() => {
    const detectTenant = async () => {
      try {
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        
        const isLocalhost = ['localhost', 'www', ''].includes(subdomain);
        const tenantSubdomain = isLocalhost ? 'default' : subdomain;

        const response = await fetch(`${API_URL}/tenants/${tenantSubdomain}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTenantData(data.data);
        } else {
          setTenantData({
            name: 'Benevolent Fund',
            logo: Logo,
            subdomain: 'default'
          });
        }
      } catch (error) {
        console.error('Failed to fetch tenant:', error);
        setTenantData({
          name: 'Benevolent Fund',
          logo: Logo,
          subdomain: 'default'
        });
      } finally {
        setTenantLoading(false);
      }
    };

    detectTenant();
  }, [API_URL]);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setError("No reset token provided. Please request a new password reset link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/reset-password`, {
        token: token,
        newPassword: password,
        confirmPassword: confirmPassword,
      });

      if (response.data.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login", { 
            state: { message: "Password reset successfully! Please login with your new password." } 
          });
        }, 2000);
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(
        err.response?.data?.message || 
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    navigate("/login");
  };

  if (tenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1768d8] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading tenant...</p>
        </div>
      </div>
    );
  }

  // Invalid Token View
  if (!isTokenValid) {
    return (
      <div className="auth min-h-screen flex">
        {/* Left Section - Branding/Art */}
        <section className="authArt hidden lg:flex flex-col justify-between w-1/2 bg-[#f8faff] p-12">
          <div className="brand flex items-center gap-3 mb-8">
            <div className="logo w-10 h-10 bg-[#1768d8] text-white flex items-center justify-center rounded-lg font-bold text-lg">
              BF
            </div>
            <div>
              <b className="block text-lg text-gray-900">{tenantData?.name || 'Benevolent Fund'}</b>
              <small className="text-xs text-gray-500">Community fundraising platform</small>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Secure community fundraising, built for trust.
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Manage members, events, payments, beneficiaries, payouts, notifications and reports from one multi-tenant platform.
            </p>
          </div>

          <small className="text-xs text-gray-400 mt-8">
            © 2026 {tenantData?.name || 'Benevolent Fund Platform'}
          </small>
        </section>

        {/* Right Section - Invalid Token */}
        <section className="authWrap flex-1 flex items-center justify-center bg-white p-6 lg:p-12">
          <div className="card authCard w-full max-w-md">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
              <p className="text-sm text-gray-500 mb-6">{error}</p>
              <Link
                to="/forgot-password"
                className="inline-flex items-center justify-center w-full bg-[#1768d8] hover:bg-[#1457b8] text-white font-medium py-2.5 rounded-lg transition"
              >
                Request New Link
              </Link>
              <div className="mt-4 text-center">
                <button
                  onClick={handleBackToSignIn}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1768d8] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </button>
              </div>
            </div>

            {/* Security Footer */}
            <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Enterprise-grade security</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="auth min-h-screen flex">
      {/* Left Section - Branding/Art */}
      <section className="authArt hidden lg:flex flex-col justify-between w-1/2 bg-[#f8faff] p-12">
        <div className="brand flex items-center gap-3 mb-8">
          <div className="logo w-10 h-10 bg-[#1768d8] text-white flex items-center justify-center rounded-lg font-bold text-lg">
            BF
          </div>
          <div>
            <b className="block text-lg text-gray-900">{tenantData?.name || 'Benevolent Fund'}</b>
            <small className="text-xs text-gray-500">Community fundraising platform</small>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Secure community fundraising, built for trust.
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Manage members, events, payments, beneficiaries, payouts, notifications and reports from one multi-tenant platform.
          </p>
        </div>

        <small className="text-xs text-gray-400 mt-8">
          © 2026 {tenantData?.name || 'Benevolent Fund Platform'}
        </small>
      </section>

      {/* Right Section - Reset Password Form */}
      <section className="authWrap flex-1 flex items-center justify-center bg-white p-6 lg:p-12">
        <div className="card authCard w-full max-w-md">
          {!success ? (
            // Reset Password Form
            <>
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h2>
                <p className="text-sm text-gray-500 mb-8">Enter your new password below</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="field mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-gray-300 focus:border-[#1768d8] focus:ring-2 focus:ring-[#1768d8]/20 outline-none transition text-sm"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Must be at least 8 characters with letters and numbers
                  </p>
                </div>

                <div className="field mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-gray-300 focus:border-[#1768d8] focus:ring-2 focus:ring-[#1768d8]/20 outline-none transition text-sm"
                      required
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1768d8] hover:bg-[#1457b8] text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleBackToSignIn}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1768d8] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                  </button>
                </div>
              </form>
            </>
          ) : (
            // Success View
            <>
              <div className="text-center">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
                <p className="text-sm text-gray-500">Redirecting to login...</p>
              </div>

              <div className="mt-8">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">
                    You can now sign in with your new password
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Enterprise-grade security</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResetPassword;