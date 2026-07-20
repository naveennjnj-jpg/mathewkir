// layouts/admin/AdminLayout.tsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TreasurerSidebar from "./TreasurerSidebar";
import TreasurerHeader from "./TreasurerHeader";
import { useAuth } from "@/context/AuthContext";

const AdminLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);

  // Apply admin theme if needed
  useEffect(() => {
    // Any admin-specific initialization
  }, []);

  // Get user initials
  const getUserInitials = () => {
    if (user?.name) {
      const parts = user.name.split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return user.name.slice(0, 2).toUpperCase();
    }
    return 'A';
  };

  return (
    <div className="min-h-screen bg-[#050505] font-['Manrope']">
      {/* Sidebar */}
      <TreasurerSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
        adminName={user?.name || "Admin"}
        adminEmail={user?.email || "admin@email.com"}
        adminInitials={getUserInitials()}
      />

      {/* Main Wrapper */}
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? "lg:pl-[260px]" : "lg:pl-[72px]"
          } ${isRightSidebarOpen ? "lg:pr-[320px]" : "lg:pr-0"}`}
      >
        <TreasurerHeader
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          adminName={user?.name || "Admin"}
          adminEmail={user?.email || "admin@email.com"}
          adminInitials={getUserInitials()}
          onRightSidebarToggle={toggleRightSidebar}
          isRightSidebarOpen={isRightSidebarOpen}
        />

        <main className="pt-16 p-6 min-h-screen">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;