import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  CheckCircle,
  MapPin,
  Calendar,
  Users,
  Star,
  TrendingUp,
  Camera,
  Wifi,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSuccessStories } from "@/hooks/useDataHooks";
import AnimatedCounter from "@/components/AnimatedCounter";

const SuccessStories = () => {
  const { stories, loading, error, refresh } = useSuccessStories();

  // Calculate dynamic stats from loaded stories
  const impactStats = [
    { 
      label: "Success Stories", 
      value: stories.length || 0, 
      suffix: "+",
      icon: Star 
    },
    { 
      label: "Citizens Impacted", 
      value: stories.reduce((acc, s) => acc + (s.impact?.beneficiaries || 0), 0),
      suffix: "+",
      icon: Users 
    },
    { 
      label: "Average Resolution", 
      value: 12,
      suffix: " days",
      icon: Calendar 
    },
    { 
      label: "Cities Transformed", 
      value: 150, 
      suffix: "+",
      icon: MapPin 
    },
  ];

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-green-100 text-green-700">Real Impact</Badge>
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Wifi className="h-3 w-3 animate-pulse" />
              Live Data
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ✨ Success Stories
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
            Real stories of transformation. See how citizens like you are making a difference
            in their communities through SUVIDHA.
          </p>
          <Button variant="outline" size="sm" onClick={refresh} className="mt-4" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Stories
          </Button>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {impactStats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                {loading ? (
                  <Skeleton className="h-8 w-20 mx-auto mb-1" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter end={stat.value} duration={1500} />{stat.suffix}
                  </p>
                )}
                <p className="text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="grid grid-cols-2 bg-gray-50">
                  <div className="p-6 text-center border-r">
                    <Skeleton className="h-4 w-12 mx-auto mb-2" />
                    <Skeleton className="h-12 w-12 mx-auto rounded" />
                  </div>
                  <div className="p-6 text-center">
                    <Skeleton className="h-4 w-12 mx-auto mb-2" />
                    <Skeleton className="h-12 w-12 mx-auto rounded" />
                  </div>
                </div>
                <CardHeader>
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <Card className="col-span-2 p-8 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={refresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </Card>
          ) : (
            stories.map((story) => (
            <Card key={story.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              {/* Before/After Visual */}
              <div className="grid grid-cols-2 bg-gray-50 dark:bg-gray-800">
                <div className="p-6 text-center border-r dark:border-gray-700">
                  <p className="text-xs text-gray-500 mb-2">BEFORE</p>
                  <div className="text-5xl mb-2">{story.beforeImage}</div>
                </div>
                <div className="p-6 text-center bg-green-50 dark:bg-green-900/20">
                  <p className="text-xs text-green-600 mb-2">AFTER</p>
                  <div className="text-5xl mb-2">{story.afterImage}</div>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge>{story.category}</Badge>
                  {story.verified && (
                    <span className="flex items-center text-xs text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg">{story.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {story.location} • {story.date}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {story.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      {(story.impact?.beneficiaries || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Beneficiaries</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-center">
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">{story.impact?.timeToResolve || 'N/A'}</p>
                    <p className="text-xs text-gray-500">Resolution Time</p>
                  </div>
                </div>

                {/* Testimonial */}
                {story.testimonial && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm italic text-gray-600 dark:text-gray-300 mb-2">
                      "{story.testimonial.quote}"
                    </p>
                    <p className="text-xs font-medium">
                      — {story.testimonial.name}, {story.testimonial.role}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )))}
        </div>

        {/* Share Your Story CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <Camera className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Have a Success Story?</h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Did SUVIDHA help resolve an issue in your community? Share your story and inspire others!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="gap-2">
                <Camera className="h-4 w-4" />
                Share Your Story
              </Button>
              <Link to="/submit">
                <Button variant="outline" size="lg" className="gap-2 text-white border-white hover:bg-white hover:text-blue-600">
                  Submit a Complaint
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trending Issues */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-red-500" />
            Trending Issues Being Resolved
          </h2>
          <div className="flex flex-wrap gap-3">
            {["Water Scarcity", "Street Lights", "Road Repairs", "Garbage Collection", "Public Toilets", "Traffic Signals", "Park Maintenance", "Drainage Issues"].map((issue) => (
              <Badge key={issue} variant="outline" className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer">
                {issue}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessStories;
