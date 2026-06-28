import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  Users,
  MapPin,
  TrendingUp,

  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Radio,
  Wifi,
  BarChart3,

  ArrowUp,
  ArrowDown,
  Sparkles,
  Eye
} from "lucide-react";

interface LiveEvent {
  id: string;
  type: "complaint_filed" | "complaint_resolved" | "dept_response" | "citizen_update" | "priority_escalation";
  title: string;
  location: string;
  timestamp: Date;
  category: string;
  priority?: "low" | "medium" | "high" | "critical";
}

interface CityStats {
  activeComplaints: number;
  resolvedToday: number;
  avgResponseTime: number;
  citizensOnline: number;
  criticalIssues: number;
  departmentsActive: number;
  trend: "up" | "down" | "stable";
  satisfactionScore: number;
}

const RealTimeInsights = () => {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [stats, setStats] = useState<CityStats>({
    activeComplaints: 247,
    resolvedToday: 89,
    avgResponseTime: 4.2,
    citizensOnline: 1423,
    criticalIssues: 3,
    departmentsActive: 12,
    trend: "up",
    satisfactionScore: 87
  });
  const [isLive, setIsLive] = useState(true);
  const [heatmapData, setHeatmapData] = useState<{ area: string; intensity: number }[]>([
    { area: "Central", intensity: 85 },
    { area: "North", intensity: 45 },
    { area: "South", intensity: 62 },
    { area: "East", intensity: 38 },
    { area: "West", intensity: 71 },
  ]);

  const eventTypes = [
    { type: "complaint_filed", locations: ["MG Road", "Gandhi Nagar", "Civil Lines", "Sector 22", "Model Town"], categories: ["Water", "Roads", "Electricity", "Sanitation"] },
    { type: "complaint_resolved", locations: ["Station Area", "Market Road", "University Campus", "Industrial Area"], categories: ["Water", "Roads", "Electricity"] },
    { type: "dept_response", locations: ["City Center", "Old City", "Tech Park", "Hospital Road"], categories: ["Health", "Property", "Transport"] },
    { type: "priority_escalation", locations: ["Main Highway", "School Zone", "Residential Complex"], categories: ["Roads", "Electricity", "Water"] },
  ];

  const generateEvent = useCallback((): LiveEvent => {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const type = eventType.type as LiveEvent["type"];
    
    const titles: Record<string, string[]> = {
      complaint_filed: [
        "New water complaint registered",
        "Road damage reported",
        "Street light issue submitted",
        "Garbage collection complaint",
        "Power outage reported"
      ],
      complaint_resolved: [
        "Pothole repair completed",
        "Water supply restored",
        "Street light fixed",
        "Drainage issue resolved",
        "Electricity meter replaced"
      ],
      dept_response: [
        "PWD team dispatched",
        "Water Dept acknowledged",
        "Field inspection scheduled",
        "Repair work initiated",
        "Materials ordered"
      ],
      priority_escalation: [
        "Issue escalated to supervisor",
        "Marked as high priority",
        "Emergency response activated",
        "Multiple complaints merged"
      ],
      citizen_update: [
        "Citizen added photos",
        "Status inquiry received",
        "Feedback submitted",
        "Rating provided"
      ]
    };

    return {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      type,
      title: titles[type][Math.floor(Math.random() * titles[type].length)],
      location: eventType.locations[Math.floor(Math.random() * eventType.locations.length)],
      timestamp: new Date(),
      category: eventType.categories[Math.floor(Math.random() * eventType.categories.length)],
      priority: type === "priority_escalation" ? "high" : undefined
    };
  }, []);

  // Simulate real-time events
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newEvent = generateEvent();
      setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
      
      // Update stats randomly
      setStats(prev => ({
        ...prev,
        activeComplaints: prev.activeComplaints + (Math.random() > 0.5 ? 1 : -1),
        resolvedToday: Math.random() > 0.7 ? prev.resolvedToday + 1 : prev.resolvedToday,
        citizensOnline: prev.citizensOnline + Math.floor(Math.random() * 10) - 5,
        avgResponseTime: +(prev.avgResponseTime + (Math.random() - 0.5) * 0.1).toFixed(1),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, generateEvent]);

  // Initialize with some events
  useEffect(() => {
    const initialEvents = Array(5).fill(null).map(() => generateEvent());
    setEvents(initialEvents);
  }, []);

  const getEventIcon = (type: LiveEvent["type"]) => {
    switch (type) {
      case "complaint_filed": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "complaint_resolved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "dept_response": return <Zap className="h-4 w-4 text-blue-500" />;
      case "priority_escalation": return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "citizen_update": return <Users className="h-4 w-4 text-purple-500" />;
    }
  };

  const getEventColor = (type: LiveEvent["type"]) => {
    switch (type) {
      case "complaint_filed": return "border-l-orange-500 bg-orange-50/50";
      case "complaint_resolved": return "border-l-green-500 bg-green-50/50";
      case "dept_response": return "border-l-blue-500 bg-blue-50/50";
      case "priority_escalation": return "border-l-red-500 bg-red-50/50";
      case "citizen_update": return "border-l-purple-500 bg-purple-50/50";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Live Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isLive ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
            <Radio className={`h-4 w-4 ${isLive ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium">{isLive ? 'LIVE' : 'PAUSED'}</span>
          </div>
          <span className="text-sm text-gray-500">
            Real-time city monitoring dashboard
          </span>
        </div>
        <Button 
          variant={isLive ? "outline" : "default"} 
          size="sm"
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? 'Pause Feed' : 'Resume Live'}
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Activity className="h-8 w-8 text-blue-600" />
              {stats.trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">{stats.activeComplaints}</p>
            <p className="text-xs text-blue-600">Active Complaints</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <Badge className="bg-green-600">{stats.resolvedToday}</Badge>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-2">{stats.resolvedToday}</p>
            <p className="text-xs text-green-600">Resolved Today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="h-8 w-8 text-orange-600" />
              <span className="text-xs text-orange-600">hours</span>
            </div>
            <p className="text-2xl font-bold text-orange-900 mt-2">{stats.avgResponseTime}</p>
            <p className="text-xs text-orange-600">Avg Response Time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-purple-600" />
              <Wifi className="h-4 w-4 text-green-500 animate-pulse" />
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-2">{stats.citizensOnline.toLocaleString()}</p>
            <p className="text-xs text-purple-600">Citizens Online</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Live Event Feed */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Live Activity Feed
              {isLive && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className={`p-3 border-l-4 rounded-r-lg transition-all ${getEventColor(event.type)} ${
                      index === 0 ? 'animate-slide-in-right' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getEventIcon(event.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{event.location}</span>
                          <Badge variant="outline" className="text-[10px] h-4">{event.category}</Badge>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {formatTime(event.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* City Heatmap */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              Area Activity Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {heatmapData.map((area) => (
                <div key={area.area} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{area.area} Zone</span>
                    <span className="text-sm text-gray-500">{area.intensity} active</span>
                  </div>
                  <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                        area.intensity > 70 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                        area.intensity > 50 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                        'bg-gradient-to-r from-green-400 to-green-600'
                      }`}
                      style={{ width: `${area.intensity}%` }}
                    />
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="text-xs font-medium text-white drop-shadow">
                        {area.intensity > 70 ? '🔥 High Activity' : area.intensity > 50 ? '⚡ Moderate' : '✅ Normal'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Critical Issues Alert */}
            {stats.criticalIssues > 0 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-900">{stats.criticalIssues} Critical Issues</p>
                    <p className="text-sm text-red-600">Require immediate attention</p>
                  </div>
                  <Button size="sm" variant="destructive" className="ml-auto">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            )}

            {/* Satisfaction Score */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  City Satisfaction Score
                </span>
                <span className="text-lg font-bold text-green-600">{stats.satisfactionScore}%</span>
              </div>
              <Progress value={stats.satisfactionScore} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeInsights;
