import Layout from "@/components/layout/Layout";
import AdminAnalytics from "@/components/AdminAnalytics";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Brain, Target, TrendingUp } from "lucide-react";

const AnalyticsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time insights, AI predictions & performance metrics
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium">Real-time Data</p>
              <p className="text-xs text-muted-foreground">Live metrics</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="font-medium">AI Insights</p>
              <p className="text-xs text-muted-foreground">Predictive analytics</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">SLA Tracking</p>
              <p className="text-xs text-muted-foreground">Compliance monitoring</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium">Trend Analysis</p>
              <p className="text-xs text-muted-foreground">Historical patterns</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Dashboard */}
        <AdminAnalytics />
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
