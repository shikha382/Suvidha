import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, CheckCircle, AlertCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
}

const statusConfig: Record<ComplaintStatus, { label: string; icon: any; color: string }> = {
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

const Status = () => {
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserComplaints(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserComplaints(session.user.id);
      } else {
        setUserComplaints([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserComplaints = async (userId: string) => {
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUserComplaints(data as Complaint[]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsSearching(true);
    setComplaint(null);

    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("tracking_id", trackingId.trim().toUpperCase())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setComplaint(data as Complaint);
      } else {
        toast({
          title: "Not Found",
          description: "No request found with this tracking ID.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Search Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const ComplaintCard = ({ item }: { item: Complaint }) => {
    const status = statusConfig[item.status];
    const StatusIcon = status.icon;

    return (
      <Card className="animate-scale-in">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription className="mt-1">
                <span className="font-mono text-primary">{item.tracking_id}</span>
                <span className="mx-2">•</span>
                {serviceTypeLabels[item.service_type]}
              </CardDescription>
            </div>
            <Badge className={status.color}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
          
          {item.location && (
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-medium">Location:</span> {item.location}
            </p>
          )}

          {item.admin_remarks && (
            <div className="bg-muted p-3 rounded-lg mb-4">
              <p className="text-sm font-medium text-foreground mb-1">Admin Remarks:</p>
              <p className="text-sm text-muted-foreground">{item.admin_remarks}</p>
            </div>
          )}

          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Submitted: {format(new Date(item.created_at), "PPp")}</span>
            <span>Updated: {format(new Date(item.updated_at), "PPp")}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl mb-3">
            Track Your Request
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Enter your tracking ID to check the status of your submitted request.
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-xl mx-auto mb-10">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter Tracking ID (e.g., SUV-20260201-ABC123)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isSearching}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Result */}
        {complaint && (
          <div className="max-w-2xl mx-auto mb-10">
            <h2 className="font-display font-semibold text-lg mb-4">Search Result</h2>
            <ComplaintCard item={complaint} />
          </div>
        )}

        {/* User's Complaints */}
        {user && userComplaints.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display font-semibold text-lg mb-4">Your Requests</h2>
            <div className="space-y-4">
              {userComplaints.map((item) => (
                <ComplaintCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {user && userComplaints.length === 0 && (
          <Card className="max-w-xl mx-auto text-center">
            <CardContent className="py-10">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">You haven't submitted any requests yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Status;
