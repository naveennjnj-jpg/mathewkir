// pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/assets/home/logo.png';

interface TenantData {
  name: string;
  logo: string;
  subdomain: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, setError } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [tenantLoading, setTenantLoading] = useState<boolean>(true);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);

    if (result.success) {
      const userRole = result.data?.data?.role;

      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } else {
      setError(result.error || "Login failed");
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

      {/* Right Section - Login Form */}
      <section className="authWrap flex-1 flex items-center justify-center bg-white p-6 lg:p-12">
        <div className="card authCard w-full max-w-md">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-sm text-gray-500 mb-8">Sign in to continue.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#1768d8] focus:ring-2 focus:ring-[#1768d8]/20 outline-none transition text-sm"
                required
              />
            </div>

            <div className="field mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#1768d8] focus:ring-2 focus:ring-[#1768d8]/20 outline-none transition text-sm pr-10"
                  required
                />
                
              </div>
            </div>

            <div className="flex items-center justify-between text-xs mb-5">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="rounded border-gray-300 text-[#1768d8] focus:ring-[#1768d8]"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-[#1768d8] hover:text-[#1457b8] transition">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn primary w-full bg-[#1768d8] hover:bg-[#1457b8] text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Need an account?{' '}
            <Link to="/onboarding" className="text-[#1768d8] hover:text-[#1457b8] transition font-medium">
              Register
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;