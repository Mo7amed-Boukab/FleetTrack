import { useEffect, useState } from "react";
import {
  Truck,
  Package,
  Users,
  Route,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import StatsCard from "../../components/StatsCard";
import Header from "../../components/Header";
import vehicleService from "../../services/vehicleService";
import tripService from "../../services/tripService";
import userService from "../../services/userService";

const OverviewPage = () => {
  const [stats, setStats] = useState({
    totalTrucks: 0,
    totalTrailers: 0,
    totalDrivers: 0,
    ongoingTrips: 0,
  });
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [vehiclesRes, tripsRes, usersRes] = await Promise.all([
          vehicleService.getAllVehicles(),
          tripService.getAllTrips(),
          userService.getAllUsers(),
        ]);

        const vehicles = vehiclesRes.data || [];
        const trips = tripsRes.data || [];
        const users = usersRes.data || [];

        // Calculate statistics
        const trucks = vehicles.filter((v) => v.type === "camion");
        const trailers = vehicles.filter((v) => v.type === "remorque");
        const drivers = users.filter((u) => u.role === "chauffeur");
        const validTrips = trips.filter((t) => t && t.status);
        const ongoingTrips = validTrips.filter(
          (t) => t.status === "in_progress"
        );

        setStats({
          totalTrucks: trucks.length,
          totalTrailers: trailers.length,
          totalDrivers: drivers.length,
          ongoingTrips: ongoingTrips.length,
        });

        // Get 5 most recent trips
        const sortedTrips = validTrips
          .sort(
            (a, b) =>
              new Date(b.createdAt || b.departureDate) -
              new Date(a.createdAt || a.departureDate)
          )
          .slice(0, 5);
        setRecentTrips(sortedTrips);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsData = [
    {
      icon: Truck,
      title: "Total Camions",
      value: loading ? "..." : stats.totalTrucks.toString(),
      trendLabel: "actifs dans la flotte",
    },
    {
      icon: Package,
      title: "Total Remorques",
      value: loading ? "..." : stats.totalTrailers.toString(),
      trendLabel: "en service",
    },
    {
      icon: Users,
      title: "Chauffeurs",
      value: loading ? "..." : stats.totalDrivers.toString(),
      trendLabel: "disponibles",
    },
    {
      icon: Route,
      title: "Trajets en cours",
      value: loading ? "..." : stats.ongoingTrips.toString(),
      trendLabel: "en cours d'exécution",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      planned: {
        label: "Planifié",
        className: "bg-blue-50 text-blue-900",
      },
      in_progress: {
        label: "En cours",
        className: "bg-yellow-50 text-yellow-900",
      },
      completed: {
        label: "Terminé",
        className: "bg-green-50 text-green-900",
      },
      cancelled: {
        label: "Annulé",
        className: "bg-red-50 text-red-900",
      },
    };

    const config = statusConfig[status] || statusConfig.planned;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Overview" description="Vue d'ensemble de votre flotte" />
      <div className="flex-1 p-4 lg:p-6 bg-gray-50">
        {/* Statistiques - 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              trendLabel={stat.trendLabel}
            />
          ))}
        </div>

        {/* Trajets récents */}
        <div className="bg-white border border-gray-200 rounded overflow-x-auto">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Trajets récents
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Les 5 derniers trajets enregistrés
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-3"></div>
              <p>Chargement...</p>
            </div>
          ) : recentTrips.length > 0 ? (
            <>
              {/* Header du tableau */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700 min-w-[1200px]">
                <div className="col-span-2">Chauffeur</div>
                <div className="col-span-2">Véhicule</div>
                <div className="col-span-2">Départ</div>
                <div className="col-span-2">Date de départ</div>
                <div className="col-span-2">Date d'arrivée</div>
                <div className="col-span-2 text-center">Statut</div>
              </div>

              {/* Lignes */}
              {recentTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 transition-colors text-sm hover:bg-gray-50 min-w-[1200px]"
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {trip.driver?.fullname ||
                        trip.driver?.firstName + " " + trip.driver?.lastName ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-gray-600">
                    <div>
                      <div className="font-medium">
                        {trip.truck?.Immatriculation || "N/A"}
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
                    <div>
                      <div className="font-medium text-gray-900">
                        {trip.departure?.location ||
                          trip.departure?.city ||
                          "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        →{" "}
                        {trip.arrival?.location || trip.arrival?.city || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-green-700" />
                    <div className="text-xs">
                      {trip.departure?.date || trip.departureDate ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {new Date(
                              trip.departure?.date || trip.departureDate
                            ).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-gray-500">
                            {new Date(
                              trip.departure?.date || trip.departureDate
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
                  <div className="col-span-2 flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-red-700" />
                    <div className="text-xs">
                      {trip.arrival?.date || trip.arrivalDate ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {new Date(
                              trip.arrival?.date || trip.arrivalDate
                            ).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-gray-500">
                            {new Date(
                              trip.arrival?.date || trip.arrivalDate
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
                  <div className="col-span-2 flex items-center justify-center">
                    {getStatusBadge(trip.status)}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Route className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="font-medium">Aucun trajet récent</p>
              <p className="text-sm mt-1">Les trajets apparaîtront ici</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
