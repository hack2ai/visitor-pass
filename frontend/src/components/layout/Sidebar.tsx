import {
  LayoutDashboard,
  Users,
  UserPlus,
  QrCode,
  FileText,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const menus = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Visitors",
    icon: Users,
    path: "/visitors",
  },
  {
    name: "Create Visitor",
    icon: UserPlus,
    path: "/visitors/create",
  },
  {
    name: "QR Scanner",
    icon: QrCode,
    path: "/scanner",
  },
  {
    name: "Reports",
    icon: FileText,
    path: "/reports",
  },
  {
    name: "Profile",
    icon: UserCircle,
    path: "/profile",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-slate-900 text-white shadow-xl">
      {/* Logo */}

      <div className="border-b border-slate-800 px-6 py-8">
        <h1 className="text-3xl font-bold tracking-wide">
          Pankaj
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          AI Visitor Pass System
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon
                size={20}
                className="transition-transform duration-200 group-hover:scale-110"
              />

              <span className="font-medium">
                {menu.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}

      <div className="border-t border-slate-800 p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold">
            PK
          </div>

          <div>
            <h3 className="font-semibold">
              Pankaj Kumar
            </h3>

            <p className="text-xs text-slate-400">
              Administrator
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-medium transition hover:bg-red-700"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;