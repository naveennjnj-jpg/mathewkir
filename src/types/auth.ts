// types/auth.ts
export interface User {
  user_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: "admin" | "treasurer" | "member";
  is_super_admin: boolean;
  created_at: string;
  tenant_id?: string;
  tenant_subdomain?: string;
}

export interface Membership {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantSubdomain: string;
  role: "admin" | "treasurer" | "member";
  status: string;
  joinedAt: string;
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    memberships: Membership[];
  };
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  data: User;
  message?: string;
}

export interface AuthResponseLogin {
  success: boolean;
  token?: string;
  message?: string;
  data: {
    user: User;
    role: string;
    tenants: any[];
    currentTenant: any | null;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  subdomain?: string; // Add subdomain to login credentials
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
  login: (email: string, password: string, subdomain?: string) => Promise<{ success: boolean; data?: AuthResponseLogin; error?: string }>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateDetails: (userData: Partial<User>) => Promise<{ success: boolean; data?: User; error?: string }>;
  AdminupdateDetails: (userData: Partial<User>) => Promise<{ success: boolean; data?: User; error?: string }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  setError: (error: string | null) => void;
}