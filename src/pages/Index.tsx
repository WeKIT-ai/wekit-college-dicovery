import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Users, Award, TrendingUp, Star, ArrowRight } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const stats = [
    { label: "Youth Mentored", value: "10,000+", icon: Users },
    { label: "Expert Mentors", value: "500+", icon: Award },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
    { label: "College Reviews", value: "2,500+", icon: Star }
  ];

  const features = [
    {
      title: "Honest Feedback",
      description: "Real reviews from verified seniors and alumni",
      icon: "🎯"
    },
    {
      title: "Smart Comparison",
      description: "Compare colleges on key parameters side-by-side",
      icon: "⚖️"
    },
    {
      title: "Expert Mentoring",
      description: "Book 1-on-1 calls with college seniors",
      icon: "🤝"
    },
    {
      title: "Earn Rewards",
      description: "Get WeKIT coins for sharing your experience",
      icon: "💰"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Discover Your Dream College
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Real feedback from seniors. Smart comparisons. Expert mentoring. 
            Make informed decisions about your future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild variant="hero" size="lg" className="text-lg px-8 py-4">
              <Link to="/discover">
                <Search className="mr-2 h-5 w-5" />
                Explore Colleges
              </Link>
            </Button>
            {user ? (
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/feedback">
                  Rate College
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/auth">
                  Get Started
                </Link>
              </Button>
            )}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose WeKIT College Discovery?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We bridge the gap between potential and opportunity through honest feedback and smart technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to find your perfect college match
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Explore & Search</h3>
              <p className="text-muted-foreground">
                Search through thousands of colleges and read honest feedback from verified students
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Compare & Analyze</h3>
              <p className="text-muted-foreground">
                Use our smart comparison tool to evaluate colleges on key parameters that matter to you
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect & Decide</h3>
              <p className="text-muted-foreground">
                Book mentoring sessions with seniors to get personalized guidance for your decision
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-4xl mx-auto shadow-elegant">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Find Your Perfect College?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of students who have made informed decisions with WeKIT College Discovery
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="hero" size="lg" className="text-lg px-8 py-4">
                  <Link to="/discover">
                    Start Exploring
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                {user ? (
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                    <Link to="/compare">
                      Compare Colleges
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                    <Link to="/auth">
                      Sign Up Now
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
