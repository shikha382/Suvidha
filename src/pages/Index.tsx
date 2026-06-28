import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import LifeEventsSection from "@/components/home/LifeEventsSection";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Zap, Users } from "lucide-react";

const FeaturesSection = () => (
  <section className="py-20 bg-gradient-to-b from-background to-muted/30">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          Why Choose Us
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Built for Citizens, By the Government
        </h2>
        <p className="text-muted-foreground">
          Experience seamless civic services with our modern, transparent, and efficient platform
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Sparkles,
            title: "AI-Powered Resolution",
            description: "Smart complaint categorization and routing using advanced AI for faster resolution times",
            color: "from-purple-500 to-pink-500"
          },
          {
            icon: Zap,
            title: "Real-time Tracking",
            description: "Track your complaints in real-time with live updates and notifications at every stage",
            color: "from-orange-500 to-red-500"
          },
          {
            icon: Shield,
            title: "Secure & Transparent",
            description: "End-to-end encryption with complete transparency in the resolution process",
            color: "from-blue-500 to-cyan-500"
          }
        ].map((feature) => (
          <div 
            key={feature.title}
            className="group relative p-8 rounded-2xl bg-card border hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <feature.icon className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-blue-700 text-white">
    <div className="container">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Experience Better Civic Services?
        </h2>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Join millions of citizens who have transformed their civic experience with SUVIDHA. 
          Submit your first complaint in under 2 minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg" asChild>
            <Link to="/submit">
              Submit Complaint
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-lg" asChild>
            <Link to="/smart-city">
              <Sparkles className="mr-2 h-5 w-5" />
              Explore AI Hub
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/60">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>10L+ Citizens</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <span>2 Min Setup</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <FeaturesSection />
      <TestimonialsCarousel />
      <LifeEventsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
