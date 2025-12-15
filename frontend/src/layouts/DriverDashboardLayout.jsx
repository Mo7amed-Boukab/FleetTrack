import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import DriverSidebar from "../components/DriverSidebar";

const DriverDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <DriverSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Burger menu button - mobile only */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-5 z-30 p-2 text-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DriverDashboardLayout;
