// types/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'editor';
  accountType: 'individual' | 'institutional';
  institution?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  data: User;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  accountType: 'individual' | 'institutional';
  institution?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (userData: RegisterData) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateDetails: (userData: Partial<User>) => Promise<{ success: boolean; data?: User; error?: string }>;
  AdminupdateDetails: (userData: Partial<User>) => Promise<{ success: boolean; data?: User; error?: string }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  setError: (error: string | null) => void;
}