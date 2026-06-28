import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageCircle,
  ThumbsUp,
  Users,
  MapPin,
  Clock,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Send,
  Heart,
  Flag,
  Share2
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge?: string;
    level: number;
  };
  content: string;
  location: string;
  timestamp: Date;
  category: string;
  likes: number;
  comments: number;
  supporters: number;
  isLiked: boolean;
  isSupported: boolean;
  type: "issue" | "update" | "success" | "question";
  status?: "trending" | "resolved" | "urgent";
}

const CommunityHub = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [filter, setFilter] = useState<"all" | "trending" | "nearby" | "resolved">("all");
  const [isPosting, setIsPosting] = useState(false);

  const samplePosts: CommunityPost[] = [
    {
      id: "1",
      author: { name: "Amit Sharma", avatar: "AS", badge: "🏆 Champion", level: 5 },
      content: "Great news! The pothole on MG Road has finally been fixed after our collective complaint. 47 citizens supported this issue! This is the power of community action. 🎉",
      location: "MG Road, Sector 15",
      timestamp: new Date(Date.now() - 3600000),
      category: "Roads",
      likes: 89,
      comments: 23,
      supporters: 47,
      isLiked: false,
      isSupported: true,
      type: "success",
      status: "resolved"
    },
    {
      id: "2",
      author: { name: "Priya Verma", avatar: "PV", badge: "⭐ Active", level: 3 },
      content: "🚨 URGENT: No water supply in Gandhi Nagar for the past 8 hours. Many families with young children are affected. Please support this issue to get faster resolution!",
      location: "Gandhi Nagar, Block C",
      timestamp: new Date(Date.now() - 7200000),
      category: "Water",
      likes: 156,
      comments: 45,
      supporters: 234,
      isLiked: true,
      isSupported: true,
      type: "issue",
      status: "urgent"
    },
    {
      id: "3",
      author: { name: "Rahul Kumar", avatar: "RK", level: 2 },
      content: "Just filed a complaint about the broken street lights in Civil Lines. If you live nearby and face the same issue, please support to help prioritize this. Safety first! 🔦",
      location: "Civil Lines",
      timestamp: new Date(Date.now() - 14400000),
      category: "Electricity",
      likes: 34,
      comments: 12,
      supporters: 28,
      isLiked: false,
      isSupported: false,
      type: "issue",
      status: "trending"
    },
    {
      id: "4",
      author: { name: "Municipal Corp", avatar: "MC", badge: "🏛️ Official", level: 10 },
      content: "📢 UPDATE: We're conducting a city-wide sanitation drive this weekend. Garbage collection will be enhanced in all areas. Thank you for your patience and cooperation!",
      location: "City Wide",
      timestamp: new Date(Date.now() - 28800000),
      category: "Sanitation",
      likes: 245,
      comments: 67,
      supporters: 0,
      isLiked: false,
      isSupported: false,
      type: "update"
    },
    {
      id: "5",
      author: { name: "Sneha Patel", avatar: "SP", level: 4 },
      content: "Does anyone know the process for applying for a new water connection? I've been trying to find information but the website is confusing. Any help appreciated! 🙏",
      location: "Model Town",
      timestamp: new Date(Date.now() - 43200000),
      category: "Water",
      likes: 12,
      comments: 8,
      supporters: 0,
      isLiked: false,
      isSupported: false,
      type: "question"
    }
  ];

  useEffect(() => {
    setPosts(samplePosts);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleSupport = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, supporters: post.isSupported ? post.supporters - 1 : post.supporters + 1, isSupported: !post.isSupported }
        : post
    ));
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setIsPosting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const post: CommunityPost = {
      id: Date.now().toString(),
      author: { name: "You", avatar: "YO", badge: "✨ New", level: 1 },
      content: newPost,
      location: "Your Location",
      timestamp: new Date(),
      category: "General",
      likes: 0,
      comments: 0,
      supporters: 0,
      isLiked: false,
      isSupported: false,
      type: "issue"
    };
    
    setPosts(prev => [post, ...prev]);
    setNewPost("");
    setIsPosting(false);
  };

  const getTypeIcon = (type: CommunityPost["type"]) => {
    switch (type) {
      case "issue": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "success": return <Sparkles className="h-4 w-4 text-green-500" />;
      case "update": return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case "question": return <MessageCircle className="h-4 w-4 text-purple-500" />;
    }
  };

  const getStatusBadge = (status?: CommunityPost["status"]) => {
    if (!status) return null;
    switch (status) {
      case "trending":
        return <Badge className="bg-orange-500">🔥 Trending</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">✅ Resolved</Badge>;
      case "urgent":
        return <Badge className="bg-red-500 animate-pulse">🚨 Urgent</Badge>;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const filteredPosts = posts.filter(post => {
    if (filter === "trending") return post.status === "trending" || post.supporters > 50;
    if (filter === "resolved") return post.status === "resolved";
    return true;
  });

  // Live stats
  const [liveStats, setLiveStats] = useState({
    citizensActive: 1247,
    issuesDiscussed: 89,
    resolvedTogether: 234
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        citizensActive: prev.citizensActive + Math.floor(Math.random() * 10) - 4,
        issuesDiscussed: prev.issuesDiscussed + (Math.random() > 0.8 ? 1 : 0),
        resolvedTogether: prev.resolvedTogether + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-900">{liveStats.citizensActive.toLocaleString()}</p>
            <p className="text-xs text-blue-600">Citizens Active</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-6 w-6 text-orange-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-orange-900">{liveStats.issuesDiscussed}</p>
            <p className="text-xs text-orange-600">Issues Discussed</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <Sparkles className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-900">{liveStats.resolvedTogether}</p>
            <p className="text-xs text-green-600">Resolved Together</p>
          </CardContent>
        </Card>
      </div>

      {/* Post Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback className="bg-blue-100 text-blue-700">YO</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input
                placeholder="Share an issue, ask a question, or post an update..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="border-0 bg-gray-100 focus-visible:ring-1"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">📍 Add Location</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">📷 Add Photo</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">🏷️ Category</Badge>
                </div>
                <Button onClick={handlePost} disabled={!newPost.trim() || isPosting} size="sm">
                  <Send className="h-4 w-4 mr-1" />
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "trending", "nearby", "resolved"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "all" && "All Posts"}
            {f === "trending" && "🔥 Trending"}
            {f === "nearby" && "📍 Nearby"}
            {f === "resolved" && "✅ Resolved"}
          </Button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              {/* Author Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                      {post.author.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{post.author.name}</span>
                      {post.author.badge && (
                        <Badge variant="secondary" className="text-xs">{post.author.badge}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {post.location}
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      {formatTime(post.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTypeIcon(post.type)}
                  {getStatusBadge(post.status)}
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

              {/* Category */}
              <div className="mb-4">
                <Badge variant="outline">{post.category}</Badge>
              </div>

              {/* Supporters Progress (for issues) */}
              {post.type === "issue" && post.supporters > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-blue-800">Community Support</span>
                    <span className="text-sm text-blue-600">{post.supporters} supporters</span>
                  </div>
                  <Progress value={Math.min(post.supporters / 100 * 100, 100)} className="h-2" />
                  <p className="text-xs text-blue-600 mt-1">
                    {post.supporters >= 100 ? "✅ Priority increased!" : `${100 - post.supporters} more needed for priority boost`}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 text-sm ${post.isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
                  >
                    <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-500 transition-colors">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
                
                {post.type === "issue" && (
                  <Button
                    size="sm"
                    variant={post.isSupported ? "default" : "outline"}
                    onClick={() => handleSupport(post.id)}
                    className={post.isSupported ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {post.isSupported ? "Supported!" : "Support Issue"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityHub;
