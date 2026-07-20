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
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart3,
  CreditCard,
  Home,
  User,
  Shield,
  Briefcase,
  Clock,
  UserCheck,
  FileSpreadsheet,
  Store,
  PanelLeft,
  PanelRight
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
  children?: SidebarItem[];
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
  const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(["Dashboard"]));
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

  const toggleMenu = (menuName: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuName)) {
      newExpanded.delete(menuName);
    } else {
      newExpanded.add(menuName);
    }
    setExpandedMenus(newExpanded);
    setSelectedMenu(menuName);
  };

  // Admin menu items
  const sidebarItems: SidebarItem[] = [
    { 
      title: "Dashboard", 
      path: "/admin", 
      icon: LayoutDashboard 
    },
    { 
      title: "Events", 
      path: "/admin/events", 
      icon: Calendar 
    },
    { 
      title: "BRT Tickets", 
      path: "/admin/brt-tickets", 
      icon: Ticket 
    },
    { 
      title: "Users", 
      path: "/admin/users", 
      icon: Users 
    },
    { 
      title: "Analytics", 
      path: "/admin/analytics", 
      icon: BarChart3 
    },
    { 
      title: "Settings", 
      path: "/admin/settings", 
      icon: Settings 
    },
  ];

  // Check if a menu item or any of its children is active
  const isMenuActive = (item: SidebarItem) => {
    if (isActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child.path));
    }
    return false;
  };

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
          <a href="/">
            <span className={`logo ${!isOpen ? 'hidden' : ''}`}>
              <img 
                className="dark:hidden" 
                src="/images/logo/logo.svg" 
                alt="Logo" 
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
              />
            </span>

            <img
              className={`logo-icon ${isOpen ? 'hidden' : 'lg:block'}`}
              src="/images/logo/logo-icon.svg"
              alt="Logo"
            />
          </a>
        </div>
        {/* SIDEBAR HEADER */}

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          {/* Sidebar Menu */}
          <nav>
            {/* Menu Group */}
            <div>
              <h3 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
                <span className={`menu-group-title ${!isOpen ? 'lg:hidden' : ''}`}>
                  MENU
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
                  const active = isMenuActive(item);
                  const Icon = item.icon;
                  const hasChildren = item.children && item.children.length > 0;
                  const isExpanded = expandedMenus.has(item.title);

                  return (
                    <li key={item.path}>
                      {hasChildren ? (
                        <>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleMenu(item.title);
                            }}
                            className={`menu-item group ${
                              active ? 'menu-item-active' : 'menu-item-inactive'
                            } flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                              !isOpen ? 'lg:justify-center lg:px-2' : ''
                            }`}
                          >
                            <Icon
                              className={`w-[18px] h-[18px] ${
                                active ? 'text-brand-500' : 'text-gray-400'
                              }`}
                            />
                            <span
                              className={`menu-item-text ${
                                !isOpen ? 'lg:hidden' : ''
                              } text-sm font-medium ${
                                active ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-400'
                              }`}
                            >
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className={`ml-auto bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full ${!isOpen ? 'lg:hidden' : ''}`}>
                                {item.badge}
                              </span>
                            )}
                            <svg
                              className={`menu-item-arrow absolute right-2.5 top-1/2 -translate-y-1/2 stroke-current transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              } ${!isOpen ? 'lg:hidden' : ''}`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.79175 7.39584L10.0001 12.6042L15.2084 7.39585"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>

                          {/* Dropdown Menu */}
                          {isExpanded && (
                            <div className="overflow-hidden transform translate">
                              <ul className={`flex flex-col gap-1 mt-2 menu-dropdown pl-9 ${!isOpen ? 'lg:hidden' : ''}`}>
                                {item.children.map((child) => (
                                  <li key={child.path}>
                                    <Link
                                      to={child.path}
                                      onClick={() => {
                                        if (window.innerWidth < 1024) {
                                          onClose?.();
                                        }
                                      }}
                                      className={`menu-dropdown-item group flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                                        isActive(child.path)
                                          ? 'menu-dropdown-item-active text-brand-500 bg-brand-500/10'
                                          : 'menu-dropdown-item-inactive text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                                      }`}
                                    >
                                      <span className="text-sm">{child.title}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      ) : (
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
                          {item.badge && (
                            <span className={`ml-auto bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full ${!isOpen ? 'lg:hidden' : ''}`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Others Group */}
            <div>
              <h3 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
                <span className={`menu-group-title ${!isOpen ? 'lg:hidden' : ''}`}>
                  Others
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
                {/* Support/Help */}
                <li>
                  <Link
                    to="/admin/support"
                    className={`menu-item group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive('/admin/support')
                        ? 'menu-item-active bg-brand-500/10 text-brand-500'
                        : 'menu-item-inactive text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                    } ${!isOpen ? 'lg:justify-center lg:px-2' : ''}`}
                  >
                    <Shield className="w-[18px] h-[18px] text-gray-400" />
                    <span className={`menu-item-text ${!isOpen ? 'lg:hidden' : ''} text-sm font-medium`}>
                      Support
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          {/* Sidebar Menu */}

          {/* Promo Box */}
          <div className={`mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03] ${!isOpen ? 'lg:hidden' : ''}`}>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              #1 Tailwind CSS Dashboard
            </h3>
            <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
              Leading Tailwind CSS Admin Template with 400+ UI Component and Pages.
            </p>
            <a
              href="https://tailadmin.com/pricing"
              target="_blank"
              rel="nofollow"
              className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
            >
              Purchase Plan
            </a>
          </div>
          {/* Promo Box */}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`menu-item group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 ${
              !isOpen ? 'lg:justify-center lg:px-2' : ''
            }`}
          >
            <LogOut className="w-[18px] h-[18px]" />
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

export default AdminSidebar;