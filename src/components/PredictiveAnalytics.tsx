import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lightbulb,
  Zap,
  BarChart3,
  Target,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface Prediction {
  category: string;
  currentVolume: number;
  predictedVolume: number;
  trend: "up" | "down" | "stable";
  confidence: number;
  insight: string;
  recommendation: string;
  estimatedImpact: string;
}

interface AreaInsight {
  area: string;
  riskScore: number;
  topIssue: string;
  predictedIssues: number;
  suggestedAction: string;
}

const PredictiveAnalytics = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [areaInsights, setAreaInsights] = useState<AreaInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"24h" | "7d" | "30d">("7d");

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      setPredictions([
        {
          category: "Water Supply",
          currentVolume: 45,
          predictedVolume: 72,
          trend: "up",
          confidence: 89,
          insight: "Expected 60% increase in water complaints due to summer season approaching",
          recommendation: "Pre-position mobile water tankers in high-demand areas",
          estimatedImpact: "~15,000 citizens affected"
        },
        {
          category: "Roads & Potholes",
          currentVolume: 67,
          predictedVolume: 54,
          trend: "down",
          confidence: 82,
          insight: "Road complaints expected to decrease after ongoing repair drive",
          recommendation: "Shift focus to preventive maintenance in monsoon-prone areas",
          estimatedImpact: "20% reduction in accidents"
        },
        {
          category: "Electricity",
          currentVolume: 38,
          predictedVolume: 89,
          trend: "up",
          confidence: 94,
          insight: "Power outage complaints to surge due to peak summer load",
          recommendation: "Implement load shedding schedule proactively; notify citizens",
          estimatedImpact: "~50,000 households"
        },
        {
          category: "Sanitation",
          currentVolume: 52,
          predictedVolume: 48,
          trend: "stable",
          confidence: 76,
          insight: "Garbage collection complaints stable with minor weekend fluctuations",
          recommendation: "Increase weekend collection frequency by 20%",
          estimatedImpact: "Improved satisfaction rate"
        }
      ]);

      setAreaInsights([
        {
          area: "Central District",
          riskScore: 78,
          topIssue: "Water Pipeline Age",
          predictedIssues: 23,
          suggestedAction: "Schedule proactive pipeline inspection"
        },
        {
          area: "North Zone",
          riskScore: 45,
          topIssue: "Street Lighting",
          predictedIssues: 12,
          suggestedAction: "Replace aging LED fixtures"
        },
        {
          area: "Industrial Area",
          riskScore: 89,
          topIssue: "Power Grid Overload",
          predictedIssues: 34,
          suggestedAction: "Deploy additional transformers"
        },
        {
          area: "Residential Colony",
          riskScore: 32,
          topIssue: "Garbage Overflow",
          predictedIssues: 8,
          suggestedAction: "Add extra collection round"
        }
      ]);

      setIsAnalyzing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [selectedTimeframe]);

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return "bg-red-500";
    if (score >= 50) return "bg-orange-500";
    if (score >= 30) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (isAnalyzing) {
    return (
      <Card className="border-2 border-purple-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <Brain className="h-16 w-16 text-purple-600 animate-pulse" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-purple-900 mb-2">AI Analyzing Patterns...</h3>
            <p className="text-gray-600 mb-4">Processing historical data and generating predictions</p>
            <div className="max-w-xs mx-auto space-y-2">
              <Progress value={33} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Analyzing complaints...</span>
                <span>33%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Predictive Analytics</h2>
            <p className="text-sm text-gray-500">AI-powered issue forecasting</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(["24h", "7d", "30d"] as const).map((tf) => (
            <Button
              key={tf}
              size="sm"
              variant={selectedTimeframe === tf ? "default" : "outline"}
              onClick={() => {
                setSelectedTimeframe(tf);
                setIsAnalyzing(true);
              }}
            >
              {tf === "24h" ? "24 Hours" : tf === "7d" ? "7 Days" : "30 Days"}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Predictions */}
      <div className="grid md:grid-cols-2 gap-4">
        {predictions.map((pred) => (
          <Card key={pred.category} className="overflow-hidden">
            <div className={`h-1 ${pred.trend === "up" ? "bg-red-500" : pred.trend === "down" ? "bg-green-500" : "bg-blue-500"}`} />
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{pred.category}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getTrendIcon(pred.trend)}
                    <span className="text-sm">
                      {pred.currentVolume} → {pred.predictedVolume} complaints
                    </span>
                  </div>
                </div>
                <Badge variant={pred.trend === "up" ? "destructive" : "default"} className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {pred.confidence}% confidence
                </Badge>
              </div>

              {/* Prediction Bar */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-400 rounded-full" 
                      style={{ width: `${(pred.currentVolume / Math.max(pred.currentVolume, pred.predictedVolume)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">Now</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${pred.trend === "up" ? "bg-red-400" : "bg-green-400"}`}
                      style={{ width: `${(pred.predictedVolume / Math.max(pred.currentVolume, pred.predictedVolume)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">Predicted</span>
                </div>
              </div>

              {/* Insight */}
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-blue-800">
                  <Lightbulb className="h-4 w-4 inline mr-1 text-yellow-500" />
                  {pred.insight}
                </p>
              </div>

              {/* Recommendation */}
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs font-medium text-green-700 mb-1">AI Recommendation:</p>
                <p className="text-sm text-green-800">{pred.recommendation}</p>
                <p className="text-xs text-green-600 mt-2">
                  <Zap className="h-3 w-3 inline mr-1" />
                  Impact: {pred.estimatedImpact}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Area Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Area Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {areaInsights.map((area) => (
              <div key={area.area} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(area.riskScore)}`} />
                    <span className="font-semibold">{area.area}</span>
                  </div>
                  <Badge variant={area.riskScore >= 70 ? "destructive" : area.riskScore >= 50 ? "default" : "secondary"}>
                    Risk Score: {area.riskScore}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-gray-500">Top Predicted Issue</p>
                    <p className="text-sm font-medium">{area.topIssue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expected Complaints</p>
                    <p className="text-sm font-medium">{area.predictedIssues} in next 7 days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Suggested Action</p>
                    <p className="text-sm font-medium text-blue-600">{area.suggestedAction}</p>
                  </div>
                </div>

                <Progress value={area.riskScore} className="h-1 mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-purple-900">AI-Generated Priority Actions</h3>
              <p className="text-sm text-purple-600">Based on predictive analysis, take these proactive steps</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              View All Actions
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/80 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-xs font-medium text-red-600">URGENT</span>
              </div>
              <p className="text-sm font-medium">Deploy water tankers to Central District</p>
              <p className="text-xs text-gray-500 mt-1">Expected demand surge in 48 hours</p>
            </div>
            <div className="bg-white/80 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-3 w-3 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-orange-600">SOON</span>
              </div>
              <p className="text-sm font-medium">Schedule transformer maintenance</p>
              <p className="text-xs text-gray-500 mt-1">Industrial Area showing stress signs</p>
            </div>
            <div className="bg-white/80 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600">PLANNED</span>
              </div>
              <p className="text-sm font-medium">Update citizen on power schedule</p>
              <p className="text-xs text-gray-500 mt-1">Proactive communication reduces complaints</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
