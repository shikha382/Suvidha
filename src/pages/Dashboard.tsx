import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Download,
  RefreshCw,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  Map,
  Brain
} from "lucide-react";
import { useDashboard } from "@/hooks/useDataHooks";
import HeatmapVisualization from "@/components/HeatmapVisualization";
import SentimentAnalysis from "@/components/SentimentAnalysis";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const { data, loading, refresh } = useDashboard(30000);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive" as const;
      case "medium": return "default" as const;
      default: return "secondary" as const;
    }
  };

  const stats = data ? [
    { id: "total", title: "Total Complaints", value: data.stats.total_complaints.toLocaleString(), change: `${data.stats.change_total > 0 ? '+' : ''}${data.stats.change_total}%`, changeType: data.stats.change_total >= 0 ? "positive" : "negative", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/30" },
    { id: "resolved", title: "Resolved", value: data.stats.resolved.toLocaleString(), change: `${data.stats.change_resolved > 0 ? '+' : ''}${data.stats.change_resolved}%`, changeType: "positive", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/30" },
    { id: "pending", title: "Pending", value: data.stats.pending.toLocaleString(), change: `${data.stats.change_pending}%`, changeType: data.stats.change_pending <= 0 ? "positive" : "negative", icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-900/30" },
    { id: "critical", title: "Critical Issues", value: data.stats.critical.toLocaleString(), change: `+${data.stats.change_critical}%`, changeType: "negative", icon: AlertTriangle, color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-900/30" },
  ] : [];

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-blue-700 text-white py-10 md:py-14">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
                Analytics Dashboard
                <span className="flex items-center gap-1 text-sm font-normal text-white bg-white/20 px-3 py-1 rounded-full">
                  <Wifi className="h-3 w-3 animate-pulse" />
                  Live
                </span>
              </h1>
              <p className="text-white/80 mt-1">Real-time insights into civic service performance</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px] bg-white/10 border-white/30 text-white">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary" size="icon" onClick={refresh} disabled={loading} className="bg-white/20 text-white hover:bg-white/30 border-0">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-8 -mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            stats.map((stat) => (
              <Card key={stat.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Complaints Trend
              </CardTitle>
              <CardDescription>Daily complaints vs resolved comparison</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.weeklyTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="complaints" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.2}
                        strokeWidth={2}
                        name="Total Complaints"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="resolved" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.2}
                        strokeWidth={2}
                        name="Resolved"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>By Category</CardTitle>
              <CardDescription>Distribution of complaints</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[250px] w-full rounded-full mx-auto" />
              ) : (
                <>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data?.categoryDistribution || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {(data?.categoryDistribution || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {(data?.categoryDistribution || []).map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="dark:text-gray-300">{item.name}</span>
                        </div>
                        <span className="font-semibold dark:text-white">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent & Department Performance */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>Latest issues reported by citizens</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {(data?.recentComplaints || []).map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">{complaint.title}</span>
                          <Badge variant={getPriorityColor(complaint.priority)} className="text-xs">
                            {complaint.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span>{complaint.id}</span>
                          <span>•</span>
                          <span>{complaint.category}</span>
                          <span>•</span>
                          <span>{complaint.time}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Resolution rates by department</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {(data?.departmentPerformance || []).map((dept) => (
                    <div key={dept.name} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium dark:text-white">{dept.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Avg: {dept.avgTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${dept.resolved}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-green-600">{dept.resolved}%</span>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{dept.resolved} resolved</span>
                        <span>{dept.pending} pending</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics Section */}
        <div className="mt-8">
          <Tabs defaultValue="heatmap" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="heatmap" className="gap-2">
                <Map className="h-4 w-4" />
                Complaint Heatmap
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="gap-2">
                <Brain className="h-4 w-4" />
                Citizen Sentiment
              </TabsTrigger>
            </TabsList>
            <TabsContent value="heatmap">
              <HeatmapVisualization />
            </TabsContent>
            <TabsContent value="sentiment">
              <SentimentAnalysis />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
