import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  Navigation, 
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Wifi,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMapLocations } from "@/hooks/useDataHooks";
import { type MapLocation } from "@/services/dataService";

const MapView = () => {
  const [selectedComplaint, setSelectedComplaint] = useState<MapLocation | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [zoomLevel, setZoomLevel] = useState(100);
  const { toast } = useToast();
  
  // Dynamic data hook with 30s auto-refresh
  const { locations, loading, error, refresh, filterByStatus } = useMapLocations(30000);
  
  // Get filtered complaints based on current filter
  const complaints = filterByStatus(filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress": return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive" as const;
      case "medium": return "default" as const;
      default: return "secondary" as const;
    }
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-500";
      case "in_progress": return "bg-blue-500";
      default: return "bg-yellow-500";
    }
  };

  const handleMarkerClick = (complaint: MapLocation) => {
    setSelectedComplaint(complaint);
    toast({
      title: "Complaint Selected",
      description: `Viewing details for ${complaint.id}`,
    });
  };

  const handleLocateMe = () => {
    toast({
      title: "Location Detected",
      description: "Showing complaints near your location",
    });
  };

  const statusCounts = {
    all: locations.length,
    pending: locations.filter(c => c.status === "pending").length,
    in_progress: locations.filter(c => c.status === "in_progress").length,
    resolved: locations.filter(c => c.status === "resolved").length,
  };

  if (error) {
    return (
      <Layout>
        <div className="container py-8">
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Failed to load map data</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">Complaint Map</h1>
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Wifi className="h-3 w-3 animate-pulse" />
                Live
              </div>
            </div>
            <p className="text-gray-600">Visualize and track issues across the city • Auto-refreshes every 30s</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={refresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleLocateMe}>
              <Navigation className="h-4 w-4 mr-2" />
              Locate Me
            </Button>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                <SelectItem value="in_progress">In Progress ({statusCounts.in_progress})</SelectItem>
                <SelectItem value="resolved">Resolved ({statusCounts.resolved})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {loading && complaints.length === 0 ? (
                  <div className="h-[500px] bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                      <p className="text-gray-600">Loading map data...</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="relative bg-gradient-to-br from-blue-100 to-green-100 h-[500px] overflow-hidden"
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
                  >
                  {/* Simulated Map Background */}
                  <div className="absolute inset-0 opacity-30">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3B82F6" strokeWidth="0.5"/>
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Road Lines */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 transform -translate-y-1/2" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gray-300 transform -translate-x-1/2" />
                    <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-200" />
                    <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-200" />
                  </div>

                  {/* Complaint Markers */}
                  {complaints.map((complaint, idx) => (
                    <button
                      key={complaint.id}
                      onClick={() => handleMarkerClick(complaint)}
                      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full ${
                        selectedComplaint?.id === complaint.id ? 'scale-125 z-20' : 'z-10'
                      }`}
                      style={{
                        top: `${20 + (idx * 15)}%`,
                        left: `${15 + (idx * 18)}%`,
                      }}
                      aria-label={`View complaint: ${complaint.title}`}
                    >
                      <div className="relative">
                        <div className={`w-10 h-10 ${getMarkerColor(complaint.status)} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        {complaint.priority === "high" && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                        )}
                        {selectedComplaint?.id === complaint.id && (
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
                            {complaint.id}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}

                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="shadow-lg"
                      onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="shadow-lg"
                      onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="shadow-lg">
                      <Layers className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg">
                    <p className="text-xs font-semibold mb-2">Legend</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span>Pending ({statusCounts.pending})</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span>In Progress ({statusCounts.in_progress})</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span>Resolved ({statusCounts.resolved})</span>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Selected Complaint Details */}
            {selectedComplaint && (
              <Card className="border-2 border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selectedComplaint.id}</CardTitle>
                    <Badge className={getStatusColor(selectedComplaint.status)}>
                      {selectedComplaint.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">{selectedComplaint.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{selectedComplaint.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{selectedComplaint.category}</span>
                    <Badge variant={getPriorityColor(selectedComplaint.priority)}>
                      {selectedComplaint.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {selectedComplaint.reportedAt}
                  </div>
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Details
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Complaints List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Nearby Complaints</CardTitle>
                  {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {loading && complaints.length === 0 ? (
                  // Loading skeletons
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border-2 border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  ))
                ) : complaints.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No complaints found for this filter</p>
                  </div>
                ) : (
                  complaints.map((complaint) => (
                    <button
                      key={complaint.id}
                      onClick={() => handleMarkerClick(complaint)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                        selectedComplaint?.id === complaint.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(complaint.status)}
                          <span className="font-medium text-sm">{complaint.title}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>{complaint.category}</span>
                          <span>•</span>
                          <span>{complaint.reportedAt}</span>
                        </div>
                      </div>
                      <Badge variant={getPriorityColor(complaint.priority)} className="text-xs">
                        {complaint.priority}
                      </Badge>
                    </div>
                  </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapView;