import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Camera,
  Square,
  Play,
  Pause,
  RotateCcw,
  Upload,
  CheckCircle2,
  Loader2,
  Mic,
  Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadProps {
  onVideoCapture: (file: File, thumbnail: string, transcript?: string) => void;
  maxDuration?: number; // in seconds
  maxFileSize?: number; // in MB
}

const VideoUpload = ({ 
  onVideoCapture, 
  maxDuration = 60, 
  maxFileSize = 50 
}: VideoUploadProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("environment");

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing, width: 1280, height: 720 },
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera and microphone access to record video.",
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
  }, []);

  const startRecording = useCallback(async () => {
    await startCamera();
    
    setTimeout(() => {
      if (streamRef.current) {
        const mediaRecorder = new MediaRecorder(streamRef.current, {
          mimeType: 'video/webm;codecs=vp9,opus'
        });
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const file = new File([blob], `complaint-video-${Date.now()}.webm`, { type: 'video/webm' });
          
          setRecordedVideo(url);
          setVideoFile(file);
          stopCamera();
        };

        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];
        mediaRecorder.start(1000);
        setIsRecording(true);
        setRecordingTime(0);

        timerRef.current = setInterval(() => {
          setRecordingTime(prev => {
            if (prev >= maxDuration - 1) {
              stopRecording();
              return prev;
            }
            return prev + 1;
          });
        }, 1000);
      }
    }, 500);
  }, [startCamera, stopCamera, maxDuration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  }, [isRecording, isPaused]);

  const resetRecording = useCallback(() => {
    stopRecording();
    stopCamera();
    setRecordedVideo(null);
    setVideoFile(null);
    setRecordingTime(0);
    setTranscript("");
    chunksRef.current = [];
  }, [stopRecording, stopCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxFileSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Maximum file size is ${maxFileSize}MB`,
          variant: "destructive"
        });
        return;
      }

      const url = URL.createObjectURL(file);
      setRecordedVideo(url);
      setVideoFile(file);
    }
  };

  const processAndSubmit = async () => {
    if (!videoFile) return;

    setIsProcessing(true);
    
    // Simulate AI transcription
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200));
      setUploadProgress(i);
    }

    // Mock AI transcript
    const mockTranscript = "There is a large pothole on the main road near the bus stop. It's been here for two weeks and is causing traffic issues. Several vehicles have been damaged.";
    setTranscript(mockTranscript);

    // Generate thumbnail (first frame)
    const thumbnail = await generateThumbnail(recordedVideo!);
    
    setIsProcessing(false);
    onVideoCapture(videoFile, thumbnail, mockTranscript);

    toast({
      title: "Video processed successfully!",
      description: "AI has transcribed your video description.",
    });
  };

  const generateThumbnail = async (videoUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.currentTime = 0.5;
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const switchCamera = async () => {
    setCameraFacing(prev => prev === "user" ? "environment" : "user");
    if (streamRef.current && !isRecording) {
      stopCamera();
      await startCamera();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Video className="h-5 w-5 text-primary" />
          Video Complaint
          <Badge variant="secondary" className="ml-auto">
            Max {maxDuration}s
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Preview Area */}
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          {recordedVideo ? (
            <video
              src={recordedVideo}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={cn(
                "w-full h-full object-cover",
                !streamRef.current && "hidden"
              )}
            />
          )}

          {!recordedVideo && !streamRef.current && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Camera className="h-16 w-16" />
              <p className="text-sm">Record or upload a video of the issue</p>
            </div>
          )}

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className={cn(
                "h-3 w-3 rounded-full bg-red-500",
                !isPaused && "animate-pulse"
              )} />
              <Badge variant="destructive">
                {formatTime(recordingTime)} / {formatTime(maxDuration)}
              </Badge>
            </div>
          )}

          {/* Camera Switch Button */}
          {streamRef.current && !isRecording && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4"
              onClick={switchCamera}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Recording Progress */}
        {isRecording && (
          <Progress value={(recordingTime / maxDuration) * 100} className="h-2" />
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-center">
          {!recordedVideo ? (
            <>
              {!isRecording ? (
                <>
                  <Button onClick={startRecording} className="gap-2">
                    <Video className="h-4 w-4" />
                    Start Recording
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Video
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={pauseRecording}
                    className="gap-2"
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-4 w-4" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={stopRecording}
                    className="gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Stop
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={resetRecording}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Re-record
              </Button>
              <Button 
                onClick={processAndSubmit}
                disabled={isProcessing}
                className="gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Use This Video
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {/* Processing Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-primary animate-pulse" />
                AI Transcribing...
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium">
              <Volume2 className="h-4 w-4 text-primary" />
              AI Transcript
            </div>
            <p className="text-sm text-muted-foreground">{transcript}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
