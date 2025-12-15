import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Mail,
  Phone,
  UserCircle,
  User,
  Edit2,
  Trash2,
} from "lucide-react";
import Header from "../../components/Header";
import ChauffeurModal from "../../components/ChauffeurModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import userService from "../../services/userService";

const ChauffeursPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    telephone: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [chauffeurs, setChauffeurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChauffeurs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAllUsers();
      setChauffeurs(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des chauffeurs:", err);
      setError("Impossible de charger les chauffeurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChauffeurs();
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

    if (!editingId) {
      if (!formData.password.trim()) {
        newErrors.password = "Le mot de passe est requis";
      } else if (formData.password.length < 6) {
        newErrors.password =
          "Le mot de passe doit contenir au moins 6 caractères";
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const userData = {
        ...formData,
        role: "chauffeur",
      };

      // En mode édition, ne pas envoyer le password
      if (editingId) {
        delete userData.password;
      }

      if (editingId) {
        await userService.updateUser(editingId, userData);
      } else {
        await userService.createUser(userData);
      }

      await fetchChauffeurs();
      handleCloseModal();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde du chauffeur:", err);

      if (err.response?.data?.message) {
        setErrors({ submit: err.response.data.message });
      } else {
        setErrors({
          submit: editingId
            ? "Erreur lors de la modification du chauffeur"
            : "Erreur lors de la création du chauffeur",
        });
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      fullname: "",
      email: "",
      password: "",
      telephone: "",
      status: "active",
    });
    setErrors({});
  };

  const handleEdit = (chauffeur) => {
    setEditingId(chauffeur._id);
    setFormData({
      fullname: chauffeur.fullname,
      email: chauffeur.email,
      password: "",
      telephone: chauffeur.telephone,
      status: chauffeur.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, fullname) => {
    setDeleteTarget({ id, fullname });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await userService.deleteUser(deleteTarget.id);
      await fetchChauffeurs();
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setErrors({ submit: "Erreur lors de la suppression du chauffeur" });
      setIsDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Chauffeurs" description="Gestion des chauffeurs" />

      <div className="flex-1 p-4 lg:p-6 bg-gray-50">
        {/* Header avec recherche, filtre et bouton */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou téléphone..."
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
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-900 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Nouveau Chauffeur
            </button>
          </div>
        </div>

        {/* Liste des chauffeurs */}
        <div className="bg-white border border-gray-200 rounded overflow-x-auto">
          {/* Header du tableau */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700 min-w-[1100px]">
            <div className="col-span-2">Nom Complet</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Téléphone</div>
            <div className="col-span-2">Date de création</div>
            <div className="col-span-1">Statut</div>
            <div className="col-span-2 text-center">Actions</div>
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
            chauffeurs.length > 0 &&
            chauffeurs
              .filter((chauffeur) => {
                const matchesSearch =
                  chauffeur.fullname
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  chauffeur.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

                const matchesStatus =
                  statusFilter === "all" || chauffeur.status === statusFilter;

                return matchesSearch && matchesStatus;
              })
              .map((chauffeur) => (
                <div
                  key={chauffeur._id}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 transition-colors text-sm min-w-[1100px]"
                >
                  <div className="col-span-2 flex items-center gap-2">
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
                  <div className="col-span-1 flex items-center">
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
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(chauffeur)}
                      className="p-1.5 text-blue-700 rounded hover:bg-gray-50 hover:text-blue-800 transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(chauffeur._id, chauffeur.fullname)
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
          {!loading && !error && chauffeurs.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <UserCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Aucun chauffeur trouvé</p>
            </div>
          )}

          {/* No results after filter */}
          {!loading &&
            !error &&
            chauffeurs.length > 0 &&
            chauffeurs.filter((chauffeur) => {
              const matchesSearch =
                chauffeur.fullname
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                chauffeur.email
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());

              const matchesStatus =
                statusFilter === "all" || chauffeur.status === statusFilter;

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
      <ChauffeurModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? "Modifier Chauffeur" : "Nouveau Chauffeur"}
        formData={formData}
        errors={errors}
        onSubmit={handleSubmit}
        onChange={handleChange}
        isEditMode={!!editingId}
      />

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={deleteTarget?.fullname}
        itemType="le chauffeur"
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

export default ChauffeursPage;
