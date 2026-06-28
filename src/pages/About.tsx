import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  Users, 
  Clock, 
  TrendingUp,
  Award,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Brain,
  BarChart3,
  Heart,
  Star,
  Code,
  Database,
  Palette
} from "lucide-react";

const About = () => {
  const achievements = [
    { id: "issues", icon: Trophy, title: "2,847+", subtitle: "Issues Resolved", color: "text-yellow-500" },
    { id: "citizens", icon: Users, title: "15,000+", subtitle: "Active Citizens", color: "text-blue-500" },
    { id: "response", icon: Clock, title: "48hrs", subtitle: "Avg Response Time", color: "text-green-500" },
    { id: "rating", icon: Star, title: "4.8/5", subtitle: "Citizen Rating", color: "text-purple-500" },
  ];

  const features = [
    {
      id: "ai",
      icon: Brain,
      title: "AI-Powered Classification",
      description: "Smart categorization of complaints using NLP for faster routing to appropriate departments",
      tag: "Innovation"
    },
    {
      id: "language",
      icon: Globe,
      title: "Multi-Language Support",
      description: "Support for Hindi, English, and 10+ regional languages for inclusive access",
      tag: "Accessibility"
    },
    {
      id: "mobile",
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for mobile devices with PWA support for offline functionality",
      tag: "Technology"
    },
    {
      id: "security",
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption with Supabase RLS policies and secure authentication",
      tag: "Security"
    },
    {
      id: "realtime",
      icon: Zap,
      title: "Real-Time Updates",
      description: "WebSocket-powered live notifications and status tracking for instant feedback",
      tag: "Performance"
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive dashboards with predictive analytics for proactive governance",
      tag: "Intelligence"
    }
  ];

  const sdgGoals = [
    { id: "sdg9", number: 9, title: "Industry, Innovation & Infrastructure", progress: 85 },
    { id: "sdg11", number: 11, title: "Sustainable Cities & Communities", progress: 90 },
    { id: "sdg16", number: 16, title: "Peace, Justice & Strong Institutions", progress: 80 },
    { id: "sdg17", number: 17, title: "Partnerships for the Goals", progress: 75 },
  ];

  const techStack = [
    { id: "react", name: "React 18", category: "Frontend", icon: Code },
    { id: "typescript", name: "TypeScript", category: "Language", icon: Code },
    { id: "tailwind", name: "Tailwind CSS", category: "Styling", icon: Palette },
    { id: "supabase", name: "Supabase", category: "Backend", icon: Database },
    { id: "postgresql", name: "PostgreSQL", category: "Database", icon: Database },
    { id: "recharts", name: "Recharts", category: "Visualization", icon: BarChart3 },
    { id: "vite", name: "Vite", category: "Build Tool", icon: Zap },
    { id: "shadcn", name: "shadcn/ui", category: "UI Library", icon: Palette },
  ];

  const problemsSolutions = [
    { id: "p1", problem: "Complex, multi-step complaint registration", solution: "3-click complaint submission with smart forms" },
    { id: "p2", problem: "No transparency in resolution status", solution: "Real-time tracking with SMS/Email notifications" },
    { id: "p3", problem: "Long wait times and no estimated dates", solution: "AI-predicted resolution times based on data" },
    { id: "p4", problem: "Limited accessibility for all citizens", solution: "Voice-enabled chatbot in regional languages" },
    { id: "p5", problem: "No data-driven insights for policy", solution: "Comprehensive analytics for governance insights" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-blue-700 text-white py-16 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white backdrop-blur-sm border-0 px-4 py-1.5">
              Government of India Initiative
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              About <span className="text-white/90">SUVIDHA</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Smart Urban Digital Helpdesk for All - Revolutionizing citizen-government interaction 
              through AI-powered civic technology for transparent and efficient governance.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {/* Achievement Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 -mt-12">
          {achievements.map((item) => (
            <Card key={item.id} className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="pt-6">
                <item.icon className={`h-10 w-10 mx-auto mb-3 ${item.color}`} />
                <div className="text-3xl font-bold text-foreground">{item.title}</div>
                <div className="text-muted-foreground">{item.subtitle}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Problem Statement */}
        <Card className="mb-12 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Target className="h-6 w-6" />
              Problem vs Solution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {problemsSolutions.map((item) => (
                <div key={item.id} className="grid md:grid-cols-2 gap-4 p-4 bg-white rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl">❌</span>
                    <span className="text-gray-700">{item.problem}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="text-gray-700">{item.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">🚀 Key Innovations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-10 w-10 text-blue-600" />
                    <Badge variant="outline">{feature.tag}</Badge>
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* UN SDG Alignment */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              UN Sustainable Development Goals Alignment
            </CardTitle>
            <CardDescription>
              SUVIDHA directly contributes to achieving these global goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {sdgGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold mr-2">
                        {goal.number}
                      </span>
                      {goal.title}
                    </span>
                    <span className="text-sm text-gray-600">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">🛠️ Technology Stack</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech) => (
              <div key={tech.id} className="flex items-center gap-2 bg-white border rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
                <tech.icon className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{tech.name}</span>
                <Badge variant="outline" className="text-xs">{tech.category}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Metrics */}
        <Card className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              Projected Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">75%</div>
                <div className="text-gray-700 font-medium">Faster Resolution</div>
                <div className="text-sm text-gray-500">Compared to traditional methods</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">₹2Cr+</div>
                <div className="text-gray-700 font-medium">Annual Savings</div>
                <div className="text-sm text-gray-500">Reduced paperwork & manual processing</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">10L+</div>
                <div className="text-gray-700 font-medium">Citizens Served</div>
                <div className="text-sm text-gray-500">Projected first year reach</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Civic Engagement?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Join us in building a more transparent, efficient, and citizen-centric government.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Heart className="mr-2 h-5 w-5" />
              Support This Project
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
              <Award className="mr-2 h-5 w-5" />
              View Demo
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;