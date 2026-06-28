import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Users,
  BarChart3,
  Settings,
  Download,
  Search,
  Plus,
  Edit,
  Eye,
  MessageSquare,
  Activity,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

type ComplaintStatus = "pending" | "in_progress" | "resolved" | "rejected";

interface Complaint {
  id: string;
  tracking_id: string;
  service_type: string;
  title: string;
  description: string;
  location: string | null;
  status: ComplaintStatus;
  admin_remarks: string | null;
  created_at: string;
  updated_at: string;
  priority?: "low" | "medium" | "high";
  assigned_to?: string;
  citizen_name?: string;
  citizen_email?: string;
  citizen_phone?: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  role: "citizen" | "admin" | "department_head";
  status: "active" | "suspended";
}

interface StatusConfigItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const statusConfig: Record<ComplaintStatus, StatusConfigItem> = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "In Progress", icon: Loader2, color: "bg-blue-100 text-blue-800" },
  resolved: { label: "Resolved", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", icon: XCircle, color: "bg-red-100 text-red-800" },
};

const serviceTypeLabels: Record<string, string> = {
  bill_issue: "Bill Issue",
  water_issue: "Water Issue",
  complaint: "General Complaint",
  other: "Other",
};

const Admin = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<ComplaintStatus>("pending");
  const [updateRemarks, setUpdateRemarks] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const { toast } = useToast();

  // Mock data for demo purposes
  const mockComplaints: Complaint[] = useMemo(() => [
    {
      id: "1",
      tracking_id: "C001",
      service_type: "water_issue",
      title: "Water pipeline burst on MG Road",
      description: "Major water pipeline burst causing flooding on the main road. Immediate attention required.",
      location: "MG Road, Sector 15",
      status: "in_progress",
      admin_remarks: "Field team dispatched. Expected completion in 6 hours.",
      created_at: "2026-01-30T10:30:00Z",
      updated_at: "2026-01-30T14:20:00Z",
      priority: "high",
      assigned_to: "Water Dept. Team A",
      citizen_name: "Rajesh Kumar",
      citizen_email: "rajesh.kumar@email.com",
      citizen_phone: "+91-9876543210"
    },
    {
      id: "2",
      tracking_id: "C002",
      service_type: "bill_issue",
      title: "Incorrect property tax bill",
      description: "Property tax bill shows wrong amount. Should be ₹15,000 but charged ₹25,000.",
      location: "House No. 45, Block B",
      status: "pending",
      admin_remarks: null,
      created_at: "2026-01-29T16:45:00Z",
      updated_at: "2026-01-29T16:45:00Z",
      priority: "medium",
      assigned_to: "Revenue Department",
      citizen_name: "Priya Sharma",
      citizen_email: "priya.sharma@email.com",
      citizen_phone: "+91-9876543211"
    },
    {
      id: "3",
      tracking_id: "C003",
      service_type: "complaint",
      title: "Street light not working",
      description: "Street light pole #45 has been non-functional for the past 3 days.",
      location: "Main Street, Near Park",
      status: "resolved",
      admin_remarks: "Light bulb replaced. Issue resolved.",
      created_at: "2026-01-28T09:15:00Z",
      updated_at: "2026-01-29T11:30:00Z",
      priority: "low",
      assigned_to: "Electricity Department",
      citizen_name: "Amit Singh",
      citizen_email: "amit.singh@email.com",
      citizen_phone: "+91-9876543212"
    },
    {
      id: "4",
      tracking_id: "C004",
      service_type: "complaint",
      title: "Garbage not collected for 3 days",
      description: "Garbage has not been collected from this location for over 3 days. Bad smell affecting residents.",
      location: "Sector 22, Block C",
      status: "rejected",
      admin_remarks: "Area not under municipal jurisdiction. Forwarded to concerned authority.",
      created_at: "2026-01-27T12:00:00Z",
      updated_at: "2026-01-28T10:15:00Z",
      priority: "high",
      assigned_to: "Sanitation Department",
      citizen_name: "Sunita Devi",
      citizen_email: "sunita.devi@email.com",
      citizen_phone: "+91-9876543213"
    }
  ], []);

  const mockUsers: User[] = useMemo(() => [
    {
      id: "1",
      email: "rajesh.kumar@email.com",
      created_at: "2026-01-15T10:30:00Z",
      last_sign_in_at: "2026-01-31T09:15:00Z",
      role: "citizen",
      status: "active"
    },
    {
      id: "2",
      email: "admin@gov.in",
      created_at: "2025-12-01T10:00:00Z",
      last_sign_in_at: "2026-02-01T08:00:00Z",
      role: "admin",
      status: "active"
    }
  ], []);

  const analyticsData = {
    complaintsOverTime: [
      { month: "Oct", complaints: 45, resolved: 38 },
      { month: "Nov", complaints: 62, resolved: 55 },
      { month: "Dec", complaints: 78, resolved: 71 },
      { month: "Jan", complaints: 95, resolved: 87 }
    ],
    statusDistribution: [
      { name: "Resolved", value: 45, color: "#10B981" },
      { name: "In Progress", value: 25, color: "#3B82F6" },
      { name: "Pending", value: 20, color: "#F59E0B" },
      { name: "Rejected", value: 10, color: "#EF4444" }
    ],
    departmentWorkload: [
      { department: "Water", complaints: 35 },
      { department: "Roads", complaints: 28 },
      { department: "Electricity", complaints: 22 },
      { department: "Sanitation", complaints: 18 }
    ]
  };

  const stats = [
    {
      title: "Total Complaints",
      value: mockComplaints.length.toString(),
      change: "+12%",
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      title: "Resolved",
      value: mockComplaints.filter(c => c.status === "resolved").length.toString(),
      change: "+8%",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Pending",
      value: mockComplaints.filter(c => c.status === "pending").length.toString(),
      change: "-3%",
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Active Users",
      value: mockUsers.filter(u => u.status === "active").length.toString(),
      change: "+15%",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setComplaints(mockComplaints);
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, [mockComplaints, mockUsers]);

  const handleUpdateComplaint = async (complaintId: string, newStatus: ComplaintStatus, remarks: string) => {
    try {
      const updatedComplaints = complaints.map(complaint => 
        complaint.id === complaintId 
          ? { 
              ...complaint, 
              status: newStatus, 
              admin_remarks: remarks,
              updated_at: new Date().toISOString()
            }
          : complaint
      );
      
      setComplaints(updatedComplaints);
      setIsUpdateDialogOpen(false);
      setSelectedComplaint(null);
      setUpdateRemarks("");
      
      toast({
        title: "✅ Complaint updated successfully",
        description: `Status changed to ${statusConfig[newStatus].label}`,
      });
    } catch (err) {
      console.error("Update failed:", err);
      toast({
        title: "Update failed",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const openUpdateDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status);
    setUpdateRemarks(complaint.admin_remarks || "");
    setIsUpdateDialogOpen(true);
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.citizen_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage complaints, users, and system settings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => toast({ title: "📊 Report exported!", description: "Monthly admin report downloaded successfully." })}>
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="gap-2" onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
              toast({ title: "🔄 Data refreshed!", description: "Dashboard data updated successfully." });
            }}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockComplaints.slice(0, 3).map((complaint) => (
                      <div key={complaint.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium">{complaint.title}</p>
                          <p className="text-sm text-gray-600">{complaint.tracking_id} • {complaint.citizen_name}</p>
                        </div>
                        <Badge className={statusConfig[complaint.status].color}>
                          {statusConfig[complaint.status].label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start gap-2" variant="outline" onClick={() => toast({ title: "🔔 Announcement created!", description: "System maintenance notice published." })}>
                    <Plus className="h-4 w-4" />
                    Create Announcement
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline" onClick={() => toast({ title: "👥 Department access", description: "Department management opened." })}>
                    <Users className="h-4 w-4" />
                    Manage Departments
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline" onClick={() => toast({ title: "⚙️ Settings updated", description: "System configuration accessed." })}>
                    <Settings className="h-4 w-4" />
                    System Settings
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline" onClick={() => toast({ title: "📊 Report generated!", description: "Comprehensive system report created successfully." })}>
                    <BarChart3 className="h-4 w-4" />
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="complaints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Complaint Management</CardTitle>
                <CardDescription>Manage and track all citizen complaints with full CRUD operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by ID, title, or citizen name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title & Location</TableHead>
                        <TableHead>Citizen Info</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComplaints.map((complaint) => {
                        const StatusIcon = statusConfig[complaint.status].icon;
                        return (
                          <TableRow key={complaint.id} className="hover:bg-gray-50">
                            <TableCell className="font-mono font-medium text-blue-600">
                              {complaint.tracking_id}
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div>
                                <div className="font-medium truncate" title={complaint.title}>
                                  {complaint.title}
                                </div>
                                <div className="text-sm text-gray-500">{complaint.location}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{complaint.citizen_name}</div>
                                <div className="text-sm text-gray-500">{complaint.citizen_email}</div>
                                <div className="text-sm text-gray-400">{complaint.citizen_phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {serviceTypeLabels[complaint.service_type] || complaint.service_type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(complaint.priority)}>
                                {complaint.priority?.toUpperCase() || "LOW"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusConfig[complaint.status].color}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {statusConfig[complaint.status].label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(complaint.created_at), "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openUpdateDialog(complaint)}
                                  title="Update complaint status"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    toast({
                                      title: `📋 Complaint ${complaint.tracking_id}`,
                                      description: complaint.description,
                                    });
                                  }}
                                  title="View full details"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  Showing {filteredComplaints.length} of {complaints.length} complaints
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>👥 User Management</CardTitle>
                <CardDescription>Manage citizen accounts and administrator privileges</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email Address</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Account Status</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "outline"}>
                            {user.role === "admin" ? "🛡️ Administrator" : "👤 Citizen"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {user.status === "active" ? "✅ Active" : "❌ Suspended"}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(user.created_at), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), "MMM dd, yyyy HH:mm") : "Never"}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => toast({ 
                              title: "👤 User Management", 
                              description: `Managing settings for ${user.email}` 
                            })}
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📈 Complaints Trend</CardTitle>
                  <CardDescription>Monthly complaint volume and resolution rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.complaintsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="complaints" stroke="#3B82F6" strokeWidth={2} name="Complaints" />
                      <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🥧 Status Distribution</CardTitle>
                  <CardDescription>Current complaint status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.statusDistribution.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>🏢 Department Workload</CardTitle>
                  <CardDescription>Complaint distribution across different departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.departmentWorkload}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="complaints" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>🔄 Update Complaint Status</DialogTitle>
              <DialogDescription>
                Update status and add administrative remarks for complaint <strong>{selectedComplaint?.tracking_id}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="status">New Status</Label>
                <Select value={updateStatus} onValueChange={(value: ComplaintStatus) => setUpdateStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">⏳ Pending Review</SelectItem>
                    <SelectItem value="in_progress">🔄 In Progress</SelectItem>
                    <SelectItem value="resolved">✅ Resolved</SelectItem>
                    <SelectItem value="rejected">❌ Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="remarks">Admin Remarks</Label>
                <Textarea
                  id="remarks"
                  value={updateRemarks}
                  onChange={(e) => setUpdateRemarks(e.target.value)}
                  placeholder="Add detailed remarks about the status update, actions taken, or reasons for rejection..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => selectedComplaint && handleUpdateComplaint(selectedComplaint.id, updateStatus, updateRemarks)}>
                Update Complaint
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Admin;