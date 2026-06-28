import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Volume2,
  VolumeX,
  Clock,
  MapPin,
  AlertTriangle,
  CloudRain,
  Zap,
  CheckCircle2,
  Settings,
  BellRing,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  email: boolean;
  push: boolean;
  sms: boolean;
  category: "complaints" | "alerts" | "community" | "updates";
}

const defaultSettings: NotificationSetting[] = [
  {
    id: "complaint-status",
    label: "Complaint Status Updates",
    description: "Get notified when your complaint status changes",
    icon: CheckCircle2,
    email: true,
    push: true,
    sms: true,
    category: "complaints"
  },
  {
    id: "complaint-assigned",
    label: "Officer Assignment",
    description: "When an officer is assigned to your complaint",
    icon: MessageSquare,
    email: true,
    push: true,
    sms: false,
    category: "complaints"
  },
  {
    id: "complaint-resolved",
    label: "Resolution Confirmation",
    description: "When your complaint is marked as resolved",
    icon: CheckCircle2,
    email: true,
    push: true,
    sms: true,
    category: "complaints"
  },
  {
    id: "weather-alerts",
    label: "Weather Alerts",
    description: "Severe weather warnings for your area",
    icon: CloudRain,
    email: false,
    push: true,
    sms: true,
    category: "alerts"
  },
  {
    id: "emergency-alerts",
    label: "Emergency Notifications",
    description: "Critical alerts affecting your locality",
    icon: AlertTriangle,
    email: true,
    push: true,
    sms: true,
    category: "alerts"
  },
  {
    id: "maintenance",
    label: "Scheduled Maintenance",
    description: "Planned service interruptions in your area",
    icon: Clock,
    email: true,
    push: true,
    sms: false,
    category: "alerts"
  },
  {
    id: "community-upvotes",
    label: "Upvotes & Reactions",
    description: "When someone upvotes your complaint",
    icon: Zap,
    email: false,
    push: true,
    sms: false,
    category: "community"
  },
  {
    id: "community-comments",
    label: "Comments & Replies",
    description: "When someone comments on your post",
    icon: MessageSquare,
    email: true,
    push: true,
    sms: false,
    category: "community"
  },
  {
    id: "area-issues",
    label: "Nearby Issues",
    description: "New complaints reported in your area",
    icon: MapPin,
    email: false,
    push: true,
    sms: false,
    category: "community"
  },
  {
    id: "weekly-digest",
    label: "Weekly Digest",
    description: "Summary of activity and resolved issues",
    icon: Mail,
    email: true,
    push: false,
    sms: false,
    category: "updates"
  },
  {
    id: "new-features",
    label: "New Features & Updates",
    description: "Learn about new platform features",
    icon: Bell,
    email: true,
    push: false,
    sms: false,
    category: "updates"
  }
];

const NotificationPreferences = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [quietHours, setQuietHours] = useState({ enabled: false, start: "22:00", end: "07:00" });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  const updateSetting = (id: string, channel: "email" | "push" | "sms", value: boolean) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, [channel]: value } : s
    ));
  };

  const toggleAllForCategory = (category: string, channel: "email" | "push" | "sms", value: boolean) => {
    setSettings(prev => prev.map(s => 
      s.category === category ? { ...s, [channel]: value } : s
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    toast({
      title: "Preferences saved!",
      description: "Your notification settings have been updated.",
    });
  };

  const getCategorySettings = (category: string) => 
    settings.filter(s => s.category === category);

  const categories = [
    { id: "complaints", label: "Complaints", icon: MessageSquare },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
    { id: "community", label: "Community", icon: MapPin },
    { id: "updates", label: "Updates", icon: Bell }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BellRing className="h-6 w-6 text-primary" />
            Notification Preferences
          </h2>
          <p className="text-muted-foreground">Choose how and when you want to be notified</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-primary" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label className="text-base">Notification Sound</Label>
                <p className="text-sm text-muted-foreground">Play sound for new notifications</p>
              </div>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <Label className="text-base">Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">Pause non-urgent notifications</p>
              </div>
            </div>
            <Switch 
              checked={quietHours.enabled} 
              onCheckedChange={(v) => setQuietHours({...quietHours, enabled: v})} 
            />
          </div>

          {quietHours.enabled && (
            <div className="flex items-center gap-4 ml-8 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Label>From</Label>
                <Select 
                  value={quietHours.start} 
                  onValueChange={(v) => setQuietHours({...quietHours, start: v})}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 24}, (_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {`${i.toString().padStart(2, '0')}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label>To</Label>
                <Select 
                  value={quietHours.end} 
                  onValueChange={(v) => setQuietHours({...quietHours, end: v})}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 24}, (_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {`${i.toString().padStart(2, '0')}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Channel Legend */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Mail className="h-4 w-4" /> Email
        </span>
        <span className="flex items-center gap-2">
          <Bell className="h-4 w-4" /> Push
        </span>
        <span className="flex items-center gap-2">
          <Smartphone className="h-4 w-4" /> SMS
        </span>
      </div>

      {/* Notification Categories */}
      <Tabs defaultValue="complaints" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat.id} value={cat.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{cat.label} Notifications</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">All:</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => toggleAllForCategory(cat.id, "email", true)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => toggleAllForCategory(cat.id, "push", true)}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => toggleAllForCategory(cat.id, "sms", true)}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getCategorySettings(cat.id).map(setting => (
                    <div 
                      key={setting.id}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <setting.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <Label className="text-base">{setting.label}</Label>
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <Switch 
                            checked={setting.email}
                            onCheckedChange={(v) => updateSetting(setting.id, "email", v)}
                          />
                          <Mail className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Switch 
                            checked={setting.push}
                            onCheckedChange={(v) => updateSetting(setting.id, "push", v)}
                          />
                          <Bell className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Switch 
                            checked={setting.sms}
                            onCheckedChange={(v) => updateSetting(setting.id, "sms", v)}
                          />
                          <Smartphone className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Emergency Override Notice */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Emergency Override</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Critical emergency alerts will always be delivered regardless of your preferences or quiet hours settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPreferences;
