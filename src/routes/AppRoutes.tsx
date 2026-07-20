// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
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
</Route>




    </Routes>
  );
};

export default AppRoutes;