import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Send, 
  User, 
  X,
  MessageCircle
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant = ({ isOpen, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm SUVIDHA AI Assistant. I can help you with:\n\n• Filing complaints and service requests\n• Checking complaint status\n• Understanding government processes\n• Finding the right department\n\nHow can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "File a water complaint",
        "Track my complaint status",
        "Report a road issue",
        "Check service timings"
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickResponses: Record<string, { text: string; suggestions: string[] }> = {
    "file a water complaint": {
      text: "I'll help you file a water complaint. Here's what I need:\n\n1. Your location/address\n2. Type of water issue (no supply, contamination, leakage)\n3. How long has this been a problem?\n4. Any additional details\n\nWould you like me to guide you through the complaint form?",
      suggestions: ["Yes, guide me through", "Show complaint form", "What documents needed?"]
    },
    "track my complaint status": {
      text: "To track your complaint status, I need your complaint ID. It should look like 'C001', 'WTR2024001', etc.\n\nAlternatively, I can look it up using:\n• Your registered phone number\n• Email address\n• Location of the complaint",
      suggestions: ["Enter complaint ID", "Use phone number", "Use email lookup"]
    },
    "report a road issue": {
      text: "I can help you report a road issue. Common road problems include:\n\n🕳️ Potholes\n🚧 Broken streetlights\n🛣️ Damaged signage\n💧 Waterlogging\n🚦 Traffic signal issues\n\nWhich type of road issue would you like to report?",
      suggestions: ["Pothole", "Street light", "Traffic signal", "Waterlogging"]
    },
    "check service timings": {
      text: "Here are the service timings for different departments:\n\n🏢 Municipal Office: 9:00 AM - 5:30 PM\n💧 Water Department: 24/7 Emergency\n⚡ Electricity Board: 9:00 AM - 6:00 PM\n🛣️ Public Works: 8:00 AM - 4:00 PM\n\nEmergency services are available 24/7. Is there a specific department you need to contact?",
      suggestions: ["Emergency contact", "Water dept contact", "Electricity contact", "PWD contact"]
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const lowercaseInput = inputText.toLowerCase();
      let botResponse: Message;

      const matchedResponse = Object.entries(quickResponses).find(([key]) => 
        lowercaseInput.includes(key)
      );

      if (matchedResponse) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: matchedResponse[1].text,
          sender: "bot",
          timestamp: new Date(),
          suggestions: matchedResponse[1].suggestions
        };
      } else if (lowercaseInput.includes("complaint") || lowercaseInput.includes("issue")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "I understand you have a complaint or issue to report. Let me help you find the right solution.\n\nCould you please specify:\n• What type of issue is this? (water, road, electricity, etc.)\n• Where is the location?\n• When did you first notice this problem?",
          sender: "bot",
          timestamp: new Date(),
          suggestions: ["Water issue", "Road problem", "Electricity issue", "Sanitation problem"]
        };
      } else if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "Hello! Great to see you using SUVIDHA. I'm here to make your experience smooth and efficient. What would you like to do today?",
          sender: "bot",
          timestamp: new Date(),
          suggestions: ["File a complaint", "Track status", "Get help", "Service info"]
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "I understand your query. While I'm designed to help with civic services, I might need more specific information to provide the best assistance.\n\nWould you like me to:\n• Connect you with a human agent?\n• Help you navigate to the right service?\n• Provide general information about our services?",
          sender: "bot",
          timestamp: new Date(),
          suggestions: ["Human agent", "Service navigation", "General info", "Start over"]
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => onClose()}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg">SUVIDHA AI Assistant</CardTitle>
              <p className="text-xs text-blue-100">Online • Instant responses</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                  <div className={`flex items-end gap-2 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`rounded-2xl p-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <div className={`text-xs mt-1 ${
                        message.sender === "user" ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion) => (
                        <Button
                          key={`${message.id}-${suggestion}`}
                          variant="outline"
                          size="sm"
                          className="text-xs h-auto py-1 px-2 mr-1"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask me anything about civic services..."
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputText.trim() || isTyping}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;