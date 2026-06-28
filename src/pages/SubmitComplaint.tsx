import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload, 
  MapPin, 
  Camera, 
  CheckCircle,
  AlertCircle,
  FileText,
  Send,
  Lightbulb,
  Shield,
  Clock,
  Zap,
  Sparkles,
  Video,
  ScanLine
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SmartComplaintAnalyzer from "@/components/SmartComplaintAnalyzer";
import VideoUpload from "@/components/VideoUpload";
import ARCameraScanner from "@/components/ARCameraScanner";

const SubmitComplaint = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [showARScanner, setShowARScanner] = useState(false);
  const [videoData, setVideoData] = useState<{ video: Blob | null; transcript: string | null }>({ video: null, transcript: null });
  
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    title: "",
    description: "",
    location: "",
    pincode: "",
    images: [] as string[],
    priority: "medium",
    phone: "",
    email: ""
  });

  const categories = [
    { value: "water", label: "Water Supply", icon: "💧", subcategories: ["No Water", "Low Pressure", "Water Quality", "Leakage", "Billing Issue"] },
    { value: "electricity", label: "Electricity", icon: "⚡", subcategories: ["Power Cut", "Street Light", "Meter Issue", "Billing Dispute", "Transformer"] },
    { value: "roads", label: "Roads & Transport", icon: "🛣️", subcategories: ["Pothole", "Traffic Signal", "Road Damage", "Footpath Issue", "Drainage"] },
    { value: "sanitation", label: "Sanitation", icon: "🗑️", subcategories: ["Garbage Collection", "Open Dumping", "Sewage Overflow", "Public Toilet", "Pest Control"] },
    { value: "property", label: "Property Tax", icon: "🏠", subcategories: ["Assessment Query", "Payment Issue", "Name Transfer", "New Registration"] },
    { value: "health", label: "Health Services", icon: "🏥", subcategories: ["Hospital Issue", "Ambulance", "Medicine Shortage", "Vaccination", "PHC Complaint"] },
    { value: "others", label: "Others", icon: "📋", subcategories: ["Public Nuisance", "Encroachment", "Noise Pollution", "Other"] }
  ];

  const handleImageUpload = () => {
    // Simulate image upload
    const fakeImages = ["image1.jpg", "image2.jpg"];
    setFormData({ ...formData, images: fakeImages });
    toast({
      title: "Images Uploaded",
      description: "2 images uploaded successfully",
    });
  };

  const handleLocationDetect = () => {
    // Simulate location detection
    setFormData({ 
      ...formData, 
      location: "Near Gandhi Circle, MG Road, Jaipur",
      pincode: "302001"
    });
    toast({
      title: "Location Detected",
      description: "Your location has been auto-detected",
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTrackingId = `SUVIDHA-2026-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;
    setTrackingId(newTrackingId);
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.category && formData.subcategory && formData.title;
      case 2:
        return formData.location && formData.description;
      case 3:
        return formData.phone || formData.email;
      default:
        return false;
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="container py-16 max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Complaint Submitted Successfully!
            </h1>
            <p className="text-gray-600 mb-8">
              Your complaint has been registered and assigned to the relevant department.
            </p>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <p className="text-gray-600 mb-2">Your Tracking ID</p>
              <p className="text-3xl font-bold text-blue-600 mb-4">{trackingId}</p>
              <p className="text-sm text-gray-500">
                Save this ID to track the progress of your complaint
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-white rounded-lg border">
              <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Est. Response</p>
              <p className="text-xs text-gray-500">24-48 hours</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Priority</p>
              <p className="text-xs text-gray-500 capitalize">{formData.priority}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm font-medium">AI Routed</p>
              <p className="text-xs text-gray-500">Smart Assignment</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button variant="outline" className="flex-1" onClick={() => window.location.href = '/track'}>
              Track Complaint
            </Button>
            <Button className="flex-1" onClick={() => {
              setIsSuccess(false);
              setStep(1);
              setFormData({
                category: "", subcategory: "", title: "", description: "",
                location: "", pincode: "", images: [], priority: "medium",
                phone: "", email: ""
              });
            }}>
              Submit Another
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Submit a Complaint
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Report issues in your area and help us improve civic services
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className={step >= 1 ? "text-blue-600 font-medium" : ""}>Category</span>
            <span className={step >= 2 ? "text-blue-600 font-medium" : ""}>Details</span>
            <span className={step >= 3 ? "text-blue-600 font-medium" : ""}>Contact</span>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Step 1: Category Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">Select Category *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <div
                        key={cat.value}
                        onClick={() => setFormData({ ...formData, category: cat.value, subcategory: "" })}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center hover:shadow-md ${
                          formData.category === cat.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <p className="text-sm font-medium mt-2">{cat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.category && (
                  <div>
                    <Label className="text-base font-semibold mb-4 block">Select Issue Type *</Label>
                    <Select
                      value={formData.subcategory}
                      onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose specific issue" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.find(c => c.value === formData.category)?.subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.subcategory && (
                  <div>
                    <Label className="text-base font-semibold mb-2 block">Brief Title *</Label>
                    <Input
                      placeholder="E.g., No water supply in Block A for 3 days"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                )}

                {/* AI Suggestion */}
                {formData.category && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">AI Suggestion</p>
                      <p className="text-sm text-yellow-700">
                        Based on similar complaints in your area, this issue typically gets resolved within 3-5 days.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-2 block">Location *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter your address"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={handleLocationDetect}>
                      <MapPin className="h-4 w-4 mr-2" />
                      Detect
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Pincode</Label>
                    <Input
                      placeholder="Enter pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High - Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">Detailed Description *</Label>
                  <Textarea
                    placeholder="Provide more details about the issue. Include when it started, how it's affecting you, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* AI-Powered Smart Analysis */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <Label className="text-base font-semibold">AI Smart Analysis</Label>
                  </div>
                  <SmartComplaintAnalyzer 
                    description={formData.description} 
                    location={formData.location}
                    onAnalysisComplete={(result) => {
                      // Auto-update form based on AI analysis
                      if (result.priority === "critical" || result.priority === "high") {
                        setFormData(prev => ({ ...prev, priority: "high" }));
                      }
                    }}
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">Upload Images (Optional)</Label>
                  <div 
                    onClick={handleImageUpload}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    {formData.images.length > 0 ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="h-6 w-6" />
                        <span>{formData.images.length} images uploaded</span>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Click to upload photos of the issue</p>
                        <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG up to 5MB each</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Video Upload Section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="h-4 w-4 text-blue-600" />
                    <Label className="text-base font-semibold">Record Video Evidence (Optional)</Label>
                  </div>
                  <VideoUpload 
                    onVideoCapture={(video, transcript) => {
                      setVideoData({ video, transcript });
                      if (transcript) {
                        setFormData(prev => ({
                          ...prev,
                          description: prev.description 
                            ? `${prev.description}\n\n📹 Video Transcript: ${transcript}`
                            : `📹 Video Transcript: ${transcript}`
                        }));
                      }
                      toast({
                        title: "Video captured!",
                        description: "Your video evidence has been attached to the complaint.",
                      });
                    }}
                  />
                </div>

                {/* AR Scanner */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ScanLine className="h-4 w-4 text-purple-600" />
                    <Label className="text-base font-semibold">AI Issue Detection (Optional)</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Point your camera at the issue and let AI automatically detect and categorize it.
                  </p>
                  {showARScanner ? (
                    <ARCameraScanner 
                      onIssueDetected={(issue) => {
                        setFormData(prev => ({
                          ...prev,
                          title: prev.title || issue.suggestedTitle,
                          description: prev.description 
                            ? `${prev.description}\n\n🤖 AI Detection: ${issue.description}`
                            : `🤖 AI Detection: ${issue.description}`,
                          category: issue.category.toLowerCase() || prev.category
                        }));
                        setShowARScanner(false);
                        toast({
                          title: "Issue detected!",
                          description: `AI identified: ${issue.suggestedTitle}`,
                        });
                      }}
                      onClose={() => setShowARScanner(false)}
                    />
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowARScanner(true)}
                      className="w-full gap-2"
                    >
                      <ScanLine className="h-4 w-4" />
                      Open AI Scanner
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Contact Info */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> We'll use this information to send you updates about your complaint.
                  </p>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Complaint Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{categories.find(c => c.value === formData.category)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issue Type:</span>
                      <span className="font-medium">{formData.subcategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium truncate max-w-[200px]">{formData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium truncate max-w-[200px]">{formData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <Badge variant={formData.priority === 'high' ? 'destructive' : 'default'} className="capitalize">
                        {formData.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < 3 ? (
                <Button 
                  onClick={nextStep}
                  disabled={!isStepValid()}
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Complaint
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SubmitComplaint;