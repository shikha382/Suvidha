import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Star,
  Medal,
  Gift,
  Zap,
  Users,
  Target,
  Crown,
  Award,
  Sparkles,
  ChevronRight,
  Lock
} from "lucide-react";
import { useLeaderboard } from "@/hooks/useDataHooks";

const Rewards = () => {
  const { leaderboard: dynamicLeaderboard } = useLeaderboard(undefined, 30000);
  
  const userPoints = 2450;
  const userLevel = 5;

  const levels = [
    { level: 1, name: "Newcomer", minPoints: 0, icon: "🌱" },
    { level: 2, name: "Active Citizen", minPoints: 500, icon: "🌿" },
    { level: 3, name: "Community Helper", minPoints: 1000, icon: "🌳" },
    { level: 4, name: "Problem Solver", minPoints: 1500, icon: "⭐" },
    { level: 5, name: "Champion", minPoints: 2000, icon: "🏆" },
    { level: 6, name: "Guardian", minPoints: 3000, icon: "🛡️" },
    { level: 7, name: "Legend", minPoints: 5000, icon: "👑" },
  ];

  const badges = [
    { id: "early-adopter", name: "Early Adopter", description: "Joined during launch phase", icon: Sparkles, color: "bg-purple-500", earned: true },
    { id: "first-report", name: "First Report", description: "Submitted first complaint", icon: Target, color: "bg-blue-500", earned: true },
    { id: "helper", name: "Community Helper", description: "Helped 5 other citizens", icon: Users, color: "bg-green-500", earned: true },
    { id: "streak-7", name: "Week Warrior", description: "7-day login streak", icon: Zap, color: "bg-orange-500", earned: true },
    { id: "streak-30", name: "Month Master", description: "30-day login streak", icon: Crown, color: "bg-yellow-500", earned: false },
    { id: "resolver", name: "Problem Resolver", description: "10 complaints resolved", icon: Trophy, color: "bg-red-500", earned: false },
    { id: "influencer", name: "Influencer", description: "Referred 10 users", icon: Star, color: "bg-pink-500", earned: false },
    { id: "advocate", name: "Civic Advocate", description: "50 complaints resolved", icon: Medal, color: "bg-indigo-500", earned: false },
  ];

  const rewards = [
    { id: "r1", name: "₹50 Mobile Recharge", points: 1000, image: "📱", available: true },
    { id: "r2", name: "₹100 Amazon Voucher", points: 2000, image: "🛒", available: true },
    { id: "r3", name: "₹200 Swiggy Voucher", points: 3500, image: "🍔", available: true },
    { id: "r4", name: "Movie Ticket", points: 1500, image: "🎬", available: true },
    { id: "r5", name: "₹500 Flipkart Voucher", points: 5000, image: "🎁", available: false },
    { id: "r6", name: "Meet the Mayor", points: 10000, image: "🏛️", available: false },
  ];

  // Use dynamic leaderboard or fallback
  const leaderboard = dynamicLeaderboard.length > 0 ? dynamicLeaderboard.map((u, i) => ({
    rank: i + 1,
    name: u.name,
    points: u.points,
    city: u.city,
    avatar: u.avatar,
    isUser: u.is_current_user,
    badges_count: u.badges_count
  })) : [
    { rank: 1, name: "Amit Kumar", points: 15420, city: "Delhi", avatar: "AK" },
    { rank: 2, name: "Priya Sharma", points: 12850, city: "Jaipur", avatar: "PS" },
    { rank: 3, name: "Rahul Singh", points: 11200, city: "Mumbai", avatar: "RS" },
    { rank: 4, name: "Sneha Patel", points: 9800, city: "Ahmedabad", avatar: "SP" },
    { rank: 5, name: "You", points: userPoints, city: "Your City", avatar: "ME", isUser: true },
  ];

  const activities = [
    { action: "Submit a complaint", points: 50 },
    { action: "Complaint resolved", points: 100 },
    { action: "Rate a service", points: 20 },
    { action: "Refer a friend", points: 200 },
    { action: "Complete profile", points: 100 },
    { action: "Daily login", points: 10 },
    { action: "7-day streak bonus", points: 100 },
  ];

  const currentLevel = levels.find(l => l.level === userLevel) ?? levels[0];
  const nextLevel = levels.find(l => l.level === userLevel + 1);
  const progressToNext = nextLevel 
    ? ((userPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-purple-700 text-white py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-8 w-8" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Rewards & Recognition
              </h1>
            </div>
            <p className="text-lg text-white/80">
              Earn points, unlock badges, and get rewarded for being an active citizen!
            </p>
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* User Stats Card */}
        <Card className="mb-8 -mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl">
                  {currentLevel.icon}
                </div>
                <div>
                  <p className="text-white/80 text-sm">Your Level</p>
                  <h2 className="text-2xl font-bold">{currentLevel.name}</h2>
                  <p className="text-white/80">Level {userLevel}</p>
                </div>
              </div>
              
              <div className="flex-1 max-w-md w-full">
                <div className="flex justify-between text-sm mb-2">
                  <span>{userPoints} points</span>
                  <span>{nextLevel ? `${nextLevel.minPoints} points for Level ${nextLevel.level}` : "Max Level!"}</span>
                </div>
                <Progress value={progressToNext} className="h-3 bg-white/20" />
                {nextLevel && (
                  <p className="text-sm text-white/80 mt-1">
                    {nextLevel.minPoints - userPoints} points to {nextLevel.name}
                  </p>
                )}
              </div>

              <div className="text-center">
                <p className="text-4xl font-bold">{userPoints}</p>
                <p className="text-white/80">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="badges" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg mx-auto">
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="earn">How to Earn</TabsTrigger>
          </TabsList>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <Card 
                  key={badge.id} 
                  className={`text-center transition-all ${
                    badge.earned 
                      ? "hover:shadow-lg" 
                      : "opacity-60 grayscale"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-full ${badge.color} mx-auto mb-3 flex items-center justify-center`}>
                      {badge.earned ? (
                        <badge.icon className="h-8 w-8 text-white" />
                      ) : (
                        <Lock className="h-6 w-6 text-white/60" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-500">{badge.description}</p>
                    {badge.earned && (
                      <Badge className="mt-2 bg-green-100 text-green-700">Earned!</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <div className="grid md:grid-cols-3 gap-4">
              {rewards.map((reward) => (
                <Card key={reward.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-4">{reward.image}</div>
                    <h3 className="font-semibold mb-2">{reward.name}</h3>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold">{reward.points} points</span>
                    </div>
                    <Button 
                      className="w-full"
                      disabled={userPoints < reward.points || !reward.available}
                    >
                      {(() => {
                        if (userPoints >= reward.points && reward.available) return "Redeem Now";
                        if (!reward.available) return "Coming Soon";
                        return `Need ${reward.points - userPoints} more`;
                      })()}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Citizens This Month
                </CardTitle>
                <CardDescription>
                  Compete with fellow citizens and climb the ranks!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user) => {
                    const getRankStyle = (rank: number) => {
                      if (rank === 1) return "bg-yellow-400 text-yellow-900";
                      if (rank === 2) return "bg-gray-300 text-gray-700";
                      if (rank === 3) return "bg-orange-400 text-orange-900";
                      return "bg-gray-200 text-gray-600";
                    };

                    const getRowStyle = () => {
                      if (user.isUser) return "bg-blue-50 border-2 border-blue-500 dark:bg-blue-900/20";
                      return "bg-gray-50 dark:bg-gray-800";
                    };
                    
                    return (
                    <div 
                      key={user.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg ${getRowStyle()}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankStyle(user.rank)}`}>
                        {user.rank <= 3 ? ["🥇", "🥈", "🥉"][user.rank - 1] : user.rank}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.city}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{user.points.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                  )})}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* How to Earn Tab */}
          <TabsContent value="earn">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Earn Points
                  </CardTitle>
                  <CardDescription>
                    Complete these activities to earn points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div 
                        key={activity.action}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <span className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-blue-500" />
                          {activity.action}
                        </span>
                        <Badge variant="secondary">+{activity.points} pts</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    Level Benefits
                  </CardTitle>
                  <CardDescription>
                    Unlock perks as you level up
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {levels.map((level) => (
                      <div 
                        key={level.level}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          level.level <= userLevel 
                            ? "bg-green-50 dark:bg-green-900/20" 
                            : "bg-gray-50 dark:bg-gray-800"
                        }`}
                      >
                        <span className="text-2xl">{level.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium">Level {level.level}: {level.name}</p>
                          <p className="text-xs text-gray-500">{level.minPoints}+ points</p>
                        </div>
                        {level.level <= userLevel && (
                          <Badge className="bg-green-500">Unlocked</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="mt-8 bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <CardContent className="p-8 text-center">
            <Gift className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Refer Friends & Earn 200 Points!</h2>
            <p className="text-white/90 mb-4">
              Share SUVIDHA with your friends and family. When they sign up, you both earn rewards!
            </p>
            <Button variant="secondary" size="lg">
              Get Referral Link
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Rewards;
