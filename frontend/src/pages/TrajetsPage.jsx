import { useState } from "react";
import {
  Plus,
  Search,
  MapPin,
  Calendar,
  User,
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import Header from "../components/Header";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import TripModal from "../components/TripModal";

const TrajetsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    driver: "",
    truck: "",
    trailer: "",
    departureLocation: "",
    departureDate: "",
    arrivalLocation: "",
    arrivalDate: "",
    status: "planned",
  });
  const [errors, setErrors] = useState({});

  // Données simulées
  const [trajets] = useState([
    {
      _id: "1",
      driver: {
        _id: "d1",
        fullname: "Ahmed Benali",
        telephone: "+212 6 12 34 56 78",
      },
      truck: {
        _id: "t1",
        Immatriculation: "ABC-1234",
        brand: "Mercedes",
        model: "Actros",
      },
      trailer: {
        _id: "tr1",
        Immatriculation: "XYZ-5678",
        brand: "Schmitz",
        model: "Cargobull",
      },
      departure: {
        location: "Casablanca",
        date: "2024-12-10T08:00:00",
        mileage: 125000,
      },
      arrival: {
        location: "Marrakech",
        date: "2024-12-10T12:30:00",
        mileage: 125250,
      },
      status: "completed",
      fuelConsumed: 45,
      cargoDetails: {
        description: "Produits alimentaires",
        weight: 8500,
      },
      createdAt: "2024-12-09T10:00:00",
    },
    {
      _id: "2",
      driver: {
        _id: "d2",
        fullname: "Youssef Alami",
        telephone: "+212 6 23 45 67 89",
      },
      truck: {
        _id: "t2",
        Immatriculation: "DEF-5678",
        brand: "Volvo",
        model: "FH16",
      },
      trailer: null,
      departure: {
        location: "Tanger",
        date: "2024-12-11T14:00:00",
        mileage: 89000,
      },
      arrival: {
        location: "Fès",
        date: null,
        mileage: null,
      },
      status: "in_progress",
      fuelConsumed: null,
      cargoDetails: {
        description: "Matériaux de construction",
        weight: 12000,
      },
      createdAt: "2024-12-10T09:00:00",
    },
    {
      _id: "3",
      driver: {
        _id: "d3",
        fullname: "Fatima Zahra",
        telephone: "+212 6 34 56 78 90",
      },
      truck: {
        _id: "t3",
        Immatriculation: "GHI-9012",
        brand: "Scania",
        model: "R450",
      },
      trailer: {
        _id: "tr2",
        Immatriculation: "JKL-3456",
        brand: "Krone",
        model: "Profi Liner",
      },
      departure: {
        location: "Rabat",
        date: "2024-12-13T06:00:00",
        mileage: 67000,
      },
      arrival: {
        location: "Agadir",
        date: null,
        mileage: null,
      },
      status: "planned",
      fuelConsumed: null,
      cargoDetails: {
        description: "Équipements électroniques",
        weight: 5000,
      },
      createdAt: "2024-12-11T15:00:00",
    },
    {
      _id: "4",
      driver: {
        _id: "d1",
        fullname: "Ahmed Benali",
        telephone: "+212 6 12 34 56 78",
      },
      truck: {
        _id: "t1",
        Immatriculation: "ABC-1234",
        brand: "Mercedes",
        model: "Actros",
      },
      trailer: null,
      departure: {
        location: "Marrakech",
        date: "2024-12-08T07:00:00",
        mileage: 124500,
      },
      arrival: {
        location: "Casablanca",
        date: "2024-12-08T11:00:00",
        mileage: 124750,
      },
      status: "cancelled",
      fuelConsumed: null,
      cargoDetails: {
        description: "Trajet annulé - problème mécanique",
        weight: 0,
      },
      createdAt: "2024-12-07T16:00:00",
    },
  ]);

  const drivers = [
    { _id: "d1", fullname: "Ahmed Benali" },
    { _id: "d2", fullname: "Youssef Alami" },
    { _id: "d3", fullname: "Fatima Zahra" },
  ];

  const trucks = [
    { _id: "t1", Immatriculation: "ABC-1234", brand: "Mercedes" },
    { _id: "t2", Immatriculation: "DEF-5678", brand: "Volvo" },
    { _id: "t3", Immatriculation: "GHI-9012", brand: "Scania" },
  ];

  const trailers = [
    { _id: "tr1", Immatriculation: "XYZ-5678", brand: "Schmitz" },
    { _id: "tr2", Immatriculation: "JKL-3456", brand: "Krone" },
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

    if (!formData.driver) newErrors.driver = "Le chauffeur est requis";
    if (!formData.truck) newErrors.truck = "Le camion est requis";
    if (!formData.departureLocation)
      newErrors.departureLocation = "Le lieu de départ est requis";
    if (!formData.departureDate)
      newErrors.departureDate = "La date de départ est requise";
    if (!formData.arrivalLocation)
      newErrors.arrivalLocation = "Le lieu d'arrivée est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("Trajet ", editingId ? "modifié" : "créé", formData);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      driver: "",
      truck: "",
      trailer: "",
      departureLocation: "",
      departureDate: "",
      arrivalLocation: "",
      arrivalDate: "",
      status: "planned",
    });
    setErrors({});
  };

  const handleEdit = (trajet) => {
    setEditingId(trajet._id);
    setFormData({
      driver: trajet.driver._id,
      truck: trajet.truck._id,
      trailer: trajet.trailer?._id || "",
      departureLocation: trajet.departure.location,
      departureDate: trajet.departure.date?.substring(0, 16),
      arrivalLocation: trajet.arrival.location,
      arrivalDate: trajet.arrival.date?.substring(0, 16) || "",
      status: trajet.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (trajet) => {
    setDeleteTarget({
      id: trajet._id,
      name: `${trajet.departure.location} → ${trajet.arrival.location}`,
    });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Trajet supprimé:", deleteTarget.id);
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleViewDetails = (trajet) => {
    setSelectedTrip(trajet);
    setIsDetailsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planned: {
        label: "Planifié",
        className: "bg-blue-50 text-blue-900",
      },
      in_progress: {
        label: "En cours",
        className: "bg-yellow-50 text-yellow-900",
      },
      completed: {
        label: "Terminé",
        className: "bg-green-50 text-green-900",
      },
      cancelled: {
        label: "Annulé",
        className: "bg-red-50 text-red-900",
      },
    };

    const config = statusConfig[status] || statusConfig.planned;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const filteredTrajets = trajets.filter((trajet) => {
    const matchesSearch =
      trajet.departure.location
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      trajet.arrival.location
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      trajet.driver.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trajet.truck.Immatriculation.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

    const matchesStatus =
      statusFilter === "all" || trajet.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: trajets.length,
    planned: trajets.filter((t) => t.status === "planned").length,
    inProgress: trajets.filter((t) => t.status === "in_progress").length,
    completed: trajets.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Trajets"
        description="Planification et suivi des trajets"
      />

      <div className="flex-1 p-6 bg-gray-50">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total trajets</p>
                <p className="text-2xl font-medium text-gray-700">
                  {stats.total}
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Planifiés</p>
                <p className="text-2xl font-medium text-gray-700">
                  {stats.planned}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-900" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-medium text-gray-700">
                  {stats.inProgress}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-50 rounded flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-yellow-900" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminés</p>
                <p className="text-2xl font-medium text-gray-700">
                  {stats.completed}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Header avec recherche, filtre et bouton */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par lieu, chauffeur ou immatriculation..."
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
                <option value="planned">Planifié</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-900 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Nouveau Trajet
            </button>
          </div>
        </div>

        {/* Liste des trajets */}
        <div className="bg-white border border-gray-200 rounded">
          {/* Header du tableau */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700">
            <div className="col-span-2">Chauffeur</div>
            <div className="col-span-2">Véhicule</div>
            <div className="col-span-2">Départ</div>
            <div className="col-span-2">Arrivée</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-1">Statut</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Lignes */}
          {filteredTrajets.length > 0 ? (
            filteredTrajets.map((trajet) => (
              <div
                key={trajet._id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 transition-colors text-sm"
              >
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">
                    {trajet.driver.fullname}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-gray-600">
                  <div>
                    <div className="font-medium">
                      {trajet.truck.Immatriculation}
                    </div>
                    {trajet.trailer && (
                      <div className="text-xs text-gray-500">
                        + {trajet.trailer.Immatriculation}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {trajet.departure.location}
                </div>
                <div className="col-span-2 flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-slate-800" />
                  {trajet.arrival.location}
                </div>
                <div className="col-span-1 flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(trajet.departure.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </div>
                <div className="col-span-1 flex items-center">
                  {getStatusBadge(trajet.status)}
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(trajet)}
                    className="p-1.5 text-blue-700 rounded hover:bg-gray-50 hover:text-bleu-800 transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(trajet)}
                    className="p-1.5 text-red-700 rounded hover:bg-gray-50 hover:text-red-800 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : filteredTrajets.length === 0 && trajets.length > 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Aucun résultat trouvé</p>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Aucun trajet trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de création/édition */}
      <TripModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? "Modifier le trajet" : "Nouveau trajet"}
        formData={formData}
        errors={errors}
        onSubmit={handleSubmit}
        onChange={handleChange}
        drivers={drivers}
        trucks={trucks}
        trailers={trailers}
        isEditMode={!!editingId}
      />

      {/* Modal détails */}

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={deleteTarget?.name}
        itemType="le trajet"
      />
    </div>
  );
};

export default TrajetsPage;
