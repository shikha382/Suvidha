import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Droplets,
  Zap,
  Car,
  Trash2,
  Construction,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Filter,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HotspotData {
  id: string;
  area: string;
  lat: number;
  lng: number;
  totalComplaints: number;
  resolved: number;
  pending: number;
  categories: {
    water: number;
    electricity: number;
    roads: number;
    waste: number;
    construction: number;
    other: number;
  };
  trend: "increasing" | "decreasing" | "stable";
  avgResolutionTime: number; // hours
}

const mockHotspots: HotspotData[] = [
  {
    id: "1",
    area: "Koramangala",
    lat: 12.9352,
    lng: 77.6245,
    totalComplaints: 234,
    resolved: 189,
    pending: 45,
    categories: { water: 45, electricity: 32, roads: 78, waste: 52, construction: 15, other: 12 },
    trend: "decreasing",
    avgResolutionTime: 48
  },
  {
    id: "2",
    area: "Indiranagar",
    lat: 12.9716,
    lng: 77.6412,
    totalComplaints: 189,
    resolved: 145,
    pending: 44,
    categories: { water: 28, electricity: 45, roads: 56, waste: 38, construction: 12, other: 10 },
    trend: "stable",
    avgResolutionTime: 52
  },
  {
    id: "3",
    area: "HSR Layout",
    lat: 12.9121,
    lng: 77.6446,
    totalComplaints: 312,
    resolved: 201,
    pending: 111,
    categories: { water: 89, electricity: 56, roads: 98, waste: 45, construction: 18, other: 6 },
    trend: "increasing",
    avgResolutionTime: 72
  },
  {
    id: "4",
    area: "Whitefield",
    lat: 12.9698,
    lng: 77.7500,
    totalComplaints: 267,
    resolved: 198,
    pending: 69,
    categories: { water: 67, electricity: 78, roads: 45, waste: 34, construction: 32, other: 11 },
    trend: "increasing",
    avgResolutionTime: 64
  },
  {
    id: "5",
    area: "Electronic City",
    lat: 12.8399,
    lng: 77.6770,
    totalComplaints: 198,
    resolved: 167,
    pending: 31,
    categories: { water: 34, electricity: 89, roads: 23, waste: 28, construction: 15, other: 9 },
    trend: "decreasing",
    avgResolutionTime: 36
  },
  {
    id: "6",
    area: "Jayanagar",
    lat: 12.9308,
    lng: 77.5838,
    totalComplaints: 156,
    resolved: 134,
    pending: 22,
    categories: { water: 45, electricity: 23, roads: 45, waste: 32, construction: 8, other: 3 },
    trend: "stable",
    avgResolutionTime: 42
  },
  {
    id: "7",
    area: "Marathahalli",
    lat: 12.9591,
    lng: 77.7011,
    totalComplaints: 289,
    resolved: 178,
    pending: 111,
    categories: { water: 56, electricity: 67, roads: 89, waste: 45, construction: 22, other: 10 },
    trend: "increasing",
    avgResolutionTime: 78
  },
  {
    id: "8",
    area: "Banashankari",
    lat: 12.9255,
    lng: 77.5468,
    totalComplaints: 145,
    resolved: 128,
    pending: 17,
    categories: { water: 38, electricity: 28, roads: 34, waste: 28, construction: 12, other: 5 },
    trend: "decreasing",
    avgResolutionTime: 38
  }
];

const categoryConfig = {
  water: { icon: Droplets, color: "bg-blue-500", label: "Water" },
  electricity: { icon: Zap, color: "bg-yellow-500", label: "Electricity" },
  roads: { icon: Car, color: "bg-gray-500", label: "Roads" },
  waste: { icon: Trash2, color: "bg-green-500", label: "Waste" },
  construction: { icon: Construction, color: "bg-orange-500", label: "Construction" },
  other: { icon: AlertTriangle, color: "bg-purple-500", label: "Other" }
};

const HeatmapVisualization = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedArea, setSelectedArea] = useState<HotspotData | null>(null);

  const maxComplaints = Math.max(...mockHotspots.map(h => h.totalComplaints));

  const getHeatColor = (count: number) => {
    const intensity = count / maxComplaints;
    if (intensity > 0.8) return "from-red-600 to-red-400";
    if (intensity > 0.6) return "from-orange-500 to-orange-400";
    if (intensity > 0.4) return "from-yellow-500 to-yellow-400";
    if (intensity > 0.2) return "from-green-500 to-green-400";
    return "from-green-400 to-green-300";
  };

  const sortedHotspots = useMemo(() => {
    return [...mockHotspots].sort((a, b) => b.totalComplaints - a.totalComplaints);
  }, []);

  const stats = useMemo(() => {
    const total = mockHotspots.reduce((sum, h) => sum + h.totalComplaints, 0);
    const resolved = mockHotspots.reduce((sum, h) => sum + h.resolved, 0);
    const pending = mockHotspots.reduce((sum, h) => sum + h.pending, 0);
    const avgTime = mockHotspots.reduce((sum, h) => sum + h.avgResolutionTime, 0) / mockHotspots.length;
    return { total, resolved, pending, avgTime: Math.round(avgTime) };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Issue Heatmap
          </h2>
          <p className="text-muted-foreground">Visualize complaint density across areas</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <config.icon className="h-4 w-4" />
                    {config.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Complaints</p>
            <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-2xl font-bold text-green-600">{stats.resolved.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Resolution</p>
            <p className="text-2xl font-bold">{stats.avgTime}h</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Heatmap Grid */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Area Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {sortedHotspots.map(hotspot => (
                <button
                  key={hotspot.id}
                  className={cn(
                    "relative p-4 rounded-xl bg-gradient-to-br transition-all hover:scale-105 hover:shadow-lg cursor-pointer text-white",
                    getHeatColor(hotspot.totalComplaints),
                    selectedArea?.id === hotspot.id && "ring-2 ring-offset-2 ring-primary"
                  )}
                  onClick={() => setSelectedArea(hotspot)}
                >
                  <div className="text-left">
                    <p className="font-semibold text-sm truncate">{hotspot.area}</p>
                    <p className="text-2xl font-bold">{hotspot.totalComplaints}</p>
                    <div className="flex items-center gap-1 text-xs mt-1 opacity-90">
                      {hotspot.trend === "increasing" && (
                        <>
                          <TrendingUp className="h-3 w-3" />
                          Rising
                        </>
                      )}
                      {hotspot.trend === "decreasing" && (
                        <>
                          <TrendingDown className="h-3 w-3" />
                          Falling
                        </>
                      )}
                      {hotspot.trend === "stable" && "Stable"}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-6 text-sm">
              <span className="text-muted-foreground">Issue Density:</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-green-400" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-yellow-500" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-orange-500" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span>Critical</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Area Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedArea ? selectedArea.area : "Select an Area"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedArea ? (
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={
                    selectedArea.trend === "decreasing" ? "default" :
                    selectedArea.trend === "increasing" ? "destructive" : "secondary"
                  }>
                    {selectedArea.trend === "increasing" && <TrendingUp className="h-3 w-3 mr-1" />}
                    {selectedArea.trend === "decreasing" && <TrendingDown className="h-3 w-3 mr-1" />}
                    {selectedArea.trend.charAt(0).toUpperCase() + selectedArea.trend.slice(1)}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{selectedArea.totalComplaints}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedArea.resolved}</p>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-600">{selectedArea.pending}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedArea.avgResolutionTime}h</p>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Category Breakdown</h4>
                  {Object.entries(selectedArea.categories)
                    .sort(([,a], [,b]) => b - a)
                    .map(([key, value]) => {
                      const config = categoryConfig[key as keyof typeof categoryConfig];
                      const percent = (value / selectedArea.totalComplaints) * 100;
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <div className={cn("h-8 w-8 rounded flex items-center justify-center", config.color)}>
                            <config.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span>{config.label}</span>
                              <span className="font-medium">{value}</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full", config.color)}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <Button className="w-full">View All Complaints</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <MapPin className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm text-center">
                  Click on an area tile to view detailed complaint breakdown
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Problem Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Areas Requiring Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {sortedHotspots
              .filter(h => h.trend === "increasing" || h.pending > 50)
              .slice(0, 3)
              .map(hotspot => (
                <Card key={hotspot.id} className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{hotspot.area}</h4>
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        High Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {hotspot.pending} pending complaints
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Avg resolution:</span>
                      <span className="font-medium">{hotspot.avgResolutionTime}h</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatmapVisualization;
