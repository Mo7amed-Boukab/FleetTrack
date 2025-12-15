import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Route, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DriverSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuSections = [
    {
      title: "GÉNÉRAL",
      items: [
        {
          icon: LayoutDashboard,
          label: "Overview",
          path: "/driver/overview",
        },
        { icon: Route, label: "Mes Trajets", path: "/driver/trajets" },
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
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          w-64 bg-white border-r border-gray-200
          flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-start border-b border-gray-200 px-4">
          <Link to="/driver/overview" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-slate-800 rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-semibold text-lg text-gray-800">
              FleetTrack
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <p className="text-xs font-semibold text-gray-400 mb-3 px-3">
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
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded
                        text-sm font-medium transition-all
                        ${
                          isActive
                            ? "bg-slate-800 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
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

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {JSON.parse(localStorage.getItem("user") || "{}")?.fullname ||
                  "Chauffeur"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {JSON.parse(localStorage.getItem("user") || "{}")?.email ||
                  "chauffeur@fleet.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DriverSidebar;
