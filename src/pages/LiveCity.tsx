import Layout from "@/components/layout/Layout";
import SmartCityDashboard from "@/components/SmartCityDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, CloudSun, Car, Zap, Droplets, AlertTriangle } from "lucide-react";

const LiveCityPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Live City Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time city data, utilities, traffic & emergency services
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-6 mb-8">
          <Card>
            <CardContent className="pt-4 text-center">
              <CloudSun className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Weather</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Car className="h-6 w-6 text-red-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Traffic</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Water</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Power</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Activity className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Transport</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Emergency</p>
            </CardContent>
          </Card>
        </div>

        {/* Smart City Dashboard */}
        <SmartCityDashboard />
      </div>
    </Layout>
  );
};

export default LiveCityPage;
