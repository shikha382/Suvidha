import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Camera,
  Scan,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RotateCcw,
  Zap,
  MapPin,
  Car,
  Droplets,
  Trash2,
  Construction,
  Lightbulb,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface DetectedIssue {
  type: string;
  confidence: number;
  description: string;
  category: string;
  icon: React.ElementType;
  severity: "low" | "medium" | "high";
  suggestedTitle: string;
  location?: string;
}

const issueTypes = [
  {
    type: "pothole",
    category: "Roads",
    icon: Car,
    descriptions: [
      "Large pothole detected on road surface",
      "Road damage with visible depression",
      "Damaged asphalt requiring immediate repair"
    ],
    severity: "high" as const
  },
  {
    type: "waterlogging",
    category: "Water",
    icon: Droplets,
    descriptions: [
      "Water accumulation detected on road",
      "Drainage issue causing stagnant water",
      "Blocked drain leading to waterlogging"
    ],
    severity: "medium" as const
  },
  {
    type: "garbage",
    category: "Waste",
    icon: Trash2,
    descriptions: [
      "Garbage pile detected in public area",
      "Overflowing waste bin requiring attention",
      "Illegal dumping site identified"
    ],
    severity: "medium" as const
  },
  {
    type: "streetlight",
    category: "Electricity",
    icon: Lightbulb,
    descriptions: [
      "Non-functional streetlight detected",
      "Damaged light pole requiring repair",
      "Missing streetlight in residential area"
    ],
    severity: "medium" as const
  },
  {
    type: "construction",
    category: "Construction",
    icon: Construction,
    descriptions: [
      "Unauthorized construction activity",
      "Construction debris blocking pathway",
      "Safety hazard from construction site"
    ],
    severity: "high" as const
  }
];

interface ARCameraScannerProps {
  onIssueDetected: (issue: DetectedIssue, imageData: string) => void;
  onClose?: () => void;
}

const ARCameraScanner = ({ onIssueDetected, onClose }: ARCameraScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [detectedIssue, setDetectedIssue] = useState<DetectedIssue | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("environment");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing, width: 1280, height: 720 },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;
      setIsScanning(true);
      setHasCamera(true);
    } catch (error) {
      setHasCamera(false);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to use AR scanning.",
        variant: "destructive"
      });
    }
  }, [cameraFacing, toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
    setIsAnalyzing(true);
    setAnalyzeProgress(0);

    // Simulate AI analysis
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 50));
      setAnalyzeProgress(i);
    }

    // Randomly select an issue type for demo
    const randomIssue = issueTypes[Math.floor(Math.random() * issueTypes.length)];
    const randomDescription = randomIssue.descriptions[
      Math.floor(Math.random() * randomIssue.descriptions.length)
    ];

    const detected: DetectedIssue = {
      type: randomIssue.type,
      confidence: 85 + Math.floor(Math.random() * 15),
      description: randomDescription,
      category: randomIssue.category,
      icon: randomIssue.icon,
      severity: randomIssue.severity,
      suggestedTitle: `${randomIssue.category} Issue - ${randomIssue.type.charAt(0).toUpperCase() + randomIssue.type.slice(1)}`,
      location: "Near current location"
    };

    setDetectedIssue(detected);
    setIsAnalyzing(false);
  };

  const confirmIssue = () => {
    if (detectedIssue && capturedImage) {
      onIssueDetected(detectedIssue, capturedImage);
      toast({
        title: "Issue captured!",
        description: "Proceeding to complaint form with detected details.",
      });
    }
  };

  const resetScan = () => {
    setDetectedIssue(null);
    setCapturedImage(null);
    setAnalyzeProgress(0);
  };

  const switchCamera = async () => {
    setCameraFacing(prev => prev === "user" ? "environment" : "user");
    stopCamera();
    setTimeout(startCamera, 300);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      default: return "bg-green-500";
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scan className="h-5 w-5 text-primary" />
            AR Issue Scanner
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Point your camera at an issue for AI detection
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera View */}
        <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning Overlay */}
          {isScanning && !capturedImage && !isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
                
                {/* Scanning line animation */}
                <div className="absolute inset-x-0 h-0.5 bg-primary animate-scan" />
              </div>
            </div>
          )}

          {/* Analyzing Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="font-medium mb-2">AI Analyzing Image...</p>
              <div className="w-48">
                <Progress value={analyzeProgress} className="h-2" />
              </div>
              <p className="text-sm mt-2 text-white/70">Detecting issues...</p>
            </div>
          )}

          {/* Detection Result Overlay */}
          {detectedIssue && !isAnalyzing && (
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={cn("text-white", getSeverityColor(detectedIssue.severity))}>
                    {detectedIssue.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">
                    {detectedIssue.confidence}% confidence
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-white mb-1">
                  <detectedIssue.icon className="h-5 w-5" />
                  <span className="font-semibold">{detectedIssue.category}</span>
                </div>
                <p className="text-white/90 text-sm">{detectedIssue.description}</p>
              </div>
            </div>
          )}

          {/* Camera Switch Button */}
          {isScanning && !capturedImage && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4"
              onClick={switchCamera}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}

          {/* No Camera Message */}
          {!hasCamera && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
              <Camera className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Camera not available</p>
            </div>
          )}
        </div>

        {/* Detection Details Card */}
        {detectedIssue && !isAnalyzing && (
          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-12 w-12 rounded-lg flex items-center justify-center",
                  getSeverityColor(detectedIssue.severity)
                )}>
                  <detectedIssue.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">{detectedIssue.suggestedTitle}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {detectedIssue.location}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-background rounded-lg">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-medium">AI Analysis</span>
                </div>
                <p className="text-sm text-muted-foreground">{detectedIssue.description}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!detectedIssue ? (
            <>
              <Button
                className="flex-1"
                onClick={captureAndAnalyze}
                disabled={!isScanning || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4 mr-2" />
                    Capture & Scan
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="flex-1" onClick={resetScan}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Rescan
              </Button>
              <Button className="flex-1" onClick={confirmIssue}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Use This
              </Button>
            </>
          )}
        </div>

        {/* Tips */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            For best results, ensure good lighting and center the issue in the viewfinder.
          </p>
        </div>
      </CardContent>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 2px); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </Card>
  );
};

export default ARCameraScanner;
