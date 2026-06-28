import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trophy,
  Medal,
  Star,
  Users,
  Sparkles,
  Target,
  CalendarDays,
  Bell
} from "lucide-react";
import Achievements from "@/components/Achievements";
import Leaderboard from "@/components/Leaderboard";
import AppointmentBooking from "@/components/AppointmentBooking";
import NotificationPreferences from "@/components/NotificationPreferences";

const GamificationHub = () => {
  const [activeTab, setActiveTab] = useState("achievements");

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white py-12 md:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge className="bg-white/20 text-white backdrop-blur-sm border-0 px-4 py-1.5">
                <Trophy className="h-3 w-3 mr-1" />
                Citizen Rewards Program
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10" />
              Gamification Hub
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Earn achievements, climb the leaderboard, and get rewarded for being an active citizen.
              Your contributions make our city better!
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <Star className="h-8 w-8 text-yellow-300" />
                  <div className="text-left">
                    <p className="text-2xl font-bold">2,850</p>
                    <p className="text-sm text-white/70">Total Points</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <Medal className="h-8 w-8 text-yellow-300" />
                  <div className="text-left">
                    <p className="text-2xl font-bold">#47</p>
                    <p className="text-sm text-white/70">Global Rank</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <Target className="h-8 w-8 text-yellow-300" />
                  <div className="text-left">
                    <p className="text-2xl font-bold">3/12</p>
                    <p className="text-sm text-white/70">Badges Earned</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 -mt-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-card shadow-lg rounded-lg border">
            <TabsTrigger 
              value="achievements" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="appointments" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="mt-6">
            <Achievements />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <AppointmentBooking />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default GamificationHub;
