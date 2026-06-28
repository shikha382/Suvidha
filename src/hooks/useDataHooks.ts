import { useState, useEffect, useCallback } from "react";
import {
  fetchCitizenStats,
  fetchComplaints,
  fetchNews,
  fetchDepartments,
  fetchLeaderboard,
  fetchNotifications,
  fetchAnalytics,
  fetchDashboardData,
  trackComplaint,
  fetchMapLocations,
  fetchSuccessStories,
  fetchFeedbackData,
  fetchHeroStats,
  type CitizenStats,
  type Complaint,
  type NewsItem,
  type Department,
  type LeaderboardUser,
  type Notification,
  type DashboardData,
  type TrackedComplaint,
  type MapLocation,
  type SuccessStory,
  type FeedbackItem,
  type FeedbackStats
} from "@/services/dataService";

// Hook for dynamic stats with auto-refresh
export const useDynamicStats = (refreshInterval = 30000) => {
  const [stats, setStats] = useState<CitizenStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchCitizenStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch stats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [refresh, refreshInterval]);

  return { stats, loading, error, refresh };
};

// Hook for complaints with filtering
export const useComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchComplaints();
      setComplaints(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch complaints");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filterByStatus = useCallback((status: string) => {
    if (status === "all") return complaints;
    return complaints.filter(c => c.status === status);
  }, [complaints]);

  const filterByDepartment = useCallback((department: string) => {
    if (department === "all") return complaints;
    return complaints.filter(c => c.department === department);
  }, [complaints]);

  return { complaints, loading, error, refresh, filterByStatus, filterByDepartment };
};

// Hook for news
export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNews();
      setNews(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch news");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pinnedNews = news.filter(n => n.is_pinned);
  const regularNews = news.filter(n => !n.is_pinned);

  return { news, pinnedNews, regularNews, loading, error, refresh };
};

// Hook for departments
export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDepartments();
      setDepartments(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch departments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { departments, loading, error, refresh };
};

// Hook for leaderboard
export const useLeaderboard = (currentUserId?: string, refreshInterval = 60000) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchLeaderboard(currentUserId);
      setLeaderboard(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leaderboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [refresh, refreshInterval]);

  return { leaderboard, loading, error, refresh };
};

// Hook for notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return { notifications, unreadCount, loading, error, refresh, markAsRead, markAllAsRead };
};

// Hook for analytics
export const useAnalytics = (refreshInterval = 60000) => {
  const [analytics, setAnalytics] = useState<Awaited<ReturnType<typeof fetchAnalytics>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [refresh, refreshInterval]);

  return { analytics, loading, error, refresh };
};

// Hook for Dashboard Data
export const useDashboard = (refreshInterval = 30000) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchDashboardData();
      setData(result);
      setError(null);
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [refresh, refreshInterval]);

  return { data, loading, error, refresh };
};

// Hook for Complaint Tracking
export const useComplaintTracking = () => {
  const [complaint, setComplaint] = useState<TrackedComplaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const track = useCallback(async (trackingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await trackComplaint(trackingId);
      if (result) {
        setComplaint(result);
      } else {
        setError("No complaint found with this tracking ID");
        setComplaint(null);
      }
    } catch (err) {
      setError("Failed to track complaint");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setComplaint(null);
    setError(null);
  }, []);

  return { complaint, loading, error, track, clear };
};

// Hook for Map Locations
export const useMapLocations = (refreshInterval = 30000) => {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchMapLocations();
      setLocations(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch locations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [refresh, refreshInterval]);

  const filterByStatus = useCallback((status: string) => {
    if (status === "all") return locations;
    return locations.filter(l => l.status === status);
  }, [locations]);

  return { locations, loading, error, refresh, filterByStatus };
};

// Hook for Success Stories
export const useSuccessStories = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSuccessStories();
      setStories(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch success stories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stories, loading, error, refresh };
};

// Hook for Feedback
export const useFeedback = () => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [recentFeedback, setRecentFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFeedbackData();
      setStats(data.stats);
      setRecentFeedback(data.recentFeedback);
      setError(null);
    } catch (err) {
      setError("Failed to fetch feedback");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, recentFeedback, loading, error, refresh };
};

// Hook for Hero Stats
export const useHeroStats = (refreshInterval = 30000) => {
  const [heroStats, setHeroStats] = useState<{
    issuesResolved: number;
    avgResponseTime: number;
    satisfactionRate: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchHeroStats();
      setHeroStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [refresh, refreshInterval]);

  return { heroStats, loading, refresh };
};
