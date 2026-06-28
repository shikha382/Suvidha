// Dynamic Data Service Layer - Simulates real API with realistic data
// In production, replace with actual Supabase/API calls

import { supabase } from "@/integrations/supabase/client";

// Types
export interface Complaint {
  id: string;
  tracking_id: string;
  service_type: string;
  title: string;
  description: string;
  location: string | null;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  admin_remarks: string | null;
  created_at: string;
  updated_at: string;
  priority: "low" | "medium" | "high" | "urgent";
  assigned_to: string;
  department: string;
  citizen_name: string;
  citizen_email: string;
  citizen_phone: string;
  attachments?: string[];
  rating?: number;
  resolution_time?: number; // in hours
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: "announcement" | "scheme" | "emergency" | "update" | "event";
  image_url?: string;
  published_at: string;
  author: string;
  department: string;
  is_pinned: boolean;
  views: number;
  tags: string[];
}

export interface Department {
  id: string;
  name: string;
  head: string;
  email: string;
  phone: string;
  total_complaints: number;
  resolved_complaints: number;
  avg_resolution_time: number;
  rating: number;
  staff_count: number;
  budget_utilized: number;
}

export interface CitizenStats {
  total_citizens: number;
  active_today: number;
  new_this_month: number;
  total_complaints: number;
  resolved_complaints: number;
  avg_resolution_time: number;
  satisfaction_rate: number;
  departments_count: number;
  cities_covered: number;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  points: number;
  city: string;
  avatar: string;
  badges_count: number;
  complaints_resolved: number;
  is_current_user?: boolean;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action_url?: string;
  category: "complaint" | "reward" | "system" | "news";
}

// Simulated real-time data with random variations
const generateRandomVariation = (base: number, variance: number) => {
  return Math.floor(base + (Math.random() - 0.5) * variance * 2);
};

// Dynamic Complaints Data
export const fetchComplaints = async (): Promise<Complaint[]> => {
  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data && data.length > 0) {
      return data as unknown as Complaint[];
    }
  } catch {
    console.log("Using mock data");
  }

  // Return mock data for demo
  const now = new Date();
  return [
    {
      id: "c1",
      tracking_id: `TRK${Date.now().toString().slice(-6)}001`,
      service_type: "water_issue",
      title: "Water pipeline burst on MG Road",
      description: "Major water pipeline burst causing flooding. Immediate attention required. Water flowing onto the road affecting traffic.",
      location: "MG Road, Sector 15, Near Central Park",
      status: "in_progress",
      admin_remarks: "Emergency team dispatched. ETA 2 hours.",
      created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      priority: "urgent",
      assigned_to: "Water Emergency Team A",
      department: "Water Supply",
      citizen_name: "Rajesh Kumar",
      citizen_email: "rajesh.kumar@email.com",
      citizen_phone: "+91-9876543210",
      attachments: ["photo1.jpg", "video1.mp4"]
    },
    {
      id: "c2",
      tracking_id: `TRK${Date.now().toString().slice(-6)}002`,
      service_type: "electricity",
      title: "Power outage in Block C",
      description: "Complete power failure affecting 50+ households since morning. No updates from department.",
      location: "Block C, Sector 22, Residential Area",
      status: "pending",
      admin_remarks: null,
      created_at: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      assigned_to: "Electricity Department",
      department: "Electricity",
      citizen_name: "Priya Sharma",
      citizen_email: "priya.sharma@email.com",
      citizen_phone: "+91-9876543211"
    },
    {
      id: "c3",
      tracking_id: `TRK${Date.now().toString().slice(-6)}003`,
      service_type: "roads",
      title: "Pothole causing accidents",
      description: "Large pothole on main highway exit. Already caused 2 minor accidents today.",
      location: "NH-48 Exit, Near Toll Plaza",
      status: "in_progress",
      admin_remarks: "Road repair team assigned. Temporary barriers placed.",
      created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      priority: "urgent",
      assigned_to: "Road Maintenance Unit",
      department: "Roads & Infrastructure",
      citizen_name: "Amit Singh",
      citizen_email: "amit.singh@email.com",
      citizen_phone: "+91-9876543212",
      rating: 4
    },
    {
      id: "c4",
      tracking_id: `TRK${Date.now().toString().slice(-6)}004`,
      service_type: "sanitation",
      title: "Garbage not collected for 5 days",
      description: "Municipal garbage collection has stopped. Area is becoming unhygienic.",
      location: "Green Park Colony, Ward 12",
      status: "resolved",
      admin_remarks: "Issue resolved. Regular collection schedule restored. Extra cleaning done.",
      created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      priority: "medium",
      assigned_to: "Sanitation Department",
      department: "Sanitation",
      citizen_name: "Sunita Devi",
      citizen_email: "sunita.devi@email.com",
      citizen_phone: "+91-9876543213",
      rating: 5,
      resolution_time: 60
    },
    {
      id: "c5",
      tracking_id: `TRK${Date.now().toString().slice(-6)}005`,
      service_type: "property_tax",
      title: "Incorrect property tax assessment",
      description: "Property tax calculated incorrectly. Building area mentioned is 2x actual size.",
      location: "House No. 45, Model Town",
      status: "pending",
      admin_remarks: null,
      created_at: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      priority: "medium",
      assigned_to: "Revenue Department",
      department: "Revenue",
      citizen_name: "Vikram Mehta",
      citizen_email: "vikram.mehta@email.com",
      citizen_phone: "+91-9876543214"
    },
    {
      id: "c6",
      tracking_id: `TRK${Date.now().toString().slice(-6)}006`,
      service_type: "streetlight",
      title: "Dark street - safety concern",
      description: "5 street lights not working. Area has become unsafe for evening walks.",
      location: "Joggers Park, Sector 18",
      status: "resolved",
      admin_remarks: "All lights repaired. LED upgrades done for better illumination.",
      created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      assigned_to: "Street Lighting Unit",
      department: "Electricity",
      citizen_name: "Neha Gupta",
      citizen_email: "neha.gupta@email.com",
      citizen_phone: "+91-9876543215",
      rating: 5,
      resolution_time: 72
    }
  ];
};

// Dynamic News Data
export const fetchNews = async (): Promise<NewsItem[]> => {
  const now = new Date();
  return [
    {
      id: "n1",
      title: "New Water Conservation Scheme Launched",
      content: "The Municipal Corporation has launched a new water conservation initiative offering 20% rebate on water bills for households implementing rainwater harvesting. Register now to avail benefits.",
      category: "scheme",
      image_url: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800",
      published_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      author: "Water Department",
      department: "Water Supply",
      is_pinned: true,
      views: generateRandomVariation(1500, 200),
      tags: ["water", "conservation", "rebate", "scheme"]
    },
    {
      id: "n2",
      title: "Road Construction Alert: NH-48 Diversion",
      content: "Due to ongoing flyover construction, traffic on NH-48 will be diverted via Sector 10 road from Feb 5-15. Plan your commute accordingly.",
      category: "announcement",
      image_url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800",
      published_at: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      author: "Traffic Police",
      department: "Roads & Infrastructure",
      is_pinned: true,
      views: generateRandomVariation(3200, 400),
      tags: ["traffic", "construction", "diversion"]
    },
    {
      id: "n3",
      title: "Property Tax Payment Deadline Extended",
      content: "Good news for property owners! The deadline for property tax payment has been extended to March 31, 2026. Avail 5% early bird discount if paid before Feb 28.",
      category: "update",
      published_at: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      author: "Revenue Department",
      department: "Revenue",
      is_pinned: false,
      views: generateRandomVariation(2800, 300),
      tags: ["property tax", "deadline", "discount"]
    },
    {
      id: "n4",
      title: "Emergency: Dengue Prevention Drive",
      content: "Rising dengue cases reported. Fogging operations scheduled in all wards. Keep surroundings clean, avoid stagnant water. Report mosquito breeding sites via SUVIDHA app.",
      category: "emergency",
      image_url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800",
      published_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      author: "Health Department",
      department: "Health",
      is_pinned: true,
      views: generateRandomVariation(5500, 800),
      tags: ["dengue", "health", "emergency", "prevention"]
    },
    {
      id: "n5",
      title: "Free Wi-Fi Zones Expanded",
      content: "Smart City initiative expands free Wi-Fi to 50 more public locations including parks, bus stops, and community centers. Download the SUVIDHA app for seamless connection.",
      category: "scheme",
      image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
      published_at: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(),
      author: "IT Department",
      department: "Smart City",
      is_pinned: false,
      views: generateRandomVariation(4200, 500),
      tags: ["wifi", "smart city", "digital"]
    },
    {
      id: "n6",
      title: "Annual Town Hall Meeting - Feb 15",
      content: "Join the Mayor and city officials for the Annual Town Hall Meeting. Voice your concerns, get updates on ongoing projects, and participate in city planning. Register online.",
      category: "event",
      image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      published_at: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      author: "Mayor's Office",
      department: "Administration",
      is_pinned: false,
      views: generateRandomVariation(1800, 200),
      tags: ["town hall", "meeting", "mayor", "citizen engagement"]
    }
  ];
};

// Dynamic Department Data
export const fetchDepartments = async (): Promise<Department[]> => {
  return [
    {
      id: "d1",
      name: "Water Supply",
      head: "Dr. Ramesh Agarwal",
      email: "water@municipality.gov.in",
      phone: "+91-1800-123-4567",
      total_complaints: generateRandomVariation(450, 50),
      resolved_complaints: generateRandomVariation(380, 30),
      avg_resolution_time: generateRandomVariation(48, 12),
      rating: 4.2,
      staff_count: 85,
      budget_utilized: 78
    },
    {
      id: "d2",
      name: "Electricity",
      head: "Er. Suresh Kumar",
      email: "electricity@municipality.gov.in",
      phone: "+91-1800-123-4568",
      total_complaints: generateRandomVariation(380, 40),
      resolved_complaints: generateRandomVariation(350, 25),
      avg_resolution_time: generateRandomVariation(24, 8),
      rating: 4.5,
      staff_count: 120,
      budget_utilized: 85
    },
    {
      id: "d3",
      name: "Roads & Infrastructure",
      head: "Mr. Vijay Malhotra",
      email: "roads@municipality.gov.in",
      phone: "+91-1800-123-4569",
      total_complaints: generateRandomVariation(520, 60),
      resolved_complaints: generateRandomVariation(420, 40),
      avg_resolution_time: generateRandomVariation(72, 24),
      rating: 3.8,
      staff_count: 200,
      budget_utilized: 92
    },
    {
      id: "d4",
      name: "Sanitation",
      head: "Mrs. Kavita Sharma",
      email: "sanitation@municipality.gov.in",
      phone: "+91-1800-123-4570",
      total_complaints: generateRandomVariation(280, 30),
      resolved_complaints: generateRandomVariation(260, 20),
      avg_resolution_time: generateRandomVariation(12, 4),
      rating: 4.6,
      staff_count: 350,
      budget_utilized: 88
    },
    {
      id: "d5",
      name: "Revenue",
      head: "Mr. Ashok Verma",
      email: "revenue@municipality.gov.in",
      phone: "+91-1800-123-4571",
      total_complaints: generateRandomVariation(150, 20),
      resolved_complaints: generateRandomVariation(130, 15),
      avg_resolution_time: generateRandomVariation(120, 48),
      rating: 3.9,
      staff_count: 45,
      budget_utilized: 65
    },
    {
      id: "d6",
      name: "Health",
      head: "Dr. Meera Patel",
      email: "health@municipality.gov.in",
      phone: "+91-1800-123-4572",
      total_complaints: generateRandomVariation(180, 25),
      resolved_complaints: generateRandomVariation(165, 15),
      avg_resolution_time: generateRandomVariation(36, 12),
      rating: 4.4,
      staff_count: 150,
      budget_utilized: 95
    }
  ];
};

// Dynamic Stats
export const fetchCitizenStats = async (): Promise<CitizenStats> => {
  return {
    total_citizens: generateRandomVariation(125000, 5000),
    active_today: generateRandomVariation(8500, 500),
    new_this_month: generateRandomVariation(2200, 200),
    total_complaints: generateRandomVariation(52000, 1000),
    resolved_complaints: generateRandomVariation(48500, 800),
    avg_resolution_time: generateRandomVariation(36, 6),
    satisfaction_rate: generateRandomVariation(94, 3),
    departments_count: 12,
    cities_covered: 25
  };
};

// Dynamic Leaderboard
export const fetchLeaderboard = async (currentUserId?: string): Promise<LeaderboardUser[]> => {
  const users: LeaderboardUser[] = [
    { rank: 1, id: "u1", name: "Amit Kumar", points: generateRandomVariation(15420, 500), city: "Delhi", avatar: "AK", badges_count: 12, complaints_resolved: 45 },
    { rank: 2, id: "u2", name: "Priya Sharma", points: generateRandomVariation(12850, 400), city: "Jaipur", avatar: "PS", badges_count: 10, complaints_resolved: 38 },
    { rank: 3, id: "u3", name: "Rahul Singh", points: generateRandomVariation(11200, 350), city: "Mumbai", avatar: "RS", badges_count: 9, complaints_resolved: 32 },
    { rank: 4, id: "u4", name: "Sneha Patel", points: generateRandomVariation(9800, 300), city: "Ahmedabad", avatar: "SP", badges_count: 8, complaints_resolved: 28 },
    { rank: 5, id: "u5", name: "Vikram Mehta", points: generateRandomVariation(8500, 250), city: "Pune", avatar: "VM", badges_count: 7, complaints_resolved: 25 },
    { rank: 6, id: "u6", name: "Neha Gupta", points: generateRandomVariation(7200, 200), city: "Lucknow", avatar: "NG", badges_count: 6, complaints_resolved: 22 },
    { rank: 7, id: "u7", name: "Arjun Reddy", points: generateRandomVariation(6800, 180), city: "Hyderabad", avatar: "AR", badges_count: 6, complaints_resolved: 20 },
    { rank: 8, id: "u8", name: "Kavya Nair", points: generateRandomVariation(5500, 150), city: "Chennai", avatar: "KN", badges_count: 5, complaints_resolved: 18 },
    { rank: 9, id: "u9", name: "Rohit Joshi", points: generateRandomVariation(4800, 120), city: "Bhopal", avatar: "RJ", badges_count: 4, complaints_resolved: 15 },
    { rank: 10, id: "u10", name: "Ananya Das", points: generateRandomVariation(4200, 100), city: "Kolkata", avatar: "AD", badges_count: 4, complaints_resolved: 14 }
  ];

  if (currentUserId) {
    const userIndex = users.findIndex(u => u.id === currentUserId);
    if (userIndex !== -1) {
      users[userIndex].is_current_user = true;
    }
  }

  const sortedUsers = [...users];
  sortedUsers.sort((a, b) => b.points - a.points);
  return sortedUsers.map((u, i) => ({ ...u, rank: i + 1 }));
};

// Notifications
export const fetchNotifications = async (): Promise<Notification[]> => {
  const now = new Date();
  return [
    {
      id: "notif1",
      type: "success",
      title: "Complaint Resolved!",
      message: "Your complaint TRK123456 about street light has been resolved.",
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      read: false,
      action_url: "/status",
      category: "complaint"
    },
    {
      id: "notif2",
      type: "info",
      title: "New Badge Earned!",
      message: "Congratulations! You've earned the 'Week Warrior' badge for 7-day streak.",
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      action_url: "/rewards",
      category: "reward"
    },
    {
      id: "notif3",
      type: "warning",
      title: "Complaint Update",
      message: "Your water issue complaint is now being processed by the field team.",
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      read: true,
      action_url: "/status",
      category: "complaint"
    },
    {
      id: "notif4",
      type: "info",
      title: "Town Hall Meeting",
      message: "Annual Town Hall Meeting scheduled for Feb 15. Register now!",
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      action_url: "/news",
      category: "news"
    },
    {
      id: "notif5",
      type: "success",
      title: "Points Credited",
      message: "+100 points added for your resolved complaint!",
      timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      read: true,
      action_url: "/rewards",
      category: "reward"
    }
  ];
};

// Real-time Analytics Data
export const fetchAnalytics = async () => {
  const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
  return {
    complaintsOverTime: months.map((month, i) => ({
      month,
      complaints: generateRandomVariation(80 + i * 15, 10),
      resolved: generateRandomVariation(70 + i * 14, 8)
    })),
    statusDistribution: [
      { name: "Resolved", value: generateRandomVariation(48, 5), color: "#10B981" },
      { name: "In Progress", value: generateRandomVariation(28, 4), color: "#3B82F6" },
      { name: "Pending", value: generateRandomVariation(18, 3), color: "#F59E0B" },
      { name: "Rejected", value: generateRandomVariation(6, 2), color: "#EF4444" }
    ],
    departmentPerformance: [
      { department: "Water", resolved: generateRandomVariation(85, 5), pending: generateRandomVariation(15, 3) },
      { department: "Electricity", resolved: generateRandomVariation(92, 4), pending: generateRandomVariation(8, 2) },
      { department: "Roads", resolved: generateRandomVariation(78, 6), pending: generateRandomVariation(22, 4) },
      { department: "Sanitation", resolved: generateRandomVariation(95, 3), pending: generateRandomVariation(5, 2) },
      { department: "Revenue", resolved: generateRandomVariation(72, 8), pending: generateRandomVariation(28, 5) }
    ],
    hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      complaints: i >= 8 && i <= 20 ? generateRandomVariation(15, 5) : generateRandomVariation(3, 2)
    })),
    satisfactionTrend: months.map((month, i) => ({
      month,
      satisfaction: generateRandomVariation(88 + i * 2, 3)
    }))
  };
};

// Submit Complaint
export const submitComplaint = async (data: Partial<Complaint>): Promise<{ success: boolean; tracking_id: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const trackingId = `TRK${Date.now().toString().slice(-8)}`;
  
  // Try Supabase
  try {
    const { error } = await supabase.from("complaints").insert({
      title: data.title || "Untitled Complaint",
      description: data.description || "",
      service_type: (data.service_type as "water_issue" | "bill_issue" | "complaint" | "other") || "other",
      location: data.location || "",
      user_id: "anonymous",
      tracking_id: trackingId,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    if (error) throw error;
  } catch {
    console.log("Using mock submission");
  }
  
  return { success: true, tracking_id: trackingId };
};

// Update Complaint Status (Admin)
export const updateComplaintStatus = async (
  id: string, 
  status: Complaint["status"], 
  remarks: string
): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const { error } = await supabase
      .from("complaints")
      .update({ status, admin_remarks: remarks, updated_at: new Date().toISOString() })
      .eq("id", id);
    
    if (error) throw error;
  } catch {
    console.log("Using mock update");
  }
  
  return { success: true };
};

// ============== NEW DYNAMIC DATA FUNCTIONS ==============

// Dashboard Analytics
export interface DashboardData {
  stats: {
    total_complaints: number;
    resolved: number;
    pending: number;
    critical: number;
    change_total: number;
    change_resolved: number;
    change_pending: number;
    change_critical: number;
  };
  weeklyTrend: { day: string; complaints: number; resolved: number }[];
  categoryDistribution: { name: string; value: number; color: string }[];
  recentComplaints: {
    id: string;
    title: string;
    category: string;
    status: string;
    priority: string;
    time: string;
  }[];
  departmentPerformance: {
    name: string;
    resolved: number;
    pending: number;
    avgTime: string;
  }[];
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const now = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return {
    stats: {
      total_complaints: generateRandomVariation(2847, 100),
      resolved: generateRandomVariation(2156, 80),
      pending: generateRandomVariation(542, 30),
      critical: generateRandomVariation(149, 20),
      change_total: generateRandomVariation(12, 5),
      change_resolved: generateRandomVariation(8, 3),
      change_pending: generateRandomVariation(-3, 2),
      change_critical: generateRandomVariation(15, 5)
    },
    weeklyTrend: days.map((day, i) => ({
      day,
      complaints: generateRandomVariation(45, 15),
      resolved: generateRandomVariation(40, 12)
    })),
    categoryDistribution: [
      { name: "Water Issues", value: generateRandomVariation(45, 5), color: "#3B82F6" },
      { name: "Road Problems", value: generateRandomVariation(30, 4), color: "#10B981" },
      { name: "Garbage Collection", value: generateRandomVariation(15, 3), color: "#F59E0B" },
      { name: "Street Lights", value: generateRandomVariation(10, 2), color: "#EF4444" }
    ],
    recentComplaints: [
      { id: `TRK${Date.now().toString().slice(-6)}1`, title: "Water pipeline burst", category: "Water", status: "in_progress", priority: "high", time: `${generateRandomVariation(2, 1)} hours ago` },
      { id: `TRK${Date.now().toString().slice(-6)}2`, title: "Street light not working", category: "Electricity", status: "pending", priority: "medium", time: `${generateRandomVariation(4, 1)} hours ago` },
      { id: `TRK${Date.now().toString().slice(-6)}3`, title: "Garbage not collected", category: "Sanitation", status: "resolved", priority: "high", time: `${generateRandomVariation(6, 2)} hours ago` },
      { id: `TRK${Date.now().toString().slice(-6)}4`, title: "Pothole on main road", category: "Roads", status: "pending", priority: "low", time: `${generateRandomVariation(8, 2)} hours ago` },
      { id: `TRK${Date.now().toString().slice(-6)}5`, title: "Drainage overflow", category: "Water", status: "in_progress", priority: "high", time: `${generateRandomVariation(12, 3)} hours ago` }
    ],
    departmentPerformance: [
      { name: "Water Dept.", resolved: generateRandomVariation(85, 5), pending: generateRandomVariation(12, 4), avgTime: `${generateRandomVariation(24, 6)} hrs` },
      { name: "Roads Dept.", resolved: generateRandomVariation(78, 5), pending: generateRandomVariation(18, 5), avgTime: `${generateRandomVariation(48, 12)} hrs` },
      { name: "Electricity", resolved: generateRandomVariation(92, 3), pending: generateRandomVariation(8, 3), avgTime: `${generateRandomVariation(12, 4)} hrs` },
      { name: "Sanitation", resolved: generateRandomVariation(88, 4), pending: generateRandomVariation(15, 4), avgTime: `${generateRandomVariation(18, 6)} hrs` }
    ]
  };
};

// Complaint Tracking
export interface TrackedComplaint {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  progress: number;
  description: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  estimatedResolution: string;
  timeline: {
    id: string;
    date: string;
    status: string;
    description: string;
    completed: boolean;
  }[];
  updates: {
    id: string;
    date: string;
    message: string;
  }[];
}

export const trackComplaint = async (trackingId: string): Promise<TrackedComplaint | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .eq("tracking_id", trackingId.toUpperCase())
      .single();
    
    if (!error && data) {
      const progress = data.status === "resolved" ? 100 : data.status === "in_progress" ? 65 : 25;
      return {
        id: data.tracking_id,
        title: data.title,
        category: data.service_type.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
        status: data.status.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
        priority: "Medium",
        progress,
        description: data.description,
        location: data.location || "Not specified",
        createdAt: new Date(data.created_at).toLocaleDateString(),
        updatedAt: new Date(data.updated_at).toLocaleDateString(),
        assignedTo: "Municipal Corporation",
        estimatedResolution: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        timeline: [
          { id: "t1", date: new Date(data.created_at).toLocaleDateString(), status: "Submitted", description: "Complaint registered successfully", completed: true },
          { id: "t2", date: new Date(data.created_at).toLocaleDateString(), status: "Acknowledged", description: "Received by department", completed: true },
          { id: "t3", date: data.status !== "pending" ? new Date(data.updated_at).toLocaleDateString() : "Pending", status: "Assigned", description: "Assigned to field team", completed: data.status !== "pending" },
          { id: "t4", date: data.status === "in_progress" || data.status === "resolved" ? new Date(data.updated_at).toLocaleDateString() : "Pending", status: "In Progress", description: "Work in progress", completed: data.status === "in_progress" || data.status === "resolved" },
          { id: "t5", date: data.status === "resolved" ? new Date(data.updated_at).toLocaleDateString() : "Pending", status: "Resolved", description: data.status === "resolved" ? "Issue resolved" : "Pending completion", completed: data.status === "resolved" }
        ],
        updates: [
          { id: "u1", date: new Date(data.updated_at).toLocaleString(), message: data.admin_remarks || "Your complaint is being processed." }
        ]
      };
    }
  } catch {
    console.log("Using mock tracking data");
  }
  
  // Mock data for demo
  const mockComplaints: Record<string, TrackedComplaint> = {
    "SUVIDHA-2026-001": {
      id: "SUVIDHA-2026-001",
      title: "Water Supply Disruption",
      category: "Water Supply",
      status: "In Progress",
      priority: "High",
      progress: 65,
      description: "Irregular water supply in Sector 15 for the past 3 days.",
      location: "Sector 15, Jaipur, Rajasthan",
      createdAt: "2026-01-28",
      updatedAt: "2026-02-01",
      assignedTo: "Water Department - Jaipur Municipal Corporation",
      estimatedResolution: "2026-02-03",
      timeline: [
        { id: "t1", date: "2026-01-28", status: "Submitted", description: "Complaint registered", completed: true },
        { id: "t2", date: "2026-01-28", status: "Acknowledged", description: "Received by Water Department", completed: true },
        { id: "t3", date: "2026-01-29", status: "Assigned", description: "Assigned to field team", completed: true },
        { id: "t4", date: "2026-01-30", status: "Inspected", description: "Pipeline issue identified", completed: true },
        { id: "t5", date: "2026-02-01", status: "In Progress", description: "Repair work initiated", completed: false },
        { id: "t6", date: "2026-02-03", status: "Resolved", description: "Pending completion", completed: false }
      ],
      updates: [
        { id: "u1", date: "2026-02-01 10:30 AM", message: "Repair team has started work on the pipeline." },
        { id: "u2", date: "2026-01-30 03:15 PM", message: "Inspection revealed damaged underground section." }
      ]
    }
  };
  
  return mockComplaints[trackingId.toUpperCase()] || null;
};

// Map Locations
export interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  status: "pending" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high";
  category: string;
  reportedAt: string;
  description: string;
}

export const fetchMapLocations = async (): Promise<MapLocation[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const categories = ["Water Issues", "Electricity", "Sanitation", "Roads"];
  const statuses: MapLocation["status"][] = ["pending", "in_progress", "resolved"];
  const priorities: MapLocation["priority"][] = ["low", "medium", "high"];
  
  // Generate dynamic locations around Delhi
  return Array.from({ length: generateRandomVariation(15, 5) }, (_, i) => ({
    id: `C${String(i + 1).padStart(3, "0")}`,
    lat: 28.6139 + (Math.random() - 0.5) * 0.05,
    lng: 77.209 + (Math.random() - 0.5) * 0.05,
    title: [
      "Water pipeline burst",
      "Street light not working",
      "Garbage not collected",
      "Pothole on road",
      "Drainage overflow",
      "Illegal construction",
      "Broken water meter",
      "Tree blocking road"
    ][i % 8],
    status: statuses[i % 3],
    priority: priorities[i % 3],
    category: categories[i % 4],
    reportedAt: `${generateRandomVariation(3, 2)} hours ago`,
    description: "Reported by citizen through SUVIDHA portal."
  }));
};

// Success Stories
export interface SuccessStory {
  id: string;
  title: string;
  location: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  impact: {
    complaints: number;
    beneficiaries: number;
    timeToResolve: string;
    costSaved: string;
  };
  testimonial: {
    name: string;
    role: string;
    quote: string;
  };
  date: string;
  verified: boolean;
}

export const fetchSuccessStories = async (): Promise<SuccessStory[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: "story-1",
      title: "From Darkness to Light: Street Lighting Revival",
      location: "Sector 22, Gurugram",
      category: "Electricity",
      beforeImage: "🌑",
      afterImage: "💡",
      description: "After 6 months of darkness, the entire sector now has functional LED street lights. The initiative was triggered by a single complaint that united 200+ residents.",
      impact: {
        complaints: 1,
        beneficiaries: generateRandomVariation(5000, 500),
        timeToResolve: "45 days",
        costSaved: `₹${generateRandomVariation(250000, 50000).toLocaleString()}/year`
      },
      testimonial: {
        name: "Sunita Sharma",
        role: "Resident",
        quote: "We used to be scared to step out after 7 PM. Now children play till 9 PM safely!"
      },
      date: "January 2026",
      verified: true
    },
    {
      id: "story-2",
      title: "Clean Water for 10,000 Families",
      location: "Jaipur Rural District",
      category: "Water Supply",
      beforeImage: "🚱",
      afterImage: "💧",
      description: "A contaminated water supply affecting 10 villages was fixed within 3 weeks after multiple complaints highlighted the pattern through SUVIDHA's map visualization.",
      impact: {
        complaints: generateRandomVariation(47, 10),
        beneficiaries: generateRandomVariation(40000, 5000),
        timeToResolve: "21 days",
        costSaved: `₹${generateRandomVariation(5000000, 1000000).toLocaleString()} (health costs)`
      },
      testimonial: {
        name: "Ramesh Yadav",
        role: "Village Sarpanch",
        quote: "The AI analysis identified the contamination source within hours."
      },
      date: "December 2025",
      verified: true
    },
    {
      id: "story-3",
      title: "Pothole-Free Road in Record Time",
      location: "MG Road, Bangalore",
      category: "Roads",
      beforeImage: "🕳️",
      afterImage: "🛣️",
      description: "A 2km stretch with 34 potholes was completely repaired after citizen photo evidence through SUVIDHA made it impossible to ignore.",
      impact: {
        complaints: generateRandomVariation(156, 30),
        beneficiaries: generateRandomVariation(100000, 20000),
        timeToResolve: "15 days",
        costSaved: `₹${generateRandomVariation(1000000, 200000).toLocaleString()} (vehicle damage)`
      },
      testimonial: {
        name: "Dr. Priya Nair",
        role: "Daily Commuter",
        quote: "My car suspension thanks SUVIDHA! The before-after photos went viral."
      },
      date: "January 2026",
      verified: true
    },
    {
      id: "story-4",
      title: "Garbage-Free Colony Initiative",
      location: "Andheri East, Mumbai",
      category: "Sanitation",
      beforeImage: "🗑️",
      afterImage: "🌳",
      description: "Regular garbage collection schedule was established after tracking complaints showed a pattern of missed collections.",
      impact: {
        complaints: generateRandomVariation(89, 20),
        beneficiaries: generateRandomVariation(15000, 3000),
        timeToResolve: "30 days",
        costSaved: `₹${generateRandomVariation(500000, 100000).toLocaleString()} (health hazards)`
      },
      testimonial: {
        name: "Mohammed Khan",
        role: "Society President",
        quote: "The data dashboard showed BMC exactly where and when they were failing."
      },
      date: "November 2025",
      verified: true
    },
    {
      id: "story-5",
      title: "School Building Safety Renovation",
      location: "Government School, Patna",
      category: "Education",
      beforeImage: "🏚️",
      afterImage: "🏫",
      description: "A crumbling school building that put 500 students at risk was renovated after parents collectively raised concerns through SUVIDHA.",
      impact: {
        complaints: generateRandomVariation(23, 5),
        beneficiaries: generateRandomVariation(500, 50),
        timeToResolve: "60 days",
        costSaved: "Priceless (lives protected)"
      },
      testimonial: {
        name: "Geeta Devi",
        role: "Parent",
        quote: "My children now study in a safe building. SUVIDHA gave us a voice."
      },
      date: "October 2025",
      verified: true
    },
    {
      id: "story-6",
      title: "Senior Citizen Pension Streamlined",
      location: "Delhi NCR Region",
      category: "Social Welfare",
      beforeImage: "📋",
      afterImage: "💰",
      description: "Pension delays affecting 2000+ senior citizens were resolved after complaint patterns revealed bottlenecks.",
      impact: {
        complaints: generateRandomVariation(234, 50),
        beneficiaries: generateRandomVariation(2000, 200),
        timeToResolve: "45 days",
        costSaved: `₹${generateRandomVariation(10000000, 2000000).toLocaleString()} (delayed payments)`
      },
      testimonial: {
        name: "Harbhajan Singh",
        role: "Retired Teacher",
        quote: "At 75, standing in queues was impossible. Now my pension comes on time!"
      },
      date: "January 2026",
      verified: true
    }
  ];
};

// Feedback Data
export interface FeedbackItem {
  id: string;
  complaintId: string;
  rating: number;
  comment: string;
  category: string;
  date: string;
  helpful: number;
  status: "Positive" | "Neutral" | "Negative";
}

export interface FeedbackStats {
  avgRating: number;
  totalFeedback: number;
  satisfactionRate: number;
  responseRate: number;
}

export const fetchFeedbackData = async (): Promise<{ stats: FeedbackStats; recentFeedback: FeedbackItem[] }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    stats: {
      avgRating: Number((generateRandomVariation(42, 3) / 10).toFixed(1)),
      totalFeedback: generateRandomVariation(1247, 100),
      satisfactionRate: generateRandomVariation(87, 5),
      responseRate: generateRandomVariation(94, 3)
    },
    recentFeedback: [
      {
        id: "fb1",
        complaintId: `C${generateRandomVariation(100, 50).toString().padStart(3, "0")}`,
        rating: 5,
        comment: "Excellent response time! The water issue was resolved within 6 hours.",
        category: "Water Issues",
        date: "2 days ago",
        helpful: generateRandomVariation(12, 5),
        status: "Positive"
      },
      {
        id: "fb2",
        complaintId: `C${generateRandomVariation(100, 50).toString().padStart(3, "0")}`,
        rating: 3,
        comment: "Issue was resolved but took longer than expected. Better communication needed.",
        category: "Roads",
        date: "5 days ago",
        helpful: generateRandomVariation(8, 3),
        status: "Neutral"
      },
      {
        id: "fb3",
        complaintId: `C${generateRandomVariation(100, 50).toString().padStart(3, "0")}`,
        rating: 5,
        comment: "Amazing service! The team was professional and efficient.",
        category: "Sanitation",
        date: "1 week ago",
        helpful: generateRandomVariation(15, 5),
        status: "Positive"
      },
      {
        id: "fb4",
        complaintId: `C${generateRandomVariation(100, 50).toString().padStart(3, "0")}`,
        rating: 2,
        comment: "Poor response time. The issue took 2 weeks to resolve.",
        category: "Electricity",
        date: "2 weeks ago",
        helpful: generateRandomVariation(3, 2),
        status: "Negative"
      }
    ]
  };
};

// Submit Feedback
export const submitFeedback = async (data: {
  complaintId: string;
  rating: number;
  comment: string;
  category: string;
}): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

// Hero Stats (for homepage)
export const fetchHeroStats = async (): Promise<{
  issuesResolved: number;
  avgResponseTime: number;
  satisfactionRate: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    issuesResolved: generateRandomVariation(2847, 100),
    avgResponseTime: generateRandomVariation(48, 8),
    satisfactionRate: generateRandomVariation(87, 3)
  };
};
