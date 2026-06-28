import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Newspaper,
  Megaphone,
  AlertTriangle,
  Calendar,
  Gift,
  RefreshCw,
  Search,
  Eye,
  Clock,
  Tag,
  ExternalLink,
  Pin,
  TrendingUp,
  Bell
} from "lucide-react";
import { useNews } from "@/hooks/useDataHooks";
import { formatDistanceToNow } from "date-fns";
import type { NewsItem } from "@/services/dataService";

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  announcement: { label: "Announcement", icon: Megaphone, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  scheme: { label: "Government Scheme", icon: Gift, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
  emergency: { label: "Emergency Alert", icon: AlertTriangle, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
  update: { label: "Update", icon: RefreshCw, color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  event: { label: "Event", icon: Calendar, color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" }
};

// NewsCard component extracted outside News for performance
interface NewsCardProps {
  item: NewsItem;
  featured?: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const NewsCard = ({ item, featured = false, isSelected, onSelect }: NewsCardProps) => {
  const config = categoryConfig[item.category];
  const IconComponent = config.icon;
  
  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      } ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={onSelect}
    >
      {item.image_url && (
        <div className={`relative ${featured ? "h-64" : "h-40"} overflow-hidden`}>
          <img 
            src={item.image_url} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          {item.is_pinned && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1.5 rounded-full">
              <Pin className="h-4 w-4" />
            </div>
          )}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4`}>
            <Badge className={`${config.bgColor} ${config.color} border-0`}>
              <IconComponent className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </div>
        </div>
      )}
      <CardHeader className={item.image_url ? "pt-3" : ""}>
        {!item.image_url && (
          <Badge className={`${config.bgColor} ${config.color} border-0 w-fit mb-2`}>
            <IconComponent className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        )}
        <CardTitle className={`${featured ? "text-xl" : "text-lg"} line-clamp-2`}>
          {item.title}
        </CardTitle>
        <CardDescription className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(item.published_at), { addSuffix: true })}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {item.views.toLocaleString()} views
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className={`text-sm text-muted-foreground ${isSelected ? "" : "line-clamp-3"}`}>
          {item.content}
        </p>
        
        {isSelected && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Department:</span> {item.department}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Author:</span> {item.author}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            <Button className="w-full mt-3" size="sm">
              Read Full Article <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const News = () => {
  const { news, pinnedNews, loading, refresh } = useNews();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNews, setSelectedNews] = useState<string | null>(null);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-blue-700 text-white py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Newspaper className="h-8 w-8" />
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  News & Updates
                </h1>
              </div>
              <p className="text-white/80 text-lg">
                Stay informed with the latest government announcements and updates
              </p>
            </div>
            <Button onClick={refresh} variant="secondary" className="flex items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* Pinned News Ticker */}
        {pinnedNews.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 -mt-8">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 text-white p-2 rounded-full animate-pulse">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-4 animate-marquee">
                  {pinnedNews.map((item, index) => (
                    <span key={item.id} className="whitespace-nowrap text-sm font-medium">
                      📢 {item.title}
                      {index < pinnedNews.length - 1 && <span className="mx-4 text-yellow-500">•</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="emergency" className="text-red-600">
                <AlertTriangle className="h-3 w-3 mr-1 hidden md:inline" />
                Alert
              </TabsTrigger>
              <TabsTrigger value="scheme">Schemes</TabsTrigger>
              <TabsTrigger value="announcement">News</TabsTrigger>
              <TabsTrigger value="update">Updates</TabsTrigger>
              <TabsTrigger value="event">Events</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 flex items-center gap-3">
              <Newspaper className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{news.length}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Total Articles</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {news.filter(n => n.category === "emergency").length}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">Alerts</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4 flex items-center gap-3">
              <Gift className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {news.filter(n => n.category === "scheme").length}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Schemes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {news.reduce((sum, n) => sum + n.views, 0).toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Total Views</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* News Grid */}
        {(() => {
          if (loading) {
            return (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <Skeleton className="h-40 w-full" />
                    <CardHeader>
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          }
          
          if (filteredNews.length === 0) {
            return (
              <Card className="p-12 text-center">
                <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No news found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try a different search term" : "Check back later for updates"}
                </p>
              </Card>
            );
          }
          
          return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item, index) => (
                <NewsCard 
                  key={item.id} 
                  item={item} 
                  featured={index === 0 && selectedCategory === "all"}
                  isSelected={selectedNews === item.id}
                  onSelect={() => setSelectedNews(selectedNews === item.id ? null : item.id)}
                />
              ))}
            </div>
          );
        })()}

        {/* Subscribe Section */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Never Miss an Update</h3>
              <p className="text-muted-foreground">
                Subscribe to receive instant notifications about important news and alerts
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Input placeholder="Enter your email" className="max-w-xs" />
              <Button>
                <Bell className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default News;
