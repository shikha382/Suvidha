import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Brain, 
  Users, 
  BarChart3,
  Sparkles,
  Radio,
  TrendingUp,
  MessageCircle
} from "lucide-react";
import RealTimeInsights from "@/components/RealTimeInsights";
import PredictiveAnalytics from "@/components/PredictiveAnalytics";
import CommunityHub from "@/components/CommunityHub";

const SmartCity = () => {
  const [activeTab, setActiveTab] = useState("realtime");

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary via-blue-600 to-purple-700 text-white py-12 md:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge className="bg-white/20 text-white backdrop-blur-sm border-0 px-4 py-1.5">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge className="bg-red-500/80 text-white border-0">
                <Radio className="h-3 w-3 mr-1 animate-pulse" />
                Live
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 flex items-center justify-center gap-3">
              <Brain className="h-10 w-10" />
              Smart City Command Center
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Real-time monitoring, AI predictions, and community-driven governance.
              Experience the future of civic management.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 -mt-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-card shadow-lg rounded-lg border">
            <TabsTrigger 
              value="realtime" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Real-Time</span> Insights
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </TabsTrigger>
            <TabsTrigger 
              value="predictive" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Predictive</span> Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="community" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="h-4 w-4" />
              Community Hub
            </TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="mt-6">
            <RealTimeInsights />
          </TabsContent>

          <TabsContent value="predictive" className="mt-6">
            <PredictiveAnalytics />
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <CommunityHub />
          </TabsContent>
        </Tabs>

        {/* Innovation Banner */}
        <div className="mt-12 p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl text-white">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold mb-1">🤖</div>
              <p className="font-medium">AI-Powered Analysis</p>
              <p className="text-sm text-white/80">Smart categorization</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">📊</div>
              <p className="font-medium">Predictive Insights</p>
              <p className="text-sm text-white/80">Prevent before they happen</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">🌐</div>
              <p className="font-medium">Real-Time Monitoring</p>
              <p className="text-sm text-white/80">Live city dashboard</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">👥</div>
              <p className="font-medium">Community Driven</p>
              <p className="text-sm text-white/80">Collective problem solving</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SmartCity;
