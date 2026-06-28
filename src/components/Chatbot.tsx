import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  X,
  Send,
  Loader2,
  User,
  Sparkles,
  HelpCircle,
  FileText,
  MapPin,
  Phone,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  links?: { text: string; url: string }[];
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

// AI Response System
const generateAIResponse = async (message: string): Promise<{ response: string; suggestions?: string[]; links?: { text: string; url: string }[] }> => {
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

  const lowerMessage = message.toLowerCase();

  // Complaint related
  if (lowerMessage.includes("complaint") || lowerMessage.includes("complain") || lowerMessage.includes("issue") || lowerMessage.includes("problem")) {
    if (lowerMessage.includes("submit") || lowerMessage.includes("file") || lowerMessage.includes("register") || lowerMessage.includes("new")) {
      return {
        response: "I can help you submit a complaint! 📝\n\nTo file a new complaint:\n1. Go to Services page\n2. Select the issue category (Water, Electricity, Roads, etc.)\n3. Fill in the details and location\n4. Upload photos if available\n5. Submit and save your tracking ID\n\nYou'll receive updates via SMS and can track progress anytime!",
        suggestions: ["Submit complaint now", "What documents needed?", "Check complaint status"],
        links: [{ text: "Submit Complaint", url: "/services" }]
      };
    }
    if (lowerMessage.includes("track") || lowerMessage.includes("status") || lowerMessage.includes("check")) {
      return {
        response: "To track your complaint status:\n\n1. Go to the Track Status page\n2. Enter your Tracking ID (e.g., TRK12345678)\n3. View real-time status and updates\n\nYou can also see the assigned officer and expected resolution time. Need help finding your tracking ID?",
        suggestions: ["Track my complaint", "Lost tracking ID", "Expected resolution time"],
        links: [{ text: "Track Status", url: "/status" }]
      };
    }
  }

  // Water related
  if (lowerMessage.includes("water")) {
    if (lowerMessage.includes("supply") || lowerMessage.includes("no water") || lowerMessage.includes("shortage")) {
      return {
        response: "For water supply issues:\n\n🚰 **Emergency (No water)**: Call 1800-123-4567\n⏰ **Supply timing**: 6 AM - 9 AM, 5 PM - 8 PM\n📅 **Scheduled cuts**: Check announcements on News page\n\nIf water supply is disrupted, file a complaint and our team will respond within 4 hours.",
        suggestions: ["Report water issue", "Water supply schedule", "Quality complaint"],
        links: [{ text: "Report Water Issue", url: "/services" }]
      };
    }
    if (lowerMessage.includes("bill") || lowerMessage.includes("payment")) {
      return {
        response: "For water bill queries:\n\n💰 Pay online via the Services section\n📱 UPI, Card, Net Banking accepted\n🧾 Dispute a bill? File a complaint with bill copy\n📅 Due date: 15th of every month\n✨ Get 5% discount on autopay!\n\nNeed to see your billing history?",
        suggestions: ["Pay water bill", "Dispute bill amount", "Set up autopay"]
      };
    }
  }

  // Electricity related
  if (lowerMessage.includes("electricity") || lowerMessage.includes("power") || lowerMessage.includes("light")) {
    if (lowerMessage.includes("outage") || lowerMessage.includes("cut") || lowerMessage.includes("no power")) {
      return {
        response: "For power outages:\n\n⚡ **Emergency**: Call 1800-123-4568\n🔧 **Scheduled maintenance**: Check News section\n📊 **Current outages**: View live map on Status page\n\nMost outages are resolved within 2 hours. For longer issues, file a complaint for priority handling.",
        suggestions: ["Report power outage", "Check outage map", "Emergency contact"],
        links: [{ text: "Report Outage", url: "/services" }]
      };
    }
  }

  // Tax related
  if (lowerMessage.includes("tax") || lowerMessage.includes("property")) {
    return {
      response: "Property Tax Information:\n\n📅 **Payment deadline**: March 31, 2026\n💰 **Early bird discount**: 5% before Feb 28\n🏠 **Calculate tax**: Use our online calculator\n📝 **Dispute assessment**: File with property documents\n\nNeed help with tax calculation or payment?",
      suggestions: ["Pay property tax", "Calculate tax", "Dispute assessment"],
      links: [{ text: "Tax Services", url: "/services" }]
    };
  }

  // Rewards related
  if (lowerMessage.includes("reward") || lowerMessage.includes("point") || lowerMessage.includes("badge")) {
    return {
      response: "🏆 **Rewards Program**\n\nEarn points by:\n• Submitting complaints: +50 points\n• Resolved complaints: +100 points\n• Daily login: +10 points\n• Refer friends: +200 points\n\nRedeem for vouchers, movie tickets, and more! You can also compete on the leaderboard.",
      suggestions: ["View my points", "Available rewards", "How to earn more"],
      links: [{ text: "View Rewards", url: "/rewards" }]
    };
  }

  // Contact/Help
  if (lowerMessage.includes("contact") || lowerMessage.includes("phone") || lowerMessage.includes("call") || lowerMessage.includes("helpline")) {
    return {
      response: "📞 **Contact Information**\n\n🆘 Emergency: 112\n💧 Water: 1800-123-4567\n⚡ Electricity: 1800-123-4568\n🛣️ Roads: 1800-123-4569\n📧 Email: support@suvidha.gov.in\n\n⏰ Helpline hours: 24/7 for emergencies, 8 AM - 8 PM for general queries",
      suggestions: ["Submit online complaint", "Find office location", "Chat with agent"]
    };
  }

  // Location/Office
  if (lowerMessage.includes("office") || lowerMessage.includes("location") || lowerMessage.includes("address") || lowerMessage.includes("visit")) {
    return {
      response: "🏛️ **Municipal Corporation Office**\n\n📍 Main Office: Civil Lines, Sector 17\n⏰ Hours: Mon-Sat, 9 AM - 5 PM\n📍 Zone Offices: Available in all major sectors\n\n💡 Tip: Most services are available online - no need to visit!",
      suggestions: ["Find nearest office", "Online services", "Book appointment"],
      links: [{ text: "Office Locations", url: "/about" }]
    };
  }

  // Greetings
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey") || lowerMessage.includes("namaste")) {
    return {
      response: "Namaste! 🙏 I'm your SUVIDHA Assistant.\n\nI can help you with:\n• Filing & tracking complaints\n• Bill payments & tax queries\n• Government schemes & news\n• Rewards & points\n• Contact information\n\nWhat would you like help with today?",
      suggestions: ["Submit a complaint", "Track my complaint", "Pay bills", "View rewards"]
    };
  }

  // Thanks
  if (lowerMessage.includes("thank") || lowerMessage.includes("thanks") || lowerMessage.includes("dhanyawad")) {
    return {
      response: "You're welcome! 😊 Happy to help!\n\nIs there anything else I can assist you with? Remember, you can always reach us at our 24/7 helpline: 1800-123-4567",
      suggestions: ["Submit complaint", "Track status", "No, that's all"]
    };
  }

  // Default response
  return {
    response: "I understand you're asking about: \"" + message + "\"\n\nI can help you with:\n• 📝 Submitting complaints\n• 📍 Tracking complaint status\n• 💰 Bill payments\n• 🏆 Rewards program\n• 📰 News & updates\n• 📞 Contact information\n\nCould you please be more specific about what you need?",
    suggestions: ["Submit complaint", "Track status", "Contact helpline", "View news"]
  };
};

const Chatbot = ({ isOpen, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Namaste! 🙏 I'm SUVIDHA Assistant, your AI-powered helper.\n\nI can assist you with complaints, bill payments, tracking status, and more. How can I help you today?",
      timestamp: new Date(),
      suggestions: ["Submit a complaint", "Track my complaint", "Pay bills", "Contact helpline"]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { response, suggestions, links } = await generateAIResponse(messageText);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        suggestions,
        links
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again or contact our helpline at 1800-123-4567.",
        timestamp: new Date(),
        suggestions: ["Try again", "Contact helpline"]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in globalThis) {
      if (isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ""));
        utterance.lang = "en-IN";
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-24 right-4 z-50 transition-all duration-300 ${isMinimized ? "w-80" : "w-96"}`}>
      <Card className="shadow-2xl border-2 overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-primary to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">SUVIDHA Assistant</CardTitle>
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online • AI Powered
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="h-96 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                      <div className={`flex items-start gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === "user" 
                            ? "bg-primary text-white" 
                            : "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                        }`}>
                          {message.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className={`rounded-2xl px-4 py-2 ${
                            message.role === "user"
                              ? "bg-primary text-white rounded-tr-sm"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm"
                          }`}>
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                          </div>
                          
                          {message.role === "assistant" && (
                            <div className="flex items-center gap-2 mt-1 ml-1">
                              <button 
                                onClick={() => speakMessage(message.content)}
                                className="text-gray-400 hover:text-primary transition-colors"
                              >
                                {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                              </button>
                              <button className="text-gray-400 hover:text-green-500 transition-colors">
                                <ThumbsUp className="h-3 w-3" />
                              </button>
                              <button className="text-gray-400 hover:text-red-500 transition-colors">
                                <ThumbsDown className="h-3 w-3" />
                              </button>
                            </div>
                          )}

                          {/* Links */}
                          {message.links && message.links.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {message.links.map((link, i) => (
                                <a
                                  key={i}
                                  href={link.url}
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                >
                                  <FileText className="h-3 w-3" />
                                  {link.text}
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Suggestions */}
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {message.suggestions.map((suggestion, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleSend(suggestion)}
                                  className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 flex-shrink-0" onClick={() => handleSend("Submit complaint")}>
                  <FileText className="h-3 w-3 mr-1" />
                  Complaint
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 flex-shrink-0" onClick={() => handleSend("Track status")}>
                  <Clock className="h-3 w-3 mr-1" />
                  Track
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 flex-shrink-0" onClick={() => handleSend("Office location")}>
                  <MapPin className="h-3 w-3 mr-1" />
                  Location
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 flex-shrink-0" onClick={() => handleSend("Contact helpline")}>
                  <Phone className="h-3 w-3 mr-1" />
                  Helpline
                </Badge>
              </div>
            </div>

            {/* Input */}
            <CardContent className="p-4 border-t">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Powered by AI • For emergencies call 112
              </p>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

// Floating Chatbot Button
export const ChatbotButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
    >
      <Bot className="h-6 w-6 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
    </button>
  );
};

export default Chatbot;
