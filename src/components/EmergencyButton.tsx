import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  MapPin, 
  Send,
  Loader2,
  CheckCircle,
  Ambulance,
  Flame,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmergencyButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emergencyType, setEmergencyType] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  const emergencyTypes = [
    { id: "medical", label: "Medical Emergency", icon: Ambulance, color: "bg-red-500", number: "108" },
    { id: "fire", label: "Fire Emergency", icon: Flame, color: "bg-orange-500", number: "101" },
    { id: "police", label: "Police/Crime", icon: Shield, color: "bg-blue-500", number: "100" },
    { id: "disaster", label: "Natural Disaster", icon: AlertTriangle, color: "bg-yellow-500", number: "1078" },
  ];

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
          toast({
            title: "📍 Location detected!",
            description: "Your GPS coordinates have been captured.",
          });
        },
        () => {
          toast({
            title: "Location access denied",
            description: "Please enter your location manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSubmit = () => {
    if (!emergencyType || !location || !phone) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate emergency report submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: "🚨 Emergency Reported!",
        description: "Help is on the way. Stay calm and stay safe.",
      });
    }, 2000);
  };

  const resetForm = () => {
    setEmergencyType(null);
    setLocation("");
    setDescription("");
    setPhone("");
    setSubmitted(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-40 right-4 z-50 rounded-full h-14 w-14 bg-red-600 hover:bg-red-700 text-white border-none shadow-lg animate-pulse"
          aria-label="Emergency SOS"
        >
          <AlertTriangle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Emergency SOS
          </DialogTitle>
          <DialogDescription>
            Report an emergency situation immediately. Help will be dispatched to your location.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Emergency Reported!</h3>
            <p className="text-gray-600 mb-4">
              Your emergency has been reported. Help is on the way.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-yellow-800">
                📞 Helpline Numbers:
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <span>Police: <strong>100</strong></span>
                <span>Ambulance: <strong>108</strong></span>
                <span>Fire: <strong>101</strong></span>
                <span>Disaster: <strong>1078</strong></span>
              </div>
            </div>
            <Button onClick={resetForm}>Close</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Emergency Type Selection */}
            <div>
              <Label className="mb-2 block">Type of Emergency *</Label>
              <div className="grid grid-cols-2 gap-2">
                {emergencyTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={emergencyType === type.id ? "default" : "outline"}
                    className={`h-auto py-3 flex flex-col gap-1 ${
                      emergencyType === type.id ? type.color + " text-white" : ""
                    }`}
                    onClick={() => setEmergencyType(type.id)}
                  >
                    <type.icon className="h-5 w-5" />
                    <span className="text-xs">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location *</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="location"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleGetLocation}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="phone"
                  placeholder="Your contact number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Brief Description</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe the emergency situation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Submit Button */}
            <Button 
              className="w-full bg-red-600 hover:bg-red-700" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Reporting Emergency...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Report Emergency Now
                </>
              )}
            </Button>

            {/* Emergency Numbers */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                For immediate help, call:{" "}
                <a href="tel:100" className="text-blue-600 font-bold ml-1">100 (Police)</a>{" | "}
                <a href="tel:108" className="text-red-600 font-bold ml-1">108 (Ambulance)</a>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyButton;
