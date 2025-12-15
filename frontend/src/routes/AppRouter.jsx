import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import DriverDashboardLayout from "../layouts/DriverDashboardLayout";

// Admin Pages
import CamionsPage from "../pages/admin/CamionsPage";
import RemorquesPage from "../pages/admin/RemorquesPage";
import PneusPage from "../pages/admin/PneusPage";
import TrajetsPage from "../pages/admin/TrajetsPage";
import ChauffeursPage from "../pages/admin/ChauffeursPage";
import MaintenancePage from "../pages/admin/MaintenancePage";
import AdminOverviewPage from "../pages/admin/OverviewPage";

// Driver Pages
import DriverOverviewPage from "../pages/driver/OverviewPage";
import MesTrajetsPage from "../pages/driver/MesTrajetsPage";

// Auth Pages
import LoginPage from "../pages/Login";
import ProtectedRoute from "./RouteProtected";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Routes Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="camions" element={<CamionsPage />} />
        <Route path="remorques" element={<RemorquesPage />} />
        <Route path="pneus" element={<PneusPage />} />
        <Route path="trajets" element={<TrajetsPage />} />
        <Route path="chauffeurs" element={<ChauffeursPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
      </Route>

      {/* Routes Chauffeur */}
      <Route
        path="/driver"
        element={
          <ProtectedRoute allowedRoles={["chauffeur"]}>
            <DriverDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/driver/overview" replace />} />
        <Route path="overview" element={<DriverOverviewPage />} />
        <Route path="trajets" element={<MesTrajetsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;
