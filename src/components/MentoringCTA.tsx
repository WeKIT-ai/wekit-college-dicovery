import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Award, Users, ArrowRight, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface MentoringCTAProps {
  variant?: "hero" | "sidebar" | "inline" | "floating";
  className?: string;
}

export function MentoringCTA({ variant = "inline", className = "" }: MentoringCTAProps) {
  if (variant === "hero") {
    return (
      <section className={`py-16 px-4 bg-gradient-primary ${className}`}>
        <div className="container mx-auto">
          <Card className="max-w-4xl mx-auto shadow-glow border-0 bg-white/95 backdrop-blur">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="flex justify-center mb-6">
                <Badge variant="secondary" className="text-sm px-4 py-2 bg-primary/10 text-primary">
                  🚀 #1 College Mentoring Platform
                </Badge>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">
                Get 1-on-1 Mentoring from College Seniors
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Stop guessing about college choices. Get insider knowledge from students who've been there. 
                <span className="text-primary font-semibold"> 95% of our mentees get into their dream college!</span>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">500+ Expert Mentors</h4>
                  <p className="text-sm text-muted-foreground">From top colleges across India</p>
                </div>
                <div className="text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">4.9/5 Rating</h4>
                  <p className="text-sm text-muted-foreground">10,000+ successful sessions</p>
                </div>
                <div className="text-center">
                  <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">24hr Response</h4>
                  <p className="text-sm text-muted-foreground">Get matched instantly</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-4 hover-scale">
                  <Link to="/auth">
                    Book Free Session Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Link to="/discover">
                    Browse Mentors
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                ⚡ Limited Time: First session FREE for new users
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (variant === "sidebar") {
    return (
      <Card className={`shadow-elegant bg-gradient-subtle ${className}`}>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <Badge className="mb-3 bg-primary/10 text-primary">🎯 TRENDING</Badge>
            <h3 className="text-lg font-bold mb-2">Need Expert Guidance?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect with college seniors who've cracked the same entrance exams you're preparing for!
            </p>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Entrance exam strategies</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>College application tips</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Course selection guidance</span>
            </div>
          </div>

          <Button asChild className="w-full hover-scale">
            <Link to="/auth">
              <Calendar className="mr-2 h-4 w-4" />
              Book Session (₹99)
            </Link>
          </Button>
          
          <p className="text-xs text-center text-muted-foreground mt-2">
            💫 First session FREE for new users
          </p>
        </CardContent>
      </Card>
    );
  }

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Card className="shadow-glow bg-primary text-white max-w-xs animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">23 mentors online now!</span>
            </div>
            <p className="text-xs mb-3">Get instant guidance from college seniors</p>
            <Button asChild variant="secondary" size="sm" className="w-full text-primary">
              <Link to="/auth">
                Chat Now - FREE
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default inline variant
  return (
    <Card className={`bg-gradient-card shadow-elegant hover:shadow-glow transition-all duration-300 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">🎯 Stuck choosing colleges?</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Get personalized advice from seniors who've been through the exact same process. 
              <span className="text-primary font-medium"> Book a 1-on-1 mentoring session now!</span>
            </p>
            <div className="flex items-center gap-3">
              <Button asChild size="sm" className="hover-scale">
                <Link to="/auth">
                  Book Mentor (₹99)
                </Link>
              </Button>
              <span className="text-xs text-muted-foreground">⚡ 500+ mentors available</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}