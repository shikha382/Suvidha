import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Users,
  Clock,
  Star,
  Phone,
  Mail,
  CheckCircle,
  TrendingUp,
  Search,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Wallet
} from "lucide-react";
import { useDepartments, useAnalytics } from "@/hooks/useDataHooks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import type { Department } from "@/services/dataService";

const departmentIcons: Record<string, string> = {
  "Water Supply": "💧",
  "Electricity": "⚡",
  "Roads & Infrastructure": "🛣️",
  "Sanitation": "🧹",
  "Revenue": "💰",
  "Health": "🏥"
};

const getPerformanceColor = (rate: number) => {
  if (rate >= 90) return "text-green-600";
  if (rate >= 70) return "text-yellow-600";
  return "text-red-600";
};

const getPerformanceBg = (rate: number) => {
  if (rate >= 90) return "bg-green-100 dark:bg-green-900/30";
  if (rate >= 70) return "bg-yellow-100 dark:bg-yellow-900/30";
  return "bg-red-100 dark:bg-red-900/30";
};

// DepartmentCard extracted outside Departments component
interface DepartmentCardProps {
  dept: Department;
  isSelected: boolean;
  onSelect: () => void;
}

const DepartmentCard = ({ dept, isSelected, onSelect }: DepartmentCardProps) => {
  const resolutionRate = Math.round((dept.resolved_complaints / dept.total_complaints) * 100);

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{departmentIcons[dept.name] || "🏛️"}</span>
            <div>
              <CardTitle className="text-lg">{dept.name}</CardTitle>
              <CardDescription className="text-xs">{dept.head}</CardDescription>
            </div>
          </div>
          <Badge className={`${getPerformanceBg(resolutionRate)} ${getPerformanceColor(resolutionRate)} border-0`}>
            {resolutionRate}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dept.total_complaints}</p>
            <p className="text-xs text-muted-foreground">Total Complaints</p>
          </div>
          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{dept.resolved_complaints}</p>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Resolution Rate</span>
            <span className={getPerformanceColor(resolutionRate)}>{resolutionRate}%</span>
          </div>
          <Progress value={resolutionRate} className="h-2" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-blue-500" />
              <span className="text-sm font-semibold">{dept.avg_resolution_time}h</span>
            </div>
            <p className="text-xs text-muted-foreground">Avg Time</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold">{dept.rating}</span>
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <Users className="h-3 w-3 text-purple-500" />
              <span className="text-sm font-semibold">{dept.staff_count}</span>
            </div>
            <p className="text-xs text-muted-foreground">Staff</p>
          </div>
        </div>

        {/* Contact */}
        {isSelected && (
          <div className="pt-4 border-t space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${dept.email}`} className="text-primary hover:underline">
                {dept.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${dept.phone}`} className="text-primary hover:underline">
                {dept.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span>Budget Utilized: {dept.budget_utilized}%</span>
            </div>
            <Button className="w-full mt-2" size="sm">
              File Complaint
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Departments = () => {
  const { departments, loading, refresh } = useDepartments();
  const { analytics } = useAnalytics();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pre-sorted departments for leaderboard
  const sortedDepartments = [...departments];
  sortedDepartments.sort((a, b) => {
    const aScore = (a.resolved_complaints / a.total_complaints) * 50 + a.rating * 10;
    const bScore = (b.resolved_complaints / b.total_complaints) * 50 + b.rating * 10;
    return bScore - aScore;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return `#${rank + 1}`;
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-blue-700 text-white py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-8 w-8" />
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Government Departments
                </h1>
              </div>
              <p className="text-white/80 text-lg">
                View performance metrics and contact information for all departments
              </p>
            </div>
            <Button onClick={refresh} variant="secondary" className="flex items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 -mt-8">
          <Card className="bg-card border-0 shadow-lg">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{departments.length}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Departments</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-10 w-10 text-green-600" />
              <div>
                <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                  {Math.round(departments.reduce((sum, d) => sum + (d.resolved_complaints / d.total_complaints) * 100, 0) / departments.length || 0)}%
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">Avg Resolution</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-10 w-10 text-purple-600" />
              <div>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                  {departments.reduce((sum, d) => sum + d.staff_count, 0)}
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400">Total Staff</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Star className="h-10 w-10 text-yellow-600 fill-yellow-600" />
              <div>
                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
                  {(departments.reduce((sum, d) => sum + d.rating, 0) / departments.length || 0).toFixed(1)}
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Avg Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="grid" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <TabsList>
              <TabsTrigger value="grid">
                <Building2 className="h-4 w-4 mr-2" />
                Cards
              </TabsTrigger>
              <TabsTrigger value="performance">
                <BarChart3 className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="comparison">
                <PieChart className="h-4 w-4 mr-2" />
                Comparison
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Grid View */}
          <TabsContent value="grid">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartments.map(dept => (
                  <DepartmentCard 
                    key={dept.id} 
                    dept={dept}
                    isSelected={selectedDepartment === dept.id}
                    onSelect={() => setSelectedDepartment(selectedDepartment === dept.id ? null : dept.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Performance Chart */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance Comparison</CardTitle>
                <CardDescription>Resolution rates and complaint volumes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.departmentPerformance || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="resolved" fill="#10B981" name="Resolved %" />
                      <Bar dataKey="pending" fill="#F59E0B" name="Pending %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Radar Comparison */}
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Metric Comparison</CardTitle>
                <CardDescription>Compare departments across different metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={departments.map(d => ({
                      name: d.name,
                      resolution: Math.round((d.resolved_complaints / d.total_complaints) * 100),
                      rating: d.rating * 20,
                      speed: Math.max(0, 100 - d.avg_resolution_time),
                      budget: d.budget_utilized,
                      staff: Math.min(100, d.staff_count / 3)
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Performance" dataKey="resolution" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                      <Radar name="Rating" dataKey="rating" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Leaderboard */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Department Leaderboard
            </CardTitle>
            <CardDescription>Ranked by overall performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedDepartments.map((dept, index) => {
                  const resolutionRate = Math.round((dept.resolved_complaints / dept.total_complaints) * 100);

                  return (
                    <div 
                      key={dept.id}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        index < 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10" : "bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="text-2xl font-bold w-10 text-center">
                        {getRankBadge(index)}
                      </div>
                      <span className="text-2xl">{departmentIcons[dept.name] || "🏛️"}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{dept.name}</p>
                        <p className="text-sm text-muted-foreground">{dept.head}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getPerformanceColor(resolutionRate)}`}>
                            {resolutionRate}%
                          </span>
                          {index === 0 && <TrendingUp className="h-4 w-4 text-green-500" />}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          {dept.rating}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Departments;
