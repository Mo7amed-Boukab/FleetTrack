import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  PlayCircle,
  MapPin,
  Truck,
} from "lucide-react";
import Header from "../../components/Header";
import StatsCard from "../../components/StatsCard";
import tripService from "../../services/tripService";

const OverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    inProgressTrips: 0,
    completedTrips: 0,
    plannedTrips: 0,
  });

  useEffect(() => {
    fetchDriverStats();
  }, []);

  const fetchDriverStats = async () => {
    try {
      setLoading(true);
      // TODO: Remplacer par l'endpoint qui filtre les trajets du chauffeur connecté
      const response = await tripService.getAllTrips();
      const allTrips = response.data || [];

      // Pour l'instant on prend tous les trajets, mais en production
      // il faudra filtrer par l'ID du chauffeur connecté
      setTrips(allTrips);

      // Calculer les statistiques
      const stats = {
        totalTrips: allTrips.length,
        inProgressTrips: allTrips.filter((t) => t.status === "in_progress")
          .length,
        completedTrips: allTrips.filter((t) => t.status === "completed").length,
        plannedTrips: allTrips.filter((t) => t.status === "planned").length,
      };

      setStats(stats);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prendre les 5 derniers trajets
  const recentTrips = trips
    .sort((a, b) => new Date(b.departure.date) - new Date(a.departure.date))
    .slice(0, 5);

  const getStatusBadge = (status) => {
    const statusConfig = {
      planned: {
        bg: "bg-blue-50",
        text: "text-blue-900",
        label: "Planifié",
      },
      in_progress: {
        bg: "bg-yellow-50",
        text: "text-yellow-900",
        label: "En cours",
      },
      completed: {
        bg: "bg-green-50",
        text: "text-green-900",
        label: "Terminé",
      },
      cancelled: {
        bg: "bg-red-50",
        text: "text-red-900",
        label: "Annulé",
      },
    };

    const config = statusConfig[status] || statusConfig.planned;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Mon Dashboard"
        description="Vue d'ensemble de vos trajets et activités"
      />

      <div className="flex-1 p-4 lg:p-6 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
          </div>
        ) : (
          <>
            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                icon={Clock}
                title="Planifiés"
                value={stats.plannedTrips.toString()}
                trendLabel="trajets à venir"
              />
              <StatsCard
                icon={PlayCircle}
                title="En cours"
                value={stats.inProgressTrips.toString()}
                trendLabel="en cours d'exécution"
              />
              <StatsCard
                icon={CheckCircle}
                title="Terminés"
                value={stats.completedTrips.toString()}
                trendLabel="trajets complétés"
              />
              <StatsCard
                icon={MapPin}
                title="Total trajets"
                value={stats.totalTrips.toString()}
                trendLabel="au total"
              />
            </div>

            {/* Trajets récents */}
            <div className="bg-white border border-gray-200 rounded">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Trajets récents</h2>
                <p className="text-sm text-gray-500">
                  Vos 5 derniers trajets assignés
                </p>
              </div>

              {recentTrips.length > 0 ? (
                <div className="overflow-x-auto lg:overflow-visible">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700 min-w-[900px] lg:min-w-0">
                    <div className="col-span-3">Véhicule</div>
                    <div className="col-span-3">Départ → Arrivée</div>
                    <div className="col-span-2">Date de départ</div>
                    <div className="col-span-2">Date d'arrivée</div>
                    <div className="col-span-2">Statut</div>
                  </div>

                  {recentTrips.map((trip) => (
                    <div
                      key={trip._id}
                      className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-sm min-w-[900px] lg:min-w-0"
                    >
                      <div className="col-span-3 flex items-center gap-2">
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

                      <div className="col-span-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {trip.departure?.location}
                          </div>
                          <div className="text-xs text-gray-500">
                            → {trip.arrival?.location}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center gap-2">
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

                      <div className="col-span-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-700" />
                        <div className="text-xs">
                          {trip.arrival?.date ? (
                            <>
                              <div className="font-medium text-gray-900">
                                {new Date(
                                  trip.arrival.date
                                ).toLocaleDateString("fr-FR", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="text-gray-500">
                                {new Date(
                                  trip.arrival.date
                                ).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </>
                          ) : (
                            <div className="text-gray-500">N/A</div>
                          )}
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center">
                        {getStatusBadge(trip.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Aucun trajet récent</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;
