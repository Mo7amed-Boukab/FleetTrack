import { X, Save, Truck, MapPin } from "lucide-react";

const TripDetailsModal = ({
  isOpen,
  trip,
  arrivalMileage,
  setArrivalMileage,
  tripStatus,
  setTripStatus,
  onClose,
  onSave,
}) => {
  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            Détails du trajet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Informations du véhicule */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Véhicule
              </h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {trip.truck?.Immatriculation}
                    </p>
                    {trip.trailer && (
                      <p className="text-sm text-gray-600">
                        + Remorque: {trip.trailer.Immatriculation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Statut */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Statut du trajet
              </h3>
              <select
                value={tripStatus}
                onChange={(e) => setTripStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200"
              >
                <option value="planned">Planifié</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>

          {/* Itinéraire */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Itinéraire
            </h3>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Départ</p>
                    <p className="font-medium text-gray-900">
                      {trip.departure.location}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(trip.departure.date).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}{" "}
                      à{" "}
                      {new Date(trip.departure.date).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Arrivée</p>
                    <p className="font-medium text-gray-900">
                      {trip.arrival.location}
                    </p>
                    {trip.arrival.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(trip.arrival.date).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}{" "}
                        à{" "}
                        {new Date(trip.arrival.date).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kilométrage */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Kilométrage
            </h3>
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Kilométrage à l'arrivée *
              </label>
              <input
                type="number"
                value={arrivalMileage}
                onChange={(e) => setArrivalMileage(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-slate-200"
                placeholder="Saisir le kilométrage à l'arrivée"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded transition-colors"
          >
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsModal;
