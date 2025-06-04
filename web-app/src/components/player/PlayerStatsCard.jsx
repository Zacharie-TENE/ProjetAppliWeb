
const PlayerStatsCard = ({ title, stats }) => {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">{title}</h3>
      <div className="space-y-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-600">{stat.label}</span>
            <span className="font-semibold text-indigo-700">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerStatsCard;