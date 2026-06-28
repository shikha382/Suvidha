import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Star,
  Medal,
  Target,
  Zap,
  Users,
  MessageSquare,
  CheckCircle2,
  Flame,
  Crown,
  Gift,
  Award,
  Heart,
  Shield,
  Clock,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  category: "reporting" | "community" | "engagement" | "special";
}

interface UserStats {
  totalPoints: number;
  level: number;
  currentLevelPoints: number;
  nextLevelPoints: number;
  rank: number;
  totalUsers: number;
  streak: number;
  complaintsSubmitted: number;
  complaintsResolved: number;
  upvotesReceived: number;
  helpfulComments: number;
}

const mockAchievements: Achievement[] = [
  {
    id: "first-complaint",
    title: "First Steps",
    description: "Submit your first complaint",
    icon: Target,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: new Date("2026-01-15"),
    rarity: "common",
    points: 50,
    category: "reporting"
  },
  {
    id: "active-reporter",
    title: "Active Reporter",
    description: "Submit 10 complaints",
    icon: MessageSquare,
    progress: 7,
    maxProgress: 10,
    unlocked: false,
    rarity: "common",
    points: 100,
    category: "reporting"
  },
  {
    id: "super-reporter",
    title: "Super Reporter",
    description: "Submit 50 complaints",
    icon: Zap,
    progress: 7,
    maxProgress: 50,
    unlocked: false,
    rarity: "rare",
    points: 500,
    category: "reporting"
  },
  {
    id: "community-hero",
    title: "Community Hero",
    description: "Get 100 upvotes on your complaints",
    icon: Heart,
    progress: 45,
    maxProgress: 100,
    unlocked: false,
    rarity: "epic",
    points: 1000,
    category: "community"
  },
  {
    id: "helpful-citizen",
    title: "Helpful Citizen",
    description: "Leave 20 helpful comments",
    icon: Users,
    progress: 12,
    maxProgress: 20,
    unlocked: false,
    rarity: "rare",
    points: 300,
    category: "community"
  },
  {
    id: "streak-master",
    title: "Streak Master",
    description: "Maintain a 7-day activity streak",
    icon: Flame,
    progress: 5,
    maxProgress: 7,
    unlocked: false,
    rarity: "rare",
    points: 250,
    category: "engagement"
  },
  {
    id: "resolution-champion",
    title: "Resolution Champion",
    description: "Have 25 of your complaints resolved",
    icon: CheckCircle2,
    progress: 15,
    maxProgress: 25,
    unlocked: false,
    rarity: "epic",
    points: 750,
    category: "reporting"
  },
  {
    id: "early-adopter",
    title: "Early Adopter",
    description: "Join during the platform launch",
    icon: Star,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: new Date("2026-01-01"),
    rarity: "legendary",
    points: 1500,
    category: "special"
  },
  {
    id: "local-guardian",
    title: "Local Guardian",
    description: "Report issues in 5 different areas",
    icon: MapPin,
    progress: 3,
    maxProgress: 5,
    unlocked: false,
    rarity: "rare",
    points: 400,
    category: "reporting"
  },
  {
    id: "quick-responder",
    title: "Quick Responder",
    description: "Respond to 10 community discussions within an hour",
    icon: Clock,
    progress: 4,
    maxProgress: 10,
    unlocked: false,
    rarity: "epic",
    points: 600,
    category: "community"
  },
  {
    id: "verified-champion",
    title: "Verified Champion",
    description: "Complete profile verification",
    icon: Shield,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: new Date("2026-01-20"),
    rarity: "common",
    points: 100,
    category: "engagement"
  },
  {
    id: "legendary-contributor",
    title: "Legendary Contributor",
    description: "Reach 10,000 total points",
    icon: Crown,
    progress: 2850,
    maxProgress: 10000,
    unlocked: false,
    rarity: "legendary",
    points: 5000,
    category: "special"
  }
];

const mockUserStats: UserStats = {
  totalPoints: 2850,
  level: 12,
  currentLevelPoints: 350,
  nextLevelPoints: 500,
  rank: 47,
  totalUsers: 15420,
  streak: 5,
  complaintsSubmitted: 7,
  complaintsResolved: 15,
  upvotesReceived: 45,
  helpfulComments: 12
};

const rarityConfig = {
  common: {
    color: "from-gray-400 to-gray-500",
    bg: "bg-gray-100 dark:bg-gray-800",
    border: "border-gray-300 dark:border-gray-600",
    text: "text-gray-600 dark:text-gray-400",
    glow: ""
  },
  rare: {
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    border: "border-blue-300 dark:border-blue-600",
    text: "text-blue-600 dark:text-blue-400",
    glow: "shadow-blue-500/20"
  },
  epic: {
    color: "from-purple-400 to-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/30",
    border: "border-purple-300 dark:border-purple-600",
    text: "text-purple-600 dark:text-purple-400",
    glow: "shadow-purple-500/30"
  },
  legendary: {
    color: "from-yellow-400 to-orange-500",
    bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30",
    border: "border-yellow-400 dark:border-yellow-500",
    text: "text-yellow-600 dark:text-yellow-400",
    glow: "shadow-yellow-500/40 shadow-lg"
  }
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const config = rarityConfig[achievement.rarity];
  const progressPercent = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:scale-[1.02]",
      config.border,
      achievement.unlocked ? config.glow : "opacity-80 grayscale-[30%]"
    )}>
      {achievement.unlocked && achievement.rarity === "legendary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 animate-pulse" />
      )}
      
      <CardContent className="p-4 relative">
        <div className="flex items-start gap-4">
          <div className={cn(
            "h-14 w-14 rounded-xl flex items-center justify-center bg-gradient-to-br",
            config.color,
            achievement.unlocked ? "" : "opacity-50"
          )}>
            <achievement.icon className="h-7 w-7 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{achievement.title}</h3>
              <Badge variant="outline" className={cn("text-xs capitalize", config.text)}>
                {achievement.rarity}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
            
            {!achievement.unlocked ? (
              <div className="space-y-1">
                <Progress value={progressPercent} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {achievement.progress} / {achievement.maxProgress}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                Unlocked {achievement.unlockedAt?.toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className={cn(
              "flex items-center gap-1 font-bold",
              achievement.unlocked ? "text-yellow-600" : "text-muted-foreground"
            )}>
              <Star className="h-4 w-4 fill-current" />
              {achievement.points}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Achievements = () => {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [category, setCategory] = useState<string>("all");

  const filteredAchievements = mockAchievements.filter(a => {
    if (filter === "unlocked" && !a.unlocked) return false;
    if (filter === "locked" && a.unlocked) return false;
    if (category !== "all" && a.category !== category) return false;
    return true;
  });

  const unlockedCount = mockAchievements.filter(a => a.unlocked).length;
  const totalPoints = mockAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Total Points</p>
                <p className="text-3xl font-bold">{mockUserStats.totalPoints.toLocaleString()}</p>
              </div>
              <Trophy className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Level {mockUserStats.level}</p>
                <Progress 
                  value={(mockUserStats.currentLevelPoints / mockUserStats.nextLevelPoints) * 100} 
                  className="mt-2 h-2 bg-white/30"
                />
                <p className="text-xs mt-1 text-white/70">
                  {mockUserStats.currentLevelPoints}/{mockUserStats.nextLevelPoints} XP
                </p>
              </div>
              <Star className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Global Rank</p>
                <p className="text-3xl font-bold">#{mockUserStats.rank}</p>
                <p className="text-xs text-white/70">of {mockUserStats.totalUsers.toLocaleString()}</p>
              </div>
              <Medal className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Day Streak</p>
                <p className="text-3xl font-bold">{mockUserStats.streak} 🔥</p>
                <p className="text-xs text-white/70">Keep it going!</p>
              </div>
              <Flame className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All ({mockAchievements.length})</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked ({unlockedCount})</TabsTrigger>
            <TabsTrigger value="locked">Locked ({mockAchievements.length - unlockedCount})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          {["all", "reporting", "community", "engagement", "special"].map(cat => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredAchievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {/* Rewards Section */}
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Redeem Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "Priority Support", points: 500, icon: Zap },
              { name: "₹100 Tax Credit", points: 2000, icon: Award },
              { name: "VIP Badge", points: 5000, icon: Crown }
            ].map(reward => (
              <Card key={reward.name} className="bg-muted/50">
                <CardContent className="p-4 text-center">
                  <reward.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium">{reward.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Star className="h-3 w-3" /> {reward.points} points
                  </p>
                  <Button 
                    size="sm" 
                    className="mt-3 w-full"
                    disabled={mockUserStats.totalPoints < reward.points}
                  >
                    {mockUserStats.totalPoints >= reward.points ? "Redeem" : "Need more points"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;
