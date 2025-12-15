import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Truck,
  Package,
  Circle,
  Route,
  Users,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import vehicleService from "../services/vehicleService";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [maintenanceCount, setMaintenanceCount] = useState(0);

  useEffect(() => {
    const fetchMaintenanceCount = async () => {
      try {
        const response = await vehicleService.getAllVehicles(
          null,
          "maintenance"
        );
        setMaintenanceCount(response?.data?.length || 0);
      } catch (error) {
        console.error("Erreur chargement maintenance:", error);
      }
    };

    fetchMaintenanceCount();
    const interval = setInterval(fetchMaintenanceCount, 30000);

    return () => clearInterval(interval);
  }, []);

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
    },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="h-20 px-5 border-b border-gray-200 flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-800 rounded-sm flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FleetTrack</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-gray-400 mb-2">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all ${
                        isActive
                          ? "bg-slate-800 text-white font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>

                      {item.path === "/admin/maintenance" &&
                        maintenanceCount > 0 && (
                          <span className="ml-auto bg-red-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                            {maintenanceCount}
                          </span>
                        )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">mohamed@gmail.com</p>
            </div>
          </div>

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-red-600 hover:bg-red-50 transition">
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
