import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  image?: string;
  rating: number;
  text: string;
  date?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Resident",
    location: "Sector 15, City",
    rating: 5,
    text: "SUVIDHA transformed how I interact with city services. My water supply issue was resolved within 24 hours! The tracking feature kept me updated at every step.",
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Business Owner",
    location: "Main Market Area",
    rating: 5,
    text: "As a shop owner, I've filed multiple complaints about street lighting. The response time has improved dramatically. The AI chat assistant was very helpful!",
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Dr. Anita Patel",
    role: "Doctor",
    location: "Civil Hospital Road",
    rating: 4,
    text: "The road repair complaint I submitted was addressed promptly. The transparency in the process and regular updates made the experience seamless.",
    date: "3 weeks ago"
  },
  {
    id: 4,
    name: "Mohammed Irfan",
    role: "Teacher",
    location: "Education Colony",
    rating: 5,
    text: "I'm impressed by the Smart City dashboard. It gives real-time insights into ongoing projects. This level of transparency was unimaginable before.",
    date: "1 week ago"
  },
  {
    id: 5,
    name: "Sunita Devi",
    role: "Homemaker",
    location: "Gandhi Nagar",
    rating: 5,
    text: "Even without much tech knowledge, I found SUVIDHA easy to use. The voice assistant in Hindi helped me file my first complaint. Excellent service!",
    date: "5 days ago"
  }
];

export const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + testimonials.length) % testimonials.length;
      visible.push({ ...testimonials[index], position: i });
    }
    return visible;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Citizens Say About Us
          </h2>
          <p className="text-muted-foreground">
            Real feedback from real citizens who have experienced the SUVIDHA platform
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="flex justify-center items-center gap-6">
            {getVisibleTestimonials().map((testimonial) => (
              <Card
                key={testimonial.id}
                className={cn(
                  "relative p-6 md:p-8 transition-all duration-500 w-full max-w-md",
                  testimonial.position === 0 
                    ? "scale-100 opacity-100 z-10 shadow-xl" 
                    : "scale-90 opacity-50 hidden md:block"
                )}
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-2">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Quote className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "h-4 w-4",
                        i < testimonial.rating 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      )} 
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={testimonial.image} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>

                {testimonial.date && (
                  <p className="text-xs text-muted-foreground mt-4 text-right">
                    {testimonial.date}
                  </p>
                )}
              </Card>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentIndex 
                      ? "bg-primary w-6" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">4.8★</p>
              <p className="text-xs text-muted-foreground">Average Rating</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">50K+</p>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">98%</p>
              <p className="text-xs text-muted-foreground">Satisfaction</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-xs text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
