// components/Sidebar/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LucideIcon,
  LayoutDashboard,
  FolderOpen,
  Presentation,
  UserCheck,
  FileText,
  Mic,
  ShoppingBag,
  ChartColumn,
  CreditCard,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users2,
  BarChart3
} from "lucide-react";
import Logo from "@/assets/home/logo.png";

interface MenuItem {
  title: string;
  path: string;
  icon?: LucideIcon;
}

interface SidebarProps {
  title: string;
  menuItems: MenuItem[];
  userName?: string;
  userEmail?: string;
  userInitials?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  isAdmin?: boolean;
}

const Sidebar = ({ 
  title, 
  menuItems, 
  userName = "Ronald Sithole",
  userEmail = "ronald@gmail.com",
  userInitials = "RS",
  isOpen = true,
  onToggle,
  onClose,
  isAdmin = false
}: SidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Group menu items by category
  const groupedItems: Record<string, MenuItem[]> = {
    overview: [],
    management: [],
    tools: [],
    resources: [],
    financial: [],
    account: [],
  };

  menuItems.forEach((item) => {
    if (["/dashboard", "/dashboard/unified", "/admin"].includes(item.path)) {
      groupedItems.overview.push(item);
    } else if (
      ["/dashboard/my-projects", "/dashboard/workshops", "/dashboard/hire-expert", 
       "/admin/users", "/admin/analytics"].includes(item.path)
    ) {
      groupedItems.management.push(item);
    } else if (
      ["/dashboard/narrative-engine", "/dashboard/voice-calibrator"].includes(item.path)
    ) {
      groupedItems.tools.push(item);
    } else if (["/dashboard/store"].includes(item.path)) {
      groupedItems.resources.push(item);
    } else if (
      ["/dashboard/user-invoices", "/dashboard/user-quotes"].includes(item.path)
    ) {
      groupedItems.financial.push(item);
    } else if (
      ["/dashboard/plans", "/dashboard/settings", "/admin/settings"].includes(item.path)
    ) {
      groupedItems.account.push(item);
    }
  });

  const categoryLabels: Record<string, string> = {
    overview: isAdmin ? "Overview" : "Overview",
    management: isAdmin ? "Management" : "Services",
    tools: "AI Tools",
    resources: "Resources",
    financial: "Finance",
    account: "Account",
  };

  const getIcon = (path: string): LucideIcon | null => {
    const iconMap: Record<string, LucideIcon> = {
      "/dashboard/unified": LayoutDashboard,
      "/dashboard": LayoutDashboard,
      "/admin": LayoutDashboard,
      "/dashboard/my-projects": FolderOpen,
      "/dashboard/workshops": Presentation,
      "/dashboard/hire-expert": UserCheck,
      "/dashboard/narrative-engine": FileText,
      "/dashboard/voice-calibrator": Mic,
      "/dashboard/store": ShoppingBag,
      "/dashboard/user-invoices": ChartColumn,
      "/dashboard/user-quotes": CreditCard,
      "/dashboard/plans": CreditCard,
      "/dashboard/settings": Settings,
      "/admin/users": Users2,
      "/admin/analytics": BarChart3,
      "/admin/settings": Settings,
    };
    return iconMap[path] || null;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 z-30 bg-[#0F2D63] transition-all duration-300 ${
        isOpen ? 'w-[260px]' : 'w-[72px]'
      }`}>
        {/* Logo */}
        <div className={`flex items-center ${isOpen ? 'justify-center' : 'justify-center'} h-20 flex-shrink-0 px-4 border-b border-white/10`}>
          <Link to={isAdmin ? "/admin" : "/user"}>
            {isOpen ? (
              <img 
                src={Logo} 
                alt="Magalela Media" 
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <div className="w-8 h-8 bg-[#C85A32] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] ${!isOpen && 'px-2'}`}>
          {Object.entries(groupedItems).map(([key, items]) => {
            if (items.length === 0) return null;
            
            return (
              <div key={key} className="mt-4 first:mt-0">
                {isOpen && (
                  <div className="px-3 mb-2">
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-white/40">
                      {categoryLabels[key] || key}
                    </p>
                  </div>
                )}
                <div className={`flex flex-col gap-[2px] ${!isOpen && 'items-center'}`}>
                  {items.map((item) => {
                    const active = isActive(item.path);
                    const Icon = getIcon(item.path) || item.icon;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`relative flex items-center ${isOpen ? 'gap-3 px-3' : 'gap-0 justify-center px-0'} h-11 rounded-xl transition-all group ${
                          active ? 'bg-white/10' : 'hover:bg-white/[0.06]'
                        }`}
                      >
                        {active && isOpen && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-[#C85A32] rounded-r-full"></div>
                        )}
                        
                        {Icon && (
                          <Icon 
                            className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                              active 
                                ? 'text-[#C85A32]' 
                                : 'text-white/65 group-hover:text-white/90'
                            }`}
                          />
                        )}
                        
                        {isOpen && (
                          <span className={`text-[14px] font-medium transition-colors ${
                            active 
                              ? 'text-white' 
                              : 'text-white/80 group-hover:text-white/95'
                          }`}>
                            {item.title}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Help Center - Only when expanded */}
          {isOpen && (
            <div className="mt-6 px-1">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="w-9 h-9 bg-[#C85A32]/20 rounded-xl flex items-center justify-center mb-3">
                  <LifeBuoy className="w-4 h-4 text-[#C85A32]" />
                </div>
                <p className="text-white font-semibold text-sm mb-3">Need Help?</p>
                <Link to="/help">
                  <button className="w-full bg-[#C85A32] hover:bg-[#a8472a] text-white text-xs font-medium rounded-xl h-9 transition-colors">
                    Explore Help Center
                  </button>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* User Profile */}
        <div className={`border-t border-white/10 p-4 flex items-center ${isOpen ? 'gap-3' : 'justify-center gap-0'}`}>
          {isOpen ? (
            <>
              <div className="w-9 h-9 bg-[#C85A32] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{userInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{userName}</p>
                <p className="text-white/50 text-xs truncate">{userEmail}</p>
              </div>
              <button className="text-white/50 hover:text-white transition-colors" onClick={() => {}}>
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-9 h-9 bg-[#C85A32] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{userInitials}</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button 
          onClick={onToggle}
          className="hidden lg:flex fixed top-[130px] items-center justify-center w-8 h-8 bg-[#C85A32] rounded-full shadow-lg hover:bg-[#a8472a] transition-all z-40 left-[244px]"
        >
          {isOpen ? (
            <ChevronLeft className="w-3.5 h-3.5 text-white" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          )}
        </button>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Sidebar;