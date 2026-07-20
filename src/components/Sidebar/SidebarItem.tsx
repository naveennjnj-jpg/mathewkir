import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  title: string;
  path: string;
  icon?: LucideIcon;
}

const SidebarItem = ({ title, path, icon: Icon }: SidebarItemProps) => {
  return (
    <li>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-slate-700"
          }`
        }
      >
        {Icon && <Icon size={18} />}
        <span>{title}</span>
      </NavLink>
    </li>
  );
};

export default SidebarItem;