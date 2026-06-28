import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, FileText, Droplets, AlertCircle, Wifi, Shield, Play, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useHeroStats } from "@/hooks/useDataHooks";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { heroStats, loading } = useHeroStats(30000);
  const { t, language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20 lg:py-28">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-1.5">
              <Shield className="h-3.5 w-3.5 mr-2" />
              {language === 'hi' ? 'भारत सरकार पहल' : 'Government of India Initiative'}
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30 backdrop-blur-sm px-4 py-1.5">
              <Wifi className="h-3.5 w-3.5 mr-2 animate-pulse" />
              {language === 'hi' ? 'लाइव डेटा • रीयल-टाइम अपडेट' : 'Live Data • Real-time Updates'}
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 backdrop-blur-sm px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              {language === 'hi' ? 'AI-संचालित प्लेटफॉर्म' : 'AI-Powered Platform'}
            </Badge>
          </div>
          
          {/* Main Heading */}
          <h1 className="mb-6 font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              {language === 'hi' ? 'सुविधा' : 'SUVIDHA'}
            </span>
          </h1>
          
          <p className="mb-2 text-xl font-semibold text-blue-200 sm:text-2xl lg:text-3xl">
            {language === 'hi' 
              ? 'स्मार्ट शहरी निगरानी और एकीकृत डिजिटल हेल्पडेस्क' 
              : 'Smart Urban Vigilance & Integrated Digital Helpdesk'}
          </p>
          
          <p className="mb-10 text-lg text-white/70 max-w-2xl mx-auto">
            {language === 'hi'
              ? 'पुरस्कार विजेता सिविक प्लेटफॉर्म - रीयल-टाइम शिकायत ट्रैकिंग, AI-संचालित समाधान और पारदर्शी शासन के लिए लाइव निगरानी।'
              : 'Award-winning civic platform with real-time complaint tracking, AI-powered resolution, and live performance monitoring for transparent governance.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 text-lg px-8 h-14 rounded-xl shadow-xl shadow-white/10 group" asChild>
              <Link to="/services">
                {language === 'hi' ? 'अनुरोध जमा करें' : 'Submit Request'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/5 text-white border-white/20 hover:bg-white/10 text-lg px-8 h-14 rounded-xl backdrop-blur-sm" asChild>
              <Link to="/track">
                <Play className="mr-2 h-5 w-5" />
                {t("hero.cta.track")}
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-purple-500/20 text-purple-200 border-purple-400/30 hover:bg-purple-500/30 text-lg px-8 h-14 rounded-xl backdrop-blur-sm" asChild>
              <Link to="/smart-city">
                <Sparkles className="mr-2 h-5 w-5" />
                {language === 'hi' ? 'AI हब' : 'AI Hub'}
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              {language === 'hi' ? 'सुरक्षित और एन्क्रिप्टेड' : 'Secure & Encrypted'}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              {language === 'hi' ? '24/7 सहायता' : '24/7 Support'}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              {language === 'hi' ? 'बहु-भाषा' : 'Multi-language'}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              {language === 'hi' ? 'मोबाइल फ्रेंडली' : 'Mobile Friendly'}
            </div>
          </div>

          {/* Dynamic Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                    <Skeleton className="h-10 w-24 mx-auto bg-white/20 mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto bg-white/20" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="text-4xl font-bold text-white flex items-center justify-center gap-2">
                    <AnimatedCounter end={heroStats?.issuesResolved || 0} duration={2000} />
                    <span className="text-green-400 text-lg font-normal">+</span>
                  </div>
                  <div className="text-white/60 text-sm mt-1">{language === 'hi' ? 'समस्याएं हल हुईं' : 'Issues Resolved'}</div>
                  <div className="text-green-400 text-xs mt-2 flex items-center justify-center gap-1">
                    <span>↑ 12%</span> {language === 'hi' ? 'इस महीने' : 'this month'}
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="text-4xl font-bold text-white">
                    <AnimatedCounter end={heroStats?.avgResponseTime || 0} duration={1500} /><span className="text-2xl">{language === 'hi' ? 'घंटे' : 'hrs'}</span>
                  </div>
                  <div className="text-white/60 text-sm mt-1">{language === 'hi' ? 'औसत प्रतिक्रिया समय' : 'Avg Response Time'}</div>
                  <div className="text-blue-400 text-xs mt-2">{language === 'hi' ? 'उद्योग में सर्वश्रेष्ठ' : 'Industry Best'}</div>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="text-4xl font-bold text-white">
                    <AnimatedCounter end={heroStats?.satisfactionRate || 0} duration={1500} /><span className="text-2xl">%</span>
                  </div>
                  <div className="text-white/60 text-sm mt-1">{language === 'hi' ? 'संतुष्टि दर' : 'Satisfaction Rate'}</div>
                  <div className="text-yellow-400 text-xs mt-2 flex items-center justify-center gap-1">
                    ⭐ 4.8 {language === 'hi' ? 'रेटिंग' : 'Rating'}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Service Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { icon: FileText, label: language === 'hi' ? "बिल समस्याएं" : "Bill Issues", desc: language === 'hi' ? "संपत्ति और उपयोगिता बिल" : "Property & Utility Bills", color: "from-orange-500 to-red-500" },
            { icon: Droplets, label: language === 'hi' ? "जल आपूर्ति" : "Water Supply", desc: language === 'hi' ? "आपूर्ति और गुणवत्ता" : "Supply & Quality Issues", color: "from-blue-500 to-cyan-500" },
            { icon: AlertCircle, label: language === 'hi' ? "शिकायतें" : "Complaints", desc: language === 'hi' ? "सामान्य नागरिक समस्याएं" : "General Civic Issues", color: "from-purple-500 to-pink-500" },
          ].map((item, index) => (
            <Link
              key={item.label}
              to="/services"
              className="group flex items-center gap-4 rounded-2xl bg-white/5 backdrop-blur-lg p-5 text-white transition-all hover:bg-white/10 hover:scale-[1.02] border border-white/10 hover:border-white/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                <item.icon className="h-7 w-7" />
              </div>
              <div>
                <p className="font-semibold text-lg group-hover:text-white/90">{item.label}</p>
                <p className="text-sm text-white/60">{item.desc}</p>
              </div>
              <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
