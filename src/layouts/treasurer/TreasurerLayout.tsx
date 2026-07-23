// layouts/admin/AdminLayout.tsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import TreasurerSidebar from "./TreasurerSidebar";
import TreasurerHeader from "./TreasurerHeader";
import { useAuth } from "@/context/AuthContext";

const Treasurerlayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };
  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);

  // Apply admin theme if needed
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
    return 'AD';
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Toast Notifications - Moved down */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 80, // Move down from top (header height is ~64px, so 80px gives some gap)
          right: 20,
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
            style: {
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
          },
          loading: {
            style: {
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #e5e7eb',
            },
          },
        }}
      />

      {/* Sidebar */}
      <TreasurerSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
      />

      {/* Content Area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <TreasurerHeader
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          adminName={user?.name || "Admin"}
          adminEmail={user?.email || "admin@email.com"}
          adminInitials={getUserInitials()}
          onRightSidebarToggle={toggleRightSidebar}
          isRightSidebarOpen={isRightSidebarOpen}
        />

        {/* Main Content */}
        <main className="pt-16 p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Treasurerlayout;