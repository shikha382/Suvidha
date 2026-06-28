import { Home, GraduationCap, Briefcase, Heart, Baby, Users } from "lucide-react";

const lifeEvents = [
  { icon: Baby, title: "Birth Registration", color: "bg-pink-500" },
  { icon: GraduationCap, title: "Education Services", color: "bg-blue-500" },
  { icon: Briefcase, title: "Employment", color: "bg-indigo-500" },
  { icon: Heart, title: "Marriage Certificate", color: "bg-red-500" },
  { icon: Home, title: "Property Services", color: "bg-green-500" },
  { icon: Users, title: "Senior Citizen", color: "bg-purple-500" },
];

const LifeEventsSection = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl mb-4">
            Life Event Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From birth to senior care, we've got you covered with comprehensive civic services 
            for every stage of life.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {lifeEvents.map((event, index) => (
            <div
              key={event.title}
              className="gov-card group flex flex-col items-center justify-center p-6 text-center cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`${event.color} inline-flex h-14 w-14 items-center justify-center rounded-full text-white mb-3 group-hover:scale-110 transition-transform`}>
                <event.icon className="h-7 w-7" />
              </div>
              <p className="text-sm font-medium text-foreground">{event.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifeEventsSection;
