// pages/CreateAccount.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, Phone, Key, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Logo from '@/assets/home/logo.png';

interface TenantData {
  name: string;
  logo: string;
  subdomain: string;
}

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const { register, error, setError } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [tenantLoading, setTenantLoading] = useState<boolean>(true);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    invitationCode: '',
  });

  // Detect tenant from subdomain
  useEffect(() => {
    const detectTenant = async () => {
      try {
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        
        const isLocalhost = ['localhost', 'www', ''].includes(subdomain);
        const tenantSubdomain = isLocalhost ? 'default' : subdomain;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/tenants/${tenantSubdomain}`, {
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    const registerData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      accountType: "individual" as "individual" | "institutional",
      tenantId: tenantData?.subdomain || 'default',
      invitationCode: formData.invitationCode || undefined,
    };

    const result = await register(registerData);

    if (result.success) {
      navigate('/user');
    } else {
      setError(result.error || "Registration failed");
    }

    setLoading(false);
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

      {/* Right Section - Create Account Form */}
      <section className="authWrap flex-1 flex items-center justify-center bg-white p-6 lg:p-12 overflow-y-auto">
        <div className="card authCard w-full max-w-md py-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create member account</h2>
            <p className="text-sm text-gray-500 mb-6">Register using a valid community invitation.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="formgrid grid grid-cols-2 gap-3 mb-4">
              {/* First Name */}
              <div className="field">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First name
                </label>
                <div className="relative">
                 
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#1768d8] focus:ring-2 focus:ring-[#1768d8]/20 outline-none transition text-sm"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="field">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last name
                </label>
                <div className="relative">
                 
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#1768d8] focus:ring-2 focus:ring-[#1768d8]/20 outline-none transition text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div className="field">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                 
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#1768d8] focus:ring-2 focus:ring-[#1768d8]/20 outline-none transition text-sm"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="field">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#1768d8] focus:ring-2 focus:ring-[#1768d8]/20 outline-none transition text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-gray-300 focus:border-[#1768d8] focus:ring-2 focus:ring-[#1768d8]/20 outline-none transition text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="field">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
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

              {/* Invitation Code */}
              <div className="field">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Invitation code
                </label>
                <div className="relative">
                 
                  <input
                    type="text"
                    id="invitationCode"
                    value={formData.invitationCode}
                    onChange={handleInputChange}
                    placeholder="Enter invitation code (optional)"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#1768d8] focus:ring-2 focus:ring-[#1768d8]/20 outline-none transition text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1768d8] hover:bg-[#1457b8] text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1768d8] hover:text-[#1457b8] transition font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default CreateAccount;