import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react";

type Language = "en" | "hi";

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  // Navigation
  "nav.home": { en: "Home", hi: "होम" },
  "nav.services": { en: "Services", hi: "सेवाएं" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "nav.track": { en: "Track", hi: "ट्रैक करें" },
  "nav.submit": { en: "Submit Complaint", hi: "शिकायत दर्ज करें" },
  "nav.about": { en: "About", hi: "हमारे बारे में" },
  "nav.rewards": { en: "Rewards", hi: "पुरस्कार" },
  "nav.login": { en: "Login", hi: "लॉगिन" },
  "nav.signup": { en: "Sign Up", hi: "साइन अप" },
  
  // Hero Section
  "hero.title": { en: "Your Voice Matters", hi: "आपकी आवाज मायने रखती है" },
  "hero.subtitle": { 
    en: "Submit complaints, track progress, and get solutions - all in one place", 
    hi: "शिकायत दर्ज करें, प्रगति ट्रैक करें, और समाधान पाएं - सब एक जगह" 
  },
  "hero.cta.submit": { en: "Submit Complaint", hi: "शिकायत दर्ज करें" },
  "hero.cta.track": { en: "Track Status", hi: "स्थिति ट्रैक करें" },
  
  // Stats
  "stats.complaints": { en: "Complaints Resolved", hi: "शिकायतें हल हुईं" },
  "stats.citizens": { en: "Active Citizens", hi: "सक्रिय नागरिक" },
  "stats.departments": { en: "Departments", hi: "विभाग" },
  "stats.cities": { en: "Cities Covered", hi: "शहर कवर" },
  
  // Services
  "services.title": { en: "Our Services", hi: "हमारी सेवाएं" },
  "services.water": { en: "Water Supply", hi: "जल आपूर्ति" },
  "services.electricity": { en: "Electricity", hi: "बिजली" },
  "services.roads": { en: "Roads & Transport", hi: "सड़कें और परिवहन" },
  "services.sanitation": { en: "Sanitation", hi: "स्वच्छता" },
  "services.health": { en: "Health", hi: "स्वास्थ्य" },
  "services.education": { en: "Education", hi: "शिक्षा" },
  
  // Common
  "common.submit": { en: "Submit", hi: "जमा करें" },
  "common.cancel": { en: "Cancel", hi: "रद्द करें" },
  "common.search": { en: "Search", hi: "खोजें" },
  "common.loading": { en: "Loading...", hi: "लोड हो रहा है..." },
  "common.success": { en: "Success!", hi: "सफलता!" },
  "common.error": { en: "Error", hi: "त्रुटि" },
  "common.pending": { en: "Pending", hi: "लंबित" },
  "common.resolved": { en: "Resolved", hi: "हल किया गया" },
  "common.inProgress": { en: "In Progress", hi: "प्रगति पर" },
  
  // Emergency
  "emergency.title": { en: "Emergency SOS", hi: "आपातकालीन एसओएस" },
  "emergency.report": { en: "Report Emergency", hi: "आपातकाल रिपोर्ट करें" },
  "emergency.help": { en: "Help is on the way", hi: "मदद रास्ते में है" },
  
  // Feedback
  "feedback.title": { en: "Share Your Feedback", hi: "अपनी प्रतिक्रिया साझा करें" },
  "feedback.placeholder": { en: "Tell us about your experience...", hi: "अपने अनुभव के बारे में बताएं..." },
  "feedback.submit": { en: "Submit Feedback", hi: "प्रतिक्रिया जमा करें" },
  
  // About
  "about.title": { en: "About SUVIDHA", hi: "सुविधा के बारे में" },
  "about.mission": { en: "Our Mission", hi: "हमारा मिशन" },
  "about.vision": { en: "Our Vision", hi: "हमारी दृष्टि" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("suvidha-language") as Language;
    return saved || "en";
  });

  const t = useCallback((key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const newLang = prev === "en" ? "hi" : "en";
      localStorage.setItem("suvidha-language", newLang);
      return newLang;
    });
  }, []);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("suvidha-language", lang);
  }, []);

  const value = useMemo(() => ({ 
    language, 
    setLanguage: handleSetLanguage, 
    t, 
    toggleLanguage 
  }), [language, handleSetLanguage, t, toggleLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
