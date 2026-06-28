import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Download,
  RefreshCw,
  Loader2,
  Activity,
  PieChart,
  Map,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  FileText,
  Zap,
} from "lucide-react";
import {
  getAnalyticsSummary,
  getComplaintTrends,
  getCategoryDistribution,
  getDepartmentPerformance,
  getPredictiveInsights,
  getRealTimeMetrics,
  getSLACompliance,
  exportAnalyticsReport,
  subscribeToAnalyticsUpdates,
  type AnalyticsSummary,
  type TrendData,
  type CategoryDistribution,
  type DepartmentPerformance,
  type PredictiveInsight,
} from "@/lib/analyticsService";
import { useToast } from "@/hooks/use-toast";

const AdminAnalytics = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  // Data states
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [categories, setCategories] = useState<CategoryDistribution[]>([]);
  const [departments, setDepartments] = useState<DepartmentPerformance[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [realTime, setRealTime] = useState<{
    complaintsToday: number;
    resolvedToday: number;
    activeOfficers: number;
    avgResponseTime: number;
    queueLength: number;
    peakHour: string;
  } | null>(null);
  const [sla, setSLA] = useState<{
    overall: number;
    byCategory: { category: string; compliance: number; target: number }[];
    breaches: { id: string; category: string; daysOverdue: number; assignedTo: string }[];
  } | null>(null);

  useEffect(() => {
    loadAllData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToAnalyticsUpdates((update) => {
      // Handle real-time updates
      console.log("Real-time update:", update);
    });

    return () => unsubscribe();
  }, [selectedPeriod]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        summaryData,
        trendsData,
        categoriesData,
        departmentsData,
        insightsData,
        realTimeData,
        slaData,
      ] = await Promise.all([
        getAnalyticsSummary(),
        getComplaintTrends("daily", parseInt(selectedPeriod)),
        getCategoryDistribution(),
        getDepartmentPerformance(),
        getPredictiveInsights(),
        getRealTimeMetrics(),
        getSLACompliance(),
      ]);

      setSummary(summaryData);
      setTrends(trendsData);
      setCategories(categoriesData);
      setDepartments(departmentsData);
      setInsights(insightsData);
      setRealTime(realTimeData);
      setSLA(slaData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated",
    });
  };

  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    setExporting(true);
    try {
      const result = await exportAnalyticsReport(format);
      toast({
        title: "Report Generated",
        description: `Downloading ${result.fileName}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not generate report",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("pdf")}
            disabled={exporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      {realTime && (
        <div className="grid gap-4 md:grid-cols-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Today's Complaints</p>
                  <p className="text-3xl font-bold">{realTime.complaintsToday}</p>
                </div>
                <FileText className="h-8 w-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Resolved Today</p>
                  <p className="text-3xl font-bold">{realTime.resolvedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Active Officers</p>
                  <p className="text-3xl font-bold">{realTime.activeOfficers}</p>
                </div>
                <Users className="h-8 w-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Avg Response</p>
                  <p className="text-3xl font-bold">{realTime.avgResponseTime.toFixed(1)}h</p>
                </div>
                <Clock className="h-8 w-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Queue Length</p>
                  <p className="text-3xl font-bold">{realTime.queueLength}</p>
                </div>
                <Activity className="h-8 w-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Peak Hour</p>
                  <p className="text-3xl font-bold">{realTime.peakHour}</p>
                </div>
                <Zap className="h-8 w-8 text-white/50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="departments" className="gap-2">
            <Building2 className="h-4 w-4" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="sla" className="gap-2">
            <Target className="h-4 w-4" />
            SLA Compliance
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Summary Cards */}
          {summary && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Complaints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{summary.totalComplaints.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>12% vs last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Resolution Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {((summary.resolvedComplaints / summary.totalComplaints) * 100).toFixed(1)}%
                  </p>
                  <Progress
                    value={(summary.resolvedComplaints / summary.totalComplaints) * 100}
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg Resolution Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{summary.avgResolutionTime} days</p>
                  <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
                    <TrendingDown className="h-4 w-4" />
                    <span>0.5 days faster</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Citizen Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{summary.citizenSatisfaction}/5.0</p>
                  <div className="flex items-center gap-1 mt-1">
                    {"⭐".repeat(Math.floor(summary.citizenSatisfaction))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Complaint Trends</CardTitle>
              <CardDescription>Daily complaints and resolutions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-1">
                {trends.slice(-30).map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-1" title={day.date}>
                    <div
                      className="bg-primary/80 rounded-t"
                      style={{ height: `${(day.complaints / 150) * 100}%` }}
                    />
                    <div
                      className="bg-green-500/80 rounded-t"
                      style={{ height: `${(day.resolved / 150) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-primary rounded" />
                  <span className="text-sm">Complaints</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded" />
                  <span className="text-sm">Resolved</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Complaints by category with trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.category} className="flex items-center gap-4">
                    <div className="w-40 truncate text-sm font-medium">{cat.category}</div>
                    <div className="flex-1">
                      <Progress value={cat.percentage} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2 w-24">
                      <span className="text-sm">{cat.count.toLocaleString()}</span>
                      {getTrendIcon(cat.trend)}
                    </div>
                    <Badge variant="outline" className="w-20 justify-center">
                      {cat.avgResolutionDays}d avg
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Rankings</CardTitle>
              <CardDescription>Performance metrics and rankings for all departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div
                    key={dept.departmentId}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold",
                          dept.rank === 1 && "bg-yellow-500",
                          dept.rank === 2 && "bg-gray-400",
                          dept.rank === 3 && "bg-amber-600",
                          dept.rank > 3 && "bg-muted text-muted-foreground"
                        )}>
                          #{dept.rank}
                        </div>
                        <div>
                          <p className="font-medium">{dept.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {dept.totalAssigned.toLocaleString()} total complaints
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{dept.satisfactionScore}</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 mt-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{dept.resolved}</p>
                        <p className="text-xs text-muted-foreground">Resolved</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-yellow-600">{dept.pending}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-600">{dept.overdue}</p>
                        <p className="text-xs text-muted-foreground">Overdue</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">{dept.avgResolutionTime}d</p>
                        <p className="text-xs text-muted-foreground">Avg Time</p>
                      </div>
                      <div className="text-center">
                        <Progress
                          value={(dept.resolved / dept.totalAssigned) * 100}
                          className="h-2 mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {((dept.resolved / dept.totalAssigned) * 100).toFixed(0)}% resolved
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SLA Tab */}
        <TabsContent value="sla" className="space-y-6 mt-6">
          {sla && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Overall SLA Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="relative h-32 w-32">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={sla.overall >= 90 ? "#22c55e" : sla.overall >= 80 ? "#f59e0b" : "#ef4444"}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={`${sla.overall * 2.51} 251`}
                            transform="rotate(-90 50 50)"
                          />
                          <text
                            x="50"
                            y="55"
                            textAnchor="middle"
                            className="fill-current text-2xl font-bold"
                          >
                            {sla.overall}%
                          </text>
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Target: 90%</p>
                        <Badge variant={sla.overall >= 90 ? "default" : "destructive"}>
                          {sla.overall >= 90 ? "On Track" : "Below Target"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>SLA by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sla.byCategory.map((cat) => (
                        <div key={cat.category} className="flex items-center gap-3">
                          <div className="w-28 text-sm truncate">{cat.category}</div>
                          <div className="flex-1">
                            <Progress
                              value={cat.compliance}
                              className={cn(
                                "h-2",
                                cat.compliance < cat.target && "[&>div]:bg-red-500"
                              )}
                            />
                          </div>
                          <div className="w-16 text-right text-sm">
                            {cat.compliance}%
                          </div>
                          {cat.compliance >= cat.target ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SLA Breaches */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    SLA Breaches
                  </CardTitle>
                  <CardDescription>Complaints that have exceeded SLA timelines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sla.breaches.map((breach) => (
                      <div
                        key={breach.id}
                        className="flex items-center justify-between p-3 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <Badge variant="destructive">{breach.daysOverdue}d overdue</Badge>
                          <div>
                            <p className="font-mono text-sm">{breach.id}</p>
                            <p className="text-xs text-muted-foreground">{breach.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{breach.assignedTo}</p>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            View Details →
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Predictive Insights
              </CardTitle>
              <CardDescription>
                AI-powered predictions and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-4 border rounded-lg",
                      insight.impact === "high" && "border-red-200 bg-red-50 dark:bg-red-900/20",
                      insight.impact === "medium" && "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20",
                      insight.impact === "low" && "border-blue-200 bg-blue-50 dark:bg-blue-900/20"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{insight.title}</h4>
                          <Badge variant={
                            insight.impact === "high" ? "destructive" :
                            insight.impact === "medium" ? "default" : "secondary"
                          }>
                            {insight.impact} impact
                          </Badge>
                          <Badge variant="outline">{insight.confidence}% confidence</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {insight.description}
                        </p>
                        <div className="mt-3 p-3 bg-white dark:bg-gray-900 rounded border">
                          <p className="text-sm font-medium">💡 Recommendation:</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {insight.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
