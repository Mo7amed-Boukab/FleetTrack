import { X, Truck, MapPin, ChevronDown } from "lucide-react";

const AssignTireModal = ({ isOpen, onClose, tire, vehicles, onSubmit }) => {
  if (!isOpen || !tire) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded w-full max-w-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Assigner le pneu
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Info du pneu */}
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500 mb-1">Pneu sélectionné</p>
            <p className="text-sm font-medium text-gray-900">
              {tire.serialNumber}
            </p>
            <p className="text-xs text-gray-600">{tire.brand}</p>
          </div>

          {/* Véhicule */}
          <div>
            <label
              htmlFor="vehicle"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Véhicule
            </label>
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                id="vehicle"
                name="vehicle"
                required
                className="w-full appearance-none pl-10 pr-3 py-2 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200 bg-white cursor-pointer"
              >
                <option value="">Sélectionner un véhicule</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.Immatriculation} - {vehicle.brand} {vehicle.model}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Position */}
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Position
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                id="position"
                name="position"
                required
                className="w-full appearance-none pl-10 pr-3 py-2 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200 bg-white cursor-pointer"
              >
                <option value="">Sélectionner une position</option>
                <option value="front_left">Avant gauche</option>
                <option value="front_right">Avant droit</option>
                <option value="rear_left">Arrière gauche</option>
                <option value="rear_right">Arrière droit</option>
                <option value="spare">Secours</option>
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
              Assigner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTireModal;
