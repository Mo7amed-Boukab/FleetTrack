import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Truck,
  PlayCircle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import Header from "../../components/Header";
import TripDetailsModal from "../../components/TripDetailsModal";
import tripService from "../../services/tripService";

const MesTrajetsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [arrivalMileage, setArrivalMileage] = useState("");
  const [tripStatus, setTripStatus] = useState("");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await tripService.getAllTrips();
      console.log("Trips fetched:", response.data);
      setTrips(response.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des trajets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setArrivalMileage(trip.arrival?.mileage || "");
    setTripStatus(trip.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
    setArrivalMileage("");
    setTripStatus("");
  };

  const handleSave = async () => {
    try {
      const updateData = {
        arrival: {
          ...selectedTrip.arrival,
          mileage: arrivalMileage ? Number(arrivalMileage) : undefined,
        },
        status: tripStatus,
      };

      await tripService.updateTrip(selectedTrip._id, updateData);
      await fetchTrips();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planned: {
        bg: "bg-blue-50",
        text: "text-blue-900",
        label: "Planifié",
        icon: Clock,
      },
      in_progress: {
        bg: "bg-yellow-50",
        text: "text-yellow-900",
        label: "En cours",
        icon: PlayCircle,
      },
      completed: {
        bg: "bg-green-50",
        text: "text-green-900",
        label: "Terminé",
        icon: CheckCircle,
      },
      cancelled: {
        bg: "bg-red-50",
        text: "text-red-900",
        label: "Annulé",
        icon: Clock,
      },
    };

    const config = statusConfig[status] || statusConfig.planned;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.departure?.location
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      trip.arrival?.location
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      trip.truck?.Immatriculation?.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

    const matchesStatus =
      statusFilter === "all" || trip.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Mes Trajets" description="Liste de tous vos trajets" />

      <div className="flex-1 p-4 lg:p-6 bg-gray-50">
        {/* Recherche et filtres */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par lieu ou véhicule..."
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
                <option value="planned">Planifié</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des trajets */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des trajets...</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded overflow-x-auto lg:overflow-visible">
            {/* Header du tableau */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700 min-w-[1100px] lg:min-w-0">
              <div className="col-span-2">Véhicule</div>
              <div className="col-span-2">Départ</div>
              <div className="col-span-2">Arrivée</div>
              <div className="col-span-2">Date de départ</div>
              <div className="col-span-2">Date d'arrivée</div>
              <div className="col-span-1">Statut</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>

            {/* Lignes */}
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 transition-colors text-sm min-w-[1100px] lg:min-w-0"
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {trip.truck?.Immatriculation}
                      </div>
                      {trip.trailer && (
                        <div className="text-xs text-gray-500">
                          + {trip.trailer.Immatriculation}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <div className="font-medium text-gray-900">
                      {trip.departure?.location}
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <div className="font-medium text-gray-900">
                      {trip.arrival?.location}
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-green-700" />
                    <div className="text-xs">
                      <div className="font-medium text-gray-900">
                        {new Date(trip.departure.date).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-gray-500">
                        {new Date(trip.departure.date).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-red-700" />
                    <div className="text-xs">
                      {trip.arrival?.date ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {new Date(trip.arrival.date).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </div>
                          <div className="text-gray-500">
                            {new Date(trip.arrival.date).toLocaleTimeString(
                              "fr-FR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500">N/A</div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center">
                    {getStatusBadge(trip.status)}
                  </div>

                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => handleViewDetails(trip)}
                      className="p-1.5 text-blue-700 rounded hover:bg-gray-50 hover:text-blue-800 transition-colors"
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : filteredTrips.length === 0 && trips.length > 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Aucun résultat trouvé</p>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Aucun trajet trouvé</p>
              </div>
            )}
          </div>
        )}
      </div>

      <TripDetailsModal
        isOpen={isModalOpen}
        trip={selectedTrip}
        arrivalMileage={arrivalMileage}
        setArrivalMileage={setArrivalMileage}
        tripStatus={tripStatus}
        setTripStatus={setTripStatus}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  );
};

export default MesTrajetsPage;
