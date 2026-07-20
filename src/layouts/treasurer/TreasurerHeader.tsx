// layouts/admin/AdminHeader.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  Search,
  Settings,
  HelpCircle,
  ChevronDown,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  LayoutDashboard,
  CreditCard,
  Settings2,
  LogOut as LogOutIcon,
  UserCog,
  Briefcase,
  Clock,
  User,
  Shield,
  Home,
  BarChart3,
  Store,
  UserCheck,
  FileSpreadsheet,
  PanelLeft,
  PanelRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface AdminHeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
  adminName?: string;
  adminEmail?: string;
  adminInitials?: string;
  onRightSidebarToggle?: () => void;
  isRightSidebarOpen?: boolean;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  theme?: string;
  initials?: string;
}

const AdminHeader = ({
  onMenuClick,
  isSidebarOpen = true,
  adminName: propName,
  adminEmail: propEmail,
  adminInitials: propInitials,
  onRightSidebarToggle,
  isRightSidebarOpen = true
}: AdminHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // User state
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: propName || 'Admin',
    email: propEmail || 'admin@email.com',
    role: 'admin',
    initials: propInitials || 'A'
  });
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data) {
          const data = response.data.data;

          // Generate initials from name
          const nameParts = data.name?.split(' ') || ['A'];
          const initials = nameParts
            .map((part: string) => part.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);

          setUserData({
            id: data.id || data._id,
            name: data.name || 'Admin',
            email: data.email || 'admin@email.com',
            role: data.role || 'admin',
            avatar: data.avatar || data.profileImage,
            theme: data.theme || 'light',
            initials: initials || 'A'
          });

          // Apply theme if needed
          if (data.theme) {
            localStorage.setItem('theme', data.theme);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage or default values
        const savedName = localStorage.getItem('userName') || 'Admin';
        const savedEmail = localStorage.getItem('userEmail') || 'admin@email.com';
        const savedInitials = savedName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

        setUserData(prev => ({
          ...prev,
          name: savedName,
          email: savedEmail,
          initials: savedInitials || 'A'
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const notifications = [
    {
      id: 1,
      title: "New user registered",
      description: "John Doe just created a new account",
      time: "5 min ago",
      icon: Users,
      color: "text-[#C9A227]",
      bgColor: "bg-[#C9A227]/10",
      read: false,
    },
    {
      id: 2,
      title: "Project submission",
      description: "New project 'Q2 Research Output' submitted for review",
      time: "1 hour ago",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      read: false,
    },
    {
      id: 3,
      title: "Payment received",
      description: "Invoice #INV-2026-004 has been paid",
      time: "3 hours ago",
      icon: CreditCard,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      read: true,
    },
    {
      id: 4,
      title: "System update",
      description: "New version 2.4.0 is ready for deployment",
      time: "5 hours ago",
      icon: Settings,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const adminNavItems = [
    { title: "Settings", path: "/admin/settings", icon: Settings2 },
  ];

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const titles: Record<string, string> = {
      "/admin": "Dashboard",
      "/admin/users": "Users Management",
      "/admin/projects": "Projects",
      "/admin/workshops": "Workshops",
      "/admin/narrative-engine": "AI Writing",
      "/admin/voice-calibrator": "AI Speech",
      "/admin/invoices": "Invoices",
      "/admin/settings": "Settings",
      "/admin/analytics": "Analytics",
      "/admin/subscriptions": "Subscriptions",
      "/admin/brt-tickets": "BRT Tickets",
      "/admin/events": "Events",
    };
    return titles[currentPath] || "Dashboard";
  };

  return (
    <>
      <header
        className={`bg-[#0E0909]/95 backdrop-blur-xl border-b border-white/5 h-16 fixed top-0 right-0 z-40 transition-all duration-300 ${
          isSidebarOpen ? 'lg:left-[260px]' : 'lg:left-[72px]'
        } left-0`}
      >
        <div className="flex items-center justify-between h-full px-4 lg:px-8">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle - Shows Menu when closed, X when open */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors text-white/50 hover:text-white/80"
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-white hidden sm:block">
                {getPageTitle()}
              </h1>
            </div> */}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Right Sidebar Toggle */}
            <button
              onClick={onRightSidebarToggle}
              className="hidden lg:flex p-2 hover:bg-white/5 rounded-lg transition-colors text-white/30 hover:text-white/60"
              title={isRightSidebarOpen ? "Hide Activity Feed" : "Show Activity Feed"}
            >
              {isRightSidebarOpen ? (
                <PanelRight className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors text-white/50 hover:text-white/80"
            >
              {/* <Search className="w-5 h-5" /> */}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 hover:bg-white/5 rounded-lg transition-colors text-white/50 hover:text-white/80"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0E0909] border border-white/5 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="text-xs text-[#C9A227] hover:underline font-medium">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer ${
                          !notification.read ? "bg-[#C9A227]/5" : ""
                        }`}
                      >
                        <div className={`${notification.bgColor} rounded-lg p-2 shrink-0`}>
                          <notification.icon className={`w-4 h-4 ${notification.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white/80 truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-white/40 truncate">
                            {notification.description}
                          </p>
                          <p className="text-[10px] text-white/20 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#C9A227] rounded-full shrink-0 mt-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/5 px-4 py-2 text-center">
                    <button className="text-xs text-[#C9A227] font-medium hover:underline">
                      View all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Home Link */}
            {/* <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 px-2 py-1.5 rounded-lg hover:bg-white/5"
            >
              <Home className="w-4 h-4" />
            </Link> */}

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 group"
                disabled={loading}
              >
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 bg-gradient-to-r from-[#F2CA46] via-[#D4AF37] to-[#AA6C39] rounded-full flex items-center justify-center">
                    <span className="text-[#050505] text-xs font-bold">
                      {loading ? '...' : userData.initials}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white">
                    {loading ? 'Loading...' : userData.name}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0E0909] border border-white/5 rounded-xl shadow-2xl z-50">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="font-semibold text-white text-sm">
                      {userData.name}
                    </p>
                    <p className="text-xs text-white/40">
                      {userData.email}
                    </p>
                  </div>
                  <div className="py-1">
                    {adminNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/50 hover:bg-white/5 hover:text-white/80"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-white/5 py-1">
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobileSearchOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0E0909] border-b border-white/5 p-3 shadow-lg">
            <div className="flex items-center gap-2 bg-[#0A0707] border border-white/7 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-white w-full"
                autoFocus
              />
              <button onClick={() => setIsMobileSearchOpen(false)} className="text-white/30">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

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

export default AdminHeader;