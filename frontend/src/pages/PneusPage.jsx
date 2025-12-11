import { useState } from "react";
import {
  Plus,
  Search,
  Circle,
  Truck,
  Tag,
  Edit2,
  Trash2,
  Link,
} from "lucide-react";
import Header from "../components/Header";
import TireModal from "../components/TireModal";
import AssignTireModal from "../components/AssignTireModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const PneusPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [selectedTire, setSelectedTire] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [formData, setFormData] = useState({
    serialNumber: "",
    brand: "",
    condition: "new",
    status: "in_stock",
  });
  const [errors, setErrors] = useState({});

  // Données simulées des pneus
  const [pneus] = useState([
    {
      _id: "1",
      serialNumber: "TIRE-2024-001",
      brand: "Michelin",
      condition: "new",
      status: "in_stock",
      vehicle: null,
      position: "unassigned",
      createdAt: "2024-01-15",
    },
    {
      _id: "2",
      serialNumber: "TIRE-2024-002",
      brand: "Bridgestone",
      condition: "good",
      status: "in_use",
      vehicle: { _id: "v1", Immatriculation: "ABC-1234" },
      position: "front_left",
      createdAt: "2024-02-10",
    },
    {
      _id: "3",
      serialNumber: "TIRE-2024-003",
      brand: "Continental",
      condition: "worn",
      status: "in_use",
      vehicle: { _id: "v2", Immatriculation: "XYZ-5678" },
      position: "rear_right",
      createdAt: "2023-11-20",
    },
    {
      _id: "4",
      serialNumber: "TIRE-2024-004",
      brand: "Goodyear",
      condition: "good",
      status: "in_stock",
      vehicle: null,
      position: "unassigned",
      createdAt: "2024-03-05",
    },
    {
      _id: "5",
      serialNumber: "TIRE-2024-005",
      brand: "Michelin",
      condition: "critical",
      status: "retired",
      vehicle: null,
      position: "unassigned",
      createdAt: "2023-08-12",
    },
    {
      _id: "6",
      serialNumber: "TIRE-2024-006",
      brand: "Pirelli",
      condition: "new",
      status: "in_stock",
      vehicle: null,
      position: "spare",
      createdAt: "2024-05-18",
    },
  ]);

  // Données simulées des véhicules pour l'assignation
  const vehicles = [
    {
      _id: "v1",
      Immatriculation: "ABC-1234",
      brand: "Mercedes",
      model: "Actros",
    },
    { _id: "v2", Immatriculation: "XYZ-5678", brand: "Volvo", model: "FH16" },
    { _id: "v3", Immatriculation: "DEF-9012", brand: "Scania", model: "R450" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = "Le numéro de série est requis";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "La marque est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("Pneu ", editingId ? "modifié" : "créé", formData);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      serialNumber: "",
      brand: "",
      condition: "new",
      status: "in_stock",
    });
    setErrors({});
  };

  const handleEdit = (pneu) => {
    setEditingId(pneu._id);
    setFormData({
      serialNumber: pneu.serialNumber,
      brand: pneu.brand,
      condition: pneu.condition,
      status: pneu.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, serialNumber) => {
    setDeleteTarget({ id, serialNumber });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Pneu supprimé:", deleteTarget.id);
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleAssign = (pneu) => {
    setSelectedTire(pneu);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const vehicleId = formData.get("vehicle");
    const position = formData.get("position");

    console.log("Assigner pneu:", {
      tireId: selectedTire._id,
      vehicleId,
      position,
    });

    setIsAssignModalOpen(false);
    setSelectedTire(null);
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      in_stock: "En stock",
      in_use: "En utilisation",
      retired: "Retiré",
    };
    return statusMap[status] || status;
  };

  const getConditionLabel = (condition) => {
    const conditionMap = {
      new: "Neuf",
      good: "Bon",
      worn: "Usé",
      critical: "Critique",
    };
    return conditionMap[condition] || condition;
  };

  const getPositionLabel = (position) => {
    const positionMap = {
      front_left: "Avant gauche",
      front_right: "Avant droit",
      rear_left: "Arrière gauche",
      rear_right: "Arrière droit",
      spare: "Secours",
      unassigned: "Non assigné",
    };
    return positionMap[position] || position;
  };

  const filteredPneus = pneus.filter((pneu) => {
    const matchesSearch =
      pneu.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pneu.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || pneu.status === statusFilter;
    const matchesCondition =
      conditionFilter === "all" || pneu.condition === conditionFilter;

    return matchesSearch && matchesStatus && matchesCondition;
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Pneus" description="Suivi et gestion des pneus" />

      <div className="flex-1 p-6 bg-gray-50">
        {/* Header avec recherche, filtres et bouton */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro de série ou marque..."
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
                <option value="in_stock">En stock</option>
                <option value="in_use">En utilisation</option>
                <option value="retired">Retiré</option>
              </select>

              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200 cursor-pointer"
              >
                <option value="all">Toutes conditions</option>
                <option value="new">Neuf</option>
                <option value="good">Bon</option>
                <option value="worn">Usé</option>
                <option value="critical">Critique</option>
              </select>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-900 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Nouveau Pneu
            </button>
          </div>
        </div>

        {/* Liste des pneus */}
        <div className="bg-white border border-gray-200 rounded">
          {/* Header du tableau */}
          <div className="border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700 p-4">
            <div className="grid grid-cols-14 gap-4 mb-2">
              <div className="col-span-2">Numéro de série</div>
              <div className="col-span-2">Marque</div>
              <div className="col-span-2">Condition</div>
              <div className="col-span-2">Statut</div>
              <div className="col-span-2">Véhicule</div>
              <div className="col-span-2">Position</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
          </div>

          {/* Lignes */}
          {filteredPneus.length > 0 ? (
            filteredPneus.map((pneu) => (
              <div
                key={pneu._id}
                className="grid grid-cols-14 gap-4 p-4 border-b border-gray-100 transition-colors text-sm"
              >
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Circle className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">
                    {pneu.serialNumber}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-gray-600">
                  <Tag className="w-4 h-4" />
                  {pneu.brand}
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="px-2 py-1 text-xs font-medium rounded bg-blue-50 text-blue-900">
                    {getConditionLabel(pneu.condition)}
                  </span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                    {getStatusLabel(pneu.status)}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-gray-600">
                  {pneu.vehicle ? (
                    <>
                      <Truck className="w-4 h-4" />
                      {pneu.vehicle.Immatriculation}
                    </>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="col-span-2 flex items-center text-gray-600">
                  {getPositionLabel(pneu.position)}
                </div>

                <div className="col-span-2 flex items-center justify-center p-2">
                  <button
                    onClick={() => handleAssign(pneu)}
                    className="p-2 text-green-700 hover:bg-gray-50 rounded transition-colors"
                    title="Assigner"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(pneu)}
                    className="p-2 text-blue-700 hover:bg-gray-50 rounded transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pneu)}
                    className="p-2 text-red-700 hover:bg-gray-50 rounded transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Circle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Aucun pneu trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TireModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? "Modifier le pneu" : "Nouveau pneu"}
        formData={formData}
        errors={errors}
        onSubmit={handleSubmit}
        onChange={handleChange}
        isEditMode={!!editingId}
      />

      <AssignTireModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedTire(null);
        }}
        tire={selectedTire}
        vehicles={vehicles}
        onSubmit={handleAssignSubmit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={deleteTarget?.serialNumber}
        itemType="pneu"
      />
    </div>
  );
};

export default PneusPage;
