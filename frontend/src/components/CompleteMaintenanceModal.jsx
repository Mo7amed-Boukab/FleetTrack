import { CheckCircle, X } from "lucide-react";

const CompleteMaintenanceModal = ({ isOpen, onClose, vehicle, onComplete, loading }) => {
  if (!isOpen || !vehicle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(vehicle._id);
  };

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded w-full max-w-xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Marquer Maintenance Effectuée</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <p className="text-sm text-gray-700">
              <strong>Véhicule :</strong> {vehicle.Immatriculation}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Marque :</strong> {vehicle.brand} {vehicle.model}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Kilométrage actuel :</strong> {vehicle.mileage?.toLocaleString()} km
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-sm text-gray-700">
              La maintenance sera enregistrée avec :
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-600 space-y-1">
              <li>Date de service : Aujourd'hui</li>
              <li>Kilométrage : {vehicle.mileage?.toLocaleString()} km</li>
              <li>Prochaine maintenance : +1 000 km ou +3 mois</li>
              <li>Statut : Disponible</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirmer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteMaintenanceModal;
