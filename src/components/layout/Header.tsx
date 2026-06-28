import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Shield, Brain, ChevronDown, Phone, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import NotificationCenter from "../NotificationCenter";
import ThemeToggle from "../ThemeToggle";
import LanguageToggle from "../LanguageToggle";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => checkAdminRole(session.user.id), 0);
      } else {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    setIsAdmin(!!data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate('/');
  };

  const mainNavLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/services", label: t("nav.services") },
    { path: "/submit", label: t("nav.submit") },
    { path: "/track", label: t("nav.track") },
    { path: "/smart-city", label: language === 'hi' ? "स्मार्ट सिटी" : "Smart City", isNew: true },
  ];

  const moreLinks = [
    { path: "/news", label: language === 'hi' ? "समाचार" : "News & Updates" },
    { path: "/departments", label: language === 'hi' ? "विभाग" : "Departments" },
    { path: "/gamification", label: language === 'hi' ? "🏆 पुरस्कार और बैज" : "🏆 Rewards & Badges", isNew: true },
    { path: "/about", label: t("nav.about") },
    { path: "/blockchain", label: language === 'hi' ? "🔗 ब्लॉकचेन ट्रैकर" : "🔗 Blockchain Tracker", isNew: true },
    { path: "/payments", label: language === 'hi' ? "💳 भुगतान और पुरस्कार" : "💳 Payments & Rewards", isNew: true },
    { path: "/documents", label: language === 'hi' ? "📄 दस्तावेज़ सत्यापन" : "📄 Document Verification", isNew: true },
    { path: "/live-city", label: language === 'hi' ? "🌆 लाइव सिटी" : "🌆 Live City Dashboard", isNew: true },
    { path: "/analytics", label: language === 'hi' ? "📊 विश्लेषण" : "📊 Analytics", isNew: true },
  ];

  const authenticatedLinks = [
    { path: "/dashboard", label: t("nav.dashboard") },
    { path: "/feedback", label: language === 'hi' ? "प्रतिक्रिया" : "Feedback" },
    { path: "/map", label: language === 'hi' ? "मानचित्र" : "Map View" },
    { path: "/stories", label: language === 'hi' ? "कहानियां" : "Stories" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-primary text-white text-xs">
        <div className="container flex justify-between items-center py-1.5">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Helpline: 1800-XXX-XXXX (Toll Free)
            </span>
            <span>|</span>
            <span>Monday - Saturday: 9:00 AM - 6:00 PM</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:underline flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              Help Center
            </Link>
            <span>|</span>
            <span>Last Updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled 
          ? "bg-card/98 backdrop-blur-lg shadow-md" 
          : "bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
      }`}>
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg group-hover:shadow-primary/30 transition-shadow">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">SUVIDHA</span>
              <span className="text-[10px] text-muted-foreground leading-none">Smart Urban Digital Helpdesk</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-muted flex items-center gap-1.5 ${
                  isActive(link.path) 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.isNew && <Brain className="h-3.5 w-3.5 text-purple-500" />}
                {link.label}
                {link.isNew && (
                  <Badge variant="secondary" className="ml-0.5 px-1.5 py-0 text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    AI
                  </Badge>
                )}
              </Link>
            ))}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                  More
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link to={link.path} className="w-full cursor-pointer">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                {user && (
                  <>
                    <DropdownMenuSeparator />
                    {authenticatedLinks.map((link) => (
                      <DropdownMenuItem key={link.path} asChild>
                        <Link to={link.path} className="w-full cursor-pointer">
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            {user && <NotificationCenter />}
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild className="border-primary/20 text-primary hover:bg-primary/10">
                    <Link to="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </> 
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
                  <Link to="/auth">
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 shadow-lg shadow-primary/20">
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-lg z-40 animate-fade-in">
            <nav className="container py-6 flex flex-col gap-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-4">
                Main Menu
              </div>
              {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.isNew && <Brain className="h-4 w-4" />}
                  {link.label}
                  {link.isNew && (
                    <Badge className="ml-auto text-[10px] bg-gradient-to-r from-purple-500 to-pink-500">
                      AI
                    </Badge>
                  )}
                </Link>
              ))}
              
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-4 mb-2 px-4">
                More
              </div>
              {moreLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {user && (
                <>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-4 mb-2 px-4">
                    My Account
                  </div>
                  {authenticatedLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive(link.path)
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "text-foreground hover:bg-muted"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
              
              <div className="border-t border-border mt-4 pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 bg-primary/10 text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 text-left flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 px-4">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-primary to-blue-600" asChild>
                      <Link to="/auth?mode=signup" onClick={() => setIsMenuOpen(false)}>
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
