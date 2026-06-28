import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  MapPin,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  rank: number;
  previousRank: number;
  streak: number;
  complaintsResolved: number;
  upvotesReceived: number;
  area: string;
  badges: string[];
  isCurrentUser?: boolean;
}

const mockLeaderboard: LeaderboardUser[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    points: 15420,
    level: 25,
    rank: 1,
    previousRank: 1,
    streak: 45,
    complaintsResolved: 89,
    upvotesReceived: 456,
    area: "Koramangala",
    badges: ["legendary", "streak-master", "community-hero"]
  },
  {
    id: "2",
    name: "Priya Sharma",
    points: 12850,
    level: 22,
    rank: 2,
    previousRank: 3,
    streak: 32,
    complaintsResolved: 67,
    upvotesReceived: 389,
    area: "Indiranagar",
    badges: ["epic", "helpful-citizen"]
  },
  {
    id: "3",
    name: "Amit Patel",
    points: 11200,
    level: 20,
    rank: 3,
    previousRank: 2,
    streak: 28,
    complaintsResolved: 54,
    upvotesReceived: 312,
    area: "HSR Layout",
    badges: ["epic", "quick-responder"]
  },
  {
    id: "4",
    name: "Sunita Reddy",
    points: 9875,
    level: 18,
    rank: 4,
    previousRank: 5,
    streak: 21,
    complaintsResolved: 48,
    upvotesReceived: 267,
    area: "Whitefield",
    badges: ["rare", "local-guardian"]
  },
  {
    id: "5",
    name: "Mohammed Ali",
    points: 8920,
    level: 17,
    rank: 5,
    previousRank: 4,
    streak: 19,
    complaintsResolved: 42,
    upvotesReceived: 234,
    area: "Electronic City",
    badges: ["rare"]
  },
  {
    id: "current",
    name: "You",
    points: 2850,
    level: 12,
    rank: 47,
    previousRank: 52,
    streak: 5,
    complaintsResolved: 15,
    upvotesReceived: 45,
    area: "Jayanagar",
    badges: ["common", "early-adopter"],
    isCurrentUser: true
  }
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Medal className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  }
};

const getRankChange = (current: number, previous: number) => {
  const diff = previous - current;
  if (diff > 0) {
    return (
      <span className="flex items-center text-green-500 text-sm">
        <TrendingUp className="h-4 w-4 mr-1" />
        +{diff}
      </span>
    );
  } else if (diff < 0) {
    return (
      <span className="flex items-center text-red-500 text-sm">
        <TrendingDown className="h-4 w-4 mr-1" />
        {diff}
      </span>
    );
  }
  return (
    <span className="flex items-center text-muted-foreground text-sm">
      <Minus className="h-4 w-4 mr-1" />
      0
    </span>
  );
};

const LeaderboardRow = ({ user, showDetails = false }: { user: LeaderboardUser; showDetails?: boolean }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-muted/50",
        user.isCurrentUser && "bg-primary/5 border border-primary/20",
        user.rank <= 3 && "bg-gradient-to-r from-yellow-500/5 to-transparent"
      )}
    >
      <div className="w-12 flex justify-center">
        {getRankIcon(user.rank)}
      </div>

      <Avatar className={cn(
        "h-12 w-12 border-2",
        user.rank === 1 && "border-yellow-500",
        user.rank === 2 && "border-gray-400",
        user.rank === 3 && "border-amber-600",
        user.rank > 3 && "border-transparent"
      )}>
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white">
          {user.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-semibold truncate",
            user.isCurrentUser && "text-primary"
          )}>
            {user.name}
          </span>
          {user.isCurrentUser && (
            <Badge variant="outline" className="text-xs">You</Badge>
          )}
          {user.streak >= 30 && (
            <span className="flex items-center text-orange-500">
              <Flame className="h-4 w-4" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {user.area}
          </span>
          <span>Level {user.level}</span>
        </div>
      </div>

      {showDetails && (
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <div className="text-center">
            <p className="font-semibold text-foreground">{user.complaintsResolved}</p>
            <p className="text-xs">Resolved</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">{user.upvotesReceived}</p>
            <p className="text-xs">Upvotes</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground flex items-center gap-1">
              {user.streak} <Flame className="h-3 w-3 text-orange-500" />
            </p>
            <p className="text-xs">Streak</p>
          </div>
        </div>
      )}

      <div className="text-right">
        <div className="flex items-center gap-1 font-bold text-yellow-600">
          <Star className="h-4 w-4 fill-current" />
          {user.points.toLocaleString()}
        </div>
        {getRankChange(user.rank, user.previousRank)}
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState("all-time");
  const currentUser = mockLeaderboard.find(u => u.isCurrentUser);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {mockLeaderboard.slice(0, 3).map((user, index) => (
          <Card 
            key={user.id}
            className={cn(
              "relative overflow-hidden",
              index === 0 && "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30",
              index === 1 && "bg-gradient-to-br from-gray-500/10 to-slate-500/10 border-gray-400/30",
              index === 2 && "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30"
            )}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                {getRankIcon(user.rank)}
              </div>
              <Avatar className="h-16 w-16 mx-auto mb-3 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.area}</p>
              <div className="flex items-center justify-center gap-1 mt-2 text-yellow-600 font-bold">
                <Star className="h-5 w-5 fill-current" />
                {user.points.toLocaleString()} pts
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeframe Tabs */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Citizen Leaderboard
            </CardTitle>
            <Tabs value={timeframe} onValueChange={setTimeframe}>
              <TabsList>
                <TabsTrigger value="weekly">This Week</TabsTrigger>
                <TabsTrigger value="monthly">This Month</TabsTrigger>
                <TabsTrigger value="all-time">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockLeaderboard.filter(u => !u.isCurrentUser).map(user => (
              <LeaderboardRow key={user.id} user={user} showDetails />
            ))}
          </div>

          {/* Current User Position */}
          {currentUser && currentUser.rank > 5 && (
            <>
              <div className="my-4 flex items-center gap-4 text-muted-foreground">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm">Your Position</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <LeaderboardRow user={currentUser} showDetails />
            </>
          )}
        </CardContent>
      </Card>

      {/* Motivational Card */}
      <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <TrendingUp className="h-10 w-10 mx-auto mb-3 text-primary" />
          <h3 className="text-xl font-bold mb-2">You're climbing up! 🚀</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You've moved up 5 positions this week! Keep reporting issues and helping the community to reach the top 25.
          </p>
          <Button className="mt-4">
            <Star className="h-4 w-4 mr-2" />
            View Ways to Earn Points
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
