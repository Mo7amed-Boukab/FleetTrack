import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Package,
  Circle,
  Route,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Fuel,
  UserCircle2,
  User,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuSections = [
    {
      title: "GÉNÉRAL",
      items: [
        { icon: LayoutDashboard, label: "Overview", path: "/admin/overview" },
        { icon: Truck, label: "Camions", path: "/admin/camions" },
        { icon: Package, label: "Remorques", path: "/admin/remorques" },
        { icon: Circle, label: "Pneus", path: "/admin/pneus" },
        { icon: Route, label: "Trajets", path: "/admin/trajets" },
        { icon: Users, label: "Chauffeurs", path: "/admin/chauffeurs" },
         { icon: Settings, label: "Maintenance", path: "/admin/maintenance" },
      ],
    }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="h-20 p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-800 rounded-sm flex items-center justify-center">
            <Truck className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-900">FleetTrack</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            <h3 className="px-3 mb-2 mt-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all ${
                      isActive
                        ? "bg-slate-800 text-white font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-100 flex items-center justify-center">
             <User className="text-gray-500 w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-gray-900 truncate">
              admin
            </div>
            <div className="text-xs text-gray-500 truncate">
              mohamed@gmail.com
            </div>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-red-600 hover:bg-red-50 transition-all">
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
