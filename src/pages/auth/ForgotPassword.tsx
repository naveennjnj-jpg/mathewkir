// pages/ForgotPassword.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Shield, Check } from "lucide-react";
import axios from "axios";
import Logo from "@/assets/home/logo.png";

interface TenantData {
  name: string;
  logo: string;
  subdomain: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/api/forgot-password`, {
        email: email.trim().toLowerCase(),
      });

      if (response.data.success) {
        setIsEmailSent(true);
      } else {
        setError(response.data.message || "Failed to send reset link");
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError(
        err.response?.data?.message || 
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTryAnotherEmail = () => {
    setIsEmailSent(false);
    setEmail("");
    setError("");
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

      {/* Right Section - Forgot Password Form */}
      <section className="authWrap flex-1 flex items-center justify-center bg-white p-6 lg:p-12">
        <div className="card authCard w-full max-w-md">
          {!isEmailSent ? (
            // Forgot Password Form
            <>
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot password</h2>
                <p className="text-sm text-gray-500 mb-8">Enter your email to receive a reset link.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="field mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#1768d8] focus:ring-2 focus:ring-[#1768d8]/20 outline-none transition text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1768d8] hover:bg-[#1457b8] text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
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
            // Check Your Inbox View
            <>
              <div className="text-center">
                <div className="w-14 h-14 bg-[#e8f0fe] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-[#1768d8]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h2>
                <p className="text-sm text-gray-500">
                  We sent a reset link to
                </p>
                <p className="font-semibold text-[#1768d8] text-sm mt-1">
                  {email}
                </p>
              </div>

              <div className="mt-8 space-y-5">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#1768d8] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">1</span>
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Check your inbox for an email from {tenantData?.name || 'Benevolent Fund'}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#1768d8] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">2</span>
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Click the secure reset link — valid for 1 hour
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#1768d8] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">3</span>
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Create a new password and sign in
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Didn't receive it? Check your spam folder.
                </p>

                <button
                  onClick={handleTryAnotherEmail}
                  className="w-full border border-gray-300 hover:border-[#1768d8] text-gray-600 hover:text-[#1768d8] font-medium py-2.5 rounded-lg transition"
                >
                  Try another email
                </button>

                <div className="text-center">
                  <button
                    onClick={handleBackToSignIn}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1768d8] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                  </button>
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

export default ForgotPassword;