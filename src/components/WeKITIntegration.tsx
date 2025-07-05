import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users, BookOpen, Trophy, Calendar, ArrowRight } from "lucide-react";

interface WeKITIntegrationProps {
  variant?: 'hero' | 'compact' | 'sidebar' | 'inline';
  className?: string;
}

export function WeKITIntegration({ variant = 'hero', className = '' }: WeKITIntegrationProps) {
  const wekitPrograms = [
    {
      title: "1-on-1 Mentoring",
      description: "Connect with industry professionals for personalized career guidance",
      url: "https://www.wekitmentoring.com/students",
      icon: Users,
      badge: "Most Popular",
      features: ["Industry Experts", "Career Guidance", "Skill Development"]
    },
    {
      title: "Skill Development Courses",
      description: "Master in-demand skills with our comprehensive course library",
      url: "https://www.wekitmentoring.com/courses",
      icon: BookOpen,
      badge: "New",
      features: ["Tech Skills", "Soft Skills", "Certifications"]
    },
    {
      title: "Career Bootcamps",
      description: "Intensive programs designed to fast-track your career",
      url: "https://www.wekitmentoring.com/bootcamps",
      icon: Trophy,
      badge: "Premium",
      features: ["Job Guarantee", "Live Projects", "Industry Mentors"]
    },
    {
      title: "Workshops & Events",
      description: "Join live workshops and networking events with professionals",
      url: "https://www.wekitmentoring.com/events",
      icon: Calendar,
      badge: null,
      features: ["Live Sessions", "Networking", "Free Events"]
    }
  ];

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'compact') {
    return (
      <Card className={`shadow-card hover:shadow-elegant transition-all duration-300 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="text-primary font-bold">WeKIT</div>
            <span className="text-sm font-normal text-muted-foreground">Programs</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Accelerate your career with our mentoring programs and skill development courses.
          </p>
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExternalLink("https://www.wekitmentoring.com/students")}
              className="justify-between"
            >
              <span>Find a Mentor</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExternalLink("https://www.wekitmentoring.com/courses")}
              className="justify-between"
            >
              <span>Browse Courses</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'sidebar') {
    return (
      <Card className={`shadow-card ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="text-primary font-bold">WeKIT</div>
            <span className="text-sm font-normal text-muted-foreground">Ecosystem</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Discover more opportunities in the WeKIT ecosystem
          </p>
          {wekitPrograms.slice(0, 2).map((program) => {
            const Icon = program.icon;
            return (
              <div key={program.title} className="border-b border-border last:border-0 pb-3 last:pb-0">
                <div className="flex items-start gap-3">
                  <Icon className="h-4 w-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">{program.title}</h4>
                      {program.badge && <Badge variant="secondary" className="text-xs">{program.badge}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{program.description}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleExternalLink(program.url)}
                      className="h-6 px-2 text-xs"
                    >
                      Learn More <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-card rounded-lg p-6 my-8 ${className}`}>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Ready for the Next Step?</h3>
          <p className="text-muted-foreground">
            Take your career to the next level with WeKIT's professional development programs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wekitPrograms.slice(0, 4).map((program) => {
            const Icon = program.icon;
            return (
              <Card key={program.title} className="hover:shadow-card transition-shadow cursor-pointer" onClick={() => handleExternalLink(program.url)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{program.title}</h4>
                        {program.badge && <Badge variant="secondary" className="text-xs">{program.badge}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{program.description}</p>
                      <div className="flex items-center gap-1 text-primary text-sm">
                        <span>Explore</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Hero variant (default)
  return (
    <section className={`py-20 px-4 bg-gradient-hero ${className}`}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Unlock Your Potential with WeKIT
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Beyond college discovery, WeKIT offers comprehensive programs to accelerate your career journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {wekitPrograms.map((program) => {
            const Icon = program.icon;
            return (
              <Card 
                key={program.title} 
                className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => handleExternalLink(program.url)}
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg flex items-center justify-center gap-2">
                    {program.title}
                    {program.badge && <Badge variant="secondary" className="text-xs">{program.badge}</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-white/80 text-sm mb-4">{program.description}</p>
                  <div className="space-y-1 mb-4">
                    {program.features.map((feature, index) => (
                      <div key={index} className="text-white/70 text-xs">• {feature}</div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary w-full"
                  >
                    Learn More <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
            onClick={() => handleExternalLink("https://www.wekitmentoring.com/")}
          >
            Explore All WeKIT Programs
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}