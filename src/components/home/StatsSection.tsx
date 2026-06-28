
import AnimatedCounter from "@/components/AnimatedCounter";
import { useDynamicStats } from "@/hooks/useDataHooks";
import { RefreshCw } from "lucide-react";

const StatsSection = () => {
  const { stats, loading, refresh } = useDynamicStats(30000); // Auto-refresh every 30s

  const displayStats = stats ? [
    { value: stats.resolved_complaints, label: "Complaints Resolved", suffix: "+" },
    { value: stats.satisfaction_rate, label: "Satisfaction Rate", suffix: "%" },
    { value: stats.avg_resolution_time, label: "Avg Response Time", suffix: "hrs" },
    { value: stats.cities_covered, label: "Cities Covered", suffix: "+" },
  ] : [
    { value: 50000, label: "Complaints Resolved", suffix: "+" },
    { value: 98, label: "Satisfaction Rate", suffix: "%" },
    { value: 24, label: "Avg Response Time", suffix: "hrs" },
    { value: 100, label: "Cities Covered", suffix: "+" },
  ];

  return (
    <section className="py-16 bg-muted dark:bg-gray-800/50 relative">
      {/* Live Update Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span>Live</span>
        <button 
          onClick={refresh} 
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Refresh stats"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="font-display text-4xl lg:text-5xl font-bold text-primary mb-2">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix}
                  duration={2000 + index * 200}
                />
              </p>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Additional Live Stats Row */}
        {stats && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-blue-600">{stats.total_citizens.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Registered Citizens</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-green-600">{stats.active_today.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Active Today</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-purple-600">{stats.new_this_month.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">New This Month</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-orange-600">{stats.departments_count}</p>
                <p className="text-xs text-muted-foreground">Active Departments</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StatsSection;
