import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";

const AdminDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        {/* Bouton menu burger pour mobile/tablette */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-3 left-5 z-30 p-2 text-slate-800 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
