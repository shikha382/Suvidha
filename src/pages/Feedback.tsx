import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Star, 
  Send, 
  ThumbsUp,
  MessageSquare,
  Award,
  Smile,
  Wifi,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFeedback } from "@/hooks/useDataHooks";
import AnimatedCounter from "@/components/AnimatedCounter";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [complaintId, setComplaintId] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Dynamic feedback data
  const { stats: feedbackStats, recentFeedback, loading, error, refresh } = useFeedback();

  // Dynamic stats based on fetched data
  const stats = [
    { id: "avg-rating", label: "Average Rating", value: feedbackStats?.avgRating || 4.2, icon: Star, color: "text-yellow-500" },
    { id: "total-feedback", label: "Total Feedback", value: feedbackStats?.totalFeedback || 1247, icon: MessageSquare, color: "text-blue-500" },
    { id: "satisfaction", label: "Satisfaction Rate", value: feedbackStats?.satisfactionRate || 87, suffix: "%", icon: Smile, color: "text-green-500" },
    { id: "response-rate", label: "Response Rate", value: feedbackStats?.responseRate || 94, suffix: "%", icon: Award, color: "text-purple-500" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Feedback submitted!",
      description: "Thank you for helping us improve our services.",
    });
    
    setRating(0);
    setFeedback("");
    setComplaintId("");
    setCategory("");
    setIsSubmitting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Positive": return "bg-green-100 text-green-800";
      case "Negative": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            className={interactive ? "cursor-pointer focus:outline-none" : "cursor-default"}
            disabled={!interactive}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= (interactive ? (hoverRating || rating) : count)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container py-8 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Feedback & Reviews
            </h1>
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Wifi className="h-3 w-3 animate-pulse" />
              Live
            </div>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto mb-4">
            Your feedback helps us improve civic services. Share your experience and help fellow citizens.
          </p>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.id}>
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                {loading ? (
                  <Skeleton className="h-8 w-16 mx-auto mb-1" />
                ) : (
                  <div className="text-2xl font-bold">
                    <AnimatedCounter end={stat.value} duration={1500} />
                    {stat.suffix || ''}
                  </div>
                )}
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submit Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Feedback</CardTitle>
              <CardDescription>
                Rate your experience with our civic services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="complaintId">Complaint ID (Optional)</Label>
                  <Input
                    id="complaintId"
                    placeholder="e.g., C001"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water">Water Issues</SelectItem>
                      <SelectItem value="roads">Roads</SelectItem>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="sanitation">Sanitation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Your Rating</Label>
                  <div className="flex items-center gap-4">
                    {renderStars(rating, true)}
                    {rating > 0 && (
                      <span className="text-sm text-gray-500">
                        {rating === 5 ? "Excellent!" : 
                         rating === 4 ? "Good" : 
                         rating === 3 ? "Average" : 
                         rating === 2 ? "Poor" : "Very Poor"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Your Feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your experience in detail..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Feedback */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Feedback</CardTitle>
                  <CardDescription>
                    What citizens are saying about our services
                  </CardDescription>
                </div>
                {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-4" />
                      ))}
                    </div>
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))
              ) : error ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button variant="outline" onClick={refresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : recentFeedback.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No feedback yet. Be the first to share!</p>
                </div>
              ) : (
                recentFeedback.map((item) => (
                <div key={item.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.complaintId}</Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(item.rating)}
                    <span className="text-sm text-gray-600">{item.category}</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3">{item.comment}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Button variant="ghost" size="sm" className="h-8">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({item.helpful})
                    </Button>
                  </div>
                </div>
              )))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;