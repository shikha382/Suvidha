import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Video,
  Building2,
  CheckCircle2,
  Phone,
  Mail,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Confetti from "./Confetti";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Department {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  services: string[];
}

const departments: Department[] = [
  {
    id: "water",
    name: "Water Supply Department",
    address: "Vidhana Soudha, Bangalore",
    phone: "1800-123-4567",
    email: "water@gov.in",
    services: ["Bill Payment", "New Connection", "Complaint Follow-up", "Meter Reading Dispute"]
  },
  {
    id: "electricity",
    name: "BESCOM Office",
    address: "K.R. Circle, Bangalore",
    phone: "1800-425-9004",
    email: "bescom@karnataka.gov.in",
    services: ["Power Connection", "Bill Dispute", "Load Enhancement", "Technical Issues"]
  },
  {
    id: "municipal",
    name: "BBMP Zonal Office",
    address: "Corporation Circle, Bangalore",
    phone: "080-2221-2121",
    email: "bbmp@gov.in",
    services: ["Property Tax", "Building Plan", "Trade License", "Birth/Death Certificate"]
  },
  {
    id: "rto",
    name: "RTO Office",
    address: "Koramangala, Bangalore",
    phone: "080-2553-5555",
    email: "rto@karnataka.gov.in",
    services: ["Driving License", "Vehicle Registration", "Transfer of Ownership", "Fitness Certificate"]
  }
];

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 10;
  const endHour = 17;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (const minutes of ["00", "30"]) {
      const time = `${hour.toString().padStart(2, "0")}:${minutes}`;
      slots.push({
        id: `${date.toDateString()}-${time}`,
        time,
        available: Math.random() > 0.3
      });
    }
  }
  return slots;
};

const AppointmentBooking = () => {
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [appointmentType, setAppointmentType] = useState<"in-person" | "virtual">("in-person");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: ""
  });
  const [isBooked, setIsBooked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const { toast } = useToast();
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  const handleBooking = () => {
    const id = `APT${Date.now().toString().slice(-8)}`;
    setBookingId(id);
    setIsBooked(true);
    setShowConfetti(true);
    
    toast({
      title: "Appointment Booked! 🎉",
      description: `Your booking ID is ${id}`,
    });
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedDept(null);
    setSelectedService("");
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setFormData({ name: "", phone: "", email: "", notes: "" });
    setIsBooked(false);
  };

  // Auto-hide confetti after animation
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  if (isBooked) {
    return (
      <>
        <Confetti trigger={showConfetti} />
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-8 text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Appointment Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Your appointment has been successfully booked
            </p>

            <Card className="bg-muted/50 mb-6">
              <CardContent className="p-4 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Booking ID</span>
                  <Badge variant="outline" className="font-mono">{bookingId}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Department</span>
                  <span className="font-medium">{selectedDept?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Service</span>
                  <span className="font-medium">{selectedService}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Date & Time</span>
                  <span className="font-medium">
                    {selectedDate?.toLocaleDateString()} at {selectedSlot?.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <Badge variant={appointmentType === "virtual" ? "secondary" : "default"}>
                    {appointmentType === "virtual" ? (
                      <><Video className="h-3 w-3 mr-1" /> Virtual</>
                    ) : (
                      <><Building2 className="h-3 w-3 mr-1" /> In-Person</>
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={resetBooking}>
                Book Another
              </Button>
              <Button className="flex-1">
                Add to Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all",
              step >= s 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
            </div>
            {s < 4 && (
              <div className={cn(
                "w-16 h-1 mx-2",
                step > s ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Department */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">Select Department</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {departments.map((dept) => (
              <Card 
                key={dept.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg",
                  selectedDept?.id === dept.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedDept(dept)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {dept.address}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {dept.services.slice(0, 2).map(s => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                        {dept.services.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{dept.services.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={() => setStep(2)} 
              disabled={!selectedDept}
              size="lg"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Select Service & Date */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-6">Choose Service & Date</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDept?.services.map(service => (
                      <SelectItem key={service} value={service}>{service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  <Label>Appointment Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={appointmentType === "in-person" ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setAppointmentType("in-person")}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      In-Person
                    </Button>
                    <Button
                      type="button"
                      variant={appointmentType === "virtual" ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setAppointmentType("virtual")}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Virtual
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => 
                    date < new Date() || 
                    date.getDay() === 0 || 
                    date.getDay() === 6
                  }
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Available Time Slots
                </CardTitle>
                <CardDescription>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {timeSlots.map(slot => (
                    <Button
                      key={slot.id}
                      variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                      disabled={!slot.available}
                      className={cn(
                        "h-12",
                        !slot.available && "opacity-50"
                      )}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button 
              onClick={() => setStep(3)} 
              disabled={!selectedService || !selectedDate || !selectedSlot}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Personal Details */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-6">Your Details</h2>
          
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    placeholder="Enter your phone number"
                    className="pl-10"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea 
                  id="notes"
                  placeholder="Any specific requirements or questions..."
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between max-w-lg mx-auto">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button 
              onClick={() => setStep(4)} 
              disabled={!formData.name || !formData.phone || !formData.email}
            >
              Review Booking
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="space-y-6 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Confirm Your Booking</h2>
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Building2 className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-semibold">{selectedDept?.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedService}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <CalendarDays className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedDate?.toLocaleDateString()}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Clock className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedSlot?.time}</p>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-primary" />
                  <span className="font-medium">Your Details</span>
                </div>
                <p className="text-sm">{formData.name}</p>
                <p className="text-sm text-muted-foreground">{formData.phone} • {formData.email}</p>
              </div>

              <div className="flex items-start gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Important</p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Please carry valid ID proof and any relevant documents for your appointment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button onClick={handleBooking} size="lg">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Booking
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
