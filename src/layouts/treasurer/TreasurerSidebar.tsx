// layouts/superadmin/SuperAdminSidebar.tsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import logo from "../../assets/home/darklogo.png";
import {
  LayoutDashboard,
  Users,
  FileText,
  Plus,
  Upload,
  DollarSign,
  Eye,
  CheckCircle,
  Settings,
  Bell,
  FileBarChart,
  History,
  Wallet,
  Calendar,
  UserPlus,
  Download,
  RefreshCw
} from 'lucide-react';

interface TreasurerSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

const TreasurerSidebar = ({
  isOpen = true,
  onToggle,
  onClose,
}: TreasurerSidebarProps) => {
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

  const sidebarItems = [
    { title: "Dashboard", path: "/treasurer", icon: LayoutDashboard },
    { title: "Members Management", path: "/treasurer/members", icon: Users },
    { title: "Create Fundraising Event", path: "/treasurer/events/create", icon: Plus },
    { title: "Event Details/Tracking", path: "/treasurer/events", icon: Calendar },
    { title: "Payment Verification", path: "/treasurer/payments/verify", icon: CheckCircle },
    { title: "Payout Records", path: "/treasurer/payouts", icon: Wallet },
    { title: "Reports", path: "/treasurer/reports", icon: FileBarChart },
    // { title: "Notifications Settings", path: "/treasurer/notifications", icon: Bell },
    { title: "Audit Log", path: "/treasurer/audit", icon: History },
    { title: "Settings", path: "/treasurer/settings", icon: Settings },
  ];

  return (
    <>
      <aside
        className={`
          sidebar fixed left-0 top-0 z-9999 flex h-screen flex-col overflow-y-hidden 
          border-r border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-black
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 lg:w-[290px]' : '-translate-x-full lg:w-[90px]'}
          lg:static lg:translate-x-0
        `}
      >
        {/* SIDEBAR HEADER */}
        <div
          className={`flex items-center gap-2 pt-8 sidebar-header pb-7 ${
            !isOpen ? 'justify-center' : 'justify-between'
          }`}
        >
          <a href="/treasurer">
            <span className={`logo ${!isOpen ? 'hidden' : ''}`}>
              <img 
                className="dark:hidden" 
                src={logo} 
                alt="Logo" 
              />
              <img
                className="hidden dark:block"
                src={logo}
                alt="Logo"
              />
            </span>
            <img
              className={`logo-icon ${isOpen ? 'hidden' : 'lg:block'}`}
              src={logo}
              alt="Logo"
            />
          </a>
        </div>

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav>
            <div>
              <h3 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
                <span className={`menu-group-title ${!isOpen ? 'lg:hidden' : ''}`}>
                  TREASURER
                </span>
                <svg
                  className={`mx-auto fill-current menu-group-icon ${
                    isOpen ? 'hidden' : 'lg:block hidden'
                  }`}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.99915 10.2451C6.96564 10.2451 7.74915 11.0286 7.74915 11.9951V12.0051C7.74915 12.9716 6.96564 13.7551 5.99915 13.7551C5.03265 13.7551 4.24915 12.9716 4.24915 12.0051V11.9951C4.24915 11.0286 5.03265 10.2451 5.99915 10.2451ZM17.9991 10.2451C18.9656 10.2451 19.7491 11.0286 19.7491 11.9951V12.0051C19.7491 12.9716 18.9656 13.7551 17.9991 13.7551C17.0326 13.7551 16.2491 12.9716 16.2491 12.0051V11.9951C16.2491 11.0286 17.0326 10.2451 17.9991 10.2451ZM13.7491 11.9951C13.7491 11.0286 12.9656 10.2451 11.9991 10.2451C11.0326 10.2451 10.2491 11.0286 10.2491 11.9951V12.0051C10.2491 12.9716 11.0326 13.7551 11.9991 13.7551C12.9656 13.7551 13.7491 12.9716 13.7491 12.0051V11.9951Z"
                    fill=""
                  />
                </svg>
              </h3>

              <ul className="flex flex-col gap-4 mb-6">
                {sidebarItems.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            onClose?.();
                          }
                        }}
                        className={`menu-item group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          active
                            ? 'menu-item-active bg-brand-500/10 text-brand-500'
                            : 'menu-item-inactive text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                        } ${!isOpen ? 'lg:justify-center lg:px-2' : ''}`}
                      >
                        <Icon
                          className={`w-[18px] h-[18px] ${
                            active ? 'text-brand-500' : 'text-gray-400'
                          }`}
                        />
                        <span
                          className={`menu-item-text ${
                            !isOpen ? 'lg:hidden' : ''
                          } text-sm font-medium`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`menu-item group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 ${
              !isOpen ? 'lg:justify-center lg:px-2' : ''
            }`}
          >
            {/* <LogOut className="w-[18px] h-[18px]" /> */}
            <span className={`menu-item-text ${!isOpen ? 'lg:hidden' : ''} text-sm font-medium`}>
              Logout
            </span>
          </button>
        </div>

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
          <div className="bg-white dark:bg-[#0E0909] border border-gray-200 dark:border-white/5 rounded-2xl p-7 w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
              Sign out?
            </h3>
            <p className="text-gray-500 dark:text-white/40 text-sm mb-6">
              You'll need to sign in again to access your workspace.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-gray-300 dark:border-white/10 rounded-xl py-2.5 text-sm font-medium text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  await handleLogout();
                }}
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-all hover:shadow-lg hover:shadow-brand-500/25"
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

export default TreasurerSidebar;