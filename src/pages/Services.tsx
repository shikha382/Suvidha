import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Droplets, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const serviceTypes = [
  {
    id: "bill_issue",
    icon: FileText,
    title: "Bill Issue",
    description: "Report discrepancies in property tax, water bills, or other municipal charges.",
    color: "border-blue-500 bg-blue-50",
    activeColor: "border-blue-500 bg-blue-100 ring-2 ring-blue-500",
  },
  {
    id: "water_issue",
    icon: Droplets,
    title: "Water Issue",
    description: "Report water supply problems, contamination, or pipeline issues.",
    color: "border-cyan-500 bg-cyan-50",
    activeColor: "border-cyan-500 bg-cyan-100 ring-2 ring-cyan-500",
  },
  {
    id: "complaint",
    icon: AlertCircle,
    title: "General Complaint",
    description: "Submit complaints about any civic issue affecting your area.",
    color: "border-orange-500 bg-orange-50",
    activeColor: "border-orange-500 bg-orange-100 ring-2 ring-orange-500",
  },
];

const complaintSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000, "Description too long"),
  location: z.string().max(200, "Location too long").optional(),
});

const Services = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", location: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [user, setUser] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a request.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!selectedService) {
      toast({
        title: "Select a Service",
        description: "Please select a service type before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Validate form
    const result = complaintSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("complaints")
        .insert({
          user_id: user.id,
          service_type: selectedService as any,
          title: formData.title.trim(),
          description: formData.description.trim(),
          location: formData.location.trim() || null,
        })
        .select("tracking_id")
        .single();

      if (error) throw error;

      setTrackingId(data.tracking_id);
      setIsSuccess(true);
      toast({
        title: "Request Submitted!",
        description: `Your tracking ID is ${data.tracking_id}`,
      });
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="container py-16">
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Request Submitted Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your complaint has been registered. Save your tracking ID to check status.
              </p>
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Tracking ID</p>
                <p className="font-display text-2xl font-bold text-primary">{trackingId}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate("/status")}>Track Status</Button>
                <Button variant="outline" onClick={() => {
                  setIsSuccess(false);
                  setSelectedService(null);
                  setFormData({ title: "", description: "", location: "" });
                }}>
                  Submit Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-blue-700 text-white py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Submit a Service Request
            </h1>
            <p className="text-lg text-white/80">
              Select the type of issue you're facing and provide details. We'll get back to you promptly.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* Service Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto -mt-8">
          {serviceTypes.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg bg-card ${
                selectedService === service.id ? service.activeColor : service.color
              }`}
            >
              <service.icon className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </button>
          ))}
        </div>

        {/* Complaint Form */}
        <Card className="max-w-2xl mx-auto shadow-lg border-0">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>
              {user ? "Fill in the details below" : "Please login to submit a request"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief title of your issue"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={!user}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed description of your issue..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={!user}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  placeholder="Address or landmark"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!user}
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting || !user}
              >
                {isSubmitting ? "Submitting..." : user ? "Submit Request" : "Login to Submit"}
              </Button>

              {!user && (
                <p className="text-center text-sm text-muted-foreground">
                  <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/auth")}>
                    Login or Register
                  </Button>{" "}
                  to submit your request
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Services;
