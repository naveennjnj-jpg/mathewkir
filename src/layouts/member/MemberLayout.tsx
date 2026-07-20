// layouts/user/UserLayout.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MemberSidebar from "./MemberSidebar";
import MemberHeader from "./MemberHeader";
import { useAuth } from "@/context/AuthContext";

const UserLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      <MemberSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
        userName={user?.name || "User"}
        userEmail={user?.email || "user@email.com"}
        userInitials={user?.name?.charAt(0) || "U"}
      />

      <MemberHeader
        onMenuClick={toggleSidebar}
        userName={user?.name || "User"}
        userEmail={user?.email || "user@email.com"}
        userInitials={user?.name?.charAt(0) || "U"}
        isSidebarOpen={isSidebarOpen}
      />

      <main className={`pt-16 transition-all duration-300 ${
        isSidebarOpen ? 'lg:pl-[260px]' : 'lg:pl-[72px]'
      }`}>
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;