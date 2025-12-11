import { X, Circle, Tag, ChevronDown } from "lucide-react";

const TireModal = ({
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
          {/* Numéro de série */}
          <div>
            <label
              htmlFor="serialNumber"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Numéro de série
            </label>
            <div className="relative">
              <Circle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                id="serialNumber"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={onChange}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors uppercase ${
                  errors.serialNumber
                    ? "border-red-300 focus:ring-1 focus:ring-red-200"
                    : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                }`}
                placeholder="Ex: TIRE-2024-001"
              />
            </div>
            {errors.serialNumber && (
              <p className="mt-1 text-xs text-red-600">{errors.serialNumber}</p>
            )}
          </div>

          {/* Marque */}
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Marque
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                placeholder="Ex: Michelin, Bridgestone"
              />
            </div>
            {errors.brand && (
              <p className="mt-1 text-xs text-red-600">{errors.brand}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Condition */}
            <div>
              <label
                htmlFor="condition"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Condition
              </label>
              <div className="relative">
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={onChange}
                  className="w-full appearance-none px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200 bg-white cursor-pointer transition-colors"
                >
                  <option value="new">Neuf</option>
                  <option value="good">Bon</option>
                  <option value="worn">Usé</option>
                  <option value="critical">Critique</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
                  <option value="in_stock">En stock</option>
                  <option value="in_use">En utilisation</option>
                  <option value="retired">Retiré</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
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
              {isEditMode ? "Modifier" : "Ajouter"} pneu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TireModal;
