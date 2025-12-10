import { useState } from "react";
import { Plus, Search, Mail, Phone, UserCircle, User } from "lucide-react";
import Header from "../components/Header";
import ChauffeurModal from "../components/ChauffeurModal";

const ChauffeursPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    telephone: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  
  // Données simulées des chauffeurs
  const [chauffeurs, setChauffeurs] = useState([
    {
      _id: "1",
      fullname: "Ahmed Benali",
      email: "ahmed.benali@fleettrack.com",
      telephone: "+212600000001",
      status: "active",
      createdAt: "2025-01-15",
    },
    {
      _id: "2",
      fullname: "Fatima Zahra",
      email: "fatima.zahra@fleettrack.com",
      telephone: "+212600000002",
      status: "active",
      createdAt: "2025-01-20",
    },
    {
      _id: "3",
      fullname: "Mohammed Alaoui",
      email: "mohammed.alaoui@fleettrack.com",
      telephone: "+212600000003",
      status: "inactive",
      createdAt: "2025-02-01",
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

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Le nom complet est requis";
    } else if (formData.fullname.length < 3) {
      newErrors.fullname = "Le nom doit contenir au moins 3 caractères";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    } else if (
      !/^\+?[0-9]{10,15}$/.test(formData.telephone.replace(/\s/g, ""))
    ) {
      newErrors.telephone = "Numéro de téléphone invalide";
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
      fullname: "",
      email: "",
      password: "",
      telephone: "",
      status: "active",
    });
    setErrors({});
  };


  return (
    <div className="flex-1 flex flex-col">
      <Header title="Chauffeurs" description="Gestion des chauffeurs" />

      <div className="flex-1 p-6 bg-gray-50">
        {/* Header avec recherche et bouton */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
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
            Nouveau Chauffeur
          </button>
        </div>

        {/* Liste des chauffeurs */}
        <div className="bg-white border border-gray-200 rounded">
          {/* Header du tableau */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700">
            <div className="col-span-3">Nom Complet</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Téléphone</div>
            <div className="col-span-2">Date de création</div>
            <div className="col-span-2">Statut</div>
          </div>

          {/* Lignes */}
          {
            chauffeurs.map((chauffeur) => (
              <div
                key={chauffeur._id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm"
              >
                <div className="col-span-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">
                    {chauffeur.fullname}
                  </span>
                </div>
                <div className="col-span-3 flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  {chauffeur.email}
                </div>
                <div className="col-span-2 flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  {chauffeur.telephone}
                </div>
                <div className="col-span-2 flex items-center text-gray-600">
                  {new Date(chauffeur.createdAt).toLocaleDateString("fr-FR")}
                </div>
                <div className="col-span-2 flex items-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      chauffeur.status === "active"
                        ? "bg-blue-50 text-blue-950"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {chauffeur.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
            ))
         }
        </div>
      </div>

      {/* Modal de création */}
      <ChauffeurModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Nouveau Chauffeur"
        formData={formData}
        errors={errors}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
    </div>
  );
};

export default ChauffeursPage;
