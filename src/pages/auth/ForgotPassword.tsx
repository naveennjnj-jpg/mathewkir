import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, ArrowLeft, Shield, Check } from "lucide-react";
import axios from "axios";
import Logo from "@/assets/home/logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

  return (
    <div className="min-h-screen bg-[#F9F7F4] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="Magalela Media"
            className="h-20 w-auto object-contain logo-image"
          />
        </Link>
        <button
          onClick={handleBackToSignIn}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#C85A32] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          {!isEmailSent ? (
            // Forgot Password Form
            <>
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-[#F3EDE6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-5 h-5 text-[#C85A32]" />
                </div>
                <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
                  Forgot your password?
                </h1>
                <p className="text-gray-500 text-sm">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex w-full border bg-white px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A32] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 h-11 rounded-xl border-gray-200 text-sm"
                        placeholder="you@institution.edu"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            // Check Your Inbox View
            <>
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-[#F3EDE6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check className="w-5 h-5 text-[#C85A32]" />
                </div>
                <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
                  Check your inbox
                </h1>
                <p className="text-gray-500 text-sm">
                  We sent a reset link to
                </p>
                <p className="font-semibold text-[#0F2D63] text-sm mt-1">
                  {email}
                </p>
              </div>

              {/* Steps Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 space-y-5">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#C85A32] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">1</span>
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Check your inbox for an email from Magalela Media
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#C85A32] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">2</span>
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Click the secure reset link — valid for 1 hour
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#C85A32] rounded-full flex items-center justify-center shrink-0 mt-0.5">
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
                  className="w-full h-11 border border-gray-200 hover:border-[#C85A32] text-gray-600 hover:text-[#C85A32] rounded-xl font-medium text-sm transition-colors"
                >
                  Try another email
                </button>

                <div className="text-center">
                  <button
                    onClick={handleBackToSignIn}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#C85A32] transition-colors"
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
      </div>
    </div>
  );
};

export default ForgotPassword;