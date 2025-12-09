import {
  Truck,
  Route,
  AlertCircle,
  TrendingUp,
  Users,
  Fuel,
  Wrench,
  Package,
} from "lucide-react";
import StatsCard from "../components/StatsCard";
import Header from "../components/Header";

const DashboardPage = () => {
  const statsData = [
    {
      icon: Truck,
      title: "Total Camions",
      value: "24",
      trend: 8,
      trendLabel: "vs mois dernier",
    },
    {
      icon: Route,
      title: "Trajets en cours",
      value: "12",
      trend: 15,
      trendLabel: "en cours d'exécution",
    },
    {
      icon: Users,
      title: "Chauffeurs actifs",
      value: "18",
      trend: 5,
      trendLabel: "disponibles aujourd'hui",
    },
    {
      icon: AlertCircle,
      title: "Maintenances prévues",
      value: "5",
      trend: -20,
      trendLabel: "cette semaine",
    },
    {
      icon: Fuel,
      title: "Consommation (L)",
      value: "1,250",
      trend: -12,
      trendLabel: "ce mois",
    },
    {
      icon: TrendingUp,
      title: "Km parcourus",
      value: "45,280",
      trend: 23,
      trendLabel: "ce mois",
    },
    {
      icon: Package,
      title: "Remorques",
      value: "16",
      trend: 0,
      trendLabel: "en service",
    },
    {
      icon: Wrench,
      title: "Interventions",
      value: "8",
      trend: -10,
      trendLabel: "ce mois",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Overview" description="Vue d'ensemble de votre flotte" />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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

        {/* Section activités récentes */}
        <div className="mt-6 bg-white border border-gray-200 rounded-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Activités récentes
          </h2>
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">Aucune activité récente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
