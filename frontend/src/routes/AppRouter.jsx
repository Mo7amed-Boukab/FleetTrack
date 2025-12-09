import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import CamionsPage from "../pages/CamionsPage";
import RemorquesPage from "../pages/RemorquesPage";
import PneusPage from "../pages/PneusPage";
import TrajetsPage from "../pages/TrajetsPage";
import ChauffeursPage from "../pages/ChauffeursPage";
import MaintenancePage from "../pages/MaintenancePage";
import LoginPage from "../pages/Login";
import OverviewPage from "../pages/OverviewPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="camions" element={<CamionsPage />} />
        <Route path="remorques" element={<RemorquesPage />} />
        <Route path="pneus" element={<PneusPage />} />
        <Route path="trajets" element={<TrajetsPage />} />
        <Route path="chauffeurs" element={<ChauffeursPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;
