import {
  Truck,
  Route,
  AlertCircle,
  TrendingUp,
  Users,
  Fuel,
  Package,
  CircleDot,
} from "lucide-react";
import StatsCard from "../components/StatsCard";
import Header from "../components/Header";

const OverviewPage = () => {
  const statsData = [
    {
      icon: Truck,
      title: "Total Camions",
      value: "24",
      trendLabel: "actifs dans la flotte",
    },
    {
      icon: Package,
      title: "Total Remorques",
      value: "16",
      trendLabel: "en service",
    },
    {
      icon: Users,
      title: "Chauffeurs",
      value: "18",
      trendLabel: "disponibles",
    },
    {
      icon: Route,
      title: "Trajets en cours",
      value: "12",
      trendLabel: "en cours d'exécution",
    },
    {
      icon: TrendingUp,
      title: "Km parcourus",
      value: "45,280",
      trendLabel: "ce mois",
    },
    {
      icon: Fuel,
      title: "Consommation Gasoil",
      value: "1,250 L",
      trendLabel: "ce mois",
    },
    {
      icon: CircleDot,
      title: "Pneus à remplacer",
      value: "8",
      trendLabel: "urgent cette semaine",
    },
    {
      icon: AlertCircle,
      title: "Maintenances prévues",
      value: "5",
      trendLabel: "vidanges/révisions à venir",
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
      </div>
    </div>
  );
};

export default OverviewPage;
