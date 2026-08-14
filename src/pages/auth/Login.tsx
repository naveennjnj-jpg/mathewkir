// pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/assets/home/logo.png';

interface TenantData {
  name: string;
  logo: string;
  subdomain: string;
  tenant_id?: string;
  settings?: {
    platform_name?: string;
    platform_logo?: string;
  };
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
  const [tenantError, setTenantError] = useState<string | null>(null);
  const [isMainDomain, setIsMainDomain] = useState<boolean>(false);

  useEffect(() => {
    const detectTenant = async () => {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");

      let subdomain = "";

      // Development: infotech.localhost
      if (hostname.endsWith(".localhost")) {
        subdomain = parts[0];
      }
      // Production: tenant.example.com
      else if (parts.length > 2) {
        subdomain = parts[0];
      }

      // No subdomain (localhost or example.com) - Main Domain
      if (!subdomain || subdomain === "www") {
        setIsMainDomain(true);
        setTenantLoading(false);

        // Show login for main domain (Super Admin)
        // Don't set error, allow login on main domain
        setTenantData({
          name: "Benevolent Fund Management Platform",
          logo: Logo,
          subdomain: "main",
        });
        return;
      }

      // Has subdomain - Tenant login
      setIsMainDomain(false);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tenants/${subdomain}`
        );

        if (response.ok) {
          const data = await response.json();
          const tenant = data.data.tenant;
          const settings = data.data.settings;

          setTenantData({
            name: settings?.platform_name || tenant.name || "Benevolent Fund Management Platform",
            logo: settings?.platform_logo || tenant.logo_url || Logo,
            subdomain: tenant.subdomain,
            tenant_id: tenant.tenant_id,
            settings: settings
          });
          setTenantError(null);
        } else if (response.status === 404) {
          setTenantError(`Organization "${subdomain}" does not exist. Please check your URL.`);
          setTenantData(null);
        } else {
          setTenantError("Unable to load organization details. Please try again.");
          setTenantData(null);
        }
      } catch (error) {
        console.error("Failed to fetch tenant:", error);
        setTenantError("Network error. Please check your connection.");
        setTenantData(null);
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

    // Get current subdomain (if any)
    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    let currentSubdomain = "";

    if (hostname.endsWith(".localhost")) {
      currentSubdomain = parts[0];
    } else if (parts.length > 2) {
      currentSubdomain = parts[0];
    }

    // Pass subdomain to login function
    // If main domain (no subdomain), pass undefined
    const result = await login(email, password, currentSubdomain || undefined);

    if (result.success) {
      const userRole = result.data!.data.role;
      const isSuperAdmin = result.data!.data.user.is_super_admin;
      const userTenantId = result.data!.data.user.tenant_id;

      console.log("userRole", userRole);
      console.log("isSuperAdmin", isSuperAdmin);

      // If on main domain, allow super admin only
      if (isMainDomain && !isSuperAdmin) {
        setError("Main domain is only for super administrators. Please use your organization's subdomain.");
        setLoading(false);
        return;
      }

      // If on tenant subdomain, verify user belongs to this tenant
      if (!isMainDomain && tenantData?.tenant_id && userTenantId && userTenantId !== tenantData.tenant_id) {
        setError(`You do not have access to "${tenantData.name}". Please use your organization's subdomain.`);
        setLoading(false);
        return;
      }

      // Redirect based on role
      switch (userRole) {
        case "admin":
          navigate("/admin");
          break;
        case "treasurer":
          navigate("/treasurer");
          break;
        case "member":
          navigate("/member");
          break;
        default:
          navigate("/login");
          break;
      }
    } else {
      // Error is already set in AuthContext
      setLoading(false);
    }
  };

  // Show tenant error only if not main domain
  if (tenantError && !isMainDomain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center max-w-md p-8">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Access Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{tenantError}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (tenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Helper function to get the logo URL
  const getLogoUrl = (logoPath: string | undefined) => {
    if (!logoPath) return Logo;
    if (logoPath.startsWith('http')) return logoPath;
    return `${import.meta.env.VITE_API_URL}${logoPath}`;
  };

  const displayName = tenantData?.name || "Benevolent Fund Management Platform";
  const displayLogo = getLogoUrl(tenantData?.logo);

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0 min-h-screen">
      <div className="flex flex-col justify-center w-full h-screen dark:bg-gray-900 sm:p-0 lg:flex-row">
        {/* Form Section */}
        <div className="flex flex-col flex-1 w-full lg:w-1/2">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div className="mb-5 sm:mb-8">
              {/* Display platform logo */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={displayLogo}
                  alt={displayName}
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = Logo;
                  }}
                />
                {isMainDomain && (
                  <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full">
                    Super Admin
                  </span>
                )}
              </div>
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isMainDomain
                  ? "Super Admin login for platform management"
                  : `Enter your email and password to sign in to ${displayName}!`
                }
              </p>
            </div>
            <div>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Email<span className="text-error-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Password<span className="text-error-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        required
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                      >
                        {/* Password toggle icons */}
                      </span>
                    </div>
                  </div>

                  {/* Remember Me Checkbox & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label
                        htmlFor="rememberMe"
                        className="flex items-center text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="rememberMe"
                            className="sr-only"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                          />
                          <div
                            className={`mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] ${rememberMe
                              ? 'border-brand-500 bg-brand-500'
                              : 'bg-transparent border-gray-300 dark:border-gray-700'
                              }`}
                          >
                            <span className={rememberMe ? '' : 'opacity-0'}>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                  stroke="white"
                                  strokeWidth="1.94437"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Signing in...' : 'Login'}
                    </button>
                  </div>
                </div>
              </form>

              {/* Sign Up Link - Hide for super admin */}
              {!isMainDomain && (
                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Don't have an account?
                    <Link
                      to="/onboarding"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400 ml-1"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Branding Section */}
        <div className="relative items-center hidden w-full h-full bg-brand-950 dark:bg-white/5 lg:grid lg:w-1/2">
          <div className="flex items-center justify-center z-1">
            <div className="flex flex-col items-center max-w-xs">
              <img
                src={displayLogo}
                alt={displayName}
                className="h-16 w-auto object-contain mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = Logo;
                }}
              />
              <p className="text-center text-gray-400 dark:text-white/60">
                {isMainDomain
                  ? "Platform Administration"
                  : displayName
                }
              </p>
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <button
            className="inline-flex items-center justify-center text-white transition-colors rounded-full size-14 bg-brand-500 hover:bg-brand-600"
            onClick={() => {
              document.documentElement.classList.toggle('dark');
            }}
          >
            {/* Dark mode icons */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;