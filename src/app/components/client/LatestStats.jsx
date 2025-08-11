"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Weight,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  Badge,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
const LatestStats = () => {
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/client/trends");
      const data = await response.json();
      if (data.status) {
        setTrendData(data.trendData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTrendData();
    }
  }, [user]);
console.log("trendData", trendData);
  // Helper function to format weight trend
  const getWeightTrendInfo = () => {
    if (!trendData) return { trend: "neutral", text: "No data", change: 0 };
    
    // Check if we have enough data for trend calculation
    if (trendData.previousWeek.weight === 0) {
      return { 
        trend: "neutral", 
        text: "New to tracking - establish baseline", 
        change: 0,
        color: "blue",
        isNewClient: true
      };
    }
    
    const change = trendData.weightTrend;
    if (change > 0) {
      return { 
        trend: "up", 
        text: `+${change.toFixed(1)} lbs this week`, 
        change: Math.abs(change),
        color: "red" // Weight gain is typically red
      };
    } else if (change < 0) {
      return { 
        trend: "down", 
        text: `${change.toFixed(1)} lbs this week`, 
        change: Math.abs(change),
        color: "green" // Weight loss is typically green
      };
    } else {
      return { trend: "neutral", text: "No change", change: 0, color: "gray" };
    }
  };

  // Helper function to format sleep trend
  const getSleepTrendInfo = () => {
    if (!trendData) return { trend: "neutral", text: "No data", change: 0 };
    
    // Check if we have enough data for trend calculation
    if (trendData.previousWeek.sleepHours === 0) {
      return { 
        trend: "neutral", 
        text: "New to tracking - establish baseline", 
        change: 0,
        color: "blue",
        isNewClient: true
      };
    }
    
    const change = trendData.sleepTrend;
    if (change > 0) {
      return { 
        trend: "up", 
        text: `+${change.toFixed(1)}h from last week`, 
        change: Math.abs(change),
        color: "green" // More sleep is good
      };
    } else if (change < 0) {
      return { 
        trend: "down", 
        text: `${change.toFixed(1)}h from last week`, 
        change: Math.abs(change),
        color: "red" // Less sleep is concerning
      };
    } else {
      return { trend: "neutral", text: "Same as last week", change: 0, color: "gray" };
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Data Context Information */}
      {trendData && trendData.dataContext && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100">
              Data Status
            </Badge>
          </div>
                           <div className="text-sm text-blue-700 dark:text-blue-300">
                   {trendData.dataContext.totalCheckIns === 0 ? (
                     "Welcome! Start tracking your daily check-ins to see your progress trends."
                   ) : trendData.dataContext.previousWeekCount === 0 ? (
                     `You have ${trendData.dataContext.currentWeekCount} check-in${trendData.dataContext.currentWeekCount === 1 ? '' : 's'} this week. Continue tracking daily to establish baseline trends.`
                   ) : (
                     `Tracking ${trendData.dataContext.currentWeekCount} day${trendData.dataContext.currentWeekCount === 1 ? '' : 's'} this week vs ${trendData.dataContext.previousWeekCount} day${trendData.dataContext.previousWeekCount === 1 ? '' : 's'} last week.`
                   )}
                 </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendData ? (
          <>
            {/* Weight Card */}
            <Card className="premium-card group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-display font-semibold text-gray-900 dark:text-white">Current Weight</CardTitle>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                  <Weight className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  {trendData.current.weight || 0} lbs
                </div>
                <div className="flex items-center gap-2">
                  {getWeightTrendInfo().trend !== "neutral" ? (
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                      getWeightTrendInfo().color === "green" 
                        ? "bg-green-100 dark:bg-green-900/30" 
                        : getWeightTrendInfo().color === "red"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-blue-100 dark:bg-blue-900/30"
                    }`}>
                      {getWeightTrendInfo().trend === "down" ? (
                        <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : getWeightTrendInfo().trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <Badge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                      <span className={`text-sm font-semibold ${
                        getWeightTrendInfo().color === "green" 
                          ? "text-green-700 dark:text-green-300" 
                          : getWeightTrendInfo().color === "red"
                          ? "text-red-700 dark:text-red-300"
                          : "text-blue-700 dark:text-blue-300"
                      }`}>
                        {getWeightTrendInfo().text}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900/30">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {getWeightTrendInfo().text}
                      </span>
                    </div>
                  )}
                </div>
                <div className="relative group">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{
                      width: trendData.goalWeight > 0 
                        ? `${Math.min(100, Math.max(0, ((trendData.initialWeight - trendData.current.weight) / (trendData.initialWeight - trendData.goalWeight)) * 100))}%`
                        : '67%'
                    }}></div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {trendData.goalWeight > 0 
                      ? `${Math.min(100, Math.max(0, ((trendData.initialWeight - trendData.current.weight) / (trendData.initialWeight - trendData.goalWeight)) * 100)).toFixed(1)}%`
                      : '67%'
                    } complete
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sleep Card */}
            <Card className="premium-card group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-display font-semibold text-gray-900 dark:text-white">Sleep Quality</CardTitle>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  {trendData.current.sleepHours || 0}h
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100">
                    {trendData.current.sleepHours >= 7 ? "Good" : trendData.current.sleepHours >= 6 ? "Fair" : "Poor"}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    {getSleepTrendInfo().trend !== "neutral" ? (
                      <>
                        {getSleepTrendInfo().trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : getSleepTrendInfo().trend === "down" ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : (
                          <Badge className="h-4 w-4 text-blue-500" />
                        )}
                        <span className={`font-medium ${
                          getSleepTrendInfo().trend === "up" 
                            ? "text-green-600 dark:text-green-400" 
                            : getSleepTrendInfo().trend === "down"
                            ? "text-red-600 dark:text-red-400"
                            : "text-blue-600 dark:text-blue-400"
                        }`}>
                          {getSleepTrendInfo().text}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {getSleepTrendInfo().text}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative group">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full" style={{
                      width: `${Math.min(100, Math.max(0, (trendData.current.sleepHours / 8) * 100))}%`
                    }}></div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {Math.min(100, Math.max(0, (trendData.current.sleepHours / 8) * 100)).toFixed(1)}% of 8h goal
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Card */}
            <Card className="premium-card group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-display font-semibold text-gray-900 dark:text-white">Weekly Compliance</CardTitle>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  {trendData.compliance?.current || 0}%
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    {trendData.compliance?.trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : trendData.compliance?.trend < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    ) : (
                      <Badge className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    )}
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {trendData.compliance?.trend > 0 
                        ? `+${trendData.compliance.trend}% from last week`
                        : trendData.compliance?.trend < 0
                        ? `${trendData.compliance.trend}% from last week`
                        : 'Same as last week'
                      }
                    </span>
                  </div>
                </div>
                <div className="relative group">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{
                      width: `${trendData.compliance?.current || 0}%`
                    }}></div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {trendData.compliance?.current || 0}% complete
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-xs sm:text-sm text-gray-500 py-2">
            No check-ins recorded yet. Start tracking your progress!
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestStats;
