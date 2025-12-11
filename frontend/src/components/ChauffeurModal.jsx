import { X, User, Mail, Lock, Phone, ChevronDown } from "lucide-react";

const ChauffeurModal = ({
  isOpen,
  onClose,
  title,
  formData,
  errors,
  onSubmit,
  onChange,
  isEditMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded w-full max-w-xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Nom complet */}
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Nom Complet
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={onChange}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors ${
                  errors.fullname
                    ? "border-red-300 focus:ring-1 focus:ring-red-200"
                    : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                }`}
                placeholder="Ex: Ahmed Benali"
              />
            </div>
            {errors.fullname && (
              <p className="mt-1 text-xs text-red-600">{errors.fullname}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors ${
                  errors.email
                    ? "border-red-300 focus:ring-1 focus:ring-red-200"
                    : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                }`}
                placeholder="exemple@fleettrack.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Mot de passe - Uniquement en mode création */}
          {!isEditMode && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors ${
                    errors.password
                      ? "border-red-300 focus:ring-1 focus:ring-red-200"
                      : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
          )}

          {/* Téléphone */}
          <div>
            <label
              htmlFor="telephone"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={onChange}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors ${
                  errors.telephone
                    ? "border-red-300 focus:ring-1 focus:ring-red-200"
                    : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                }`}
                placeholder="+212600000000"
              />
            </div>
            {errors.telephone && (
              <p className="mt-1 text-xs text-red-600">{errors.telephone}</p>
            )}
          </div>

          {/* Statut - Custom Select */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Statut
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={onChange}
                className="w-full appearance-none px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200 bg-white cursor-pointer transition-colors"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-slate-800 rounded hover:bg-slate-900 transition-all"
            >
              {isEditMode ? "Modifier" : "Créer le compte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChauffeurModal;
