import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  SmilePlus,
  Smile,
  Meh,
  Frown,
  Angry,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  MessageSquare,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
  veryNegative: number;
}

interface ComplaintSentiment {
  id: string;
  title: string;
  sentiment: "very_positive" | "positive" | "neutral" | "negative" | "very_negative";
  score: number;
  keywords: string[];
  urgencyLevel: "low" | "medium" | "high" | "critical";
}

interface SentimentAnalysisProps {
  overallSentiment?: SentimentData;
  recentComplaints?: ComplaintSentiment[];
  trend?: "improving" | "declining" | "stable";
}

const defaultSentiment: SentimentData = {
  positive: 25,
  neutral: 45,
  negative: 22,
  veryNegative: 8
};

const defaultComplaints: ComplaintSentiment[] = [
  {
    id: "1",
    title: "Water supply disrupted for 3 days",
    sentiment: "very_negative",
    score: 0.15,
    keywords: ["urgent", "children", "suffering", "immediate"],
    urgencyLevel: "critical"
  },
  {
    id: "2",
    title: "Streetlight not working near school",
    sentiment: "negative",
    score: 0.35,
    keywords: ["safety", "concerned", "dark", "students"],
    urgencyLevel: "high"
  },
  {
    id: "3",
    title: "Request for new garbage bin in park",
    sentiment: "neutral",
    score: 0.55,
    keywords: ["suggestion", "convenient", "park"],
    urgencyLevel: "low"
  },
  {
    id: "4",
    title: "Pothole repaired quickly - thank you!",
    sentiment: "positive",
    score: 0.82,
    keywords: ["thank you", "quick", "efficient", "happy"],
    urgencyLevel: "low"
  },
  {
    id: "5",
    title: "Excellent service from water department",
    sentiment: "very_positive",
    score: 0.95,
    keywords: ["excellent", "appreciated", "grateful", "wonderful"],
    urgencyLevel: "low"
  }
];

const sentimentConfig = {
  very_positive: {
    icon: SmilePlus,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    label: "Very Positive"
  },
  positive: {
    icon: Smile,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    label: "Positive"
  },
  neutral: {
    icon: Meh,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    label: "Neutral"
  },
  negative: {
    icon: Frown,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    label: "Negative"
  },
  very_negative: {
    icon: Angry,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    label: "Very Negative"
  }
};

const urgencyColors = {
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
};

const SentimentAnalysis = ({
  overallSentiment = defaultSentiment,
  recentComplaints = defaultComplaints,
  trend = "improving"
}: SentimentAnalysisProps) => {
  const totalResponses = Object.values(overallSentiment).reduce((a, b) => a + b, 0);

  const getSentimentScore = () => {
    const weights = {
      positive: 1,
      neutral: 0.5,
      negative: -0.5,
      veryNegative: -1
    };
    const weighted = 
      (overallSentiment.positive * weights.positive +
       overallSentiment.neutral * weights.neutral +
       overallSentiment.negative * weights.negative +
       overallSentiment.veryNegative * weights.veryNegative) / totalResponses;
    
    return ((weighted + 1) / 2) * 100; // Normalize to 0-100
  };

  const overallScore = getSentimentScore();

  return (
    <div className="space-y-6">
      {/* Overall Sentiment Score */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              Citizen Sentiment Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-6">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={`${overallScore * 2.51} 251`}
                    className={cn(
                      overallScore >= 60 ? "text-green-500" :
                      overallScore >= 40 ? "text-yellow-500" : "text-red-500"
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{Math.round(overallScore)}%</span>
                  <span className="text-xs text-muted-foreground">Satisfaction</span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {[
                  { label: "Positive", value: overallSentiment.positive, color: "bg-green-500" },
                  { label: "Neutral", value: overallSentiment.neutral, color: "bg-yellow-500" },
                  { label: "Negative", value: overallSentiment.negative, color: "bg-orange-500" },
                  { label: "Very Negative", value: overallSentiment.veryNegative, color: "bg-red-500" }
                ].map(item => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span className="font-medium">{Math.round((item.value / totalResponses) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all", item.color)}
                        style={{ width: `${(item.value / totalResponses) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend Card */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className={cn(
              "h-16 w-16 rounded-full flex items-center justify-center mb-4",
              trend === "improving" ? "bg-green-100 dark:bg-green-900/30" :
              trend === "declining" ? "bg-red-100 dark:bg-red-900/30" :
              "bg-yellow-100 dark:bg-yellow-900/30"
            )}>
              {trend === "improving" && <TrendingUp className="h-8 w-8 text-green-600" />}
              {trend === "declining" && <TrendingDown className="h-8 w-8 text-red-600" />}
              {trend === "stable" && <Minus className="h-8 w-8 text-yellow-600" />}
            </div>
            <h3 className="text-xl font-bold capitalize">{trend}</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              {trend === "improving" && "Citizen satisfaction is increasing this month"}
              {trend === "declining" && "Action needed to improve satisfaction"}
              {trend === "stable" && "Satisfaction levels remain consistent"}
            </p>
            <Badge variant="outline" className="mt-3">
              vs last month
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent Complaints with Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Recent Complaints Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentComplaints.map(complaint => {
              const config = sentimentConfig[complaint.sentiment];
              const Icon = config.icon;
              
              return (
                <div 
                  key={complaint.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    config.bgColor
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-800",
                      config.color
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium">{complaint.title}</h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={urgencyColors[complaint.urgencyLevel]}>
                            {complaint.urgencyLevel === "critical" && (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {complaint.urgencyLevel.charAt(0).toUpperCase() + complaint.urgencyLevel.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Sentiment:</span>
                          <span className={cn("font-medium", config.color)}>
                            {config.label}
                          </span>
                          <span className="text-muted-foreground">
                            ({Math.round(complaint.score * 100)}%)
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {complaint.keywords.map(keyword => (
                          <Badge 
                            key={keyword} 
                            variant="outline" 
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">AI Insights</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Water department complaints show high urgency - 3+ day delays reported
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                  Safety concerns frequently mentioned in streetlight complaints
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Road repair team receiving positive feedback for quick response
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysis;
