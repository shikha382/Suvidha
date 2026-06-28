import { Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, ExternalLink, Award, Clock, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickStats = [
    { icon: Users, value: "10L+", label: "Citizens Served" },
    { icon: CheckCircle, value: "2.5L+", label: "Issues Resolved" },
    { icon: Clock, value: "48hrs", label: "Avg Response" },
    { icon: Award, value: "4.8★", label: "User Rating" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      {/* Stats Bar */}
      <div className="border-b border-gray-800">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">SUVIDHA</span>
                <span className="text-xs text-gray-400">Smart Urban Vigilance & Integrated Digital Helpdesk</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm">
              Empowering citizens with seamless access to government services. 
              A Government of India initiative for transparent and efficient civic governance.
            </p>
            
            {/* Newsletter */}
            <div className="pt-4">
              <h5 className="text-sm font-semibold text-white mb-2">Subscribe to Updates</h5>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
                <Button className="bg-primary hover:bg-primary/90">Subscribe</Button>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-gray-800 hover:bg-primary hover:text-white">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-gray-800 hover:bg-primary hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-gray-800 hover:bg-primary hover:text-white">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-gray-800 hover:bg-primary hover:text-white">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-1">Home</Link></li>
              <li><Link to="/services" className="text-sm text-gray-400 hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/track" className="text-sm text-gray-400 hover:text-primary transition-colors">Track Complaint</Link></li>
              <li><Link to="/departments" className="text-sm text-gray-400 hover:text-primary transition-colors">Departments</Link></li>
              <li><Link to="/news" className="text-sm text-gray-400 hover:text-primary transition-colors">News & Updates</Link></li>
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2.5">
              <li><Link to="/submit" className="text-sm text-gray-400 hover:text-primary transition-colors">File Complaint</Link></li>
              <li><span className="text-sm text-gray-400">Water Supply Issues</span></li>
              <li><span className="text-sm text-gray-400">Road & Infrastructure</span></li>
              <li><span className="text-sm text-gray-400">Electricity Problems</span></li>
              <li><span className="text-sm text-gray-400">Sanitation Services</span></li>
              <li><Link to="/smart-city" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                Smart City Hub
                <Badge className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-0">AI</Badge>
              </Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-white">1800-XXX-XXXX</div>
                  <div className="text-xs">Toll Free (24/7)</div>
                </div>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-white">help@suvidha.gov.in</div>
                  <div className="text-xs">Email Support</div>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Smart City Office</div>
                  <div className="text-xs">Main Road, City - 100001</div>
                </div>
              </li>
            </ul>
            
            {/* App Download */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-white mb-2">Download App</h5>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-xs">
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  App Store
                </Button>
                <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-xs">
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5h15c.83 0 1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5zm12.5-9.5l-5.5-3v6l5.5-3z"/></svg>
                  Play Store
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="h-10 opacity-60" />
              <div className="text-sm text-gray-400">
                <p>© {currentYear} SUVIDHA - Government of India Initiative</p>
                <p className="text-xs">Ministry of Urban Development | Smart Cities Mission</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                RTI Portal <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
