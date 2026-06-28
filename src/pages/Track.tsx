import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  FileText,
  ArrowRight,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useComplaintTracking } from "@/hooks/useDataHooks";

const Track = () => {
  const [trackingId, setTrackingId] = useState("");
  const { complaint, loading, error, track, clear } = useComplaintTracking();

  const handleSearch = () => {
    if (trackingId.trim()) {
      track(trackingId.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes("resolved")) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (lower.includes("progress")) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "destructive" as const;
      case "medium": return "default" as const;
      default: return "secondary" as const;
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-blue-700 text-white py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Track Your Complaint
            </h1>
            <p className="text-lg text-white/80">
              Enter your tracking ID to see real-time status updates and timeline of your complaint.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-10 max-w-4xl mx-auto">
        {/* Search Box */}
        <Card className="mb-8 -mt-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Enter Tracking ID (e.g., SUVIDHA-2026-001 or TRK123456)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={loading || !trackingId.trim()}
                className="h-12 px-8"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Track
                  </>
                )}
              </Button>
            </div>
            
            {/* Quick Examples */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Try:</span>
              {["SUVIDHA-2026-001"].map(id => (
                <Button
                  key={id}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto py-1"
                  onClick={() => {
                    setTrackingId(id);
                    track(id);
                  }}
                >
                  {id}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-400">Complaint Not Found</h3>
                <p className="text-red-600 dark:text-red-400/80">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Complaint Details */}
        {complaint && !loading && (
          <div className="space-y-6 animate-fade-in">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{complaint.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <FileText className="h-4 w-4" />
                      {complaint.id}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(complaint.priority)}>
                      {complaint.priority} Priority
                    </Badge>
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Resolution Progress</span>
                    <span className="font-semibold">{complaint.progress}%</span>
                  </div>
                  <Progress value={complaint.progress} className="h-3" />
                </div>

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium dark:text-white">{complaint.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <User className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned To</p>
                      <p className="font-medium dark:text-white">{complaint.assignedTo}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted On</p>
                      <p className="font-medium dark:text-white">{complaint.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Resolution</p>
                      <p className="font-medium dark:text-white">{complaint.estimatedResolution}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="dark:text-white">{complaint.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {complaint.timeline.map((step, index) => (
                    <div key={step.id} className="flex gap-4 pb-6 last:pb-0">
                      {/* Line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? "bg-green-100 dark:bg-green-900/30" 
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        {index < complaint.timeline.length - 1 && (
                          <div className={`w-0.5 flex-1 mt-2 ${
                            step.completed ? "bg-green-300" : "bg-gray-200 dark:bg-gray-700"
                          }`} />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold dark:text-white">{step.status}</span>
                          <span className="text-sm text-muted-foreground">{step.date}</span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaint.updates.map((update) => (
                    <div key={update.id} className="flex gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">{update.date}</p>
                        <p className="dark:text-white">{update.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1" onClick={clear}>
                Track Another Complaint
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" className="flex-1">
                Contact Support
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!complaint && !loading && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Enter your Tracking ID</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your tracking ID was provided when you submitted your complaint. 
                It starts with "SUVIDHA-" or "TRK".
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Track;
