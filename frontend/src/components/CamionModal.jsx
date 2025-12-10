import { X, Truck, Tag, Calendar, Gauge, ChevronDown } from "lucide-react";

const CamionModal = ({ isOpen, onClose, title, formData, errors, onSubmit, onChange }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded w-full max-w-2xl shadow-lg">
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
          {/* Immatriculation */}
          <div>
            <label
              htmlFor="Immatriculation"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Immatriculation
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                id="Immatriculation"
                name="Immatriculation"
                value={formData.Immatriculation}
                onChange={onChange}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors uppercase ${
                  errors.Immatriculation
                    ? "border-red-300 focus:ring-1 focus:ring-red-200"
                    : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                }`}
                placeholder="Ex: ABC-1234"
              />
            </div>
            {errors.Immatriculation && (
              <p className="mt-1 text-xs text-red-600">
                {errors.Immatriculation}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Marque */}
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Marque
              </label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={onChange}
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors ${
                    errors.brand
                      ? "border-red-300 focus:ring-1 focus:ring-red-200"
                      : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                  }`}
                  placeholder="Ex: Mercedes, Volvo"
                />
              </div>
              {errors.brand && (
                <p className="mt-1 text-xs text-red-600">{errors.brand}</p>
              )}
            </div>

            {/* Modèle */}
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Modèle
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={onChange}
                className={`w-full px-3 py-2 text-sm border rounded outline-none transition-colors ${
                  errors.model
                    ? "border-red-300 focus:ring-1 focus:ring-red-200"
                    : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                }`}
                placeholder="Ex: Actros 1843"
              />
              {errors.model && (
                <p className="mt-1 text-xs text-red-600">{errors.model}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Année */}
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Année
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={onChange}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200 transition-colors"
                  placeholder="Ex: 2020"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>

            {/* Kilométrage */}
            <div>
              <label
                htmlFor="mileage"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Kilométrage (km)
              </label>
              <div className="relative">
                <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={onChange}
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors ${
                    errors.mileage
                      ? "border-red-300 focus:ring-1 focus:ring-red-200"
                      : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                  }`}
                  placeholder="Ex: 125000"
                  min="0"
                />
              </div>
              {errors.mileage && (
                <p className="mt-1 text-xs text-red-600">{errors.mileage}</p>
              )}
            </div>
          </div>

          {/* Statut */}
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
                <option value="available">Disponible</option>
                <option value="in_transit">En transit</option>
                <option value="maintenance">En maintenance</option>
                <option value="out_of_service">Hors service</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:cursor-pointer transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-slate-800 rounded hover:bg-slate-900 hover:cursor-pointer transition-all"
            >
              Ajouter un Camion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CamionModal;
