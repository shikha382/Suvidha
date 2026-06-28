import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ui/error-boundary";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Status from "./pages/Status";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import Feedback from "./pages/Feedback";
import About from "./pages/About";
import Track from "./pages/Track";
import SubmitComplaint from "./pages/SubmitComplaint";
import Rewards from "./pages/Rewards";
import SuccessStories from "./pages/SuccessStories";
import News from "./pages/News";
import Departments from "./pages/Departments";
import SmartCity from "./pages/SmartCity";
import GamificationHub from "./pages/GamificationHub";
import NotFound from "./pages/NotFound";
// Advanced Full-Stack Pages
import BlockchainPage from "./pages/Blockchain";
import PaymentsPage from "./pages/Payments";
import DocumentsPage from "./pages/Documents";
import LiveCityPage from "./pages/LiveCity";
import AnalyticsPage from "./pages/Analytics";
import Chatbot, { ChatbotButton } from "./components/Chatbot";
import VoiceAssistant from "./components/VoiceAssistantModal";
import { Button } from "./components/ui/button";
import { Mic } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/status" element={<Status />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/track" element={<Track />} />
                  <Route path="/submit" element={<SubmitComplaint />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/gamification" element={<GamificationHub />} />
                  <Route path="/stories" element={<SuccessStories />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route path="/smart-city" element={<SmartCity />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin" element={<Admin />} />
                  {/* Advanced Full-Stack Routes */}
                  <Route path="/blockchain" element={<BlockchainPage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/live-city" element={<LiveCityPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* Voice Assistant Button */}
                <Button
                  size="icon"
                  className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 z-40"
                  onClick={() => setIsVoiceOpen(true)}
                >
                  <Mic className="h-6 w-6 text-white" />
                </Button>

                {/* AI Chatbot */}
                <ChatbotButton onClick={() => setIsChatOpen(true)} />
                <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                
                {/* Voice Assistant Modal */}
                <VoiceAssistant isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
