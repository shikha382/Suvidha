import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Zap,
  AlertTriangle,
  Clock,
  Users,
  MapPin,
  Sparkles,
  Target
} from "lucide-react";

interface AnalysisResult {
  sentiment: "positive" | "neutral" | "negative" | "urgent";
  category: string;
  subcategory: string;
  priority: "low" | "medium" | "high" | "critical";
  department: string;
  estimatedResolution: string;
  similarIssues: number;
  affectedCitizens: number;
  aiSuggestions: string[];
  confidence: number;
  keywords: string[];
  urgencyScore: number;
}

interface SmartComplaintAnalyzerProps {
  description: string;
  location?: string;
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

const SmartComplaintAnalyzer = ({ description, location, onAnalysisComplete }: SmartComplaintAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState("");

  const analyzeComplaint = async () => {
    if (!description || description.length < 10) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysis(null);

    const steps = [
      { step: "🔍 Analyzing text sentiment...", progress: 15 },
      { step: "🏷️ Categorizing complaint type...", progress: 30 },
      { step: "📊 Checking similar issues in database...", progress: 50 },
      { step: "🎯 Identifying relevant department...", progress: 70 },
      { step: "⏱️ Calculating priority score...", progress: 85 },
      { step: "✨ Generating AI recommendations...", progress: 100 },
    ];

    for (const { step, progress } of steps) {
      setCurrentStep(step);
      setProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    // AI-powered analysis simulation
    const keywords = extractKeywords(description);
    const category = detectCategory(description);
    const sentiment = detectSentiment(description);
    const priority = calculatePriority(description, sentiment);
    
    const result: AnalysisResult = {
      sentiment,
      category: category.main,
      subcategory: category.sub,
      priority,
      department: category.department,
      estimatedResolution: getEstimatedTime(priority),
      similarIssues: Math.floor(Math.random() * 50) + 5,
      affectedCitizens: Math.floor(Math.random() * 500) + 100,
      aiSuggestions: generateSuggestions(category.main, description),
      confidence: Math.floor(Math.random() * 15) + 85,
      keywords,
      urgencyScore: calculateUrgencyScore(description, sentiment)
    };

    setAnalysis(result);
    setIsAnalyzing(false);
    onAnalysisComplete?.(result);
  };

  const extractKeywords = (text: string): string[] => {
    const keywords = [];
    const lowText = text.toLowerCase();
    
    if (lowText.includes("water")) keywords.push("water");
    if (lowText.includes("road") || lowText.includes("pothole")) keywords.push("road");
    if (lowText.includes("electricity") || lowText.includes("power")) keywords.push("electricity");
    if (lowText.includes("garbage") || lowText.includes("waste")) keywords.push("sanitation");
    if (lowText.includes("urgent") || lowText.includes("emergency")) keywords.push("urgent");
    if (lowText.includes("broken") || lowText.includes("damaged")) keywords.push("damaged");
    if (lowText.includes("leak") || lowText.includes("overflow")) keywords.push("leakage");
    
    return keywords.length > 0 ? keywords : ["general", "civic"];
  };

  const detectCategory = (text: string): { main: string; sub: string; department: string } => {
    const lowText = text.toLowerCase();
    
    if (lowText.includes("water") || lowText.includes("pipe") || lowText.includes("tap")) {
      return { main: "Water Supply", sub: "Water Issue", department: "Water Department" };
    }
    if (lowText.includes("road") || lowText.includes("pothole") || lowText.includes("street")) {
      return { main: "Roads & Infrastructure", sub: "Road Damage", department: "Public Works Dept" };
    }
    if (lowText.includes("electricity") || lowText.includes("power") || lowText.includes("light")) {
      return { main: "Electricity", sub: "Power Issue", department: "Electricity Board" };
    }
    if (lowText.includes("garbage") || lowText.includes("waste") || lowText.includes("sewage")) {
      return { main: "Sanitation", sub: "Waste Management", department: "Municipal Corporation" };
    }
    return { main: "General", sub: "Civic Issue", department: "Municipal Office" };
  };

  const detectSentiment = (text: string): "positive" | "neutral" | "negative" | "urgent" => {
    const lowText = text.toLowerCase();
    const urgentWords = ["urgent", "emergency", "immediately", "critical", "dangerous", "life-threatening"];
    const negativeWords = ["broken", "damaged", "not working", "failed", "poor", "terrible"];
    
    if (urgentWords.some(word => lowText.includes(word))) return "urgent";
    if (negativeWords.filter(word => lowText.includes(word)).length >= 2) return "negative";
    if (lowText.includes("please") || lowText.includes("request")) return "neutral";
    return "neutral";
  };

  const calculatePriority = (text: string, sentiment: string): "low" | "medium" | "high" | "critical" => {
    if (sentiment === "urgent") return "critical";
    if (sentiment === "negative") return "high";
    if (text.length > 200) return "medium";
    return "medium";
  };

  const calculateUrgencyScore = (text: string, sentiment: string): number => {
    let score = 50;
    if (sentiment === "urgent") score += 40;
    if (sentiment === "negative") score += 20;
    if (text.toLowerCase().includes("days") || text.toLowerCase().includes("weeks")) score += 15;
    return Math.min(score, 100);
  };

  const getEstimatedTime = (priority: string): string => {
    switch (priority) {
      case "critical": return "4-8 hours";
      case "high": return "24-48 hours";
      case "medium": return "3-5 days";
      default: return "5-7 days";
    }
  };

  const generateSuggestions = (category: string, text: string): string[] => {
    const suggestions = [
      "📸 Adding photos will help faster resolution",
      "📍 Precise location helps field teams reach quickly",
    ];
    
    if (category === "Water Supply") {
      suggestions.push("💧 Check if neighbors face same issue for cluster resolution");
      suggestions.push("🔧 Note the nearest valve/pipeline number if visible");
    } else if (category === "Roads & Infrastructure") {
      suggestions.push("📏 Estimate pothole size for accurate repair planning");
      suggestions.push("🚧 Mark if it's causing traffic hazards");
    } else if (category === "Electricity") {
      suggestions.push("⚡ Note meter number for quick identification");
      suggestions.push("🏠 Confirm if it's affecting your building or entire area");
    }
    
    return suggestions;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "urgent": return "bg-red-500";
      case "negative": return "bg-orange-500";
      case "positive": return "bg-green-500";
      default: return "bg-blue-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  useEffect(() => {
    if (description && description.length >= 20) {
      const timer = setTimeout(() => {
        analyzeComplaint();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [description]);

  if (!description || description.length < 20) {
    return (
      <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">AI Analysis Ready</p>
          <p className="text-sm text-gray-400">
            Enter at least 20 characters to activate smart analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
              <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <div>
              <p className="font-semibold text-blue-900">AI Analyzing Your Complaint</p>
              <p className="text-sm text-blue-600">{currentStep}</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 mt-2 text-right">{progress}% complete</p>
        </CardContent>
      </Card>
    );
  }

  if (analysis) {
    return (
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-600" />
              AI Analysis Complete
            </CardTitle>
            <Badge variant="outline" className="bg-green-100 text-green-700">
              {analysis.confidence}% Confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Analysis Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <Target className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <p className="text-xs text-gray-500">Category</p>
              <p className="font-semibold text-sm">{analysis.category}</p>
            </div>
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <Badge variant={getPriorityColor(analysis.priority) as "default" | "secondary" | "destructive" | "outline"} className="mb-1">
                {analysis.priority.toUpperCase()}
              </Badge>
              <p className="text-xs text-gray-500">Priority</p>
            </div>
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <Clock className="h-5 w-5 mx-auto mb-1 text-orange-600" />
              <p className="text-xs text-gray-500">Est. Resolution</p>
              <p className="font-semibold text-sm">{analysis.estimatedResolution}</p>
            </div>
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <Users className="h-5 w-5 mx-auto mb-1 text-purple-600" />
              <p className="text-xs text-gray-500">Similar Cases</p>
              <p className="font-semibold text-sm">{analysis.similarIssues} found</p>
            </div>
          </div>

          {/* Urgency Score */}
          <div className="bg-white/80 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                Urgency Score
              </span>
              <span className="text-sm font-bold">{analysis.urgencyScore}/100</span>
            </div>
            <Progress value={analysis.urgencyScore} className="h-2" />
          </div>

          {/* Department Assignment */}
          <div className="bg-blue-100/50 rounded-lg p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-600">Auto-assigned to</p>
              <p className="font-semibold text-blue-900">{analysis.department}</p>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Detected Keywords</p>
            <div className="flex flex-wrap gap-1">
              {analysis.keywords.map((keyword, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              AI Suggestions
            </p>
            <ul className="space-y-1">
              {analysis.aiSuggestions.map((suggestion, i) => (
                <li key={i} className="text-sm text-yellow-700 flex items-start gap-2">
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Affected Citizens */}
          {analysis.affectedCitizens > 100 && (
            <div className="bg-purple-100/50 rounded-lg p-3 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">
                  Potential Impact: ~{analysis.affectedCitizens.toLocaleString()} citizens
                </p>
                <p className="text-xs text-purple-600">
                  This issue may affect multiple households in the area
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default SmartComplaintAnalyzer;
