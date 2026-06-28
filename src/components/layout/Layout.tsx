import { ReactNode, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AIAssistant from "../AIAssistant";
import AccessibilityWidget from "../AccessibilityWidget";
import EmergencyButton from "../EmergencyButton";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900 transition-colors">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      
      {/* Accessibility Widget */}
      <AccessibilityWidget />
      
      {/* Emergency SOS Button */}
      <EmergencyButton />
      
      {/* AI Assistant */}
      {isChatOpen ? (
        <AIAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      ) : (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default Layout;
