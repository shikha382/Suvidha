import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  CloudSun,
  Thermometer,
  Wind,
  Droplets,
  Car,
  AlertTriangle,
  Zap,
  Bus,
  Ambulance,
  Flame,
  Shield,
  Hospital,
  MapPin,
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react";
import {
  getWeatherData,
  getTrafficData,
  getWaterSupplyData,
  getPowerSupplyData,
  getPublicTransportData,
  getEmergencyServicesData,
  subscribeToUpdates,
  type WeatherData,
  type TrafficData,
  type WaterSupplyData,
  type PowerSupplyData,
  type PublicTransportData,
  type EmergencyServicesData,
} from "@/lib/cityDataService";
import { useToast } from "@/hooks/use-toast";

const SmartCityDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Data states
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [water, setWater] = useState<WaterSupplyData | null>(null);
  const [power, setPower] = useState<PowerSupplyData | null>(null);
  const [transport, setTransport] = useState<PublicTransportData | null>(null);
  const [emergency, setEmergency] = useState<EmergencyServicesData | null>(null);

  useEffect(() => {
    loadAllData();
    setupRealTimeUpdates();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        weatherData,
        trafficData,
        waterData,
        powerData,
        transportData,
        emergencyData,
      ] = await Promise.all([
        getWeatherData(),
        getTrafficData(),
        getWaterSupplyData(),
        getPowerSupplyData(),
        getPublicTransportData(),
        getEmergencyServicesData(),
      ]);

      setWeather(weatherData);
      setTraffic(trafficData);
      setWater(waterData);
      setPower(powerData);
      setTransport(transportData);
      setEmergency(emergencyData);
      setLastUpdated(new Date());
      setConnected(true);
    } catch (error) {
      console.error("Error loading city data:", error);
      toast({
        title: "Error",
        description: "Failed to load city data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const unsubscribe = subscribeToUpdates((data) => {
      if (data.weather) setWeather(data.weather);
      if (data.traffic) setTraffic(data.traffic);
      if (data.water) setWater(data.water);
      if (data.power) setPower(data.power);
      if (data.transport) setTransport(data.transport);
      if (data.emergency) setEmergency(data.emergency);
      setLastUpdated(new Date());
    });

    return () => unsubscribe();
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-500";
    if (aqi <= 100) return "text-yellow-500";
    if (aqi <= 150) return "text-orange-500";
    if (aqi <= 200) return "text-red-500";
    return "text-purple-500";
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy (Sensitive)";
    if (aqi <= 200) return "Unhealthy";
    return "Hazardous";
  };

  const getCongestionColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-500";
      case "moderate": return "bg-yellow-500";
      case "high": return "bg-orange-500";
      case "severe": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading city data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {connected ? (
            <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
              <Wifi className="h-3 w-3" />
              Live Data
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-red-600 border-red-600">
              <WifiOff className="h-3 w-3" />
              Disconnected
            </Badge>
          )}
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={loadAllData} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Weather & AQI */}
      {weather && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {weather.city}
                  </p>
                  <p className="text-5xl font-bold mt-2">{weather.temperature}°C</p>
                  <p className="text-white/90 mt-1">{weather.condition}</p>
                </div>
                <div className="text-right space-y-2">
                  <CloudSun className="h-16 w-16 text-white/80 ml-auto" />
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Droplets className="h-4 w-4" />
                    {weather.humidity}%
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Wind className="h-4 w-4" />
                    {weather.windSpeed} km/h
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t border-white/20">
                {weather.forecast.map((day, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-white/70">{day.day}</p>
                    <p className="font-bold">{day.high}°</p>
                    <p className="text-xs text-white/70">{day.low}°</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Air Quality Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={cn("text-5xl font-bold", getAQIColor(weather.aqi))}>
                    {weather.aqi}
                  </p>
                  <p className={cn("text-sm font-medium", getAQIColor(weather.aqi))}>
                    {getAQILabel(weather.aqi)}
                  </p>
                </div>
                <div className="h-24 w-24">
                  <svg viewBox="0 0 100 60" className="w-full h-full">
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="url(#aqiGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(weather.aqi / 500) * 125.6} 125.6`}
                    />
                    <defs>
                      <linearGradient id="aqiGradient">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">PM2.5</p>
                  <p className="font-bold">{weather.pollutants.pm25}</p>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">PM10</p>
                  <p className="font-bold">{weather.pollutants.pm10}</p>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">O₃</p>
                  <p className="font-bold">{weather.pollutants.o3}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Traffic */}
      {traffic && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Traffic Status
            </CardTitle>
            <CardDescription>
              Real-time traffic congestion levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className={cn(
                "h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold",
                getCongestionColor(traffic.overallCongestion)
              )}>
                {traffic.congestionIndex}%
              </div>
              <div>
                <p className="font-medium capitalize">{traffic.overallCongestion} Congestion</p>
                <p className="text-sm text-muted-foreground">
                  {traffic.activeIncidents} active incidents
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Congestion Hotspots</p>
              {traffic.hotspots.map((spot, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn(
                    "h-3 w-3 rounded-full",
                    getCongestionColor(spot.severity)
                  )} />
                  <div className="flex-1">
                    <p className="text-sm">{spot.location}</p>
                    <Progress value={spot.delay} className="h-2 mt-1" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    +{spot.delay} min
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Utilities */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Water Supply */}
        {water && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                Water Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <Badge variant={water.status === "normal" ? "default" : "destructive"}>
                    {water.status}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Reservoir Level</span>
                    <span className="text-sm font-medium">{water.reservoirLevel}%</span>
                  </div>
                  <Progress value={water.reservoirLevel} className="h-2" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Water Quality</span>
                  <Badge variant="outline" className="text-green-600">
                    {water.quality} ({water.phLevel} pH)
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next Scheduled Maintenance</span>
                  <span className="text-sm">{water.nextMaintenance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Power Supply */}
        {power && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Power Grid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Grid Status</span>
                  <Badge variant={power.gridStatus === "stable" ? "default" : "destructive"}>
                    {power.gridStatus}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Current Load</span>
                    <span className="text-sm font-medium">{power.currentLoad}%</span>
                  </div>
                  <Progress 
                    value={power.currentLoad} 
                    className={cn(
                      "h-2",
                      power.currentLoad > 80 && "[&>div]:bg-red-500"
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Peak Hours</span>
                  <span className="text-sm">{power.peakHours}</span>
                </div>
                {power.scheduledOutages.length > 0 && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      Scheduled Outages
                    </p>
                    {power.scheduledOutages.map((outage, i) => (
                      <p key={i} className="text-xs text-muted-foreground mt-1">
                        {outage.area}: {outage.time} ({outage.duration})
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Public Transport */}
      {transport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5" />
              Public Transport
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bus">
              <TabsList>
                <TabsTrigger value="bus">Buses</TabsTrigger>
                <TabsTrigger value="metro">Metro</TabsTrigger>
              </TabsList>
              <TabsContent value="bus" className="mt-4">
                <div className="space-y-3">
                  {transport.buses.map((bus, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          {bus.route}
                        </Badge>
                        <span className="text-sm">{bus.destination}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{bus.eta} min</p>
                        <Badge
                          variant={bus.occupancy === "low" ? "default" : bus.occupancy === "medium" ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {bus.occupancy} crowd
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="metro" className="mt-4">
                <div className="space-y-3">
                  {transport.metro.map((line, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-6 w-6 rounded-full" 
                          style={{ backgroundColor: line.color }}
                        />
                        <span className="font-medium">{line.line}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={line.status === "operational" ? "default" : "destructive"}>
                          {line.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {line.frequency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Emergency Services */}
      {emergency && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Emergency Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 border rounded-lg text-center">
                <Ambulance className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Ambulances</p>
                <p className="text-2xl font-bold">
                  {emergency.ambulances.available}/{emergency.ambulances.total}
                </p>
                <p className="text-xs text-muted-foreground">
                  Avg. Response: {emergency.ambulances.avgResponseTime}
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Fire Engines</p>
                <p className="text-2xl font-bold">
                  {emergency.fireEngines.available}/{emergency.fireEngines.total}
                </p>
                <p className="text-xs text-muted-foreground">
                  Avg. Response: {emergency.fireEngines.avgResponseTime}
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Police Patrols</p>
                <p className="text-2xl font-bold">
                  {emergency.policePatrols.active}
                </p>
                <p className="text-xs text-muted-foreground">
                  {emergency.policePatrols.coverage}% city coverage
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Hospital className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Hospital Beds</p>
                <p className="text-2xl font-bold">
                  {emergency.hospitals.availableBeds}
                </p>
                <p className="text-xs text-muted-foreground">
                  ICU: {emergency.hospitals.icuBeds} available
                </p>
              </div>
            </div>

            {emergency.activeAlerts.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Active Alerts
                </p>
                <div className="space-y-2 mt-2">
                  {emergency.activeAlerts.map((alert, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-medium">{alert.type}:</span>{" "}
                      {alert.message} - <span className="text-muted-foreground">{alert.area}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartCityDashboard;
