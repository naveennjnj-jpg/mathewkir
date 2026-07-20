// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import MemberLayout from "@/layouts/member/MemberLayout";
import AdminLayout from "@/layouts/admin/AdminLayout";
import TreasurerLayout from "@/layouts/treasurer/TreasurerLayout";

// Auth Pages
import Login from "@/pages/auth/Login";
import CreateAccount from "@/pages/auth/CreateAccount";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Members Pages
import UserDashboard from "@/pages/member/Dashboard";



// Treasurer Pages
import TreasurerDashboard from "@/pages/treasurer/Dashboard";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import TenantManagement from '@/pages/admin/TenantManagement/TenantManagement';
import TenantReconciliation from '@/pages/admin/TenantReconciliation/TenantReconciliation';
import AuditLogs from '@/pages/admin/AuditLogs/AuditLogs';
import UserManagement from '@/pages/admin/UserManagement/UserManagement';
import AdminSettings from '@/pages/admin/AdminSettings/AdminSettings';
import AdminAnalytics from '@/pages/admin/AdminAnalytics/AdminAnalytics';

const AppRoutes = () => {
  return (
    <Routes>
      {/* WEBSITE - Public */}
      {/* <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<Home />} />
        <Route path="/ticket" element={<Ticket />} />
      </Route> */}

      {/* AUTH - Public */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* USER - Protected */}
      <Route path="/member" element={
        <ProtectedRoute>
          <MemberLayout />
        </ProtectedRoute>
      }>
        <Route index element={<UserDashboard />} />
      </Route>

      {/* Treasurer's - Protected (Admin Only) */}
      <Route path="/treasurer" element={
        <ProtectedRoute adminOnly={true}>
          <TreasurerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<TreasurerDashboard />} />
      </Route>

      {/* ADMIN - Protected (Admin Only) */}


      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="/admin/tenants" element={<TenantManagement />} />
        <Route path="/admin/reconciliation" element={<TenantReconciliation />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>



      {/* <Route path="/super-admin" element={
        <ProtectedRoute adminOnly={true}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="/admin/tenants" element={<TenantManagement />} />
        <Route path="/admin/reconciliation" element={<TenantReconciliation />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />


      </Route> */}




    </Routes>
  );
};

export default AppRoutes;