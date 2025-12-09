const StatsCard = ({ icon: Icon, title, value, trend, trendLabel }) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        {trendLabel && (
          <p className="text-xs text-gray-500 mt-1">{trendLabel}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
