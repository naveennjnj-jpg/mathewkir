// layouts/user/UserHeader.tsx
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
  Coins,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface UserHeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  theme?: string;
  credits?: number;
  initials?: string;
}

const UserHeader = ({
  onMenuClick,
  isSidebarOpen = true,
}: UserHeaderProps) => {
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
    name: 'User',
    email: 'user@email.com',
    role: 'user',
    credits: 0,
    initials: 'U'
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
          const nameParts = data.name?.split(' ') || ['U'];
          const initials = nameParts
            .map((part: string) => part.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);

          setUserData({
            id: data.id || data._id,
            name: data.name || 'User',
            email: data.email || 'user@email.com',
            role: data.role || 'user',
            avatar: data.avatar || data.profileImage,
            theme: data.theme || 'light',
            credits: data.credits || data.creditsBalance || 0,
            initials: initials || 'U'
          });

          // Apply theme if needed
          if (data.theme) {
            localStorage.setItem('theme', data.theme);
            // You can call a theme function here if you have one
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage or default values
        const savedName = localStorage.getItem('userName') || 'User';
        const savedEmail = localStorage.getItem('userEmail') || 'user@email.com';
        const savedCredits = parseInt(localStorage.getItem('userCredits') || '0');
        const savedInitials = savedName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
        
        setUserData(prev => ({
          ...prev,
          name: savedName,
          email: savedEmail,
          credits: savedCredits,
          initials: savedInitials
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
      title: "New project assigned",
      description: "You've been assigned to 'University Communications' project",
      time: "5 min ago",
      icon: FileText,
      color: "text-[#C85A32]",
      bgColor: "bg-[#C85A32]/10",
      read: false,
    },
    {
      id: 2,
      title: "Workshop reminder",
      description: "Media Training workshop starts in 2 hours",
      time: "1 hour ago",
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      read: false,
    },
    {
      id: 3,
      title: "New message",
      description: "Sarah sent you a message about the project",
      time: "3 hours ago",
      icon: MessageSquare,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const userNavItems = [
    { title: "Settings", path: "/user/settings", icon: Settings2 },
  ];

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const titles: Record<string, string> = {
      "/user": "Dashboard",
      "/user/profile": "Profile",
      "/user/projects": "Projects",
      "/user/workshops": "Workshops",
      "/user/narrative-engine": "AI Writing",
      "/user/voice-calibrator": "AI Speech",
      "/user/invoices": "Invoices",
      "/user/settings": "Settings",
    };
    return titles[currentPath] || "Dashboard";
  };

  return (
    <>
      <header
        className={`bg-white border-b border-gray-100 h-16 fixed top-0 right-0 z-40 transition-all duration-300 ${
          isSidebarOpen ? 'left-[260px]' : 'left-[72px]'
        }`}
      >
        <div className="flex items-center justify-between h-full px-4 lg:px-8">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-[#0F2D63] hidden sm:block">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Credits Section */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#F9F7F4] border border-gray-200 rounded-xl px-3 py-1.5">
                <Coins className="w-3.5 h-3.5 text-[#C85A32]" />
                <span className="text-xs font-bold text-[#0F2D63]">
                  {loading ? '...' : userData.credits}
                </span>
                <span className="text-xs text-gray-400 hidden sm:block">credits</span>
              </div>
              <Link
                to="/dashboard/add-credits"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C85A32] hover:bg-[#a8472a] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Credits
              </Link>
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#C85A32] rounded-full animate-pulse"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-[#0F2D63]">Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="text-xs text-[#C85A32] hover:underline font-medium">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? "bg-[#C85A32]/5" : ""
                        }`}
                      >
                        <div className={`${notification.bgColor} rounded-lg p-2 shrink-0`}>
                          <notification.icon className={`w-4 h-4 ${notification.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1C1C1C] truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {notification.description}
                          </p>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#C85A32] rounded-full shrink-0 mt-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 px-4 py-2 text-center">
                    <button className="text-xs text-[#C85A32] font-medium hover:underline">
                      View all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 group"
                disabled={loading}
              >
                {userData.avatar ? (
                  <img src={userData.avatar} alt={userData.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 bg-[#0F2D63] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {loading ? '...' : userData.initials}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-[#1C1C1C]">
                    {loading ? 'Loading...' : userData.name}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                  isProfileOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-[#0F2D63] text-sm">{userData.name}</p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
                  </div>
                  <div className="py-1">
                    {userNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#C85A32]"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
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
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-3 shadow-lg">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-gray-700 w-full"
                autoFocus
              />
              <button onClick={() => setIsMobileSearchOpen(false)} className="text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-[#0F2D63] text-lg mb-2">
              Sign out?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              You'll need to sign in again to access your workspace.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  await handleLogout();
                }}
                className="flex-1 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
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

export default UserHeader;