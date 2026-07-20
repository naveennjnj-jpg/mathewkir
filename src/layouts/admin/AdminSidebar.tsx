// layouts/admin/AdminSidebar.tsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Ticket,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LifeBuoy,
  LayoutDashboard
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  adminName?: string;
  adminEmail?: string;
  adminInitials?: string;
}

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  badge?: string | number;
}

const AdminSidebar = ({
  isOpen = true,
  onToggle,
  onClose,
  adminName = "Admin",
  adminEmail = "admin@email.com",
  adminInitials = "AD"
}: AdminSidebarProps) => {

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Admin menu items - Only Events and BRT Tickets
  const sidebarItems: SidebarItem[] = [
    { title: "All Events", path: "/admin/events", icon: Calendar },
    { title: "BRT Tickets", path: "/admin/brt-tickets", icon: Ticket },
  ];

  return (
    <>
<aside
  className={`
    fixed top-0 left-0
    h-screen
    bg-[#0E0909]/95 backdrop-blur-xl
    border-r border-white/5
    flex flex-col
    z-50
    transition-all duration-300 ease-in-out

    ${
      isOpen
        ? "translate-x-0 w-64"
        : "-translate-x-full lg:translate-x-0 lg:w-[72px]"
    }
  `}
>
        {/* Logo */}
        <div className={`p-6 border-b border-white/5 ${!isOpen && 'lg:px-4 lg:py-4'}`}>
          {isOpen ? (
            <>
              <h1 className="text-3xl font-bold tracking-wider bg-gradient-to-r from-[#F2CA46] via-[#D4AF37] to-[#AA6C39] bg-clip-text text-transparent">
                BRT
              </h1>
              <p className="text-white/30 text-[10px] tracking-wide mt-1 font-medium">
                ADMIN CONTROL
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#F2CA46] via-[#D4AF37] to-[#AA6C39] flex items-center justify-center">
                <span className="text-[#050505] font-bold text-sm">BRT</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar ${!isOpen && 'lg:p-2'}`}>
          {/* Events & Tickets Section */}
          <div>
            {isOpen && (
              <div className="px-4 mb-2">
                <span className="text-[10px] font-bold tracking-wider text-white/30">
                  🎟️ EVENTS & TICKETS
                </span>
              </div>
            )}
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;

                return (
<Link
  key={item.path}
  to={item.path}
  onClick={() => {
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  }}
  className={`
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
    ${
      active
        ? "bg-[#0A0707] border border-[#C9A227] shadow-[0_0_0_3px_rgba(201,162,39,0.12)] text-[#C9A227]"
        : "text-white/40 hover:bg-white/5 hover:text-white/80"
    }
    ${!isOpen ? "lg:justify-center lg:px-2" : ""}
  `}
>
  <Icon
    className={`w-[18px] h-[18px] ${
      active ? "text-[#C9A227]" : "text-white/40"
    }`}
  />
  {isOpen && (
    <span className="text-sm font-medium">{item.title}</span>
  )}
</Link>
                );
              })}
            </div>
          </div>


        </nav>

        {/* Logout Button - Now opens modal */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => setShowLogoutModal(true)}  // <-- FIXED: This opens the modal
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full
              text-white/30 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/30 border border-transparent
              ${!isOpen && 'lg:justify-center lg:px-2'}
            `}
          >
            <LogOut className="w-[18px] h-[18px]" />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
<button
  onClick={onToggle}
  className="hidden lg:flex absolute -right-3 top-24 items-center justify-center w-6 h-6 bg-[#C9A227] rounded-full shadow-lg hover:bg-[#DFBA3A] transition-all z-50"
>
  {isOpen ? (
    <ChevronLeft className="w-3.5 h-3.5 text-[#050505]" />
  ) : (
    <ChevronRight className="w-3.5 h-3.5 text-[#050505]" />
  )}
</button>
      </aside>

      {/* Mobile Overlay */}
{isOpen && (
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
  />
)}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0E0909] border border-white/5 rounded-2xl p-7 w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-white text-lg mb-2">
              Sign out?
            </h3>
            <p className="text-white/40 text-sm mb-6">
              You'll need to sign in again to access your workspace.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-white/10 rounded-xl py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  await handleLogout();
                }}
                className="flex-1 bg-gradient-to-r from-[#C9A227] to-[#DFBA3A] text-[#050505] rounded-xl py-2.5 text-sm font-semibold transition-all hover:shadow-lg hover:shadow-[#C9A227]/25"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;