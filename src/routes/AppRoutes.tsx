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
import MembersManagement from "@/pages/treasurer/MembersManagement/MembersManagement";
import PaymentVerification from "@/pages/treasurer/PaymentVerification/PaymentVerification";
import PayoutRecords from "@/pages/treasurer/PayoutRecords/PayoutRecords";
import Reports from "@/pages/treasurer/Reports/Reports";
import NotificationsSettings from "@/pages/treasurer/NotificationsSettings/NotificationsSettings";
import AuditLog from "@/pages/treasurer/AuditLog/AuditLog";
import EventsList from '@/pages/treasurer/EventDetails/EventsList';
import EventDetails from '@/pages/treasurer/EventDetails/EventDetails';
import CreateEvent from '@/pages/treasurer/CreateEvent/CreateEvent';
import EditEvent from '@/pages/treasurer/EventDetails/EditEvent';
import TreasurerSettings from '@/pages/treasurer/TreasurerSettings/TreasurerSettings';

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import TenantManagement from '@/pages/admin/TenantManagement/TenantManagement';
import TenantReconciliation from '@/pages/admin/TenantReconciliation/TenantReconciliation';
import AuditLogs from '@/pages/admin/AuditLogs/AuditLogs';
import UserManagement from '@/pages/admin/UserManagement/UserManagement';
import AdminSettings from '@/pages/admin/AdminSettings/AdminSettings';
import AdminAnalytics from '@/pages/admin/AdminAnalytics/AdminAnalytics';



// Member Pages
import MemberDashboard from "@/pages/member/Dashboard";
import MemberSettings from '@/pages/member/MemberSettings/MemberSettings';
import Contributions from '@/pages/member/Contributions/Contributions';
import PaymentSubmission from '@/pages/member/PaymentSubmission/PaymentSubmission';
import Beneficiaries from '@/pages/member/Beneficiaries/Beneficiaries';


const AppRoutes = () => {
  return (
    <Routes>
      {/* AUTH - Public */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* TREASURER - Protected (Treasurer Only) */}
      <Route path="/treasurer" element={
        <ProtectedRoute treasurerOnly={true}>
          <TreasurerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<TreasurerDashboard />} />
        <Route path="dashboard" element={<TreasurerDashboard />} />
        <Route path="members" element={<MembersManagement />} />
        <Route path="events" element={<EventsList />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="events/:id/edit" element={<EditEvent />} />
        <Route path="payments/verify" element={<PaymentVerification />} />
        <Route path="payouts" element={<PayoutRecords />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<NotificationsSettings />} />
        <Route path="audit" element={<AuditLog />} />
        <Route path="settings" element={<TreasurerSettings />} />
      </Route>

      {/* ADMIN - Protected (Admin Only) */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tenants" element={<TenantManagement />} />
        <Route path="reconciliation" element={<TenantReconciliation />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>


      {/* Member - Protected (Treasurer Only) */}
      <Route path="/member" element={
        <ProtectedRoute memberOnly={true}>
          <MemberLayout />
        </ProtectedRoute>
      }>
        <Route index element={<MemberDashboard />} />
        <Route path="dashboard" element={<MemberDashboard />} />
        <Route path="contributions" element={<Contributions />} />
        <Route path="payments" element={<PaymentSubmission />} />
        <Route path="beneficiaries" element={<Beneficiaries />} />
        <Route path="settings" element={<MemberSettings />} />

      </Route>


      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;