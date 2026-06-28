import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: "t1",
      name: "Priya Sharma",
      role: "Resident, Jaipur",
      avatar: "PS",
      rating: 5,
      text: "The water supply issue in our colony was resolved within 3 days after I submitted the complaint through SUVIDHA. The tracking feature kept me informed at every step!",
      date: "2 weeks ago"
    },
    {
      id: "t2",
      name: "Rajesh Kumar",
      role: "Shop Owner, Delhi",
      avatar: "RK",
      rating: 5,
      text: "I had been struggling with a streetlight issue for months. SUVIDHA made it so simple - just uploaded a photo and location, and it was fixed in a week. Amazing service!",
      date: "1 month ago"
    },
    {
      id: "t3",
      name: "Anita Desai",
      role: "Teacher, Mumbai",
      avatar: "AD",
      rating: 5,
      text: "The AI chatbot helped me navigate the process in Hindi. As someone not very tech-savvy, I found it incredibly user-friendly. Thank you SUVIDHA!",
      date: "3 weeks ago"
    },
    {
      id: "t4",
      name: "Mohammed Ali",
      role: "Senior Citizen, Hyderabad",
      avatar: "MA",
      rating: 5,
      text: "Getting my pension documents verified used to take multiple visits to government offices. Through SUVIDHA, everything was done online with SMS updates. Revolutionary!",
      date: "1 week ago"
    },
    {
      id: "t5",
      name: "Dr. Kavitha Nair",
      role: "Doctor, Bangalore",
      avatar: "KN",
      rating: 5,
      text: "The garbage collection schedule issue in our area was addressed after the map visualization showed the problem clearly. Data-driven governance at its best!",
      date: "2 months ago"
    },
    {
      id: "t6",
      name: "Amit Patel",
      role: "Business Owner, Ahmedabad",
      avatar: "AP",
      rating: 5,
      text: "Trade license renewal was a breeze. The document upload feature and real-time status tracking saved me countless hours. Highly recommend SUVIDHA!",
      date: "1 month ago"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Citizens Are Saying
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real stories from real citizens who have experienced the power of digital governance
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-700">4.8/5</span>
            <span className="text-gray-500">(Based on 15,000+ reviews)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-blue-200 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-blue-100">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex">
                      {Array.from({ length: testimonial.rating }, (_, i) => (
                        <Star key={`star-${testimonial.id}-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{testimonial.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Join thousands of satisfied citizens making a difference in their communities
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">98%</div>
              <div className="text-sm text-gray-500">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">15K+</div>
              <div className="text-sm text-gray-500">Happy Citizens</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">2.8K+</div>
              <div className="text-sm text-gray-500">Issues Resolved</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;