import { FileText, Droplets, AlertCircle, Building, Trash2, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: FileText,
    title: "Bill Issues",
    description: "Report discrepancies in property tax, water bills, or other municipal charges.",
    color: "bg-blue-500",
  },
  {
    icon: Droplets,
    title: "Water Supply",
    description: "Report water supply problems, contamination, or pipeline issues in your area.",
    color: "bg-cyan-500",
  },
  {
    icon: AlertCircle,
    title: "General Complaints",
    description: "Submit complaints about any civic issue affecting your neighborhood.",
    color: "bg-orange-500",
  },
  {
    icon: Building,
    title: "Building Permissions",
    description: "Apply for construction permits and building-related approvals.",
    color: "bg-indigo-500",
  },
  {
    icon: Trash2,
    title: "Waste Management",
    description: "Report garbage collection issues or request special waste pickup.",
    color: "bg-green-500",
  },
  {
    icon: Lightbulb,
    title: "Street Lighting",
    description: "Report faulty street lights or request new lighting installations.",
    color: "bg-yellow-500",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access a wide range of civic services designed to make your life easier. 
            Submit requests online and track them in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to="/services"
              className="gov-card group p-6 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${service.color} inline-flex h-12 w-12 items-center justify-center rounded-lg text-white mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
