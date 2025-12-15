import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Truck,
  Tag,
  Gauge,
  Calendar,
  Edit2,
  Trash2,
} from "lucide-react";
import Header from "../../components/Header";
import VehicleModal from "../../components/VehicleModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import vehicleService from "../../services/vehicleService";

const RemorquesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    Immatriculation: "",
    brand: "",
    model: "",
    year: "",
    status: "available",
  });
  const [errors, setErrors] = useState({});
  const [remorques, setRemorques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRemorques = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vehicleService.getAllVehicles("trailer");
      setRemorques(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des remorques:", err);
      setError("Impossible de charger les remorques");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemorques();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Immatriculation.trim()) {
      newErrors.Immatriculation = "L'immatriculation est requise";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "La marque est requise";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Le modèle est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const vehicleData = {
        ...formData,
        type: "trailer",
        mileage: 0, // Les remorques n'ont pas de kilométrage
        year: formData.year ? Number(formData.year) : undefined,
      };

      if (editingId) {
        await vehicleService.updateVehicle(editingId, vehicleData);
      } else {
        await vehicleService.createVehicle(vehicleData);
      }

      await fetchRemorques();
      handleCloseModal();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de la remorque:", err);

      if (err.response?.data?.message) {
        setErrors({ submit: err.response.data.message });
      } else {
        setErrors({
          submit: editingId
            ? "Erreur lors de la modification de la remorque"
            : "Erreur lors de la création de la remorque",
        });
      }
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      Immatriculation: "",
      brand: "",
      model: "",
      year: "",
      status: "available",
    });
    setErrors({});
  };

  const handleEdit = (remorque) => {
    setEditingId(remorque._id);
    setFormData({
      Immatriculation: remorque.Immatriculation,
      brand: remorque.brand,
      model: remorque.model,
      year: remorque.year || "",
      status: remorque.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, immatriculation) => {
    setDeleteTarget({ id, immatriculation });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await vehicleService.deleteVehicle(deleteTarget.id);
      await fetchRemorques();
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setErrors({ submit: "Erreur lors de la suppression de la remorque" });
      setIsDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      available: "Disponible",
      in_transit: "En transit",
      maintenance: "Maintenance",
      out_of_service: "Hors service",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Remorques" description="Gestion des remorques" />

      <div className="flex-1 p-4 lg:p-6 bg-gray-50">
        {/* Header avec recherche, filtre et bouton */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par immatriculation, marque ou modèle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200 cursor-pointer"
              >
                <option value="all">Tous les statuts</option>
                <option value="available">Disponible</option>
                <option value="in_transit">En transit</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_service">Hors service</option>
              </select>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-900 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Nouvelle Remorque
            </button>
          </div>
        </div>

        {/* Liste des remorques */}
        <div className="bg-white border border-gray-200 rounded overflow-x-auto">
          {/* Header du tableau */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700 min-w-[1100px]">
            <div className="col-span-2">Immatriculation</div>
            <div className="col-span-3">Marque</div>
            <div className="col-span-2">Modèle</div>
            <div className="col-span-2">Année</div>
            <div className="col-span-1">Statut</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-12 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-3"></div>
              <p>Chargement...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-12 text-center text-red-500">
              <p>{error}</p>
            </div>
          )}

          {/* Lignes */}
          {!loading &&
            !error &&
            remorques.length > 0 &&
            remorques
              .filter((remorque) => {
                const matchesSearch =
                  remorque.Immatriculation.toLowerCase().includes(
                    searchTerm.toLowerCase()
                  ) ||
                  remorque.brand
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  remorque.model
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

                const matchesStatus =
                  statusFilter === "all" || remorque.status === statusFilter;

                return matchesSearch && matchesStatus;
              })
              .map((remorque) => (
                <div
                  key={remorque._id}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 transition-colors text-sm min-w-[1100px]"
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Tag className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {remorque.Immatriculation}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center gap-2 text-gray-600">
                    <Truck className="w-4 h-4" />
                    {remorque.brand}
                  </div>
                  <div className="col-span-2 flex items-center text-gray-600">
                    {remorque.model}
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {remorque.year || "-"}
                  </div>
                  <div className="col-span-1 flex items-center">
                    <span className="px-2 py-1 text-xs font-medium rounded text-gray-700 bg-gray-100">
                      {getStatusLabel(remorque.status)}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(remorque)}
                      className="p-1.5 text-blue-700 rounded hover:bg-gray-50 hover:text-blue-800 transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(remorque._id, remorque.Immatriculation)
                      }
                      className="p-1.5 text-red-700 rounded hover:bg-gray-50 hover:text-red-800 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

          {/* Empty state */}
          {!loading && !error && remorques.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Aucune remorque trouvée</p>
            </div>
          )}

          {/* No results after filter */}
          {!loading &&
            !error &&
            remorques.length > 0 &&
            remorques.filter((remorque) => {
              const matchesSearch =
                remorque.Immatriculation.toLowerCase().includes(
                  searchTerm.toLowerCase()
                ) ||
                remorque.brand
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                remorque.model.toLowerCase().includes(searchTerm.toLowerCase());

              const matchesStatus =
                statusFilter === "all" || remorque.status === statusFilter;

              return matchesSearch && matchesStatus;
            }).length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Aucun résultat trouvé</p>
              </div>
            )}
        </div>
      </div>

      {/* Modal de création/édition */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? "Modifier Remorque" : "Nouvelle Remorque"}
        formData={formData}
        errors={errors}
        onSubmit={handleSubmit}
        onChange={handleChange}
        vehicleType="trailer"
        isEditMode={!!editingId}
      />

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={deleteTarget?.immatriculation}
        itemType="la remorque"
      />

      {/* Erreur de soumission */}
      {errors.submit && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded shadow-lg">
          <p className="text-sm">{errors.submit}</p>
        </div>
      )}
    </div>
  );
};

export default RemorquesPage;
