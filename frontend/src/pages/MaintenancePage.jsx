import { useState, useEffect } from "react";
import {
  Search,
  Wrench,
  Calendar,
  CheckCircle,
  Truck,
  AlertTriangle,
  Gauge,
} from "lucide-react";
import Header from "../components/Header";
import CompleteMaintenanceModal from "../components/CompleteMaintenanceModal";
import vehicleService from "../services/vehicleService";

const MaintenancePage = () => {
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [maintenanceTarget, setMaintenanceTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});

  // Données réelles depuis l'API
  const [vehiclesInMaintenance, setVehiclesInMaintenance] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  // Charger les véhicules en maintenance
  const fetchVehiclesInMaintenance = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getAllVehicles(null, "maintenance");
      setVehiclesInMaintenance(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      setErrors({
        fetch: "Impossible de charger les véhicules en maintenance",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger tous les véhicules pour les stats
  const fetchAllVehicles = async () => {
    try {
      const response = await vehicleService.getAllVehicles();
      setAllVehicles(response.data);
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  useEffect(() => {
    fetchVehiclesInMaintenance();
    fetchAllVehicles();
  }, []);

  const handleCompleteMaintenance = (vehicle) => {
    setMaintenanceTarget(vehicle);
    setIsMaintenanceModalOpen(true);
  };

  const confirmCompleteMaintenance = async (vehicleId) => {
    try {
      setMaintenanceLoading(true);
      await vehicleService.completeMaintenance(vehicleId);
      await fetchVehiclesInMaintenance();
      await fetchAllVehicles();
      setIsMaintenanceModalOpen(false);
      setMaintenanceTarget(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      setErrors({ submit: "Erreur lors de la validation de la maintenance" });
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const closeMaintenanceModal = () => {
    setIsMaintenanceModalOpen(false);
    setMaintenanceTarget(null);
  };

  const stats = {
    inMaintenance: vehiclesInMaintenance.length, // Véhicules actuellement en maintenance
    validatedToday: allVehicles.filter(
      (v) =>
        v.status === "available" &&
        v.maintenance?.lastServiceDate &&
        new Date(v.maintenance.lastServiceDate).toDateString() ===
          new Date().toDateString()
    ).length, // Validés aujourd'hui
    available: allVehicles.filter((v) => v.status === "available").length, // Total disponibles
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Maintenance"
        description="Gestion des véhicules nécessitant une maintenance"
      />

      <div className="flex-1 p-6 bg-gray-50">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En maintenance</p>
                <p className="text-2xl font-medium text-gray-600">
                  {stats.inMaintenance}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                <Wrench className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Validées aujourd'hui</p>
                <p className="text-2xl font-medium text-gray-600">
                  {stats.validatedToday}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Véhicules disponibles</p>
                <p className="text-2xl font-medium text-blue-600">
                  {stats.available}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recherche */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par véhicule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Liste des véhicules en maintenance */}
        <div className="bg-white border border-gray-200 rounded">
          {/* Header du tableau */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700">
            <div className="col-span-3">Véhicule</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Kilométrage</div>
            <div className="col-span-2">Dernier service</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-12 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-3"></div>
              <p>Chargement...</p>
            </div>
          )}

          {/* Lignes */}
          {!loading && vehiclesInMaintenance.length > 0 ? (
            vehiclesInMaintenance
              .filter((vehicle) => {
                const matchesSearch =
                  vehicle.Immatriculation.toLowerCase().includes(
                    searchTerm.toLowerCase()
                  ) ||
                  vehicle.brand
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  vehicle.model
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                return matchesSearch;
              })
              .map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 transition-colors text-sm bg-orange-50/30"
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        {vehicle.Immatriculation}
                      </span>
                      <p className="text-xs text-gray-500">
                        {vehicle.brand} {vehicle.model}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-gray-600">
                    <Truck className="w-4 h-4" />
                    {vehicle.type === "truck" ? "Camion" : "Remorque"}
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-gray-600">
                    <Gauge className="w-4 h-4" />
                    {vehicle.mileage?.toLocaleString() || 0} km
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {vehicle.maintenance?.lastServiceDate
                      ? new Date(
                          vehicle.maintenance.lastServiceDate
                        ).toLocaleDateString("fr-FR")
                      : "Aucun"}
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleCompleteMaintenance(vehicle)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-gray-700 rounded hover:bg-gray-800 transition-colors"
                      title="Marquer maintenance effectuée"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Valider maintenance
                    </button>
                  </div>
                </div>
              ))
          ) : !loading && vehiclesInMaintenance.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="font-medium">Aucun véhicule en maintenance</p>
              <p className="text-sm mt-1">
                Tous les véhicules sont disponibles
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal de complétion de maintenance */}
      <CompleteMaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={closeMaintenanceModal}
        vehicle={maintenanceTarget}
        onComplete={confirmCompleteMaintenance}
        loading={maintenanceLoading}
      />

      {/* Message de succès/erreur */}
      {errors.submit && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded shadow-lg z-50">
          <p className="text-sm">{errors.submit}</p>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;
