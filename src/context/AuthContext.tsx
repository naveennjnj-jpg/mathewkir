import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import { User, AuthResponse, AuthResponseLogin, RegisterData, AuthContextType, MeResponse } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get<MeResponse>('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data.data.user);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; data?: AuthResponse; error?: string }> => {
    try {
      setLoading(true);
      const response = await axios.post<AuthResponse>('/api/auth/register', userData);
      setUser(response.data.data);
      setIsAuthenticated(true);
      setError(null);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored in localStorage:', response.data.token);
      }

      return { success: true, data: response.data };
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Updated login function with subdomain parameter
  const login = async (
    email: string,
    password: string,
    subdomain?: string // Made optional
  ): Promise<{ success: boolean; data?: AuthResponseLogin; error?: string }> => {
    try {
      setLoading(true);

      // Send subdomain in request body
      const response = await axios.post<AuthResponseLogin>('/api/auth/login', {
        email,
        password,
        subdomain // This will be undefined if not provided
      });

      const loginData = response.data.data;
      const userData = loginData.user;

      // Verify user belongs to the current tenant (if subdomain is provided)
      if (subdomain && userData.tenant_subdomain && userData.tenant_subdomain !== subdomain) {
        const errorMsg = `You don't have access to this organization. Please use your organization's subdomain.`;
        setError(errorMsg);
        setLoading(false);
        return {
          success: false,
          error: errorMsg
        };
      }

      setUser(userData);
      setIsAuthenticated(true);
      setError(null);
      console.log('Login successful, user data:', userData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Store tenant info for later use
        if (userData.tenant_subdomain) {
          localStorage.setItem('tenant_subdomain', userData.tenant_subdomain);
        }
        if (userData.tenant_id) {
          localStorage.setItem('tenant_id', userData.tenant_id);
        }
      }

      return { success: true, data: response.data };
    } catch (err) {
      const error = err as AxiosError<any>;

      let errorMessage = "Login failed";

      if (error.response?.data?.message) {
        try {
          errorMessage = JSON.parse(error.response.data.message).message;
        } catch {
          errorMessage = error.response.data.message;
        }
      }

      // Handle specific tenant mismatch error from backend
      if (error.response?.status === 403) {
        errorMessage = error.response?.data?.message || "You don't have access to this organization";
      }

      setError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.get('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('tenant_subdomain');
      localStorage.removeItem('tenant_id');
      setError(null);
    }
  };

  const updateDetails = async (userData: Partial<User>): Promise<{ success: boolean; data?: User; error?: string }> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put<{ success: boolean; data: User }>(
        '/api/auth/updatedetails',
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.data);
      return { success: true, data: response.data.data };
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    }
  };

  const AdminupdateDetails = async (userData: Partial<User>): Promise<{ success: boolean; data?: User; error?: string }> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put<{ success: boolean; data: User }>(
        '/api/admin/updatedetails',
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.data);
      return { success: true, data: response.data.data };
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; data?: AuthResponse; error?: string }> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put<AuthResponse>(
        '/api/auth/updatepassword',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, data: response.data };
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return { success: false, error: error.response?.data?.message || 'Password update failed' };
    }
  };

  // Axios interceptors
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('tenant_subdomain');
        localStorage.removeItem('tenant_id');
        setUser(null);
        setIsAuthenticated(false);
      }
      return Promise.reject(error);
    }
  );

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    loadUser,
    updateDetails,
    AdminupdateDetails,
    updatePassword,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;