import {
  X,
  User,
  Truck,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
} from "lucide-react";

const TripModal = ({
  isOpen,
  onClose,
  title,
  formData,
  errors,
  onSubmit,
  onChange,
  drivers,
  trucks,
  trailers,
  isEditMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded w-full max-w-3xl shadow-lg">
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
          {/* Assignation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Chauffeur *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="driver"
                  value={formData.driver}
                  onChange={onChange}
                  className={`w-full appearance-none pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors bg-white cursor-pointer ${
                    errors.driver
                      ? "border-red-300 focus:ring-1 focus:ring-red-200"
                      : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                  }`}
                >
                  <option value="">Sélectionner un chauffeur</option>
                  {drivers.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.fullname}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.driver && (
                <p className="text-xs text-red-600 mt-1">{errors.driver}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Camion *
              </label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="truck"
                  value={formData.truck}
                  onChange={onChange}
                  className={`w-full appearance-none pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors bg-white cursor-pointer ${
                    errors.truck
                      ? "border-red-300 focus:ring-1 focus:ring-red-200"
                      : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                  }`}
                >
                  <option value="">Sélectionner un camion</option>
                  {trucks.map((truck) => (
                    <option key={truck._id} value={truck._id}>
                      {truck.Immatriculation} - {truck.brand}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.truck && (
                <p className="text-xs text-red-600 mt-1">{errors.truck}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Remorque (optionnel)
              </label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="trailer"
                  value={formData.trailer}
                  onChange={onChange}
                  className="w-full appearance-none pl-10 pr-3 py-2 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200 bg-white cursor-pointer"
                >
                  <option value="">Aucune remorque</option>
                  {trailers.map((trailer) => (
                    <option key={trailer._id} value={trailer._id}>
                      {trailer.Immatriculation} - {trailer.brand}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Départ et Arrivée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Lieu de départ *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="departureLocation"
                  value={formData.departureLocation}
                  onChange={onChange}
                  placeholder="Ex: Casablanca"
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors ${
                    errors.departureLocation
                      ? "border-red-300 focus:ring-1 focus:ring-red-200"
                      : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                  }`}
                />
              </div>
              {errors.departureLocation && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.departureLocation}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Lieu d'arrivée *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="arrivalLocation"
                  value={formData.arrivalLocation}
                  onChange={onChange}
                  placeholder="Ex: Marrakech"
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors ${
                    errors.arrivalLocation
                      ? "border-red-300 focus:ring-1 focus:ring-red-200"
                      : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                  }`}
                />
              </div>
              {errors.arrivalLocation && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.arrivalLocation}
                </p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date et heure de départ *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="datetime-local"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={onChange}
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded outline-none transition-colors ${
                    errors.departureDate
                      ? "border-red-300 focus:ring-1 focus:ring-red-200"
                      : "border-gray-300 focus:ring-1 focus:ring-slate-200"
                  }`}
                />
              </div>
              {errors.departureDate && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.departureDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date et heure d'arrivée prévue
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="datetime-local"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={onChange}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Statut
            </label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={onChange}
                className="w-full appearance-none pl-3 pr-3 py-2 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200 bg-white cursor-pointer"
              >
                <option value="planned">Planifié</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
              {errors.submit}
            </div>
          )}

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
              {isEditMode ? "Modifier Trajet" : "Créer Trajet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripModal;
