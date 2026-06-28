import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Loader2,
  X,
  Sparkles,
  HelpCircle,
  FileText,
  MapPin,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VoiceMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  audioUrl?: string;
  timestamp: Date;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en-IN", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi-IN", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "ta-IN", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te-IN", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "kn-IN", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml-IN", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "bn-IN", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "mr-IN", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu-IN", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa-IN", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" }
];

const mockResponses: Record<string, string> = {
  "complaint": "I can help you submit a complaint. What issue would you like to report? You can say things like 'pothole on my street', 'water supply problem', or 'garbage not collected'.",
  "status": "To check your complaint status, please tell me your tracking ID. It starts with TRK followed by numbers.",
  "help": "I'm your SUVIDHA assistant! I can help you with: submitting complaints, tracking status, finding department contacts, and getting information about services. What would you like to do?",
  "water": "For water-related issues, I can help you report supply problems, quality issues, or billing disputes. Which type of water issue are you facing?",
  "electricity": "For electricity issues, you can report power outages, billing problems, or streetlight issues. What's your concern?",
  "default": "I understand you said: '{input}'. How can I help you with this? You can ask about submitting complaints, checking status, or department contacts."
};

const VoiceAssistant = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [showLanguages, setShowLanguages] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage.code;

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const result = event.results[current];
          const transcriptText = result[0].transcript;
          setTranscript(transcriptText);

          if (result.isFinal) {
            handleUserInput(transcriptText);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            toast({
              title: "Microphone Access Denied",
              description: "Please allow microphone access for voice commands.",
              variant: "destructive"
            });
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [selectedLanguage, toast]);

  // Update recognition language when changed
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage.code;
    }
  }, [selectedLanguage]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: VoiceMessage = {
        id: "greeting",
        role: "assistant",
        text: `Namaste! I'm your SUVIDHA voice assistant. I can help you in ${selectedLanguage.name}. Say "help" to learn what I can do, or describe your issue directly.`,
        timestamp: new Date()
      };
      setMessages([greeting]);
      
      if (voiceEnabled) {
        speak(greeting.text);
      }
    }
  }, [isOpen]);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("");
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speak = (text: string) => {
    if (synthRef.current && voiceEnabled) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage.code;
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleUserInput = async (input: string) => {
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setTranscript("");
    setIsProcessing(true);

    // Simulate AI processing
    await new Promise(r => setTimeout(r, 800));

    // Generate response based on keywords
    let response = mockResponses.default.replace('{input}', input);
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("complaint") || lowerInput.includes("report") || lowerInput.includes("submit")) {
      response = mockResponses.complaint;
    } else if (lowerInput.includes("status") || lowerInput.includes("track") || lowerInput.includes("trk")) {
      response = mockResponses.status;
    } else if (lowerInput.includes("help") || lowerInput.includes("what can")) {
      response = mockResponses.help;
    } else if (lowerInput.includes("water") || lowerInput.includes("पानी")) {
      response = mockResponses.water;
    } else if (lowerInput.includes("electricity") || lowerInput.includes("light") || lowerInput.includes("बिजली")) {
      response = mockResponses.electricity;
    }

    const assistantMessage: VoiceMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      text: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsProcessing(false);

    if (voiceEnabled) {
      speak(response);
    }
  };

  const quickActions = [
    { label: "Submit Complaint", icon: FileText, query: "I want to submit a complaint" },
    { label: "Track Status", icon: Clock, query: "Check my complaint status" },
    { label: "Find Office", icon: MapPin, query: "Find nearest government office" },
    { label: "Get Help", icon: HelpCircle, query: "Help me understand how to use this" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <CardHeader className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Voice Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLanguages(!showLanguages)}
                  className="gap-2"
                >
                  <span className="text-lg">{selectedLanguage.flag}</span>
                  <span className="hidden sm:inline">{selectedLanguage.nativeName}</span>
                  <Languages className="h-4 w-4" />
                </Button>

                {showLanguages && (
                  <Card className="absolute right-0 top-full mt-2 z-10 w-48">
                    <ScrollArea className="h-64">
                      <div className="p-2">
                        {languages.map(lang => (
                          <Button
                            key={lang.code}
                            variant={selectedLanguage.code === lang.code ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => {
                              setSelectedLanguage(lang);
                              setShowLanguages(false);
                            }}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </Card>
                )}
              </div>

              {/* Voice Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
              >
                {voiceEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>

              {/* Close Button */}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}>
                  {message.role === "user" ? "You" : "🤖"}
                </div>
                <div className={cn(
                  "rounded-2xl p-3 max-w-[80%]",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-muted rounded-tl-none"
                )}>
                  <p className="text-sm">{message.text}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  🤖
                </div>
                <div className="rounded-2xl rounded-tl-none bg-muted p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="p-2 border-t">
          <div className="overflow-x-auto">
            <div className="flex gap-2 p-1">
              {quickActions.map(action => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 gap-2"
                  onClick={() => handleUserInput(action.query)}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Voice Input Area */}
        <div className="p-4 border-t bg-muted/50">
          {/* Live Transcript */}
          {(isListening || transcript) && (
            <div className="mb-4 p-3 bg-background rounded-lg min-h-[60px]">
              <div className="flex items-center gap-2 mb-1">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  isListening ? "bg-red-500 animate-pulse" : "bg-gray-400"
                )} />
                <span className="text-xs text-muted-foreground">
                  {isListening ? "Listening..." : "Transcript"}
                </span>
              </div>
              <p className="text-sm">{transcript || "Say something..."}</p>
            </div>
          )}

          {/* Microphone Button */}
          <div className="flex items-center justify-center gap-4">
            {isSpeaking && (
              <Button variant="outline" size="icon" onClick={stopSpeaking}>
                <VolumeX className="h-4 w-4" />
              </Button>
            )}

            <Button
              size="lg"
              className={cn(
                "h-16 w-16 rounded-full transition-all",
                isListening && "bg-red-500 hover:bg-red-600 animate-pulse scale-110"
              )}
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
            >
              {isListening ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>

            <Badge variant={isListening ? "destructive" : "secondary"} className="text-xs">
              {isListening ? "Tap to stop" : "Tap to speak"}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VoiceAssistant;
