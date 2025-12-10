import { useState } from "react";
import { Plus, Search, Truck, Tag, Gauge, Calendar } from "lucide-react";
import Header from "../components/Header";
import VehicleModal from "../components/VehicleModal";

const CamionsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    Immatriculation: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    status: "available",
  });
  const [errors, setErrors] = useState({});

  // Données simulées des camions
  const [camions, setCamions] = useState([
    {
      _id: "1",
      Immatriculation: "ABC-1234",
      type: "truck",
      brand: "Mercedes",
      model: "Actros 1843",
      year: 2020,
      mileage: 125000,
      status: "available",
      createdAt: "2024-01-15",
    },
    {
      _id: "2",
      Immatriculation: "XYZ-5678",
      type: "truck",
      brand: "Volvo",
      model: "FH16",
      year: 2019,
      mileage: 180000,
      status: "in_transit",
      createdAt: "2023-11-20",
    },
    {
      _id: "3",
      Immatriculation: "DEF-9012",
      type: "truck",
      brand: "Scania",
      model: "R450",
      year: 2021,
      mileage: 95000,
      status: "maintenance",
      createdAt: "2024-03-10",
    },
    {
      _id: "4",
      Immatriculation: "GHI-3456",
      type: "truck",
      brand: "MAN",
      model: "TGX 18.500",
      year: 2018,
      mileage: 220000,
      status: "available",
      createdAt: "2023-08-05",
    },
  ]);

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

    if (!formData.mileage) {
      newErrors.mileage = "Le kilométrage est requis";
    } else if (isNaN(formData.mileage) || formData.mileage < 0) {
      newErrors.mileage = "Le kilométrage doit être un nombre positif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      Immatriculation: "",
      brand: "",
      model: "",
      year: "",
      mileage: "",
      status: "available",
    });
    setErrors({});
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
      <Header title="Camions" description="Gestion de la flotte de camions" />

      <div className="flex-1 p-6 bg-gray-50">
        {/* Header avec recherche et bouton */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par immatriculation, marque ou modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded outline-none"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-900 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nouveau Camion
          </button>
        </div>

        {/* Liste des camions */}
        <div className="bg-white border border-gray-200 rounded">
          {/* Header du tableau */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700">
            <div className="col-span-2">Immatriculation</div>
            <div className="col-span-2">Marque</div>
            <div className="col-span-2">Modèle</div>
            <div className="col-span-1">Année</div>
            <div className="col-span-2">Kilométrage</div>
            <div className="col-span-2">Statut</div>
            <div className="col-span-1">Date</div>
          </div>

          {/* Lignes */}
          {camions.map((camion) => (
            <div
              key={camion._id}
              className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm"
            >
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Tag className="w-4 h-4 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">
                  {camion.Immatriculation}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-gray-600">
                <Truck className="w-4 h-4" />
                {camion.brand}
              </div>
              <div className="col-span-2 flex items-center text-gray-600">
                {camion.model}
              </div>
              <div className="col-span-1 flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                {camion.year || "-"}
              </div>
              <div className="col-span-2 flex items-center gap-2 text-gray-600">
                <Gauge className="w-4 h-4" />
                {camion.mileage.toLocaleString()} km
              </div>
              <div className="col-span-2 flex items-center">
                <span className="px-2 py-1 text-xs font-medium rounded text-gray-700 bg-gray-100">
                  {getStatusLabel(camion.status)}
                </span>
              </div>
              <div className="col-span-1 flex items-center text-gray-600 text-xs">
                {new Date(camion.createdAt).toLocaleDateString("fr-FR", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de création */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Nouveau Camion"
        formData={formData}
        errors={errors}
        onSubmit={handleSubmit}
        onChange={handleChange}
        vehicleType="truck"
      />
    </div>
  );
};

export default CamionsPage;
